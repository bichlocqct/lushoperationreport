import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Cho phép gửi báo cáo HTML dung lượng lớn

// Cấu hình kết nối PostgreSQL
const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || 'postgresql://postgres:postgres@localhost:5432/report_lush';

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1') ? false : { rejectUnauthorized: false }
});

let isTableCreated = false;
async function initDB() {
  if (isTableCreated) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        report_id VARCHAR(50) UNIQUE NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        html_content TEXT NOT NULL,
        store_name VARCHAR(255),
        leader VARCHAR(255),
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        date_str VARCHAR(100),
        template VARCHAR(50),
        progress JSONB,
        roster_shelf JSONB,
        roster_pos JSONB,
        opening_checks JSONB,
        opening_notes JSONB,
        selling_checks JSONB,
        selling_notes JSONB,
        kpi_values JSONB,
        raw_text TEXT,
        today_shifts JSONB,
        weekly_shifts_roster JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    // Add columns dynamically for operations grading & comments
    await pool.query(`
      ALTER TABLE reports ADD COLUMN IF NOT EXISTS grading_items JSONB;
      ALTER TABLE reports ADD COLUMN IF NOT EXISTS overall_comments TEXT;
    `);
    isTableCreated = true;
    console.log("Đã kết nối thành công với PostgreSQL và khởi tạo bảng reports");
  } catch (err) {
    console.error("Lỗi khởi tạo bảng PostgreSQL:", err);
  }
}

// Middleware kết nối DB tự động trước khi xử lý request
app.use(async (req, res, next) => {
  await initDB();
  next();
});

