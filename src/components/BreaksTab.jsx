import React from 'react';
import { Coffee } from 'lucide-react';

export default function BreaksTab() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* PDF Styled Section Header Bar */}
      <div className="pdf-section-header">
        <span>LỊCH NGHỈ TRƯA</span>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bento-card space-y-6">
          <div className="flex items-center gap-2 border-b border-light pb-3">
            <Coffee size={18} className="text-emerald-600 animate-pulse" />
            <div>
              <h3 className="text-sm font-display font-bold uppercase tracking-wider text-text-dark">
                Giờ Đi Ăn Quy Định (Slide 16)
              </h3>
              <p className="text-xs text-text-muted mt-0.5">Thời gian đi ăn tiêu chuẩn cho từng ca làm việc tại các cửa hàng.</p>
            </div>
          </div>
          
          <div className="table-container">
            <table className="lush-table text-left w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-xs font-bold border-b border-medium w-1/2">Ca sáng</th>
                  <th className="p-3 text-xs font-bold border-b border-medium w-1/2">Ca chiều</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 border-b border-medium text-xs font-semibold text-slate-800">
                    12h - 12h30: <span className="font-normal text-text-muted">1 nhân sự ca sáng</span>
                  </td>
                  <td className="p-4 border-b border-medium text-xs font-semibold text-slate-800">
                    15h - 15h30: <span className="font-normal text-text-muted">1 nhân sự ca tối</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 border-b border-medium text-xs font-semibold text-slate-800">
                    12h30 - 13h: <span className="font-normal text-text-muted">1 nhân sự ca sáng</span>
                  </td>
                  <td className="p-4 border-b border-medium text-xs font-semibold text-slate-800">
                    15h30 - 16h: <span className="font-normal text-text-muted">1 nhân sự ca tối</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 border-b border-medium text-xs font-semibold text-slate-800">
                    13h30 - 14h: <span className="font-normal text-text-muted">1 nhân sự ca giữa</span>
                  </td>
                  <td className="p-4 border-b border-medium text-xs font-semibold text-slate-800">
                    16h30 - 17h: <span className="font-normal text-text-muted">1 nhân sự ca tối</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-l-4 border-emerald-500 bg-emerald-50 bg-opacity-40 p-4 rounded-r-lg border-t border-b border-r border-emerald-100/50">
            <p className="text-xs text-emerald-950 leading-relaxed font-semibold">
              💡 <strong>Lưu ý quan trọng:</strong> Nếu có nhiều nhân sự hơn thì đẩy đi ăn sớm hơn hoặc sắp xếp đi ăn 1 lần 2 người nếu có thể để đảm bảo nhân lực phục vụ khách tại cửa hàng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
