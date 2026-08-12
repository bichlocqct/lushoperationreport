import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3, Calendar, Check, ChevronDown, ChevronLeft, ChevronRight, Copy, Eye, EyeOff, FileText, Globe, ShoppingBag, Store, Trash2, UsersRound } from 'lucide-react';
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
  weeklyShiftsRoster,
  employeeScheduleRoster,
  gradingScores = {},
  overallComments = ''
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

  const formatEmployeeScheduleValue = value => {
    if (!value) return '--';
    const displayValue = String(value);
    if (displayValue.startsWith('OTHER:')) return `Khác: ${displayValue.slice(6) || '--'}`;
    return SCHEDULE_CODE_LABELS[displayValue] || displayValue;
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
        {employeeScheduleRoster?.employees?.length > 0 && (
          <>
            <div style={{ fontSize: '8px', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '15px', marginBottom: '6px', color: '#52525b', letterSpacing: '0.05em' }}>
              4. Lịch Làm Việc Theo Nhân Viên (Employee Weekly Roster)
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '5px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f4f4f5' }}>
                  <th style={{ border: '1px solid #000000', padding: '4px 6px', fontSize: '7.5px', fontWeight: 'bold', textAlign: 'left' }}>Nhân viên</th>
                  <th style={{ border: '1px solid #000000', padding: '4px 6px', fontSize: '7.5px', fontWeight: 'bold', textAlign: 'center' }}>Vị trí</th>
                  {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'].map(day => (
                    <th key={day} style={{ border: '1px solid #000000', padding: '4px', fontSize: '7.5px', fontWeight: 'bold', textAlign: 'center' }}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employeeScheduleRoster.employees.map(employee => (
                  <tr key={employee.id}>
                    <td style={{ border: '1px solid #000000', padding: '4px 6px', fontSize: '8px', fontWeight: 'bold' }}>{employee.name || '--'}</td>
                    <td style={{ border: '1px solid #000000', padding: '4px 6px', fontSize: '8px', fontWeight: 'bold', textAlign: 'center' }}>{employee.position || '--'}</td>
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(dayKey => (
                      <td key={dayKey} style={{ border: '1px solid #000000', padding: '4px', fontSize: '8px', fontWeight: 'bold', textAlign: 'center' }}>
                        {formatEmployeeScheduleValue(employeeScheduleRoster.days?.[dayKey]?.[employee.id])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {weeklyShiftsRoster && !employeeScheduleRoster && (
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

      {/* V. Operations Grading & Comments */}
      {gradingScores && Object.keys(gradingScores).length > 0 && (
        <div style={{ marginTop: '25px', pageBreakInside: 'avoid' }}>
          <div style={{ backgroundColor: '#000000', color: '#ffffff', padding: '5px 10px', fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.05em' }}>
            V. Đánh Giá Vận Hành & Nhận Xét Chung / Operations Grading & Comments
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f4f4f5' }}>
                <th style={{ border: '1px solid #000000', padding: '6px 8px', fontSize: '8.5px', fontWeight: 'bold', textAlign: 'left' }}>Hạng Mục Đánh Giá / Category</th>
                <th style={{ border: '1px solid #000000', padding: '6px 8px', fontSize: '8.5px', fontWeight: 'bold', width: '25%', textAlign: 'center' }}>Điểm Số / Score</th>
                <th style={{ border: '1px solid #000000', padding: '6px 8px', fontSize: '8.5px', fontWeight: 'bold', width: '45%', textAlign: 'left' }}>Chi Tiết / Notes</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const GRADING_CATEGORIES_LOCAL = [
                  { key: 'grooming', label: 'Diện mạo & Tác phong (Grooming)' },
                  { key: 'cleanliness', label: 'Vệ sinh cửa hàng (Cleanliness)' },
                  { key: 'vmd', label: 'Trưng bày & VMD (VMD)' },
                  { key: 'service', label: 'Dịch vụ & Trải nghiệm (Experience)' },
                  { key: 'inventory', label: 'Quản lý hàng hóa & FIFO (Stock)' },
                  { key: 'cashier', label: 'Vận hành Quầy thu ngân (Cashier)' },
                  { key: 'equipment', label: 'Thiết bị & Kỹ thuật (Technical)' }
                ];

                let gradedCount = 0;
                let totalGradedScore = 0;

                const rows = GRADING_CATEGORIES_LOCAL.map(cat => {
                  const data = gradingScores[cat.key] || { score: '', note: '' };
                  if (data.score !== undefined && data.score !== null && data.score !== '') {
                    totalGradedScore += parseFloat(data.score);
                    gradedCount++;
                  }
                  
                  return (
                    <tr key={cat.key} style={{ borderBottom: '1px solid #000000' }}>
                      <td style={{ border: '1px solid #000000', padding: '5px 8px', fontSize: '9px', fontWeight: 'bold' }}>{cat.label}</td>
                      <td style={{ border: '1px solid #000000', padding: '5px 8px', fontSize: '10px', fontWeight: 'bold', textAlign: 'center', fontFamily: 'monospace' }}>
                        {data.score !== '' ? `${data.score} / 10` : '--'}
                      </td>
                      <td style={{ border: '1px solid #000000', padding: '5px 8px', fontSize: '9px', fontStyle: 'italic', color: '#3f3f46' }}>
                        {data.note || '--'}
                      </td>
                    </tr>
                  );
                });

                const average = gradedCount > 0 ? (totalGradedScore / gradedCount).toFixed(1) : '--';
                let ratingLabel = 'N/A';
                if (average !== '--') {
                  const avg = parseFloat(average);
                  if (avg >= 9.0) ratingLabel = 'XUẤT SẮC (EXCELLENT)';
                  else if (avg >= 7.0) ratingLabel = 'KHÁ TỐT (GOOD)';
                  else if (avg >= 5.0) ratingLabel = 'TRUNG BÌNH (AVERAGE)';
                  else ratingLabel = 'CẦN CẢI THIỆN (IMPROVEMENT)';
                }

                return (
                  <>
                    {rows}
                    <tr style={{ backgroundColor: '#fafafa', fontWeight: 'bold' }}>
                      <td style={{ border: '1px solid #000000', padding: '8px 10px', fontSize: '10px', textTransform: 'uppercase' }}>ĐIỂM VẬN HÀNH TRUNG BÌNH</td>
                      <td style={{ border: '1px solid #000000', padding: '8px 10px', fontSize: '11px', textAlign: 'center', fontFamily: 'monospace', color: '#000000' }}>{average} / 10</td>
                      <td style={{ border: '1px solid #000000', padding: '8px 10px', fontSize: '9px', textTransform: 'uppercase', color: '#000000' }}>XẾP LOẠI: {ratingLabel}</td>
                    </tr>
                  </>
                );
              })()}
            </tbody>
          </table>
        </div>
      )}

      {overallComments && (
        <div style={{ marginTop: '15px', border: '1px solid #000000', padding: '12px', backgroundColor: '#f9fafb', pageBreakInside: 'avoid' }}>
          <div style={{ fontSize: '7.5px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px', color: '#52525b', letterSpacing: '0.05em' }}>
            ✍️ Nhận xét chung của Ca trưởng / Shift Leader's Overall Comments:
          </div>
          <div style={{ fontSize: '10px', fontStyle: 'italic', whiteSpace: 'pre-wrap', lineHeight: '1.5', color: '#0f172a' }}>
            "{overallComments}"
          </div>
        </div>
      )}
    </div>
  );
};

const HISTORY_DAYS = [
  { key: 'monday', label: 'Thứ 2', shortLabel: 'T2' },
  { key: 'tuesday', label: 'Thứ 3', shortLabel: 'T3' },
  { key: 'wednesday', label: 'Thứ 4', shortLabel: 'T4' },
  { key: 'thursday', label: 'Thứ 5', shortLabel: 'T5' },
  { key: 'friday', label: 'Thứ 6', shortLabel: 'T6' },
  { key: 'saturday', label: 'Thứ 7', shortLabel: 'T7' },
  { key: 'sunday', label: 'Chủ Nhật', shortLabel: 'CN' }
];

const HISTORY_SHIFTS = [
  { key: 'A', label: 'A' },
  { key: 'B', label: 'B' },
  { key: 'M', label: 'M' },
  { key: 'OFF', label: 'OFF' },
  { key: 'AL', label: 'AL' },
  { key: 'CA1', label: 'CA 1' },
  { key: 'CA2', label: 'CA 2' },
  { key: 'CA3', label: 'CA 3' },
  { key: 'OTHER', label: 'Khác' }
];

const SCHEDULE_CODE_LABELS = {
  CA1: 'CA 1',
  CA2: 'CA 2',
  CA3: 'CA 3'
};

const getReportDate = (report) => {
  const date = report?.date ? new Date(report.date) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const getWeekStart = (date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const day = start.getDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;
  start.setDate(start.getDate() - daysSinceMonday);
  return start;
};

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatShortDate = (date) => (
  `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`
);

const formatReportDateLabel = (report) => {
  if (!report?.date && report?.dateStr) return report.dateStr;
  return getReportDate(report).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const parseDateKey = (dateKey) => {
  if (!dateKey) return new Date();
  const [year, month, day] = dateKey.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const formatMonthLabel = (date) => (
  date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
);

const getCalendarDays = (monthDate) => {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const mondayOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - mondayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
};

const getDayKeyFromDate = (date) => {
  const day = date.getDay();
  return HISTORY_DAYS[day === 0 ? 6 : day - 1].key;
};

const countStaff = (value) => {
  if (typeof value !== 'string' || !value.trim()) return 0;
  return value.includes(';;')
    ? value.split(';;').filter(name => name.trim()).length
    : value.split(',').filter(name => name.trim()).length;
};

const getRosterValue = (report, shiftKey, dayKey) => {
  const rosterValue = report.weeklyShiftsRoster?.[shiftKey]?.[dayKey];
  if (rosterValue) return rosterValue;

  const reportDate = getReportDate(report);
  return getDayKeyFromDate(reportDate) === dayKey
    ? report.todayShifts?.[shiftKey] || ''
    : '';
};

const getScheduleCode = value => (
  typeof value === 'string' && value.startsWith('OTHER:') ? 'OTHER' : value
);

const countScheduleCode = (report, code, dayKey) => {
  const roster = report.employeeScheduleRoster;
  if (roster?.employees && roster?.days) {
    const values = roster.days[dayKey] || {};
    return roster.employees.filter(employee => getScheduleCode(values[employee.id]) === code).length;
  }

  const legacyShiftByCode = { A: 'morning', B: 'afternoon', M: 'middle' };
  const legacyShift = legacyShiftByCode[code];
  return legacyShift ? countStaff(getRosterValue(report, legacyShift, dayKey)) : 0;
};

const buildStoreScheduleTotals = (storeReports) => {
  const reportsByDate = [...storeReports].sort((a, b) => getReportDate(b) - getReportDate(a));
  const weeklyRosterReport = reportsByDate.find(report => (
    report.employeeScheduleRoster?.employees?.length > 0 || report.weeklyShiftsRoster
  ));

  const dayTotals = HISTORY_DAYS.map(day => {
    const dailyReport = weeklyRosterReport || reportsByDate.find(report => (
      getDayKeyFromDate(getReportDate(report)) === day.key
    )) || reportsByDate[0];

    return {
      key: day.key,
      label: day.label,
      shortLabel: day.shortLabel,
      ...HISTORY_SHIFTS.reduce((totals, shift) => ({
        ...totals,
        [shift.key]: dailyReport ? countScheduleCode(dailyReport, shift.key, day.key) : 0
      }), {}),
      total: dailyReport
        ? HISTORY_SHIFTS.reduce((sum, shift) => sum + countScheduleCode(dailyReport, shift.key, day.key), 0)
        : 0
    };
  });

  return {
    dayTotals,
    total: dayTotals.reduce((sum, day) => sum + day.total, 0)
  };
};

const buildWeeklySummaries = (reports) => {
  const weekMap = new Map();

  reports.forEach(report => {
    const reportDate = getReportDate(report);
    const weekStart = getWeekStart(reportDate);
    const weekKey = formatDateKey(weekStart);
    const storeName = report.storeName || 'Chưa xác định cửa hàng';

    if (!weekMap.has(weekKey)) {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekMap.set(weekKey, {
        key: weekKey,
        start: weekStart,
        end: weekEnd,
        reports: [],
        stores: new Map()
      });
    }

    const week = weekMap.get(weekKey);
    week.reports.push(report);

    const existingStore = week.stores.get(storeName);
    if (!existingStore) {
      week.stores.set(storeName, {
        name: storeName,
        reports: [report],
        latestReport: report,
        latestDate: reportDate
      });
    } else {
      existingStore.reports.push(report);
      if (reportDate > existingStore.latestDate) {
        existingStore.latestReport = report;
        existingStore.latestDate = reportDate;
      }
    }
  });

  return Array.from(weekMap.values())
    .sort((a, b) => b.start - a.start)
    .map(week => {
      const dayTotals = Object.fromEntries(
        HISTORY_DAYS.map(day => [
          day.key,
          Object.fromEntries(HISTORY_SHIFTS.map(shift => [shift.key, 0]))
        ])
      );

      const stores = Array.from(week.stores.values())
        .map(store => {
          const scheduleTotals = buildStoreScheduleTotals(store.reports);
          return {
            ...store,
            dayTotals: scheduleTotals.dayTotals,
            rosterTotal: scheduleTotals.total
          };
        })
        .sort((a, b) => b.reports.length - a.reports.length || a.name.localeCompare(b.name));

      stores.forEach(store => {
        store.dayTotals.forEach(day => {
          HISTORY_SHIFTS.forEach(shift => {
            dayTotals[day.key][shift.key] += day[shift.key];
          });
        });
      });

      const dayTotalsWithSum = HISTORY_DAYS.map(day => ({
        ...day,
        ...dayTotals[day.key],
        total: HISTORY_SHIFTS.reduce((sum, shift) => sum + dayTotals[day.key][shift.key], 0)
      }));

      return {
        ...week,
        stores,
        dayTotals: dayTotalsWithSum,
        totalAssignments: dayTotalsWithSum.reduce((sum, day) => sum + day.total, 0)
      };
    });
};

function HistorySummary({ summaries, reports, selectedDateKey, onDateChange, selectedStoreName, onStoreChange }) {
  const selectedDate = parseDateKey(selectedDateKey);
  const selectedWeekKey = formatDateKey(getWeekStart(selectedDate));
  const selectedWeek = summaries.find(week => week.key === selectedWeekKey);
  const reportsByDate = reports.reduce((map, report) => {
    const dateKey = formatDateKey(getReportDate(report));
    map[dateKey] = (map[dateKey] || 0) + 1;
    return map;
  }, {});

  const [calendarMonth, setCalendarMonth] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );

  useEffect(() => {
    const nextSelectedDate = parseDateKey(selectedDateKey);
    setCalendarMonth(new Date(nextSelectedDate.getFullYear(), nextSelectedDate.getMonth(), 1));
  }, [selectedDateKey]);

  const selectedWeekData = selectedWeek || {
    key: selectedWeekKey,
    start: getWeekStart(selectedDate),
    end: new Date(getWeekStart(selectedDate).getFullYear(), getWeekStart(selectedDate).getMonth(), getWeekStart(selectedDate).getDate() + 6),
    reports: [],
    stores: [],
    dayTotals: HISTORY_DAYS.map(day => ({ ...day, total: 0 })),
    totalAssignments: 0
  };

  const dayTotals = Object.fromEntries(selectedWeekData.dayTotals.map(day => [day.key, day]));
  const selectedStore = selectedWeekData.stores.find(store => store.name === selectedStoreName) || selectedWeekData.stores[0];
  const weekLabel = `${formatShortDate(selectedWeekData.start)} – ${formatShortDate(selectedWeekData.end)}/${selectedWeekData.end.getFullYear()}`;
  const getStoreShiftCount = (dayKey, shiftKey) => (
    selectedStore?.dayTotals.find(day => day.key === dayKey)?.[shiftKey] || 0
  );
  const getStoreShiftWeekTotal = shiftKey => (
    HISTORY_DAYS.reduce((sum, day) => sum + getStoreShiftCount(day.key, shiftKey), 0)
  );

  return (
    <section className="history-summary-panel">
      <div className="history-summary-header">
        <div className="history-summary-title">
          <div className="history-summary-icon"><BarChart3 size={18} /></div>
          <div>
            <span className="history-summary-eyebrow">Tổng hợp vận hành</span>
            <h3>Bản ghi vận hành theo ngày</h3>
            <p>Chọn từng ngày để xem các bản report đã lưu và tổng hợp nhân sự trong tuần.</p>
          </div>
        </div>
        <div className="history-selected-date-label">
          <span>Ngày đang xem</span>
          <strong>{formatShortDate(selectedDate)}/{selectedDate.getFullYear()}</strong>
        </div>
      </div>

      <div className="history-calendar-section">
        <div className="history-calendar-header">
          <div>
            <div className="history-subheading">
              <Calendar size={15} />
              <span>Chọn ngày báo cáo</span>
            </div>
            <p>Chọn một ngày để xem đúng các bản report được lưu trong ngày đó.</p>
          </div>
          <div className="history-calendar-controls">
            <button
              type="button"
              onClick={() => setCalendarMonth(current => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
              aria-label="Tháng trước"
            >
              <ChevronLeft size={15} />
            </button>
            <strong>{formatMonthLabel(calendarMonth)}</strong>
            <button
              type="button"
              onClick={() => setCalendarMonth(current => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
              aria-label="Tháng sau"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
        <div className="history-calendar-grid" role="grid" aria-label="Lịch chọn ngày báo cáo">
          {HISTORY_DAYS.map(day => (
            <span key={day.key} className="history-calendar-weekday">{day.shortLabel}</span>
          ))}
          {getCalendarDays(calendarMonth).map(day => {
            const dayKey = formatDateKey(day);
            const reportCount = reportsByDate[dayKey] || 0;
            const isCurrentMonth = day.getMonth() === calendarMonth.getMonth();
            const isSelected = dayKey === selectedDateKey;
            const isSelectedWeek = formatDateKey(getWeekStart(day)) === selectedWeekKey;

            return (
              <button
                type="button"
                key={dayKey}
                className={`history-calendar-day ${isCurrentMonth ? '' : 'is-outside-month'} ${isSelectedWeek ? 'is-selected-week' : ''} ${isSelected ? 'is-selected' : ''} ${reportCount > 0 ? 'has-reports' : ''}`}
                onClick={() => onDateChange(dayKey)}
                aria-label={`${formatShortDate(day)}${reportCount > 0 ? `, ${reportCount} báo cáo` : ', chưa có báo cáo'}`}
                aria-pressed={isSelected}
              >
                <span>{day.getDate()}</span>
                {reportCount > 0 && <small>{reportCount}</small>}
              </button>
            );
          })}
        </div>
        <div className="history-calendar-legend">
          <span><i className="has-report-dot" /> Có báo cáo</span>
          <span><i className="selected-week-mark" /> Tuần đang xem</span>
        </div>
      </div>

      <div className="history-summary-metrics">
        <div>
          <span>Khoảng thời gian</span>
          <strong>{weekLabel}</strong>
        </div>
        <div>
          <span>Tổng báo cáo</span>
            <strong>{selectedWeekData.reports.length}</strong>
        </div>
        <div>
          <span>Cửa hàng</span>
            <strong>{selectedWeekData.stores.length}</strong>
        </div>
        <div>
          <span>Tổng lượt ca</span>
          <strong>{selectedWeekData.totalAssignments}</strong>
        </div>
      </div>

      <div className="history-store-selection">
        <div className="history-store-selection-heading">
          <div className="history-subheading">
            <Store size={15} />
            <span>Chọn cửa hàng để xem chi tiết</span>
          </div>
          <p>Bấm vào từng cửa hàng để mở bảng tổng nhân sự và các bản report trong tuần.</p>
        </div>
        <div className="history-store-choice-list">
          {selectedWeekData.stores.map(store => (
            <button
              type="button"
              key={store.name}
              className={`history-store-choice ${selectedStore?.name === store.name ? 'is-selected' : ''}`}
              onClick={() => onStoreChange(store.name)}
              aria-pressed={selectedStore?.name === store.name}
            >
              <span className="history-store-choice-mark"><Store size={16} /></span>
              <span className="history-store-choice-copy">
                <strong>{store.name}</strong>
                <small>{store.reports.length} report · Mới nhất {formatShortDate(store.latestDate)}</small>
              </span>
              <span className="history-store-choice-total">
                <strong>{store.rosterTotal}</strong>
                <small>lượt ca</small>
              </span>
              <ChevronDown size={16} className="history-store-choice-chevron" />
            </button>
          ))}
        </div>
      </div>

      {selectedStore && (
        <div className="history-selected-store">
          <div className="history-selected-store-heading">
            <div>
              <span>Tổng hợp cửa hàng</span>
              <h4>{selectedStore.name}</h4>
            </div>
            <strong>{selectedStore.rosterTotal} lượt ca trong tuần</strong>
          </div>
          <div className="history-weekly-scroll">
            <table className="history-weekly-table history-selected-store-table">
              <thead>
                <tr>
                  <th>Ca / Ngày</th>
                  {HISTORY_DAYS.map(day => <th key={day.key}>{day.shortLabel}</th>)}
                  <th>Tổng</th>
                </tr>
              </thead>
              <tbody>
                {HISTORY_SHIFTS.map(shift => (
                  <tr key={shift.key} className={getStoreShiftWeekTotal(shift.key) > 0 ? 'has-staff-row' : ''}>
                    <th className={getStoreShiftWeekTotal(shift.key) > 0 ? 'has-staff-label' : ''}>{shift.label}</th>
                    {HISTORY_DAYS.map(day => (
                      <td key={day.key} className={getStoreShiftCount(day.key, shift.key) > 0 ? 'has-staff-cell' : ''}>
                        {getStoreShiftCount(day.key, shift.key)}
                      </td>
                    ))}
                    <td className={`history-week-total ${getStoreShiftWeekTotal(shift.key) > 0 ? 'has-staff-cell' : ''}`}>
                      {getStoreShiftWeekTotal(shift.key)}
                    </td>
                  </tr>
                ))}
                <tr className="history-day-total-row">
                  <th>Tổng/ngày</th>
                  {HISTORY_DAYS.map(day => (
                    <td key={day.key} className={selectedStore.dayTotals.find(item => item.key === day.key)?.total > 0 ? 'has-staff-cell' : ''}>
                      {selectedStore.dayTotals.find(item => item.key === day.key)?.total || 0}
                    </td>
                  ))}
                  <td className={selectedStore.rosterTotal > 0 ? 'has-staff-cell' : ''}>{selectedStore.rosterTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="history-summary-layout">
        <div className="history-weekly-table-wrap">
          <div className="history-subheading">
            <UsersRound size={15} />
            <span>Tổng nhân sự theo ngày và ca</span>
          </div>
          <div className="history-weekly-scroll">
            <table className="history-weekly-table">
              <thead>
                <tr>
                  <th>Ca / Ngày</th>
                  {HISTORY_DAYS.map(day => <th key={day.key}>{day.shortLabel}</th>)}
                  <th>Tổng</th>
                </tr>
              </thead>
              <tbody>
                {HISTORY_SHIFTS.map(shift => (
                  <tr key={shift.key}>
                    <th>{shift.label}</th>
                    {HISTORY_DAYS.map(day => (
                      <td key={day.key}>{dayTotals[day.key][shift.key]}</td>
                    ))}
                    <td className="history-week-total">
                      {HISTORY_DAYS.reduce((sum, day) => sum + dayTotals[day.key][shift.key], 0)}
                    </td>
                  </tr>
                ))}
                <tr className="history-day-total-row">
                  <th>Tổng/ngày</th>
                  {HISTORY_DAYS.map(day => <td key={day.key}>{dayTotals[day.key].total}</td>)}
                  <td>{selectedWeekData.totalAssignments}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="history-summary-note">Số liệu lấy từ bản report mới nhất của từng cửa hàng trong tuần, tránh cộng trùng khi cửa hàng lưu nhiều lần.</p>
        </div>

        <div className="history-store-summary">
          <div className="history-subheading">
            <Store size={15} />
            <span>Report theo cửa hàng</span>
          </div>
          <div className="history-store-list">
            {selectedWeekData.stores.map(store => (
              <div className="history-store-row" key={store.name}>
                <div>
                  <strong>{store.name}</strong>
                  <span>Report gần nhất: {formatShortDate(store.latestDate)}</span>
                </div>
                <div className="history-store-count">
                  <strong>{store.reports.length}</strong>
                  <span>report</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="history-store-rosters">
        <div className="history-subheading">
          <Store size={15} />
          <span>Tổng nhân sự theo từng cửa hàng</span>
        </div>
        <div className="history-store-roster-list">
          {selectedWeekData.stores.map(store => {
            const storeDayTotals = Object.fromEntries(store.dayTotals.map(day => [day.key, day]));

            return (
              <article className="history-store-roster" key={`roster-${store.name}`}>
                <div className="history-store-roster-header">
                  <div>
                    <strong>{store.name}</strong>
                    <span>Bản report mới nhất: {formatShortDate(store.latestDate)} · {store.reports.length} report</span>
                  </div>
                  <div className="history-store-roster-total">
                    <strong>{store.rosterTotal}</strong>
                    <span>lượt ca trong tuần</span>
                  </div>
                </div>
                <div className="history-store-roster-scroll">
                  <table className="history-weekly-table history-store-roster-table">
                    <thead>
                      <tr>
                        <th>Ca / Ngày</th>
                        {HISTORY_DAYS.map(day => <th key={day.key}>{day.shortLabel}</th>)}
                        <th>Tổng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {HISTORY_SHIFTS.map(shift => (
                        <tr key={shift.key}>
                          <th>{shift.label}</th>
                          {HISTORY_DAYS.map(day => (
                            <td key={day.key}>{storeDayTotals[day.key][shift.key]}</td>
                          ))}
                          <td className="history-week-total">
                            {HISTORY_DAYS.reduce((sum, day) => sum + storeDayTotals[day.key][shift.key], 0)}
                          </td>
                        </tr>
                      ))}
                      <tr className="history-day-total-row">
                        <th>Tổng/ngày</th>
                        {HISTORY_DAYS.map(day => <td key={day.key}>{storeDayTotals[day.key].total}</td>)}
                        <td>{store.rosterTotal}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function HistoryTab({ reports, onDeleteReport, onOpenExportModal, focusReportId }) {
  const [expandedReportId, setExpandedReportId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [previewFormat, setPreviewFormat] = useState('web'); // Default to 'web' for beautiful layout
  const weeklySummaries = useMemo(() => buildWeeklySummaries(reports), [reports]);
  const [selectedDateKey, setSelectedDateKey] = useState('');
  const [selectedStoreName, setSelectedStoreName] = useState('');
  const latestReportDateKey = reports.length > 0
    ? formatDateKey(getReportDate(reports[0]))
    : formatDateKey(new Date());
  const activeDateKey = selectedDateKey || latestReportDateKey;
  const selectedWeekKey = formatDateKey(getWeekStart(parseDateKey(activeDateKey)));
  const selectedWeekSummary = weeklySummaries.find(week => week.key === selectedWeekKey);
  const visibleReports = useMemo(() => (
    reports.filter(report => (
      formatDateKey(getReportDate(report)) === activeDateKey
      && (!selectedStoreName || report.storeName === selectedStoreName)
    ))
  ), [activeDateKey, reports, selectedStoreName]);

  useEffect(() => {
    if (reports.length > 0 && !selectedDateKey) {
      setSelectedDateKey(formatDateKey(getReportDate(reports[0])));
    }
  }, [reports, selectedDateKey]);

  useEffect(() => {
    const stores = selectedWeekSummary?.stores || [];
    if (selectedStoreName && !stores.some(store => store.name === selectedStoreName)) {
      setSelectedStoreName('');
    }
  }, [selectedStoreName, selectedWeekSummary]);

  useEffect(() => {
    if (!focusReportId || !reports.some(report => report.id === focusReportId)) return undefined;

    const focusedReport = reports.find(report => report.id === focusReportId);
    if (focusedReport) {
      setSelectedDateKey(formatDateKey(getReportDate(focusedReport)));
      setSelectedStoreName(focusedReport.storeName || '');
    }
    setExpandedReportId(focusReportId);
    const scrollTimer = window.setTimeout(() => {
      document.getElementById(`history-report-${focusReportId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 80);

    return () => window.clearTimeout(scrollTimer);
  }, [focusReportId, reports]);

  const toggleExpand = (id) => {
    setExpandedReportId(prev => prev === id ? null : id);
  };

  const handleDateChange = dateKey => {
    setSelectedDateKey(dateKey);
    setSelectedStoreName('');
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

      {reports.length > 0 && (
        <HistorySummary
          summaries={weeklySummaries}
          reports={reports}
          selectedDateKey={activeDateKey}
          onDateChange={handleDateChange}
          selectedStoreName={selectedStoreName}
          onStoreChange={setSelectedStoreName}
        />
      )}

      {reports.length > 0 && (
        <div className="history-report-period">
          <span>Bản ghi vận hành ngày {formatShortDate(parseDateKey(activeDateKey))}/{parseDateKey(activeDateKey).getFullYear()} {selectedStoreName ? `· ${selectedStoreName}` : '· tất cả cửa hàng'}</span>
          <strong>{visibleReports.length} bản báo cáo</strong>
        </div>
      )}

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
          {visibleReports.length === 0 ? (
            <div className="history-day-empty">
              <Calendar size={18} />
              <strong>Chưa có báo cáo trong ngày này</strong>
              <span>Hãy chọn ngày có dấu số báo cáo trên lịch để mở bản lưu.</span>
            </div>
          ) : visibleReports.map(report => {
            const isExpanded = expandedReportId === report.id;
            const isCopied = copiedId === report.id;

            return (
              <div 
                key={report.id}
                id={`history-report-${report.id}`}
                className="lush-card p-0 overflow-hidden transition-all duration-300 bg-white"
              >
                {/* Header Card Summary */}
                <div 
                  onClick={() => toggleExpand(report.id)}
                  className="history-header-card"
                >
                  <div className="history-header-left">
                    <div className="history-header-icon-box">
                      <FileText size={16} className="text-black" />
                    </div>
                    <div className="history-header-details">
                      <strong className="history-header-store">{report.storeName}</strong>
                      <span className="history-header-date">{formatReportDateLabel(report)}</span>
                    </div>
                  </div>

                  <div className="history-header-right">
                    <div>
                      <span className="history-header-badge">
                        Mở cửa: {report.progress.percent}%
                      </span>
                    </div>
                    <div className="history-header-actions">
                      <a
                        href={`https://lushoperationsreport.vercel.app/reports/${report.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="history-action-btn"
                        title="Mở liên kết SSR báo cáo"
                      >
                        <Globe size={14} />
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyText(report.id, report.rawText);
                        }}
                        className="history-action-btn"
                        style={{ color: isCopied ? '#10b981' : undefined }}
                        title="Sao chép nhanh báo cáo"
                      >
                        {isCopied ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                      <button
                        onClick={(e) => confirmDelete(e, report.id)}
                        className="history-action-btn-delete"
                        title="Xóa báo cáo"
                      >
                        <Trash2 size={14} />
                      </button>
                      <span className="history-header-eye">
                        {isExpanded ? <EyeOff size={14} /> : <Eye size={14} />}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Report Content */}
                {isExpanded && (
                  <div className="p-4 bg-bg-inset border-t-2 border-black space-y-4 animate-fadeIn">
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      gap: '12px', 
                      backgroundColor: '#ffffff', 
                      padding: '12px 16px', 
                      border: '1px solid var(--border-medium)',
                      flexWrap: 'wrap'
                    }}>
                      {/* Left: Section Label */}
                      <span style={{ 
                        fontSize: '10px', 
                        fontWeight: '800', 
                        fontFamily: 'var(--font-display)', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.05em', 
                        color: 'var(--text-dark)' 
                      }}>
                        Bản Xem Trước Web (Preview)
                      </span>

                      {/* Right: Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleCopyText(report.id, report.rawText)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '10px',
                            fontWeight: '700',
                            fontFamily: 'var(--font-display)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: isCopied ? '#10b981' : 'var(--text-muted)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px 0',
                            transition: 'color 0.2s ease'
                          }}
                        >
                          {isCopied ? <Check size={12} /> : <Copy size={12} />}
                          {isCopied ? 'Đã copy!' : 'Sao chép Zalo/Telegram'}
                        </button>

                        <a
                          href={`https://lushoperationsreport.vercel.app/reports/${report.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '10px',
                            fontWeight: '700',
                            fontFamily: 'var(--font-display)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: 'var(--text-muted)',
                            textDecoration: 'none',
                            padding: '4px 0',
                            transition: 'color 0.2s ease'
                          }}
                        >
                          <Globe size={12} />
                          Mở Link SSR
                        </a>

                        <button
                          onClick={() => handleDownloadHTML(report)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '10px',
                            fontWeight: '700',
                            fontFamily: 'var(--font-display)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: 'var(--text-muted)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px 0',
                            transition: 'color 0.2s ease'
                          }}
                        >
                          <Globe size={12} />
                          Tải HTML (Web)
                        </button>
                      </div>
                    </div>

                    <div className="bg-white border border-border-medium rounded-none" style={{ height: '55vh', overflowY: 'auto' }}>
                      <FormPreview 
                        storeName={report.storeName}
                        dateStr={formatReportDateLabel(report)}
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
                        employeeScheduleRoster={report.employeeScheduleRoster}
                        gradingScores={report.gradingScores}
                        overallComments={report.overallComments}
                      />
                    </div>
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