// API: Lưu báo cáo và HTML
app.post('/api/save-report', async (req, res) => {
  try {
    const { fileName, htmlContent, reportData } = req.body;
    
    if (!fileName || !htmlContent) {
      return res.status(400).json({ success: false, error: 'Thiếu thông tin fileName hoặc htmlContent' });
    }

    const reportId = reportData?.id || `rep-${Date.now()}`;
    const dateVal = reportData?.date ? new Date(reportData.date) : new Date();

    const query = `
      INSERT INTO reports (
        report_id, file_name, html_content, store_name, leader, date, date_str, template,
        progress, roster_shelf, roster_pos, opening_checks, opening_notes, selling_checks,
        selling_notes, kpi_values, raw_text, today_shifts, weekly_shifts_roster,
        grading_items, overall_comments, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19,
        $20, $21, NOW()
      )
      ON CONFLICT (report_id) DO UPDATE SET
        file_name = EXCLUDED.file_name,
        html_content = EXCLUDED.html_content,
        store_name = EXCLUDED.store_name,
        leader = EXCLUDED.leader,
        date = EXCLUDED.date,
        date_str = EXCLUDED.date_str,
        template = EXCLUDED.template,
        progress = EXCLUDED.progress,
        roster_shelf = EXCLUDED.roster_shelf,
        roster_pos = EXCLUDED.roster_pos,
        opening_checks = EXCLUDED.opening_checks,
        opening_notes = EXCLUDED.opening_notes,
        selling_checks = EXCLUDED.selling_checks,
        selling_notes = EXCLUDED.selling_notes,
        kpi_values = EXCLUDED.kpi_values,
        raw_text = EXCLUDED.raw_text,
        today_shifts = EXCLUDED.today_shifts,
        weekly_shifts_roster = EXCLUDED.weekly_shifts_roster,
        grading_items = EXCLUDED.grading_items,
        overall_comments = EXCLUDED.overall_comments,
        updated_at = NOW()
      RETURNING *;
    `;

    const values = [
      reportId,
      fileName,
      htmlContent,
      reportData?.storeName || null,
      reportData?.leader || null,
      dateVal,
      reportData?.dateStr || null,
      reportData?.template || null,
      reportData?.progress ? JSON.stringify(reportData.progress) : null,
      reportData?.rosterShelf ? JSON.stringify(reportData.rosterShelf) : null,
      reportData?.rosterPos ? JSON.stringify(reportData.rosterPos) : null,
      reportData?.openingChecks ? JSON.stringify(reportData.openingChecks) : null,
      reportData?.openingNotes ? JSON.stringify(reportData.openingNotes) : null,
      reportData?.sellingChecks ? JSON.stringify(reportData.sellingChecks) : null,
      reportData?.sellingNotes ? JSON.stringify(reportData.sellingNotes) : null,
      reportData?.kpiValues ? JSON.stringify(reportData.kpiValues) : null,
      reportData?.rawText || null,
      reportData?.todayShifts ? JSON.stringify(reportData.todayShifts) : null,
      reportData?.weeklyShiftsRoster ? JSON.stringify(reportData.weeklyShiftsRoster) : null,
      reportData?.gradingScores ? JSON.stringify(reportData.gradingScores) : null,
      reportData?.overallComments || null
    ];

    const result = await pool.query(query, values);
    const r = result.rows[0];

    const formattedReport = {
      id: r.report_id,
      storeName: r.store_name,
      leader: r.leader,
      date: r.date,
      dateStr: r.date_str,
      template: r.template,
      progress: r.progress,
      rosterShelf: r.roster_shelf,
      rosterPos: r.roster_pos,
      openingChecks: r.opening_checks,
      openingNotes: r.opening_notes,
      sellingChecks: r.selling_checks,
      sellingNotes: r.selling_notes,
      kpiValues: r.kpi_values,
      gradingScores: r.grading_items,
      overallComments: r.overall_comments,
      rawText: r.raw_text,
      fileName: r.file_name,
      todayShifts: r.today_shifts,
      weeklyShiftsRoster: r.weekly_shifts_roster
    };

    // Lưu file HTML cục bộ và đẩy lên GitHub nếu chạy ở local
    if (!process.env.VERCEL) {
      try {
        const rootDir = path.resolve(__dirname, '..');
        const reportsDir = path.join(rootDir, 'reports');
        if (!fs.existsSync(reportsDir)) {
          fs.mkdirSync(reportsDir, { recursive: true });
        }
        const filePath = path.join(reportsDir, fileName);
        fs.writeFileSync(filePath, htmlContent, 'utf-8');
        console.log(`[Local File] Đã lưu file báo cáo tại: ${filePath}`);

        // Tự động add, commit và push lên GitHub
        const gitCmd = `git add . && git commit -m "Auto-add report: ${fileName}" && git push`;
        exec(gitCmd, { cwd: rootDir }, (error, stdout, stderr) => {
          if (error) {
            console.error(`[Git Sync Error]: ${error.message}`);
            return;
          }
          console.log(`[Git Sync Success]:\n${stdout}`);
        });
      } catch (err) {
        console.error("Lỗi khi ghi file hoặc đẩy Git:", err);
      }
    }

    res.status(200).json({ success: true, path: `/reports/${reportId}`, data: formattedReport });
  } catch (error) {
    console.error("Lỗi trong API /api/save-report:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Đẩy báo cáo lên GitHub thủ công
app.post('/api/git-push', async (req, res) => {
  if (process.env.VERCEL) {
    return res.status(400).json({ success: false, error: 'Tính năng Git push chỉ hoạt động ở môi trường local.' });
  }

  try {
    const { fileName } = req.body;
    const rootDir = path.resolve(__dirname, '..');

    const gitCmd = `git add . && git commit -m "Manual-add report: ${fileName || 'report'}" && git push`;
    exec(gitCmd, { cwd: rootDir }, (error, stdout, stderr) => {
      if (error) {
        console.error(`[Git Sync Error]: ${error.message}`);
        return res.status(500).json({ success: false, error: error.message });
      }
      console.log(`[Git Sync Success]:\n${stdout}`);
      res.status(200).json({ success: true, log: stdout });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Lấy danh sách toàn bộ báo cáo
app.get('/api/reports', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reports ORDER BY date DESC');
    const formattedReports = result.rows.map(r => ({
      id: r.report_id,
      storeName: r.store_name,
      leader: r.leader,
      date: r.date,
      dateStr: r.date_str,
      template: r.template,
      progress: r.progress,
      rosterShelf: r.roster_shelf,
      rosterPos: r.roster_pos,
      openingChecks: r.opening_checks,
      openingNotes: r.opening_notes,
      sellingChecks: r.selling_checks,
      sellingNotes: r.selling_notes,
      kpiValues: r.kpi_values,
      gradingScores: r.grading_items,
      overallComments: r.overall_comments,
      rawText: r.raw_text,
      fileName: r.file_name,
      todayShifts: r.today_shifts,
      weeklyShiftsRoster: r.weekly_shifts_roster
    }));
    res.status(200).json(formattedReports);
  } catch (error) {
    console.error("Lỗi trong API GET /api/reports:", error);
    res.status(500).json({ error: error.message });
  }
});

// API: Xóa báo cáo theo ID
app.delete('/api/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM reports WHERE report_id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy báo cáo' });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Lỗi khi xóa báo cáo:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// SSR Route: Render Báo cáo trực tiếp từ server (Server-Side Rendering)
app.get('/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT html_content FROM reports WHERE report_id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).send('<h1>Báo cáo không tồn tại / Report not found</h1>');
    }
    // Trả về HTML trực tiếp (SSR) để trình duyệt hiển thị luôn
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(result.rows[0].html_content);
  } catch (error) {
    console.error("Lỗi trong SSR route /reports/:id:", error);
    res.status(500).send(`<h1>Lỗi máy chủ / Server Error</h1><p>${error.message}</p>`);
  }
});

// API kiểm tra trạng thái hoạt động của backend
app.get('/api/check', (req, res) => {
  res.json({ status: 'ok', database: isTableCreated ? 'connected' : 'disconnected' });
});

// Khởi chạy cục bộ khi chạy trực tiếp file này (không chạy trên Vercel Serverless)
const PORT = process.env.PORT || 3000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Local Server] Backend đang chạy trên cổng ${PORT}`);
  });
}

export default app;
