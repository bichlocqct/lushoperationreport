import React, { useState } from 'react';
import { Check, ClipboardList, Clock, RefreshCw, AlertCircle, Coins, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { OPENING_CHECKLIST_TEMPLATE, SELLING_HOUR_TEMPLATE, KPI_TEMPLATES } from '../data/initialData';

export default function ChecklistsTab({ 
  openingChecks = {}, 
  setOpeningChecks, 
  openingNotes = {}, 
  setOpeningNotes,
  sellingChecks = {}, 
  setSellingChecks,
  sellingNotes = {}, 
  setSellingNotes,
  kpiValues = {},
  setKpiValues
}) {
  const [activeSubTab, setActiveSubTab] = useState('opening'); // 'opening' | 'selling' | 'kpis'
  const [openingFilter, setOpeningFilter] = useState('All');

  const getCatBadgeClass = (cat) => {
    const norm = cat.toLowerCase();
    if (norm.includes('grooming')) return 'badge-cat-grooming';
    if (norm.includes('cleanliness') || norm.includes('store cleanliness')) return 'badge-cat-cleanliness';
    if (norm.includes('ambience')) return 'badge-cat-ambience';
    if (norm.includes('electrical')) return 'badge-cat-electrical';
    if (norm.includes('pos')) return 'badge-cat-pos';
    if (norm.includes('cashier')) return 'badge-cat-cashier';
    if (norm.includes('vm')) return 'badge-cat-vm';
    if (norm.includes('tester')) return 'badge-cat-tester';
    if (norm.includes('activation')) return 'badge-cat-activation';
    if (norm.includes('stock')) return 'badge-cat-stock';
    if (norm.includes('brief') || norm.includes('team')) return 'badge-cat-brief';
    return 'badge-bw';
  };

  // Compute Opening Progress
  const totalOpeningItems = OPENING_CHECKLIST_TEMPLATE.length;
  const completedOpeningItems = OPENING_CHECKLIST_TEMPLATE.filter(item => openingChecks[item.id]).length;
  const openingProgressPercent = Math.round((completedOpeningItems / totalOpeningItems) * 100);

  // Categories in Opening Checklist
  const openingCategories = ['All', ...new Set(OPENING_CHECKLIST_TEMPLATE.map(item => {
    if (item.category === 'Store Cleanliness') return 'Cleanliness';
    if (item.category === 'Team Brief') return 'Brief';
    return item.category;
  }))];

  const handleOpeningToggle = (id) => {
    setOpeningChecks(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleOpeningNoteChange = (id, val) => {
    setOpeningNotes(prev => ({
      ...prev,
      [id]: val
    }));
  };

  const handleSellingToggle = (itemId, timeSlot) => {
    setSellingChecks(prev => {
      const currentItemState = prev[itemId] || {};
      return {
        ...prev,
        [itemId]: {
          ...currentItemState,
          [timeSlot]: !currentItemState[timeSlot]
        }
      };
    });
  };

  const handleSellingNoteChange = (itemId, val) => {
    setSellingNotes(prev => ({
      ...prev,
      [itemId]: val
    }));
  };

  const handleKpiValChange = (key, field, val) => {
    setKpiValues(prev => {
      const currentKpi = prev[key] || { target: '', actual: '', actionPlan: '' };
      return {
        ...prev,
        [key]: {
          ...currentKpi,
          [field]: val
        }
      };
    });
  };

  const getKpiValue = (key, field) => {
    return kpiValues[key]?.[field] || '';
  };

  const resetOpening = () => {
    if (window.confirm('Đặt lại toàn bộ checklist mở cửa?')) {
      setOpeningChecks({});
      setOpeningNotes({});
    }
  };

  const resetSelling = () => {
    if (window.confirm('Đặt lại toàn bộ checklist trong giờ?')) {
      setSellingChecks({});
      setSellingNotes({});
    }
  };

  const resetKpis = () => {
    if (window.confirm('Đặt lại toàn bộ các chỉ số KPI?')) {
      setKpiValues({});
    }
  };

  const getFilteredOpeningItems = () => {
    if (openingFilter === 'All') return OPENING_CHECKLIST_TEMPLATE;
    return OPENING_CHECKLIST_TEMPLATE.filter(item => {
      const cat = item.category === 'Store Cleanliness' ? 'Cleanliness' : 
                   item.category === 'Team Brief' ? 'Brief' : item.category;
      return cat === openingFilter;
    });
  };

  return (
    <div className="space-y-6">
      {/* Black Header Banner resembling PDF Slide Header */}
      <div className="pdf-section-header">
        <span>DAILY OPERATION CHECKLIST</span>
        <span className="pdf-section-header-sub">Chapter 5 • Daily Operation Guideline</span>
      </div>

      {/* Sub Tabs Selection */}
      <div className="flex border-b border-medium pb-2 justify-between items-center flex-wrap gap-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveSubTab('opening')}
            className={`px-4 py-2 font-display text-xs font-bold uppercase tracking-wider transition-all rounded-md ${
              activeSubTab === 'opening' 
                ? 'bg-black text-white shadow-sm' 
                : 'text-text-muted bg-transparent hover:text-black'
            }`}
          >
            Opening Checklist (Trước mở cửa)
          </button>
          <button
            onClick={() => setActiveSubTab('selling')}
            className={`px-4 py-2 font-display text-xs font-bold uppercase tracking-wider transition-all rounded-md ${
              activeSubTab === 'selling' 
                ? 'bg-black text-white shadow-sm' 
                : 'text-text-muted bg-transparent hover:text-black'
            }`}
          >
            Selling Hour Checklist (Trong ca)
          </button>
          <button
            onClick={() => setActiveSubTab('kpis')}
            className={`px-4 py-2 font-display text-xs font-bold uppercase tracking-wider transition-all rounded-md ${
              activeSubTab === 'kpis' 
                ? 'bg-black text-white shadow-sm' 
                : 'text-text-muted bg-transparent hover:text-black'
            }`}
          >
            KPI Tracking (17H00)
          </button>
        </div>

        <button 
          onClick={
            activeSubTab === 'opening' ? resetOpening : 
            activeSubTab === 'selling' ? resetSelling : resetKpis
          }
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-emerald-600 font-display font-bold uppercase tracking-wider transition-colors"
        >
          <RefreshCw size={12} />
          Đặt lại bảng
        </button>
      </div>

      {/* 1. Opening Checklist Tab */}
      {activeSubTab === 'opening' && (
        <div className="space-y-6">
          {/* Progress Banner */}
          <div className="bento-card flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-md font-display font-bold uppercase tracking-wider mb-1">Tiến Độ Chuẩn Bị Mở Cửa (1 Tiếng Trước Giờ Mở)</h3>
              <p className="text-xs text-text-muted">
                Đã hoàn thành <strong className="font-mono text-text-dark text-xs">{completedOpeningItems}</strong> trên tổng số <strong className="font-mono text-text-dark text-xs">{totalOpeningItems}</strong> đầu việc.
              </p>
            </div>
            <div className="flex-1 md:max-w-xs">
              <div className="flex justify-between text-xs font-bold font-mono uppercase tracking-wider mb-1 text-emerald-700">
                <span>Hoàn tất:</span>
                <span>{openingProgressPercent}%</span>
              </div>
              <div className="lush-progress-container">
                <div 
                  className="lush-progress-bar" 
                  style={{ width: `${openingProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap gap-1.5">
            {openingCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setOpeningFilter(cat)}
                className={`px-3 py-1.5 text-[10px] font-bold font-display uppercase tracking-wider border rounded-md transition-all ${
                  openingFilter === cat 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                    : 'bg-white text-text-dark border-border-medium hover:border-emerald-600 hover:text-emerald-600'
                }`}
              >
                {cat === 'All' ? 'Tất cả' : cat}
              </button>
            ))}
          </div>

          {/* Checklist Table */}
          <div className="table-container overflow-x-auto">
            <table className="lush-table">
              <thead>
                <tr>
                  <th className="w-16 text-center" style={{ padding: '0.75rem 1rem' }}>STT</th>
                  <th className="w-32" style={{ padding: '0.75rem 1rem' }}>Hạng mục</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Nội dung kiểm tra</th>
                  <th className="w-24 text-center" style={{ padding: '0.75rem 1rem' }}>Trạng thái</th>
                  <th className="w-80" style={{ padding: '0.75rem 1rem' }}>Ghi chú sự cố phát sinh</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredOpeningItems().map((item, idx) => (
                  <tr 
                    key={item.id} 
                    className={openingChecks[item.id] ? 'row-checked' : ''}
                  >
                    <td className="text-center font-bold font-mono text-xs" style={{ padding: '0.6rem 1rem' }}>{idx + 1}</td>
                    <td style={{ padding: '0.6rem 1rem' }}>
                      <span className={`badge-bw text-[10px] px-2 py-0.5 font-bold ${getCatBadgeClass(item.category)}`}>
                        {item.category}
                      </span>
                    </td>
                    <td style={{ padding: '0.6rem 1rem' }}>
                      <p className={`text-xs font-semibold ${openingChecks[item.id] ? 'text-text-muted line-through' : 'text-text-dark'}`}>
                        {item.task}
                      </p>
                    </td>
                    <td className="text-center" style={{ padding: '0.6rem 1rem' }}>
                      <label className="custom-checkbox">
                        <input 
                          type="checkbox"
                          checked={!!openingChecks[item.id]}
                          onChange={() => handleOpeningToggle(item.id)}
                        />
                        <div className="checkbox-visual">
                          <Check size={12} strokeWidth={4} />
                        </div>
                      </label>
                    </td>
                    <td style={{ padding: '0.25rem 0.5rem' }} className="cell-highlight">
                      <input
                        type="text"
                        value={openingNotes[item.id] || ''}
                        onChange={(e) => handleOpeningNoteChange(item.id, e.target.value)}
                        placeholder="Ghi chú sự cố phát sinh..."
                        className="table-input"
                      />
                    </td>
                  </tr>
                ))}

                {getFilteredOpeningItems().length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-text-muted font-display text-xs uppercase font-bold">
                      Không có đầu việc nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Selling Hour Checklist Tab */}
      {activeSubTab === 'selling' && (
        <div className="space-y-6">
          <div className="bento-card bg-slate-50/50">
            <h3 className="text-md font-display font-bold uppercase tracking-wider mb-1">Selling Hour Checklist (Trong Giờ Hoạt Động)</h3>
            <p className="text-xs text-text-muted">
              Kiểm tra định kỳ trải nghiệm khách hàng (Customer Experience) và phục hồi cửa hàng (Store Recovery) lúc 11AM, 2PM, 5PM, và 7PM.
            </p>
          </div>

          <div className="table-container overflow-x-auto">
            <table className="lush-table">
              <thead>
                <tr>
                  <th className="w-40" style={{ padding: '0.75rem 1.2rem' }}>Hạng mục</th>
                  <th style={{ padding: '0.75rem 1.2rem' }}>Nội dung</th>
                  <th className="text-center w-24" style={{ padding: '0.75rem' }}>11AM</th>
                  <th className="text-center w-24" style={{ padding: '0.75rem' }}>2PM</th>
                  <th className="text-center w-24" style={{ padding: '0.75rem' }}>5PM</th>
                  <th className="text-center w-24" style={{ padding: '0.75rem' }}>7PM</th>
                  <th className="min-w-[240px]" style={{ padding: '0.75rem 1.2rem' }}>Ghi chú sự cố / Hành động</th>
                </tr>
              </thead>
              <tbody>
                {SELLING_HOUR_TEMPLATE.map(item => {
                  const checks = sellingChecks[item.id] || {};
                  return (
                    <tr key={item.id}>
                      <td style={{ padding: '0.75rem 1.2rem' }}>
                        <span className={`badge-bw text-[9px] px-2 py-0.5 font-bold block w-fit ${
                          item.category.includes('Experience') ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>
                          {item.category === 'Customer Experience' ? 'Customer Experience' : 'Store Recovery'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1.2rem' }}>
                        <p className="text-xs font-semibold text-text-dark">{item.task}</p>
                      </td>
                      {['11am', '2pm', '5pm', '7pm'].map(slot => (
                        <td key={slot} className="text-center" style={{ padding: '0.4rem 0.75rem' }}>
                          <label className="custom-checkbox m-auto">
                            <input 
                              type="checkbox"
                              checked={!!checks[slot]}
                              onChange={() => handleSellingToggle(item.id, slot)}
                            />
                            <div className="checkbox-visual">
                              <Check size={12} strokeWidth={4} />
                            </div>
                          </label>
                        </td>
                      ))}
                      <td style={{ padding: '0.25rem 0.5rem' }} className="cell-highlight">
                        <input
                          type="text"
                          value={sellingNotes[item.id] || ''}
                          onChange={(e) => handleSellingNoteChange(item.id, e.target.value)}
                          placeholder="Ghi chú/Hành động..."
                          className="table-input"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. KPI Tracking Tab (Slide 20 Table) */}
      {activeSubTab === 'kpis' && (
        <div className="space-y-6">
          <div className="bento-card bg-slate-50/50">
            <h3 className="text-md font-display font-bold uppercase tracking-wider mb-1">KPI Tracking (17h00)</h3>
            <p className="text-xs text-text-muted">
              Cập nhật các chỉ số thực tế (Actual) so với chỉ tiêu (Target) và lập kế hoạch hành động (Action Plan) trong ca trực.
            </p>
          </div>

          <div className="table-container overflow-x-auto">
            <table className="lush-table text-left w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-xs font-bold border-b border-medium w-64">KPI</th>
                  <th className="p-3 text-xs font-bold border-b border-medium w-40 text-center">Mục tiêu (Target)</th>
                  <th className="p-3 text-xs font-bold border-b border-medium w-40 text-center">Thực tế (Actual)</th>
                  <th className="p-3 text-xs font-bold border-b border-medium w-44 text-center">Hiệu suất</th>
                  <th className="p-3 text-xs font-bold border-b border-medium">Kế hoạch hành động (Action Plan)</th>
                </tr>
              </thead>
              <tbody>
                {KPI_TEMPLATES.map(kpi => {
                  const target = getKpiValue(kpi.key, 'target');
                  const actual = getKpiValue(kpi.key, 'actual');
                  
                  // Compute achievement
                  const t = parseFloat(target);
                  const a = parseFloat(actual);
                  let perf = null;
                  if (!isNaN(t) && !isNaN(a) && t > 0) {
                    perf = Math.round((a / t) * 100);
                  }

                  let progressColor = 'bg-slate-100 text-slate-500';
                  if (perf !== null) {
                    if (perf >= 100) progressColor = 'bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold';
                    else if (perf >= 80) progressColor = 'bg-amber-50 text-amber-700 border border-amber-100 font-bold';
                    else progressColor = 'bg-rose-50 text-rose-700 border border-rose-100 font-bold';
                  }

                  return (
                    <tr key={kpi.key} className="hover:bg-slate-50/50">
                      <td className="p-3 border-b border-medium">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-text-dark">{kpi.label}</span>
                          <span className="text-[10px] text-text-muted">Đơn vị: {kpi.unit}</span>
                        </div>
                      </td>
                      <td className="p-2 border-b border-medium cell-highlight">
                        <input
                          type="text"
                          value={target}
                          onChange={(e) => handleKpiValChange(kpi.key, 'target', e.target.value)}
                          placeholder="Chỉ tiêu..."
                          className="table-input text-center font-semibold"
                        />
                      </td>
                      <td className="p-2 border-b border-medium cell-highlight">
                        <input
                          type="text"
                          value={actual}
                          onChange={(e) => handleKpiValChange(kpi.key, 'actual', e.target.value)}
                          placeholder="Thực tế..."
                          className="table-input text-center font-semibold"
                        />
                      </td>
                      <td className="p-3 border-b border-medium text-center">
                        <span className={`text-[10px] px-2.5 py-1 rounded-md ${progressColor}`}>
                          {perf !== null ? `${perf}%` : 'N/A'}
                        </span>
                      </td>
                      <td className="p-2 border-b border-medium cell-highlight">
                        <input
                          type="text"
                          value={getKpiValue(kpi.key, 'actionPlan')}
                          onChange={(e) => handleKpiValChange(kpi.key, 'actionPlan', e.target.value)}
                          placeholder="Nhập kế hoạch hành động..."
                          className="table-input"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
