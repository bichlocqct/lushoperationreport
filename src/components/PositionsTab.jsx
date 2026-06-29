import React, { useState } from 'react';
import { Clock, Info, Shield, HelpCircle } from 'lucide-react';
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

  const currentSop = POSITION_SOP[activeSopTab];

  return (
    <div className="space-y-6">
      {/* PDF Styled Section Header Bar */}
      <div className="pdf-section-header">
        <span>PHÂN CHIA VỊ TRÍ TẠI CỬA HÀNG</span>
        <span className="pdf-section-header-sub">Chapter 2 • Daily Operation Guideline</span>
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-light pb-3">
              <div className="flex items-center gap-2">
                <Info size={16} className="text-emerald-600" />
                <h3 className="text-xs font-display font-bold uppercase tracking-wider text-text-dark">Quy Trình Hoạt Động Chuẩn (SOP)</h3>
              </div>

              {/* SOP Tabs Switcher */}
              <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                {['kho', 'vmd', 'vesinh'].map(tabKey => {
                  const label = tabKey === 'kho' ? 'KHO' : tabKey === 'vmd' ? 'VMD' : 'VỆ SINH';
                  const isActive = activeSopTab === tabKey;
                  return (
                    <button
                      key={tabKey}
                      onClick={() => setActiveSopTab(tabKey)}
                      className={`px-3 py-1 text-[10px] font-bold font-display uppercase tracking-wider rounded-md transition-all ${
                        isActive
                          ? 'bg-black text-white shadow-sm'
                          : 'text-text-muted hover:text-black'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SOP Detailed Tables */}
            <div className="space-y-6">
              {currentSop.sections.map((section, secIdx) => (
                <div key={secIdx} className="space-y-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold font-display uppercase tracking-wider text-emerald-800 bg-emerald-50 w-fit px-2.5 py-1 rounded-full border border-emerald-100">
                    <Clock size={12} className="text-emerald-600" />
                    <span>Thời điểm: {section.time}</span>
                  </div>

                  <div className="table-container overflow-x-auto">
                    <table className="lush-table text-left w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="p-3 text-xs font-bold border-b border-medium w-40">Công việc</th>
                          <th className="p-3 text-xs font-bold border-b border-medium w-52">Mục đích</th>
                          <th className="p-3 text-xs font-bold border-b border-medium">Cách thực hiện</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.tasks.map((task, taskIdx) => (
                          <tr key={taskIdx} className="hover:bg-slate-50/50">
                            <td className="p-3 border-b border-medium font-bold text-xs text-text-dark vertical-top align-top">
                              {task.name}
                            </td>
                            <td className="p-3 border-b border-medium text-xs text-text-muted vertical-top align-top">
                              {task.purpose}
                            </td>
                            <td className="p-3 border-b border-medium text-xs text-slate-800 vertical-top align-top">
                              <ul className="list-disc pl-4 space-y-1.5">
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
