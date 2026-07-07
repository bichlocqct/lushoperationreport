import React, { useState } from 'react';
import { Check, ClipboardList, Clock, RefreshCw, AlertCircle, Coins, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { OPENING_CHECKLIST_TEMPLATE, SELLING_HOUR_TEMPLATE, KPI_TEMPLATES, GRADING_CATEGORIES } from '../data/initialData';

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
  setKpiValues,
  gradingScores = {},
  setGradingScores,
  overallComments = '',
  setOverallComments
}) {
  const [activeSubTab, setActiveSubTab] = useState('opening'); // 'opening' | 'selling' | 'kpis'

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

  const resetGrading = () => {
    if (window.confirm('Đặt lại toàn bộ điểm và nhận xét?')) {
      setGradingScores({});
      setOverallComments('');
    }
  };

  // Compute Overall Grading Score
  let gradedCount = 0;
  let totalGradedScore = 0;
  GRADING_CATEGORIES.forEach(cat => {
    const scoreVal = gradingScores[cat.key]?.score;
    if (scoreVal !== undefined && scoreVal !== null && scoreVal !== '') {
      totalGradedScore += parseFloat(scoreVal);
      gradedCount++;
    }
  });
  const overallGradingScore = gradedCount > 0 ? (totalGradedScore / gradedCount).toFixed(1) : null;

  return (
    <div className="space-y-6">
      {/* Black Header Banner resembling PDF Slide Header */}
      <div className="pdf-section-header">
        <span>DAILY OPERATION CHECKLIST</span>
      </div>

      {/* Sub Tabs Selection */}
      <div className="flex border-b border-medium pb-3 justify-between items-center flex-wrap gap-4">
        <div className="subtabs-container">
          <button
            onClick={() => setActiveSubTab('opening')}
            className={`subtab-btn ${activeSubTab === 'opening' ? 'active' : ''}`}
          >
            Opening Checklist (Trước mở cửa)
          </button>
          <button
            onClick={() => setActiveSubTab('selling')}
            className={`subtab-btn ${activeSubTab === 'selling' ? 'active' : ''}`}
          >
            Selling Hour Checklist (Trong ca)
          </button>
          <button
            onClick={() => setActiveSubTab('kpis')}
            className={`subtab-btn ${activeSubTab === 'kpis' ? 'active' : ''}`}
          >
            KPI Tracking (17H00)
          </button>
          <button
            onClick={() => setActiveSubTab('grading')}
            className={`subtab-btn ${activeSubTab === 'grading' ? 'active' : ''}`}
          >
            Chấm Điểm Vận Hành & Nhận Xét
          </button>
        </div>

        <button 
          onClick={
            activeSubTab === 'opening' ? resetOpening : 
            activeSubTab === 'selling' ? resetSelling : 
            activeSubTab === 'kpis' ? resetKpis : resetGrading
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
                {OPENING_CHECKLIST_TEMPLATE.map((item, idx) => (
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

                {OPENING_CHECKLIST_TEMPLATE.length === 0 && (
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

      {/* 4. Operations Grading & Comments Tab */}
      {activeSubTab === 'grading' && (
        <div className="space-y-6">
          <div className="bento-card flex flex-col md:flex-row md:items-center justify-between gap-6" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-medium)' }}>
            <div>
              <h3 className="text-md font-display font-bold uppercase tracking-wider mb-1" style={{ margin: 0, fontSize: '15px' }}>Bảng Chấm Điểm & Nhận Xét Vận Hành</h3>
              <p className="text-xs text-text-muted" style={{ margin: '4px 0 0 0', fontSize: '11px' }}>
                Đánh giá các khía cạnh vận hành của cửa hàng theo thang điểm từ 1 đến 10 và nhập nhận xét chung.
              </p>
            </div>
            {overallGradingScore !== null && (
              <div className="flex items-center gap-4 bg-slate-50 border border-medium p-3 rounded-xl" style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#f8fafc', border: '1px solid var(--border-medium)', padding: '12px 16px', borderRadius: '12px' }}>
                <div className="flex flex-col items-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider" style={{ fontSize: '9px' }}>Điểm trung bình</span>
                  <span className="text-2xl font-black font-mono" style={{ fontSize: '24px', fontWeight: 900 }}>{overallGradingScore} <span className="text-xs font-normal text-text-muted" style={{ fontSize: '12px' }}>/10</span></span>
                </div>
                <div className="h-8 w-px bg-medium" style={{ height: '32px', width: '1px', backgroundColor: 'var(--border-medium)' }}></div>
                <div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold block w-fit`} style={{
                    fontSize: '10px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    display: 'block',
                    width: 'fit-content',
                    border: '1px solid transparent',
                    ...(parseFloat(overallGradingScore) >= 9.0 ? { backgroundColor: '#ecfdf5', color: '#047857', borderColor: '#d1fae5' } :
                       parseFloat(overallGradingScore) >= 7.0 ? { backgroundColor: '#eff6ff', color: '#1d4ed8', borderColor: '#dbeafe' } :
                       parseFloat(overallGradingScore) >= 5.0 ? { backgroundColor: '#fffbeb', color: '#b45309', borderColor: '#fef3c7' } :
                       { backgroundColor: '#fff1f2', color: '#be123c', borderColor: '#ffe4e6' })
                  }}>
                    {parseFloat(overallGradingScore) >= 9.0 ? 'XUẤT SẮC (EXCELLENT)' :
                     parseFloat(overallGradingScore) >= 7.0 ? 'KHÁ TỐT (GOOD)' :
                     parseFloat(overallGradingScore) >= 5.0 ? 'TRUNG BÌNH (AVERAGE)' :
                     'CẦN CẢI THIỆN (IMPROVEMENT)'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {GRADING_CATEGORIES.map(cat => {
              const currentData = gradingScores[cat.key] || { score: '', note: '' };
              const score = currentData.score;
              const note = currentData.note;

              const handleScoreSelect = (val) => {
                setGradingScores(prev => {
                  const safePrev = prev || {};
                  return {
                    ...safePrev,
                    [cat.key]: {
                      ...(safePrev[cat.key] || {}),
                      score: val
                    }
                  };
                });
              };

              const handleNoteChange = (val) => {
                setGradingScores(prev => {
                  const safePrev = prev || {};
                  return {
                    ...safePrev,
                    [cat.key]: {
                      ...(safePrev[cat.key] || {}),
                      note: val
                    }
                  };
                });
              };

              const getActiveStyle = (val) => {
                const styles = {
                  color: '#ffffff',
                  cursor: 'pointer'
                };
                if (val <= 4) return { ...styles, backgroundColor: '#dc2626', borderColor: '#dc2626' };
                if (val <= 6) return { ...styles, backgroundColor: '#f59e0b', borderColor: '#f59e0b' };
                if (val <= 8) return { ...styles, backgroundColor: '#2563eb', borderColor: '#2563eb' };
                return { ...styles, backgroundColor: '#059669', borderColor: '#059669' };
              };

              const getBadgeText = (val) => {
                if (!val) return '';
                if (val <= 4) return 'Cần cải thiện';
                if (val <= 6) return 'Trung bình';
                if (val <= 8) return 'Khá tốt';
                return 'Xuất sắc';
              };

              const getBadgeStyle = (val) => {
                if (!val) return {};
                if (val <= 4) return { color: '#be123c', backgroundColor: '#fff1f2', borderColor: '#ffe4e6' };
                if (val <= 6) return { color: '#b45309', backgroundColor: '#fffbeb', borderColor: '#fef3c7' };
                if (val <= 8) return { color: '#1d4ed8', backgroundColor: '#eff6ff', borderColor: '#dbeafe' };
                return { color: '#047857', backgroundColor: '#ecfdf5', borderColor: '#d1fae5' };
              };

              return (
                <div key={cat.key} className="bento-card hover:border-black transition-all" style={{ border: '1px solid var(--border-medium)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-card)' }}>
                  <div className="flex justify-between items-start flex-wrap gap-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <h4 className="text-sm font-bold text-text-dark flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 'bold', margin: 0 }}>
                        {cat.label}
                        {score && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full border font-bold" style={{
                            fontSize: '9px',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            fontWeight: 'bold',
                            ...getBadgeStyle(score)
                          }}>
                            {getBadgeText(score)}
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-text-muted mt-0.5" style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>{cat.desc}</p>
                    </div>
                    {score && (
                      <span className="text-lg font-black font-mono text-text-dark" style={{ fontSize: '16px', fontWeight: 900 }}>
                        {score} <span className="text-xs font-normal text-text-muted" style={{ fontSize: '11px' }}>/10</span>
                      </span>
                    )}
                  </div>

                  {/* 1-10 Slider / Segment Buttons */}
                  <div className="flex flex-wrap gap-1 md:gap-2" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => {
                      const isSelected = score === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleScoreSelect(val)}
                          className={`w-9 h-9 text-xs font-bold font-mono rounded-lg border transition-all flex items-center justify-center cursor-pointer`}
                          style={{
                            width: '36px',
                            height: '36px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                            ...(isSelected 
                              ? getActiveStyle(val) 
                              : { backgroundColor: '#ffffff', color: 'var(--text-dark)', borderColor: 'var(--border-medium)' }
                            )
                          }}
                        >
                          {val}
                        </button>
                      );
                    })}
                    {score && (
                      <button
                        type="button"
                        onClick={() => handleScoreSelect('')}
                        className="text-[10px] text-rose-500 hover:text-rose-700 font-bold uppercase tracking-wider px-2 cursor-pointer bg-transparent border-none"
                        style={{ fontSize: '10px', color: '#f43f5e', fontWeight: 'bold', letterSpacing: '0.05em', textTransform: 'uppercase', paddingLeft: '8px', cursor: 'pointer' }}
                      >
                        Xóa điểm
                      </button>
                    )}
                  </div>

                  {/* Category Note Input */}
                  <div className="flex gap-2 items-center" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="text-xs text-text-muted font-bold min-w-[90px]" style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', minWidth: '90px' }}>Ghi chú/Góp ý:</span>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => handleNoteChange(e.target.value)}
                      placeholder="Nhập ghi chú chi tiết cho phần này (nếu có)..."
                      className="table-input flex-1"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Overall Comments Textarea */}
          <div className="bento-card border-2 border-black p-5 space-y-3" style={{ border: '2px solid #000000', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: 'var(--bg-card)' }}>
            <h4 className="text-sm font-bold uppercase tracking-wider text-text-dark" style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>✍️ Nhận xét chung của Ca trưởng (Overall Comments)</h4>
            <p className="text-xs text-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Ghi nhận tổng quát về ca làm việc, các điểm nhấn hoặc các vấn đề cần lưu ý đặc biệt cho ca sau.</p>
            <textarea
              value={overallComments}
              onChange={(e) => setOverallComments(e.target.value)}
              placeholder="Nhập đánh giá, nhận xét chung về nhân sự, doanh số, dịch vụ khách hàng hoặc sự cố phát sinh..."
              className="w-full min-h-[120px] p-3 text-xs border border-medium focus:border-black rounded-none outline-none font-sans resize-y"
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '12px',
                fontSize: '12px',
                border: '1px solid var(--border-medium)',
                outline: 'none',
                lineHeight: '1.5',
                resize: 'vertical'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
