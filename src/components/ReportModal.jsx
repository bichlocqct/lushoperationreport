import React, { useEffect, useRef, useState } from 'react';
import { X, Copy, Check, FileText, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getStoreShift, STORES, KPI_TEMPLATES, OPENING_CHECKLIST_TEMPLATE, SELLING_HOUR_TEMPLATE } from '../data/initialData';
import { generateReportHTML } from '../utils/reportGenerator';

const SCHEDULE_CODE_LABELS = {
  CA1: 'CA 1',
  CA2: 'CA 2',
  CA3: 'CA 3'
};

// Native React Form Preview Component for visual presentation inside the app
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
  completedOpening,
  totalOpening,
  openingProgress,
  openingIssues,
  sellingIssues,
  todayShifts,
  weeklyShiftsRoster,
  employeeScheduleRoster,
  gradingScores = {},
  overallComments = ''
}) => {
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
      fontFamily: "'Roboto', -apple-system, sans-serif",
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
                <span style={{ fontSize: '7.5px', fontWeight: 'bold', textTransform: 'uppercase', color: '#52525b', display: 'block', marginBottom: '2px' }}>Ca Sáng ({shifts.morningHours})</span>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#000000' }}>{shifts.morning || '--'}</span>
              </div>
              <div style={{ border: '1px solid #000000', padding: '5px 8px' }}>
                <span style={{ fontSize: '7.5px', fontWeight: 'bold', textTransform: 'uppercase', color: '#52525b', display: 'block', marginBottom: '2px' }}>Ca Giữa ({shifts.middleHours})</span>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#000000' }}>{shifts.middle || '--'}</span>
              </div>
              <div style={{ border: '1px solid #000000', padding: '5px 8px' }}>
                <span style={{ fontSize: '7.5px', fontWeight: 'bold', textTransform: 'uppercase', color: '#52525b', display: 'block', marginBottom: '2px' }}>Ca Chiều ({shifts.afternoonHours})</span>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '6px' }}>
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

