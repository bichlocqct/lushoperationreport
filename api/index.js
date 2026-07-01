import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Cho phép gửi báo cáo HTML dung lượng lớn

// Cấu hình kết nối MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  if (!MONGODB_URI) {
    console.warn("CẢNH BÁO: MONGODB_URI chưa được định nghĩa trong biến môi trường!");
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("Đã kết nối thành công với MongoDB");
  } catch (err) {
    console.error("Lỗi kết nối MongoDB:", err);
  }
}

// Thiết kế Schema cho Report
const reportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true },
  fileName: { type: String, required: true },
  htmlContent: { type: String, required: true },
  storeName: String,
  leader: String,
  date: { type: Date, default: Date.now },
  dateStr: String,
  template: String,
  progress: {
    completed: Number,
    total: Number,
    percent: Number
  },
  rosterShelf: Array,
  rosterPos: Array,
  openingChecks: Object,
  openingNotes: Object,
  sellingChecks: Object,
  sellingNotes: Object,
  kpiValues: Object,
  rawText: String,
  todayShifts: Object,
  weeklyShiftsRoster: Object
}, { timestamps: true });

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

// Middleware kết nối DB tự động trước khi xử lý request
app.use(async (req, res, next) => {
  await connectDB();
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

    // Lưu hoặc cập nhật báo cáo trong database (Upsert)
    const updatedReport = await Report.findOneAndUpdate(
      { reportId },
      {
        reportId,
        fileName,
        htmlContent,
        storeName: reportData?.storeName,
        leader: reportData?.leader,
        date: reportData?.date ? new Date(reportData.date) : new Date(),
        dateStr: reportData?.dateStr,
        template: reportData?.template,
        progress: reportData?.progress,
        rosterShelf: reportData?.rosterShelf,
        rosterPos: reportData?.rosterPos,
        openingChecks: reportData?.openingChecks,
        openingNotes: reportData?.openingNotes,
        sellingChecks: reportData?.sellingChecks,
        sellingNotes: reportData?.sellingNotes,
        kpiValues: reportData?.kpiValues,
        rawText: reportData?.rawText,
        todayShifts: reportData?.todayShifts,
        weeklyShiftsRoster: reportData?.weeklyShiftsRoster
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, path: `/reports/${reportId}`, data: updatedReport });
  } catch (error) {
    console.error("Lỗi trong API /api/save-report:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Lấy danh sách toàn bộ báo cáo
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await Report.find().sort({ date: -1 });
    const formattedReports = reports.map(r => ({
      id: r.reportId,
      storeName: r.storeName,
      leader: r.leader,
      date: r.date,
      dateStr: r.dateStr,
      template: r.template,
      progress: r.progress,
      rosterShelf: r.rosterShelf,
      rosterPos: r.rosterPos,
      openingChecks: r.openingChecks,
      openingNotes: r.openingNotes,
      sellingChecks: r.sellingChecks,
      sellingNotes: r.sellingNotes,
      kpiValues: r.kpiValues,
      rawText: r.rawText,
      fileName: r.fileName,
      todayShifts: r.todayShifts,
      weeklyShiftsRoster: r.weeklyShiftsRoster
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
    const result = await Report.findOneAndDelete({ reportId: id });
    if (!result) {
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
    const report = await Report.findOne({ reportId: id });
    if (!report) {
      return res.status(404).send('<h1>Báo cáo không tồn tại / Report not found</h1>');
    }
    // Trả về HTML trực tiếp (SSR) để trình duyệt hiển thị luôn
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(report.htmlContent);
  } catch (error) {
    console.error("Lỗi trong SSR route /reports/:id:", error);
    res.status(500).send(`<h1>Lỗi máy chủ / Server Error</h1><p>${error.message}</p>`);
  }
});

// API kiểm tra trạng thái hoạt động của backend
app.get('/api/check', (req, res) => {
  res.json({ status: 'ok', database: isConnected ? 'connected' : 'disconnected' });
});

// Khởi chạy cục bộ khi chạy trực tiếp file này (không chạy trên Vercel Serverless)
const PORT = process.env.PORT || 3000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Local Server] Backend đang chạy trên cổng ${PORT}`);
  });
}

export default app;
