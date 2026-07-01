import React, { useState } from 'react';
import { Calendar, Trash2, Copy, Check, Eye, EyeOff, FileText, ShoppingBag, Globe } from 'lucide-react';
import { generateReportHTML } from '../utils/reportGenerator';
import { KPI_TEMPLATES, OPENING_CHECKLIST_TEMPLATE, SELLING_HOUR_TEMPLATE } from '../data/initialData';

// Native React Form Preview Component for visual presentation inside HistoryTab
const FormPreview = ({
  storeName,
  dateStr,
  leader,
  rosterShelf,
  rosterPos,
  openingChecks,
  openingNotes,
  sellingChecks,
  sellingNotes,
  kpiValues,
  reportTemplate,
  todayShifts,
  weeklyShiftsRoster
}) => {
  // Calculate counts for history item
  const totalOpening = OPENING_CHECKLIST_TEMPLATE.length;
  const completedOpening = OPENING_CHECKLIST_TEMPLATE.filter(item => openingChecks[item.id]).length;
  const openingProgress = Math.round((completedOpening / totalOpening) * 100);

  const openingIssues = OPENING_CHECKLIST_TEMPLATE.filter(item => openingNotes[item.id]).map(item => ({
    category: item.category,
    task: item.task,
    note: openingNotes[item.id]
  }));

  const sellingIssues = SELLING_HOUR_TEMPLATE.filter(item => sellingNotes[item.id]).map(item => ({
    task: item.task,
    note: sellingNotes[item.id]
  }));

  const kpiCount = reportTemplate === 'standard' ? 'IV' : 'III';
  const shifts = todayShifts || {
    morning: '',
    middle: '',
    afternoon: '',
    morningHours: '',
    middleHours: '',
    afternoonHours: '',
    handoverHours: ''
  };

  const getWeeklyRosterCell = (shiftKey, dayKey) => {
    const shiftData = weeklyShiftsRoster?.[shiftKey] || {};
    const val = shiftData[dayKey] || '';
    if (!val) return '--';
    return val.split(';;').filter(name => name.trim() !== '').join(', ');
  };
  
  return (
    <div style={{
      fontFamily: "'Roboto', sans-serif",
      color: "#000000",
      backgroundColor: "#ffffff",
      padding: "24px",
      border: "2px solid #000000",
      lineHeight: "1.4",
      width: "100%",
      margin: "0 auto",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
    }}>
      {/* Header Block */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <tbody>
          <tr>
            <td style={{
              border: '1.5px solid #000000',
              padding: '10px 15px',
              textAlign: 'center',
              fontWeight: 900,
              fontSize: '22px',
              letterSpacing: '0.15em',
              backgroundColor: '#000000',
              color: '#ffffff',
              width: '100px'
            }}>LUSH</td>
            <td style={{
              border: '1.5px solid #000000',
              padding: '10px 15px',
              textAlign: 'center'
            }}>
              <h1 style={{ fontSize: '15px', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 2px 0', letterSpacing: '0.05em' }}>Bản Ghi Vận Hành Hàng Ngày</h1>
              <span style={{ fontSize: '9px', fontWeight: 500, textTransform: 'uppercase', color: '#52525b', letterSpacing: '0.05em' }}>Daily Operation & Shift Log Form</span>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Basic Form Fields */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: '1.5px solid #000000', marginBottom: '20px' }}>
        <div style={{ padding: '6px 10px', borderRight: '1.5px solid #000000' }}>
          <span style={{ fontSize: '7.5px', fontWeight: 800, textTransform: 'uppercase', color: '#52525b', display: 'block', marginBottom: '2px', letterSpacing: '0.05em' }}>Cửa hàng / Store Location</span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#000000' }}>{storeName}</span>
        </div>
        <div style={{ padding: '6px 10px', borderRight: '1.5px solid #000000' }}>
          <span style={{ fontSize: '7.5px', fontWeight: 800, textTransform: 'uppercase', color: '#52525b', display: 'block', marginBottom: '2px', letterSpacing: '0.05em' }}>Ngày thực hiện / Date Record</span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#000000' }}>{dateStr}</span>
        </div>
        <div style={{ padding: '6px 10px' }}>
          <span style={{ fontSize: '7.5px', fontWeight: 800, textTransform: 'uppercase', color: '#52525b', display: 'block', marginBottom: '2px', letterSpacing: '0.05em' }}>Leader Ca / Shift Leader</span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#000000' }}>{leader || '--'}</span>
        </div>
      </div>

      {/* I. Duty Roster */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#000000', color: '#ffffff', padding: '5px 10px', fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.05em' }}>
          I. Phân Bổ Nhân Sự Ca Làm Việc / Shift Assignment
        </div>

        {/* 1. Today's Shifts list */}
        {shifts.morningHours && (
          <>
            <div style={{ fontSize: '8px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px', color: '#52525b', letterSpacing: '0.05em' }}>
              1. Lịch Trực Ca Hôm Nay (Today's Shifts)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '12px' }}>
              <div style={{ border: '1px solid #000000', padding: '5px 8px' }}>
                <span style={{ fontSize: '7.5px', fontWeight: 'bold', textTransform: 'uppercase', color: '#52525b', display: 'block', marginBottom: '2px' }}>Ca Sáng (${shifts.morningHours})</span>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#000000' }}>{shifts.morning || '--'}</span>
              </div>
              <div style={{ border: '1px solid #000000', padding: '5px 8px' }}>
                <span style={{ fontSize: '7.5px', fontWeight: 'bold', textTransform: 'uppercase', color: '#52525b', display: 'block', marginBottom: '2px' }}>Ca Giữa (${shifts.middleHours})</span>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#000000' }}>{shifts.middle || '--'}</span>
              </div>
              <div style={{ border: '1px solid #000000', padding: '5px 8px' }}>
                <span style={{ fontSize: '7.5px', fontWeight: 'bold', textTransform: 'uppercase', color: '#52525b', display: 'block', marginBottom: '2px' }}>Ca Chiều (${shifts.afternoonHours})</span>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#000000' }}>{shifts.afternoon || '--'}</span>
              </div>
            </div>
          </>
        )}

        <div style={{ fontSize: '8px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px', color: '#52525b', letterSpacing: '0.05em' }}>
          {shifts.morningHours ? '2. Vị Trí Vận Hành Cửa Hàng (Positions)' : '1. Vị Trí Vận Hành Cửa Hàng (Positions)'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '6px', marginBottom: '12px' }}>
          {rosterPos.map(p => (
            <div key={p.id} style={{ border: '1px solid #000000', padding: '5px 8px' }}>
              <span style={{ fontSize: '7.5px', fontWeight: 'bold', textTransform: 'uppercase', color: '#52525b', display: 'block', marginBottom: '2px' }}>{p.position}</span>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#000000' }}>{p.staff || '--'}</span>
            </div>
          ))}
        </div>
        
        <div style={{ fontSize: '8px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px', color: '#52525b', letterSpacing: '0.05em' }}>
          {shifts.morningHours ? '3. Phụ Trách Khu Vực Kệ Sản Phẩm (Shelves Allocation)' : '2. Phụ Trách Khu Vực Kệ Sản Phẩm (Shelves Allocation)'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '6px', marginBottom: '12px' }}>
          {rosterShelf.map(s => (
            <div key={s.id} style={{ border: '1px solid #000000', padding: '5px 8px' }}>
              <span style={{ fontSize: '7.5px', fontWeight: 'bold', textTransform: 'uppercase', color: '#52525b', display: 'block', marginBottom: '2px' }}>Kệ: {s.area}</span>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#000000' }}>{s.staff || '--'}</span>
            </div>
          ))}
        </div>

        {/* 4. Weekly Shift Roster Table */}
        {weeklyShiftsRoster && (
          <>
            <div style={{ fontSize: '8px', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '15px', marginBottom: '6px', color: '#52525b', letterSpacing: '0.05em' }}>
              4. Lịch Trực Tuần Của Cửa Hàng (Weekly Shift Roster)
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '5px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f4f4f5' }}>
                  <th style={{ border: '1px solid #000000', padding: '4px 6px', fontSize: '7.5px', fontWeight: 'bold', textAlign: 'left', width: '12%' }}>Ca Trực</th>
                  <th style={{ border: '1px solid #000000', padding: '4px 4px', fontSize: '7.5px', fontWeight: 'bold', textAlign: 'center', width: '12.5%' }}>Thứ 2</th>
                  <th style={{ border: '1px solid #000000', padding: '4px 4px', fontSize: '7.5px', fontWeight: 'bold', textAlign: 'center', width: '12.5%' }}>Thứ 3</th>
                  <th style={{ border: '1px solid #000000', padding: '4px 4px', fontSize: '7.5px', fontWeight: 'bold', textAlign: 'center', width: '12.5%' }}>Thứ 4</th>
                  <th style={{ border: '1px solid #000000', padding: '4px 4px', fontSize: '7.5px', fontWeight: 'bold', textAlign: 'center', width: '12.5%' }}>Thứ 5</th>
                  <th style={{ border: '1px solid #000000', padding: '4px 4px', fontSize: '7.5px', fontWeight: 'bold', textAlign: 'center', width: '12.5%' }}>Thứ 6</th>
                  <th style={{ border: '1px solid #000000', padding: '4px 4px', fontSize: '7.5px', fontWeight: 'bold', textAlign: 'center', width: '12.5%', backgroundColor: '#fafafa' }}>Thứ 7</th>
                  <th style={{ border: '1px solid #000000', padding: '4px 4px', fontSize: '7.5px', fontWeight: 'bold', textAlign: 'center', width: '12.5%', backgroundColor: '#fafafa' }}>Chủ Nhật</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #000000' }}>
                  <td style={{ border: '1px solid #000000', padding: '4px 6px', fontSize: '8px', fontWeight: 'bold' }}>
                    Ca Sáng<br/><span style={{ fontSize: '6.5px', fontWeight: 'normal', color: '#52525b' }}>({shifts.morningHours || ''})</span>
                  </td>
                  <td style={{ border: '1px solid #000000', padding: '4px', fontSize: '8px', fontWeight: 'bold', textAlign: 'center' }}>{getWeeklyRosterCell('morning', 'monday')}</td>
                  <td style={{ border: '1px solid #000000', padding: '4px', fontSize: '8px', fontWeight: 'bold', textAlign: 'center' }}>{getWeeklyRosterCell('morning', 'tuesday')}</td>
                  <td style={{ border: '1px solid #000000', padding: '4px', fontSize: '8px', fontWeight: 'bold', textAlign: 'center' }}>{getWeeklyRosterCell('morning', 'wednesday')}</td>
                  <td style={{ border: '1px solid #000000', padding: '4px', fontSize: '8px', fontWeight: 'bold', textAlign: 'center' }}>{getWeeklyRosterCell('morning', 'thursday')}</td>
                  <td style={{ border: '1px solid #000000', padding: '4px', fontSize: '8px', fontWeight: 'bold', textAlign: 'center' }}>{getWeeklyRosterCell('morning', 'friday')}</td>
                  <td style={{ border: '1px solid #000000', padding: '4px', fontSize: '8px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#fafafa' }}>{getWeeklyRosterCell('morning', 'saturday')}</td>
                  <td style={{ border: '1px solid #000000', padding: '4px', fontSize: '8px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#fafafa' }}>{getWeeklyRosterCell('morning', 'sunday')}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #000000' }}>
                  <td style={{ border: '1px solid #000000', padding: '4px 6px', fontSize: '8px', fontWeight: 'bold' }}>
                    Ca Giữa<br/><span style={{ fontSize: '6.5px', fontWeight: 'normal', color: '#52525b' }}>({shifts.middleHours || ''})</span>
                  </td>
                  <td style={{ border: '1px solid #000000', padding: '4px', fontSize: '8px', fontWeight: 'bold', textAlign: 'center' }}>{getWeeklyRosterCell('middle', 'monday')}</td>
                  <td style={{ border: '1px solid #000000', padding: '4px', fontSize: '8px', fontWeight: 'bold', textAlign: 'center' }}>{getWeeklyRosterCell('middle', 'tuesday')}</td>
                  <td style={{ border: '1px solid #000000', padding: '4px', fontSize: '8px', fontWeight: 'bold', textAlign: 'center' }}>{getWeeklyRosterCell('middle', 'wednesday')}</td>
                  <td style={{ border: '1px solid #000000', padding: '4px', fontSize: '8px', fontWeight: 'bold', textAlign: 'center' }}>{getWeeklyRosterCell('middle', 'thursday')}</td>
                  <td style={{ border: '1px solid #000000', padding: '4px', fontSize: '8px', fontWeight: 'bold', textAlign: 'center' }}>{getWeeklyRosterCell('middle', 'friday')}</td>
                  <td style={{ border: '1px solid #000000', padding: '4px', fontSize: '8px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#fafafa' }}>{getWeeklyRosterCell('middle', 'saturday')}</td>
                  <td style={{ border: '1px solid #000000', padding: '4px', fontSize: '8px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#fafafa' }}>{getWeeklyRosterCell('middle', 'sunday')}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #000000' }}>
                  <td style={{ border: '1px solid #000000', padding: '4px 6px', fontSize: '8px', fontWeight: 'bold' }}>
                    Ca Chiều<br/><span style={{ fontSize: '6.5px', fontWeight: 'normal', color: '#52525b' }}>({shifts.afternoonHours || ''})</span>
                  </td>
                  <td style={{ border: '1px solid #000000', padding: '4px', fontSize: '8px', fontWeight: 'bold', textAlign: 'center' }}>{getWeeklyRosterCell('afternoon', 'monday')}</td>
                  <td style={{ border: '1px solid #000000', padding: '4px', fontSize: '8px', fontWeight: 'bold', textAlign: 'center' }}>{getWeeklyRosterCell('afternoon', 'tuesday')}</td>
                  <td style={{ border: '1px solid #000000', padding: '4px', fontSize: '8px', fontWeight: 'bold', textAlign: 'center' }}>{getWeeklyRosterCell('afternoon', 'wednesday')}</td>
                  <td style={{ border: '1px solid #000000', padding: '4px', fontSize: '8px', fontWeight: 'bold', textAlign: 'center' }}>{getWeeklyRosterCell('afternoon', 'thursday')}</td>
                  <td style={{ border: '1px solid #000000', padding: '4px', fontSize: '8px', fontWeight: 'bold', textAlign: 'center' }}>{getWeeklyRosterCell('afternoon', 'friday')}</td>
                  <td style={{ border: '1px solid #000000', padding: '4px', fontSize: '8px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#fafafa' }}>{getWeeklyRosterCell('afternoon', 'saturday')}</td>
                  <td style={{ border: '1px solid #000000', padding: '4px', fontSize: '8px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#fafafa' }}>{getWeeklyRosterCell('afternoon', 'sunday')}</td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* II. Checklist Mở Cửa */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#000000', color: '#ffffff', padding: '5px 10px', fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.05em' }}>
          II. Checklist Mở Cửa Cửa Hàng / Opening Operations Checklist
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 15px', border: '1px solid #000000', padding: '10px', marginBottom: '8px' }}>
          {OPENING_CHECKLIST_TEMPLATE.map(item => {
            const isChecked = openingChecks[item.id];
            const note = openingNotes[item.id];
            return (
              <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', padding: '3px 0', borderBottom: '1px dashed #cccccc' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 'bold', lineHeight: 1, color: '#000' }}>
                  {isChecked ? '☑' : '☐'}
                </span>
                <span style={{ fontSize: '9px', color: isChecked ? '#000000' : '#52525b' }}>
                  <span style={{ fontWeight: '800', fontSize: '7px', textTransform: 'uppercase', color: '#71717a', marginRight: '3px' }}>[{item.category}]</span> 
                  {item.task}
                  {note && <span style={{ color: '#c2410c', fontWeight: 'bold' }}> (⚠️: {note})</span>}
                </span>
              </div>
            );
          })}
        </div>
        
        <div style={{ border: '1px solid #000000', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: 'bold', backgroundColor: '#fafafa' }}>
          <span>Tổng kết tiến độ hoàn thành Opening:</span>
          <span>{completedOpening}/{totalOpening} ({openingProgress}%) - {openingProgress === 100 ? 'ĐẠT CHUẨN (PASSED)' : 'CÓ LƯU Ý (ATTENTION)'}</span>
        </div>
      </div>

      {/* III. Checklist Trong Ca */}
      {reportTemplate === 'standard' && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ backgroundColor: '#000000', color: '#ffffff', padding: '5px 10px', fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.05em' }}>
            III. Checklist Hoạt Động Trong Ca / Selling Hours Checklists
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '8px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f4f4f5' }}>
                <th style={{ border: '1px solid #000000', textAlign: 'left', padding: '6px 8px', fontSize: '8.5px', fontWeight: 'bold' }}>Hạng Mục Công Việc / Task Description</th>
                <th style={{ border: '1px solid #000000', textAlign: 'center', padding: '6px 4px', fontSize: '8.5px', width: '10%', fontWeight: 'bold' }}>11:00</th>
                <th style={{ border: '1px solid #000000', textAlign: 'center', padding: '6px 4px', fontSize: '8.5px', width: '10%', fontWeight: 'bold' }}>14:00</th>
                <th style={{ border: '1px solid #000000', textAlign: 'center', padding: '6px 4px', fontSize: '8.5px', width: '10%', fontWeight: 'bold' }}>17:00</th>
                <th style={{ border: '1px solid #000000', textAlign: 'center', padding: '6px 4px', fontSize: '8.5px', width: '10%', fontWeight: 'bold' }}>19:00</th>
              </tr>
            </thead>
            <tbody>
              {SELLING_HOUR_TEMPLATE.map(item => {
                const checks = sellingChecks[item.id] || {};
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #000000' }}>
                    <td style={{ border: '1px solid #000000', padding: '5px 8px', fontSize: '9px' }}>{item.task}</td>
                    {['11AM', '2PM', '5PM', '7PM'].map(t => (
                      <td key={t} style={{ textAlign: 'center', border: '1px solid #000000', padding: '5px', fontFamily: 'monospace', fontSize: '11px', fontWeight: 'bold' }}>
                        {checks[t] ? '☑' : '☐'}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {sellingIssues.length > 0 && (
            <div style={{ border: '1px solid #000000', borderTop: 'none', padding: '8px 10px', backgroundColor: '#fafafa', fontSize: '9px' }}>
              <div style={{ fontSize: '7.5px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '3px', color: '#52525b' }}>
                ⚠️ Sự Cố & Ghi Chú Phát Sinh Trong Ca:
              </div>
              <ul style={{ margin: 0, paddingLeft: '12px' }}>
                {sellingIssues.map((iss, index) => (
                  <li key={index}><strong>{iss.task}:</strong> <em>{iss.note}</em></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* IV. KPIs & Sales */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ backgroundColor: '#000000', color: '#ffffff', padding: '5px 10px', fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.05em' }}>
          {kpiCount}. Chỉ Số KPI & Doanh Số / Performance KPI Tracking
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f5' }}>
              <th style={{ border: '1px solid #000000', padding: '6px 8px', fontSize: '8.5px', fontWeight: 'bold', textAlign: 'left' }}>Chỉ Số KPI / Metric</th>
              <th style={{ border: '1px solid #000000', padding: '6px 8px', fontSize: '8.5px', fontWeight: 'bold', width: '18%', textAlign: 'right' }}>Chỉ Tiêu / Target</th>
              <th style={{ border: '1px solid #000000', padding: '6px 8px', fontSize: '8.5px', fontWeight: 'bold', width: '18%', textAlign: 'right' }}>Đạt Được / Actual</th>
              <th style={{ border: '1px solid #000000', padding: '6px 8px', fontSize: '8.5px', fontWeight: 'bold', width: '12%', textAlign: 'center' }}>Tỷ Lệ / %</th>
              <th style={{ border: '1px solid #000000', padding: '6px 8px', fontSize: '8.5px', fontWeight: 'bold', width: '22%', textAlign: 'left' }}>Kế Hoạch / Ghi Chú</th>
            </tr>
          </thead>
          <tbody>
            {KPI_TEMPLATES.map(kpi => {
              const vals = kpiValues[kpi.key] || { target: '', actual: '', actionPlan: '' };
              const targetVal = parseFloat(vals.target);
              const actualVal = parseFloat(vals.actual);
              let pctStr = '--';
              if (!isNaN(targetVal) && !isNaN(actualVal) && targetVal > 0) {
                pctStr = `${Math.round((actualVal / targetVal) * 100)}%`;
              }
              const targetFmt = kpi.format === 'number' && vals.target ? Number(vals.target).toLocaleString('vi-VN') : vals.target || '--';
              const actualFmt = kpi.format === 'number' && vals.actual ? Number(vals.actual).toLocaleString('vi-VN') : vals.actual || '--';
              return (
                <tr key={kpi.key} style={{ borderBottom: '1px solid #000000' }}>
                  <td style={{ border: '1px solid #000000', padding: '5px 8px', fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase' }}>{kpi.label}</td>
                  <td style={{ border: '1px solid #000000', padding: '5px 8px', fontFamily: 'monospace', fontSize: '10px', textAlign: 'right' }}>{targetFmt} <span style={{ fontSize: '7px', color: '#52525b' }}>{kpi.unit}</span></td>
                  <td style={{ border: '1px solid #000000', padding: '5px 8px', fontFamily: 'monospace', fontSize: '10px', fontWeight: 'bold', textAlign: 'right' }}>{actualFmt} <span style={{ fontSize: '7px', color: '#52525b' }}>{kpi.unit}</span></td>
                  <td style={{ border: '1px solid #000000', padding: '5px 8px', fontFamily: 'monospace', fontSize: '10px', fontWeight: 'bold', textAlign: 'center' }}>{pctStr}</td>
                  <td style={{ border: '1px solid #000000', padding: '5px 8px', fontSize: '9px', fontStyle: 'italic', color: '#3f3f46' }}>{vals.actionPlan || '--'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function HistoryTab({ reports, onDeleteReport, onOpenExportModal }) {
  const [expandedReportId, setExpandedReportId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [previewFormat, setPreviewFormat] = useState('web'); // Default to 'web' for beautiful layout

  const toggleExpand = (id) => {
    setExpandedReportId(prev => prev === id ? null : id);
  };

  const handleCopyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadHTML = (report) => {
    const htmlContent = generateReportHTML(report, report.template || 'standard');
    const cleanStoreId = report.storeName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').trim();
    const dateFormatted = report.date ? report.date.split('T')[0] : 'date';
    const fileName = report.fileName || `report-${dateFormatted}-${cleanStoreId}-${report.id}.html`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
          <div className="space-y-1 flex flex-col items-center gap-3">
            <h3 className="text-sm font-display font-bold uppercase tracking-wider text-black">Chưa có báo cáo nào</h3>
            <p className="text-xs text-text-muted max-w-sm">
              Sau khi điền thông số ca và hoàn tất checklist, bạn hãy chọn "Xuất Báo Cáo" ở góc dưới bên trái của menu chính hoặc bấm trực tiếp nút bên dưới để tạo báo cáo.
            </p>
            <button
              onClick={onOpenExportModal}
              className="btn-black text-xs py-2 px-6 flex items-center justify-center gap-1.5 mt-2"
            >
              <FileText size={14} />
              Tạo & Xuất Báo Cáo Ngay
            </button>
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
                      <a
                        href={`/reports/${report.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 hover:text-black text-text-muted transition-colors rounded hover:bg-bg-inset flex items-center"
                        title="Mở liên kết SSR báo cáo"
                      >
                        <Globe size={14} />
                      </a>
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
                  <div className="p-4 bg-bg-inset border-t-2 border-black space-y-4 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 border border-border-medium">
                      {/* Format toggle tabs */}
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setPreviewFormat('text')}
                          className={`px-3 py-1 text-[10px] font-bold font-sans uppercase tracking-wider border transition-all ${
                            previewFormat === 'text' 
                              ? 'bg-black text-white border-black' 
                              : 'bg-white text-black border-border-medium hover:border-black'
                          }`}
                        >
                          Bản Zalo/Telegram
                        </button>
                        <button
                          onClick={() => setPreviewFormat('web')}
                          className={`px-3 py-1 text-[10px] font-bold font-sans uppercase tracking-wider border transition-all ${
                            previewFormat === 'web' 
                              ? 'bg-black text-white border-black' 
                              : 'bg-white text-black border-border-medium hover:border-black'
                          }`}
                        >
                          Giao diện Web
                        </button>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        {previewFormat === 'text' ? (
                          <button
                            onClick={() => handleCopyText(report.id, report.rawText)}
                            className="flex items-center gap-1.5 text-[10px] text-black font-display font-bold hover:underline uppercase tracking-wider bg-transparent border-none cursor-pointer"
                          >
                            {isCopied ? <Check size={12} className="text-black" /> : <Copy size={12} />}
                            {isCopied ? 'Đã copy!' : 'Sao chép Text'}
                          </button>
                        ) : (
                          <div className="flex gap-3">
                            <a
                              href={`/reports/${report.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-[10px] text-black font-display font-bold hover:underline uppercase tracking-wider bg-transparent border-none cursor-pointer"
                            >
                              <Globe size={12} />
                              Mở Link SSR
                            </a>
                            <button
                              onClick={() => handleDownloadHTML(report)}
                              className="flex items-center gap-1.5 text-[10px] text-black font-display font-bold hover:underline uppercase tracking-wider bg-transparent border-none cursor-pointer"
                            >
                              <Globe size={12} />
                              Tải HTML (Web)
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {previewFormat === 'text' ? (
                      <pre className="bg-white p-4 border border-border-medium rounded-none font-mono text-[10px] leading-relaxed text-black whitespace-pre-wrap select-all max-h-[35vh] overflow-y-auto">
                        {report.rawText}
                      </pre>
                    ) : (
                      <div className="bg-white border border-border-medium h-[55vh] overflow-y-auto rounded-none">
                        <FormPreview 
                          storeName={report.storeName}
                          dateStr={report.dateStr}
                          leader={report.leader}
                          rosterShelf={report.rosterShelf}
                          rosterPos={report.rosterPos}
                          openingChecks={report.openingChecks}
                          openingNotes={report.openingNotes}
                          sellingChecks={report.sellingChecks}
                          sellingNotes={report.sellingNotes}
                          kpiValues={report.kpiValues}
                          reportTemplate={report.template || 'standard'}
                          todayShifts={report.todayShifts}
                          weeklyShiftsRoster={report.weeklyShiftsRoster}
                        />
                      </div>
                    )}
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