export default function ReportModal({
  isOpen,
  onClose,
  storeName,
  leader,
  rosterShelf,
  rosterPos,
  openingChecks,
  openingNotes,
  sellingChecks,
  sellingNotes,
  kpiValues,
  gradingScores = {},
  overallComments = '',
  weeklyShifts = {},
  employeeRoster = {},
  onSaveReport
}) {
  const [reportTemplate, setReportTemplate] = useState('standard'); // 'standard' | 'compact'
  const [previewFormat, setPreviewFormat] = useState('web'); // Default to 'web' for beautiful layout
  const [copied, setCopied] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const savedReportRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setHasSaved(false);
      setCopied(false);
      savedReportRef.current = null;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Lookup today's shift allocation from shifts roster tab
  const activeStore = STORES.find(s => s.name === storeName) || STORES[0];
  const dayOfWeek = new Date().getDay(); // 0 is Sunday, 6 is Saturday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  const getDayKey = () => {
    const mapping = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday'
    };
    return mapping[dayOfWeek];
  };

  const todayDayKey = getDayKey();
  const shiftTimes = getStoreShift(
    activeStore,
    isWeekend ? 'weekend' : 'weekday',
    todayDayKey
  );

  const employeeScheduleRoster = employeeRoster[activeStore.id] || null;

  const getShiftStaff = (shiftKey) => {
    const codeByShift = { morning: 'A', middle: 'M', afternoon: 'B' };
    if (employeeScheduleRoster) {
      const code = codeByShift[shiftKey];
      return (employeeScheduleRoster.employees || [])
        .filter(employee => employeeScheduleRoster.days?.[todayDayKey]?.[employee.id] === code)
        .map(employee => employee.name)
        .filter(Boolean)
        .join(', ');
    }

    const storeShifts = weeklyShifts[activeStore.id] || {};
    const val = storeShifts[shiftKey]?.[todayDayKey] || '';
    if (!val) return '';
    return val.split(';;').filter(name => name.trim() !== '').join(', ');
  };

  const morningStaff = getShiftStaff('morning');
  const middleStaff = getShiftStaff('middle');
  const afternoonStaff = getShiftStaff('afternoon');

  const todayShifts = {
    morning: morningStaff,
    middle: middleStaff,
    afternoon: afternoonStaff,
    morningHours: shiftTimes.morning,
    middleHours: shiftTimes.middle,
    afternoonHours: shiftTimes.afternoon,
    handoverHours: shiftTimes.handover
  };

  // Calculate opening items counts
  const totalOpening = OPENING_CHECKLIST_TEMPLATE.length;
  const completedOpening = OPENING_CHECKLIST_TEMPLATE.filter(item => openingChecks[item.id]).length;
  const openingProgress = Math.round((completedOpening / totalOpening) * 100);

  // Check for issues/notes in opening checklist
  const openingIssues = OPENING_CHECKLIST_TEMPLATE.filter(item => openingNotes[item.id]).map(item => ({
    category: item.category,
    task: item.task,
    note: openingNotes[item.id]
  }));

  // Check for issues/notes in selling checklists
  const sellingIssues = SELLING_HOUR_TEMPLATE.filter(item => sellingNotes[item.id]).map(item => ({
    task: item.task,
    note: sellingNotes[item.id]
  }));

  const weeklyShiftsRoster = weeklyShifts[activeStore.id] || null;

  // Create preview report data
  const previewReportData = {
    storeName,
    dateStr: todayStr,
    leader,
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
    gradingScores,
    overallComments,
    todayShifts,
    weeklyShiftsRoster,
    employeeScheduleRoster
  };

  // Generate Report Text
  const generateReportText = () => {
    let text = `🌿 *BÁO CÁO VẬN HÀNH HÀNG NGÀY - LUSH RETAIL* 🌿\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `📍 *Cửa hàng:* ${storeName}\n`;
    text += `📅 *Ngày:* ${todayStr}\n`;
    if (leader) {
      text += `👤 *Leader ca:* ${leader}\n`;
    }
    text += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    // Today's Shift Roster Info
    text += `👥 *LỊCH TRỰC HÔM NAY:*\n`;
    if (morningStaff) text += `• Ca Sáng (${shiftTimes.morning}): ${morningStaff}\n`;
    if (middleStaff) text += `• Ca Giữa (${shiftTimes.middle}): ${middleStaff}\n`;
    if (afternoonStaff) text += `• Ca Chiều (${shiftTimes.afternoon}): ${afternoonStaff}\n`;
    if (shiftTimes.handover) text += `• Giờ giao ca: ${shiftTimes.handover}\n`;
    text += `\n`;

    // Duty Roster
    text += `👥 *PHÂN BỔ NHÂN SỰ TRONG CA:*\n`;
    rosterPos.forEach(p => {
      text += `• ${p.position}: ${p.staff || 'Chưa trực'}\n`;
    });
    text += `• Phụ trách kệ: `;
    const shelfRosterStr = rosterShelf.map(s => `${s.area} (${s.staff || 'N/A'})`).join(', ');
    text += `${shelfRosterStr}\n\n`;

    // Weekly Shifts Roster Info
    if (weeklyShiftsRoster) {
      text += `📅 *LỊCH TRỰC TRONG TUẦN (WEEKLY ROSTER):*\n`;
      const daysMapping = [
        { key: 'monday', label: 'Thứ 2' },
        { key: 'tuesday', label: 'Thứ 3' },
        { key: 'wednesday', label: 'Thứ 4' },
        { key: 'thursday', label: 'Thứ 5' },
        { key: 'friday', label: 'Thứ 6' },
        { key: 'saturday', label: 'Thứ 7' },
        { key: 'sunday', label: 'Chủ Nhật' }
      ];
      const getRosterCellForText = (shiftKey, dayKey) => {
        const val = weeklyShiftsRoster[shiftKey]?.[dayKey] || '';
        if (!val) return '';
        return val.split(';;').filter(name => name.trim() !== '').join(', ');
      };
      
      daysMapping.forEach(d => {
        const morningName = getRosterCellForText('morning', d.key);
        const middleName = getRosterCellForText('middle', d.key);
        const afternoonName = getRosterCellForText('afternoon', d.key);
        
        let shiftsLine = [];
        if (morningName) shiftsLine.push(`Sáng: ${morningName}`);
        if (middleName) shiftsLine.push(`Giữa: ${middleName}`);
        if (afternoonName) shiftsLine.push(`Chiều: ${afternoonName}`);
        
        if (shiftsLine.length > 0) {
          text += `• *${d.label}:* ${shiftsLine.join(' | ')}\n`;
        } else {
          text += `• *${d.label}:* Nghỉ\n`;
        }
      });
      text += `\n`;
    }

    if (employeeScheduleRoster) {
      text += `📅 *LỊCH NHÂN VIÊN THEO MÃ CA (EMPLOYEE ROSTER):*\n`;
      const employeeDays = [
        { key: 'monday', label: 'Thứ 2' },
        { key: 'tuesday', label: 'Thứ 3' },
        { key: 'wednesday', label: 'Thứ 4' },
        { key: 'thursday', label: 'Thứ 5' },
        { key: 'friday', label: 'Thứ 6' },
        { key: 'saturday', label: 'Thứ 7' },
        { key: 'sunday', label: 'Chủ Nhật' }
      ];

      employeeDays.forEach(day => {
        const assignments = (employeeScheduleRoster.employees || [])
          .map(employee => {
            const code = employeeScheduleRoster.days?.[day.key]?.[employee.id];
            if (!code) return '';
            const displayCode = code.startsWith('OTHER:')
              ? `Khác: ${code.slice(6) || '--'}`
              : SCHEDULE_CODE_LABELS[code] || code;
            const position = employee.position ? ` (${employee.position})` : '';
            return `${employee.name}${position}: ${displayCode}`;
          })
          .filter(Boolean);
        text += `• *${day.label}:* ${assignments.length ? assignments.join(' | ') : 'Chưa xếp'}\n`;
      });
      text += `\n`;
    }

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

    // Operations Grading & Comments text
    const gradedCount = Object.keys(gradingScores || {}).reduce((acc, key) => {
      const val = gradingScores[key]?.score;
      if (val !== undefined && val !== null && val !== '') acc++;
      return acc;
    }, 0);

    if (gradedCount > 0) {
      text += `\n⭐️ *ĐÁNH GIÁ VẬN HÀNH:*\n`;
      const GRADING_CATEGORIES_LOCAL = [
        { key: 'grooming', label: 'Diện mạo & Tác phong' },
        { key: 'cleanliness', label: 'Vệ sinh cửa hàng' },
        { key: 'vmd', label: 'Trưng bày & VMD' },
        { key: 'service', label: 'Dịch vụ & Trải nghiệm' },
        { key: 'inventory', label: 'Quản lý hàng hóa & FIFO' },
        { key: 'cashier', label: 'Vận hành Quầy thu ngân' },
        { key: 'equipment', label: 'Thiết bị & Kỹ thuật' }
      ];

      let totalGradedScore = 0;
      GRADING_CATEGORIES_LOCAL.forEach(cat => {
        const data = gradingScores?.[cat.key];
        if (data && data.score !== undefined && data.score !== null && data.score !== '') {
          const scoreVal = parseFloat(data.score);
          totalGradedScore += scoreVal;
          text += `• ${cat.label}: ${scoreVal}/10${data.note ? ` (${data.note})` : ''}\n`;
        }
      });
      const average = (totalGradedScore / gradedCount).toFixed(1);
      let ratingLabel = 'N/A';
      const avg = parseFloat(average);
      if (avg >= 9.0) ratingLabel = 'XUẤT SẮC';
      else if (avg >= 7.0) ratingLabel = 'KHÁ TỐT';
      else if (avg >= 5.0) ratingLabel = 'TRUNG BÌNH';
      else ratingLabel = 'CẦN CẢI THIỆN';

      text += `➔ *ĐIỂM VẬN HÀNH TRUNG BÌNH:* ${average}/10 (${ratingLabel})\n`;
    }

    if (overallComments) {
      text += `\n✍️ *NHẬN XÉT CHUNG (OVERALL COMMENTS):*\n`;
      text += `"${overallComments}"\n`;
    }

    text += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `✍️ _Báo cáo được khởi tạo tự động từ hệ thống LUSH Operation Portal_`;
    return text;
  };

  const saveReportToHistoryAndLocal = async (silent = false) => {
    if (hasSaved) return savedReportRef.current;
    setHasSaved(true);

    const timeStamp = Date.now();
    const cleanStoreId = storeName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').trim();
    const dateFormatted = new Date().toISOString().split('T')[0];
    const fileName = `report-${dateFormatted}-${cleanStoreId}-${timeStamp}.html`;

    const reportData = {
      id: `rep-${timeStamp}`,
      storeName,
      leader,
      date: new Date().toISOString(),
      dateStr: todayStr,
      template: reportTemplate,
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
      gradingScores,
      overallComments,
      rawText: generateReportText(),
      fileName,
      todayShifts,
      weeklyShiftsRoster,
      employeeScheduleRoster
    };

    const htmlContent = generateReportHTML(reportData, reportTemplate);

    // 1. Try to save locally via the custom Vite dev server API
    try {
      const response = await fetch('/api/save-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileName, htmlContent, reportData })
      });
      if (response.ok && !silent) {
        const result = await response.json();
        if (result.success) {
          console.log('Báo cáo đã được lưu vào thư mục dự án:', result.path);
        }
      }
    } catch (e) {
      if (!silent) console.warn('API save-report failed or unavailable (running production build).');
    }

    // 2. Save report to localStorage database (state)
    onSaveReport(reportData, { navigate: !silent });

    const savedInfo = { reportData, htmlContent, fileName };
    savedReportRef.current = savedInfo;
    return savedInfo;
  };

  const handleCopy = async () => {
    navigator.clipboard.writeText(generateReportText());
    setCopied(true);
    await saveReportToHistoryAndLocal(true); // Auto-save silently on copy!
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadOnly = async () => {
    const savedInfo = await saveReportToHistoryAndLocal(true); // Save silently first
    if (savedInfo) {
      const { htmlContent, fileName } = savedInfo;
      // Download the HTML report to local computer downloads folder
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleExportReport = async () => {
    const result = await saveReportToHistoryAndLocal(false);
    if (!result?.reportData) return;

    confetti({
      particleCount: 80,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#202a23', '#ffffff', '#7b9480', '#b6c7b9']
    });

    onClose();
  };

  const handleClose = async () => {
    if (!hasSaved && (leader || completedOpening > 0)) {
      await saveReportToHistoryAndLocal(true); // Auto-save silently before closing
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-scaleUp" style={{ maxWidth: '850px', width: '95%' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-medium bg-white text-black" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid var(--border-medium)', backgroundColor: '#ffffff', color: '#000000' }}>
          <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} />
            <h3 className="text-xs font-sans font-bold uppercase tracking-wider">Khởi Tạo Báo Cáo Ca Trực</h3>
          </div>
          <button 
            onClick={handleClose} 
            className="text-text-muted hover:text-black transition-colors bg-transparent border-none cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Preview */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-bg-inset max-h-[65vh]" style={{ flex: '1 1 0%', padding: '16px', overflowY: 'auto', backgroundColor: 'var(--bg-inset)', maxHeight: '60vh' }}>
          <div className="rounded-none">
            <FormPreview 
              storeName={storeName}
              dateStr={todayStr}
              leader={leader}
              rosterShelf={rosterShelf}
              rosterPos={rosterPos}
              openingChecks={openingChecks}
              openingNotes={openingNotes}
              sellingChecks={sellingChecks}
              sellingNotes={sellingNotes}
              kpiValues={kpiValues}
              reportTemplate={reportTemplate}
              completedOpening={completedOpening}
              totalOpening={totalOpening}
              openingProgress={openingProgress}
              openingIssues={openingIssues}
              sellingIssues={sellingIssues}
              todayShifts={todayShifts}
              weeklyShiftsRoster={weeklyShiftsRoster}
              employeeScheduleRoster={employeeScheduleRoster}
              gradingScores={gradingScores}
              overallComments={overallComments}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-medium gap-3 bg-white" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderTop: '1px solid var(--border-medium)', gap: '12px', backgroundColor: '#ffffff' }}>
          <span className="text-[10px] text-text-muted font-sans uppercase tracking-wider">
            * Báo cáo sẽ được lưu và mở ngay trong Lịch sử Báo cáo
          </span>
          <div className="flex gap-2 w-full sm:w-auto" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={handleCopy}
              className="btn-white text-xs py-2 px-4 flex-1 sm:flex-initial flex items-center justify-center gap-1.5"
            >
              {copied ? <Check size={14} /> : null}
              {copied ? 'Đã sao chép!' : 'Sao chép Zalo/Telegram'}
            </button>
            
            <button
              onClick={handleDownloadOnly}
              className="btn-white text-xs py-2 px-4 flex-1 sm:flex-initial flex items-center justify-center gap-1.5"
            >
              <Globe size={14} />
              Tải File HTML
            </button>

            <button
              onClick={handleExportReport}
              className="btn-black text-xs py-2 px-4 flex-1 sm:flex-initial flex items-center justify-center gap-1.5"
              title="Lưu báo cáo và mở báo cáo vừa lưu trong Lịch sử Báo cáo"
            >
              <FileText size={14} />
              Lưu & Xem Báo Cáo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
