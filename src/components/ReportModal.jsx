import React, { useState } from 'react';
import { X, Copy, Check, Save, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { KPI_TEMPLATES, OPENING_CHECKLIST_TEMPLATE, SELLING_HOUR_TEMPLATE } from '../data/initialData';

export default function ReportModal({
  isOpen,
  onClose,
  storeName,
  rosterShelf,
  rosterPos,
  openingChecks,
  openingNotes,
  sellingChecks,
  sellingNotes,
  kpiValues,
  onSaveReport
}) {
  const [reportTemplate, setReportTemplate] = useState('standard'); // 'standard' | 'compact'
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate opening items counts
  const totalOpening = OPENING_CHECKLIST_TEMPLATE.length;
  const completedOpening = OPENING_CHECKLIST_TEMPLATE.filter(item => openingChecks[item.id]).length;
  const openingProgress = Math.round((completedOpening / totalOpening) * 100);

  // Check for issues/notes in opening checklist
  const openingIssues = OPENING_CHECKLIST_TEMPLATE.filter(item => openingNotes[item.id]).map(item => ({
    task: item.task,
    note: openingNotes[item.id]
  }));

  // Check for issues/notes in selling checklists
  const sellingIssues = SELLING_HOUR_TEMPLATE.filter(item => sellingNotes[item.id]).map(item => ({
    task: item.task,
    note: sellingNotes[item.id]
  }));

  // Generate Report Text
  const generateReportText = () => {
    let text = `🌿 *BÁO CÁO VẬN HÀNH HÀNG NGÀY - LUSH RETAIL* 🌿\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `📍 *Cửa hàng:* ${storeName}\n`;
    text += `📅 *Ngày:* ${todayStr}\n\n`;

    // Duty Roster
    text += `👥 *PHÂN BỔ NHÂN SỰ TRONG CA:*\n`;
    rosterPos.forEach(p => {
      text += `• ${p.position}: ${p.staff || 'Chưa trực'}\n`;
    });
    text += `• Phụ trách kệ: `;
    const shelfRosterStr = rosterShelf.map(s => `${s.area} (${s.staff || 'N/A'})`).join(', ');
    text += `${shelfRosterStr}\n\n`;

    // Opening Checklists
    text += `✅ *CHECKLIST MỞ CỬA (OPENING):*\n`;
    text += `• Hoàn thành: ${completedOpening}/${totalOpening} (${openingProgress}%)\n`;
    if (openingIssues.length > 0) {
      text += `⚠️ *Sự cố mở cửa ghi nhận:*\n`;
      openingIssues.forEach(iss => {
        text += `  - ${iss.task}: _${iss.note}_\n`;
      });
    } else {
      text += `• Trạng thái mở cửa: Sẵn sàng hoạt động bình thường\n`;
    }
    text += `\n`;

    // Selling hour checks
    if (reportTemplate === 'standard') {
      text += `⏰ *CHECKLIST TRONG GIỜ HOẠT ĐỘNG (SELLING HOURS):*\n`;
      SELLING_HOUR_TEMPLATE.forEach(item => {
        const checks = sellingChecks[item.id] || {};
        const timeChecks = ['11AM', '2PM', '5PM', '7PM'].map(t => checks[t] ? '✓' : '✗').join(' | ');
        text += `• ${item.task}: [ ${timeChecks} ]\n`;
      });
      if (sellingIssues.length > 0) {
        text += `⚠️ *Ghi chú sự cố trong ca:*\n`;
        sellingIssues.forEach(iss => {
          text += `  - ${iss.task}: _${iss.note}_\n`;
        });
      }
      text += `\n`;
    }

    // KPIs & Sales Tracking
    text += `📈 *KẾT QUẢ KPI & DOANH SỐ (Báo cáo 17h):*\n`;
    KPI_TEMPLATES.forEach(kpi => {
      const vals = kpiValues[kpi.key] || { target: '', actual: '', actionPlan: '' };
      const targetVal = parseFloat(vals.target);
      const actualVal = parseFloat(vals.actual);
      let pctStr = '--';
      if (!isNaN(targetVal) && !isNaN(actualVal) && targetVal > 0) {
        pctStr = `${Math.round((actualVal / targetVal) * 100)}%`;
      }
      
      const targetFmt = kpi.format === 'number' && vals.target ? Number(vals.target).toLocaleString('vi-VN') : vals.target;
      const actualFmt = kpi.format === 'number' && vals.actual ? Number(vals.actual).toLocaleString('vi-VN') : vals.actual;
      
      text += `• *${kpi.label}:*\n`;
      text += `  - Chỉ tiêu: ${targetFmt || '--'} ${kpi.unit}\n`;
      text += `  - Đạt được: ${actualFmt || '--'} ${kpi.unit} (${pctStr})\n`;
      if (vals.actionPlan) {
        text += `  - Ghi chú/Hành động: _${vals.actionPlan}_\n`;
      }
    });

    text += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `✍️ _Báo cáo được khởi tạo tự động từ hệ thống LUSH Operation Portal_`;
    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    const reportData = {
      id: `rep-${Date.now()}`,
      storeName,
      date: new Date().toISOString(),
      dateStr: todayStr,
      progress: {
        completed: completedOpening,
        total: totalOpening,
        percent: openingProgress
      },
      rosterShelf,
      rosterPos,
      openingChecks,
      openingNotes,
      sellingChecks,
      sellingNotes,
      kpiValues,
      rawText: generateReportText()
    };

    onSaveReport(reportData);

    // Confetti celebration (B&W/Gray values or default festive)
    confetti({
      particleCount: 120,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#000000', '#ffffff', '#71717a', '#a1a1aa']
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-medium bg-white text-black">
          <div className="flex items-center gap-2">
            <FileText size={16} />
            <h3 className="text-xs font-sans font-bold uppercase tracking-wider">Khởi Tạo Báo Cáo Ca Trực</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-text-muted hover:text-black transition-colors bg-transparent border-none cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-bg-inset p-2 border-b border-medium gap-2">
          <span className="text-[10px] text-text-muted font-bold font-sans px-2 py-1.5 flex items-center">
            MẪU BÁO CÁO:
          </span>
          <button
            onClick={() => setReportTemplate('standard')}
            className={`px-3 py-1.5 text-xs font-bold font-sans uppercase tracking-wider border transition-all ${
              reportTemplate === 'standard' 
                ? 'bg-black text-white border-black' 
                : 'bg-white text-black border-border-medium hover:border-black'
            }`}
          >
            Đầy đủ (Standard)
          </button>
          <button
            onClick={() => setReportTemplate('compact')}
            className={`px-3 py-1.5 text-xs font-bold font-sans uppercase tracking-wider border transition-all ${
              reportTemplate === 'compact' 
                ? 'bg-black text-white border-black' 
                : 'bg-white text-black border-border-medium hover:border-black'
            }`}
          >
            Rút gọn
          </button>
        </div>

        {/* Body Preview */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-bg-inset">
          <div 
            className="bg-white border border-medium p-4 font-mono text-[10px] text-black whitespace-pre-wrap max-h-[45vh] overflow-y-auto select-all leading-relaxed"
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {generateReportText()}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-medium gap-3 bg-white">
          <span className="text-[10px] text-text-muted font-sans uppercase tracking-wider">
            * Nhấp vào hộp văn bản để bôi đen nhanh
          </span>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="btn-white text-xs py-2 px-4 flex-1 sm:flex-initial flex items-center justify-center gap-1.5"
            >
              {copied ? <Check size={14} /> : null}
              {copied ? 'Đã sao chép!' : 'Sao chép Zalo/Telegram'}
            </button>
            
            <button
              onClick={handleSave}
              className="btn-black text-xs py-2 px-4 flex-1 sm:flex-initial flex items-center justify-center gap-1.5"
            >
              Lưu báo cáo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
