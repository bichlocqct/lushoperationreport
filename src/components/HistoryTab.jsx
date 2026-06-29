import React, { useState } from 'react';
import { Calendar, Trash2, Copy, Check, Eye, EyeOff, FileText, ShoppingBag } from 'lucide-react';

export default function HistoryTab({ reports, onDeleteReport }) {
  const [expandedReportId, setExpandedReportId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedReportId(prev => prev === id ? null : id);
  };

  const handleCopyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const confirmDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Xóa báo cáo này khỏi lịch sử lưu trữ?')) {
      onDeleteReport(id);
      if (expandedReportId === id) setExpandedReportId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-black pb-4">
        <h2 className="section-title">Lịch Sử Báo Cáo Đã Lưu (Saved Logs)</h2>
        <p className="text-xs text-text-muted">
          Xem lại và sao chép nhanh các báo cáo đã hoàn thành của những ca làm việc trước đó.
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="lush-card flex flex-col items-center justify-center p-12 text-center space-y-4">
          <div className="w-12 h-12 bg-bg-inset border border-medium rounded-md flex items-center justify-center">
            <ShoppingBag size={20} className="text-black" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-display font-bold uppercase tracking-wider text-black">Chưa có báo cáo nào</h3>
            <p className="text-xs text-text-muted max-w-sm">
              Sau khi điền thông số ca và hoàn tất checklist, bạn hãy chọn "Xuất Báo Cáo" ở góc dưới bên trái và lưu lại.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map(report => {
            const isExpanded = expandedReportId === report.id;
            const isCopied = copiedId === report.id;

            return (
              <div 
                key={report.id}
                className="lush-card p-0 overflow-hidden transition-all duration-300 bg-white"
              >
                {/* Header Card Summary */}
                <div 
                  onClick={() => toggleExpand(report.id)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-bg-inset transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="p-2 bg-bg-inset border border-black flex-shrink-0">
                      <FileText size={16} className="text-black" />
                    </div>
                    <div>
                      <strong className="text-xs font-bold font-display uppercase tracking-wider text-black block">{report.storeName}</strong>
                      <span className="text-[10px] text-text-muted block mt-0.5">{report.dateStr}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <span className="badge-bw text-[9px]">
                        Mở cửa: {report.progress.percent}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyText(report.id, report.rawText);
                        }}
                        className="p-1.5 hover:text-black text-text-muted transition-colors rounded hover:bg-bg-inset"
                        title="Sao chép nhanh báo cáo"
                      >
                        {isCopied ? <Check size={14} className="text-black" /> : <Copy size={14} />}
                      </button>
                      <button
                        onClick={(e) => confirmDelete(e, report.id)}
                        className="p-1.5 hover:text-black text-text-muted transition-colors rounded hover:bg-bg-inset"
                        title="Xóa báo cáo"
                      >
                        <Trash2 size={14} />
                      </button>
                      <span className="text-text-muted pl-1">
                        {isExpanded ? <EyeOff size={14} /> : <Eye size={14} />}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Report Content */}
                {isExpanded && (
                  <div className="p-4 bg-bg-inset border-t-2 border-black space-y-4">
                    <div className="flex justify-between items-center bg-white px-3 py-1.5 border border-border-medium">
                      <span className="text-[9px] font-bold font-display text-text-muted uppercase tracking-wider">
                        Nội dung báo cáo gửi Zalo / Telegram
                      </span>
                      <button
                        onClick={() => handleCopyText(report.id, report.rawText)}
                        className="flex items-center gap-1 text-[10px] text-black font-display font-bold hover:underline uppercase tracking-wider"
                      >
                        {isCopied ? <Check size={12} /> : <Copy size={12} />}
                        {isCopied ? 'Đã copy!' : 'Sao chép'}
                      </button>
                    </div>
                    <pre className="bg-white p-4 border border-border-medium rounded-none font-mono text-[10px] leading-relaxed text-black whitespace-pre-wrap select-all max-h-[35vh] overflow-y-auto">
                      {report.rawText}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
