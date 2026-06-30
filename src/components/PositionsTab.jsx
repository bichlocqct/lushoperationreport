import React, { useState } from 'react';
import { Clock, Info, Shield, HelpCircle, Package, Palette, Sparkles } from 'lucide-react';
import { POSITION_SOP } from '../data/initialData';

export default function PositionsTab({ rosterPos, setRosterPos }) {
  const [activeSopTab, setActiveSopTab] = useState('kho'); // 'kho' | 'vmd' | 'vesinh'

  const getPosBadgeClass = (pos) => {
    const norm = pos.toLowerCase();
    if (norm.includes('tester')) return 'badge-pos-tester';
    if (norm.includes('kho')) return 'badge-pos-kho';
    if (norm.includes('vmd')) return 'badge-pos-vmd';
    if (norm.includes('vệ sinh')) return 'badge-pos-vesinh';
    return 'badge-bw';
  };

  const handlePosStaffChange = (id, val) => {
    setRosterPos(prev => prev.map(item => item.id === id ? { ...item, staff: val } : item));
  };

  const getTabConfig = (tabKey) => {
    switch (tabKey) {
      case 'kho':
        return {
          label: 'KHO',
          desc: 'Quản lý kho hàng',
          icon: Package,
          activeClass: 'sop-filter-btn-kho'
        };
      case 'vmd':
        return {
          label: 'VMD',
          desc: 'Visual Merchandising',
          icon: Palette,
          activeClass: 'sop-filter-btn-vmd'
        };
      case 'vesinh':
        return {
          label: 'VỆ SINH',
          desc: 'Vệ sinh cửa hàng',
          icon: Sparkles,
          activeClass: 'sop-filter-btn-vesinh'
        };
      default:
        return {
          label: tabKey.toUpperCase(),
          desc: '',
          icon: Info,
          activeClass: ''
        };
    }
  };

  const currentSop = POSITION_SOP[activeSopTab];

  return (
    <div className="space-y-6">
      {/* PDF Styled Section Header Bar */}
      <div className="pdf-section-header">
        <span>PHÂN CHIA VỊ TRÍ TẠI CỬA HÀNG</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roster Assignment Table */}
        <div className="lg:col-span-1">
          <div className="bento-card space-y-4 h-full">
            <div className="border-b border-light pb-2">
              <h3 className="text-xs font-display font-bold uppercase tracking-wider text-text-dark">Lịch Phân Chia Vị Trí Trong Cửa Hàng</h3>
            </div>
            <div className="table-container border-0 shadow-none">
              <table className="lush-table">
                <thead>
                  <tr>
                    <th className="w-16 text-center">STT</th>
                    <th>Vị trí</th>
                    <th>Người phụ trách</th>
                  </tr>
                </thead>
                <tbody>
                  {rosterPos.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="text-center font-bold font-mono text-xs">{idx + 1}</td>
                      <td>
                        <span className={`badge-bw text-xs font-bold ${getPosBadgeClass(item.position)}`}>
                          {item.position}
                        </span>
                      </td>
                      <td className="cell-highlight">
                        <input
                          type="text"
                          value={item.staff}
                          onChange={(e) => handlePosStaffChange(item.id, e.target.value)}
                          className="table-input font-semibold"
                          placeholder="Nhập tên..."
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SOP Guidelines Documentation */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bento-card space-y-6 h-full">
            <div className="flex flex-col gap-4 border-b border-light pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-900 text-white rounded-lg">
                  <Info size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-display font-extrabold uppercase tracking-wider text-text-dark">Quy Trình Hoạt Động Chuẩn (SOP)</h3>
                  <p className="text-xs text-text-muted mt-0.5">Tiêu chuẩn vận hành hàng ngày cho các vị trí cửa hàng</p>
                </div>
              </div>

              {/* SOP Tabs Switcher as Filter Bar */}
              <div className="sop-filter-container">
                {['kho', 'vmd', 'vesinh'].map(tabKey => {
                  const config = getTabConfig(tabKey);
                  const IconComponent = config.icon;
                  const isActive = activeSopTab === tabKey;
                  return (
                    <button
                      key={tabKey}
                      onClick={() => setActiveSopTab(tabKey)}
                      className={`sop-filter-btn ${isActive ? `active ${config.activeClass}` : ''}`}
                    >
                      <IconComponent size={18} className="sop-filter-icon" />
                      <div className="text-left">
                        <span className="block sop-filter-label">{config.label}</span>
                        <span className="block sop-filter-desc">{config.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SOP Detailed Tables */}
            <div className="space-y-6">
              {currentSop.sections.map((section, secIdx) => (
                <div key={secIdx} className="space-y-3">
                  <div className="sop-time-badge">
                    <Clock size={14} />
                    <span>Thời điểm: {section.time}</span>
                  </div>

                  <div className="table-container overflow-x-auto border border-slate-200 shadow-sm rounded-xl">
                    <table className="sop-table text-left w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="w-1/4">Công việc</th>
                          <th className="w-1/4">Mục đích</th>
                          <th className="w-2/4">Cách thực hiện</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.tasks.map((task, taskIdx) => (
                          <tr key={taskIdx} className="hover:bg-slate-50/50">
                            <td className="sop-table-task-name">
                              {task.name}
                            </td>
                            <td className="sop-table-task-purpose">
                              {task.purpose}
                            </td>
                            <td>
                              <ul className="sop-table-steps-list">
                                {task.steps.map((step, stepIdx) => (
                                  <li key={stepIdx}>{step}</li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
