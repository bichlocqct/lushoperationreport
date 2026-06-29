import React from 'react';
import { CheckSquare, Target, ClipboardList } from 'lucide-react';

export default function ShelvesTab({ rosterShelf, setRosterShelf }) {
  
  const getShelfBadgeClass = (area) => {
    const norm = area.toLowerCase();
    if (norm.includes('shower')) return 'badge-shelf-shower';
    if (norm.includes('hair')) return 'badge-shelf-hair';
    if (norm.includes('fragrance') || norm.includes('gift')) return 'badge-shelf-fragrance';
    if (norm.includes('face')) return 'badge-shelf-face';
    if (norm.includes('hand') || norm.includes('body')) return 'badge-shelf-handbody';
    return 'badge-shelf-cashier';
  };

  const handleShelfStaffChange = (id, val) => {
    setRosterShelf(prev => prev.map(item => item.id === id ? { ...item, staff: val } : item));
  };

  return (
    <div className="space-y-6">
      {/* Black Header Banner resembling PDF Slide Header */}
      <div className="pdf-section-header">
        <span>PHÂN CHIA KỆ</span>
        <span className="pdf-section-header-sub">Chapter 1 • Daily Operation Report</span>
      </div>

      <div className="shelves-grid">
        {/* Left/Middle: Interactive Shelf Division Table */}
        <div className="space-y-6">
          <div className="bento-card space-y-4">
            <div className="border-b border-light pb-2">
              <h3 className="text-xs font-display font-bold uppercase tracking-wider text-text-dark">Lịch Phân Chia Các Khu Vực Kệ Tại Cửa Hàng</h3>
            </div>
            <div className="table-container">
              <table className="lush-table">
                <thead>
                  <tr>
                    <th className="w-16 text-center">STT</th>
                    <th>Khu vực</th>
                    <th className="w-64">Người phụ trách</th>
                  </tr>
                </thead>
                <tbody>
                  {rosterShelf.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="text-center font-bold font-mono text-xs">{idx + 1}</td>
                      <td>
                        <span className={`badge-bw text-xs font-bold ${getShelfBadgeClass(item.area)}`}>
                          {item.area}
                        </span>
                      </td>
                      <td className="cell-highlight">
                        <input
                          type="text"
                          value={item.staff}
                          onChange={(e) => handleShelfStaffChange(item.id, e.target.value)}
                          className="table-input font-semibold"
                          placeholder="Nhập tên nhân viên..."
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Work Goals (Mục tiêu công việc) */}
        <div>
          <div className="bento-card goals-card h-full space-y-4">
            <div className="flex items-center gap-2 border-b border-light pb-2">
              <Target size={16} className="text-emerald-600" />
              <h3 className="text-xs font-display font-bold uppercase tracking-wider text-text-dark">Mục Tiêu Công Việc</h3>
            </div>
            <p className="goal-subtitle">Đảm bảo khu vực được phân công:</p>
            <ul className="goals-list">
              {[
                'Đảm bảo đầy đủ hàng hóa & tester',
                'Kệ luôn sạch sẽ và đúng tiêu chuẩn VM',
                'Các routine thu hút khách hàng và dễ dàng tư vấn',
                'Đảm bảo nguyên tắc FIFO hàng hóa (trên kệ và cupboard)'
              ].map((goal, idx) => (
                <li key={idx}>
                  <div className="check-icon">✓</div>
                  <span className="leading-tight">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Row 2: Job Responsibilities (Slide 4 Content) */}
      <div className="bento-card space-y-4 w-full">
        <div className="flex items-center gap-2 border-b border-light pb-2">
          <ClipboardList size={16} className="text-emerald-600" />
          <h3 className="text-xs font-display font-bold uppercase tracking-wider text-text-dark">Trách Nhiệm Công Việc Chi Tiết</h3>
        </div>

        <div className="responsibilities-grid">
          {/* Card A: Quản lý hàng hóa */}
          <div className="responsibility-card">
            <div className="responsibility-badge responsibility-badge-goods">
              Quản lý hàng hóa
            </div>
            <ul className="list-disc">
              <li>Phụ trách kiểm hàng theo khu vực <strong>mỗi tuần</strong></li>
              <li><strong>Refill sản phẩm</strong> kịp thời vào đầu ca và <strong>tránh để kệ trống</strong></li>
              <li>Báo cáo cho SM khi thiếu hàng</li>
              <li><strong>Kiểm tra thường xuyên</strong> HSD và tình trạng sản phẩm</li>
              <li><strong>Theo dõi</strong> sản phẩm bán chậm/bán chạy</li>
            </ul>
          </div>

          {/* Card B: VM & Vệ sinh */}
          <div className="responsibility-card">
            <div className="responsibility-badge responsibility-badge-vm">
              VM & Vệ sinh
            </div>
            <ul className="list-disc">
              <li>Trưng bày VM theo <strong>đúng layout của brand</strong></li>
              <li>Lau kệ sạch sẽ, không bụi bẩn</li>
              <li>Tester luôn sạch sẽ và đầy đủ <strong>(không dưới 1/3)</strong> và sử dụng được</li>
            </ul>
          </div>

          {/* Card C: Báo cáo & Trách nhiệm */}
          <div className="responsibility-card">
            <div className="responsibility-badge responsibility-badge-report">
              Báo cáo & Trách nhiệm
            </div>
            <ul className="list-disc">
              <li><strong>Chịu trách nhiệm</strong> nếu khu vực mình bừa bộn</li>
              <li><strong>Báo cáo cho leader</strong> khi kệ mình có các vấn đề bên trên xảy ra thường xuyên</li>
              <li>Phối hợp với toàn bộ cửa hàng để vận hành được trơn tru</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
