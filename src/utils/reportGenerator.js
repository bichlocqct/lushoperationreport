import { KPI_TEMPLATES, OPENING_CHECKLIST_TEMPLATE, SELLING_HOUR_TEMPLATE } from '../data/initialData';

/**
 * Generates a self-contained, beautifully styled black-and-white HTML webpage for the daily operations report.
 * It is styled as a professional shift log form utilizing the Roboto font.
 * @param {Object} reportData - The report data structure.
 * @param {string} template - The report template style: 'standard' | 'compact'
 * @returns {string} The HTML string.
 */
export function generateReportHTML(reportData, template = 'standard') {
  const {
    storeName,
    dateStr,
    leader = '',
    progress = { completed: 0, total: 0, percent: 0 },
    rosterShelf = [],
    rosterPos = [],
    openingChecks = {},
    openingNotes = {},
    sellingChecks = {},
    sellingNotes = {},
    kpiValues = {},
    todayShifts,
    weeklyShiftsRoster
  } = reportData;

  // Process opening checklists issues
  const openingIssues = OPENING_CHECKLIST_TEMPLATE.filter(item => openingNotes[item.id]).map(item => ({
    category: item.category,
    task: item.task,
    note: openingNotes[item.id]
  }));

  // Process selling hours issues
  const sellingIssues = SELLING_HOUR_TEMPLATE.filter(item => sellingNotes[item.id]).map(item => ({
    task: item.task,
    note: sellingNotes[item.id]
  }));

  // 1. Shift Schedule HTML (Today's Shifts)
  let todayShiftsHTML = '';
  if (todayShifts) {
    todayShiftsHTML = `
      <div style="font-size: 8px; font-weight: bold; text-transform: uppercase; margin-bottom: 6px; color: #52525b; letter-spacing: 0.05em;">
        1. Lịch Trực Ca Hôm Nay (Today's Shifts)
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 15px;">
        <div style="border: 1px solid #000000; padding: 6px 10px; display: flex; flex-direction: column; justify-content: space-between;">
          <span style="font-size: 8px; font-weight: bold; text-transform: uppercase; color: #52525b; letter-spacing: 0.05em; display: block; margin-bottom: 2px;">Ca Sáng (${todayShifts.morningHours || ''})</span>
          <span style="font-size: 11px; font-weight: bold; color: #000000;">${todayShifts.morning || '--'}</span>
        </div>
        <div style="border: 1px solid #000000; padding: 6px 10px; display: flex; flex-direction: column; justify-content: space-between;">
          <span style="font-size: 8px; font-weight: bold; text-transform: uppercase; color: #52525b; letter-spacing: 0.05em; display: block; margin-bottom: 2px;">Ca Giữa (${todayShifts.middleHours || ''})</span>
          <span style="font-size: 11px; font-weight: bold; color: #000000;">${todayShifts.middle || '--'}</span>
        </div>
        <div style="border: 1px solid #000000; padding: 6px 10px; display: flex; flex-direction: column; justify-content: space-between;">
          <span style="font-size: 8px; font-weight: bold; text-transform: uppercase; color: #52525b; letter-spacing: 0.05em; display: block; margin-bottom: 2px;">Ca Chiều (${todayShifts.afternoonHours || ''})</span>
          <span style="font-size: 11px; font-weight: bold; color: #000000;">${todayShifts.afternoon || '--'}</span>
        </div>
      </div>
    `;
  }

  // 2. Roster and Shift Allocation Grid
  const rosterItems = [
    { label: 'Leader Ca', value: leader },
    ...rosterPos.map(p => ({ label: p.position, value: p.staff }))
  ];

  const rosterHTML = rosterItems.map(item => `
    <div style="border: 1px solid #000000; padding: 6px 10px; display: flex; flex-direction: column; justify-content: space-between;">
      <span style="font-size: 8px; font-weight: bold; text-transform: uppercase; color: #52525b; letter-spacing: 0.05em; display: block; margin-bottom: 2px;">${item.label}</span>
      <span style="font-size: 11px; font-weight: bold; color: #000000;">${item.value || '<span style="color: #d1d5db; font-style: italic; font-weight: normal;">--</span>'}</span>
    </div>
  `).join('');

  // 3. Shelf Assignments Grid
  const shelfHTML = rosterShelf.map(s => `
    <div style="border: 1px solid #000000; padding: 6px 10px; display: flex; flex-direction: column; justify-content: space-between;">
      <span style="font-size: 8px; font-weight: bold; text-transform: uppercase; color: #52525b; letter-spacing: 0.05em; display: block; margin-bottom: 2px;">Kệ: ${s.area}</span>
      <span style="font-size: 11px; font-weight: bold; color: #000000;">${s.staff || '<span style="color: #d1d5db; font-style: italic; font-weight: normal;">--</span>'}</span>
    </div>
  `).join('');

  // 4. Weekly shifts roster HTML
  let weeklyRosterHTML = '';
  if (weeklyShiftsRoster) {
    const getCell = (shiftKey, dayKey) => {
      const val = weeklyShiftsRoster[shiftKey]?.[dayKey] || '';
      if (!val) return '--';
      return val.split(';;').filter(name => name.trim() !== '').join(', ');
    };

    weeklyRosterHTML = `
      <div style="font-size: 8px; font-weight: bold; text-transform: uppercase; margin-top: 15px; margin-bottom: 6px; color: #52525b; letter-spacing: 0.05em; page-break-inside: avoid;">
        4. Lịch Trực Tuần Của Cửa Hàng (Weekly Shift Roster)
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-top: 5px; page-break-inside: avoid;">
        <thead>
          <tr style="background-color: #f4f4f5;">
            <th style="border: 1px solid #000000; padding: 5px 6px; font-size: 7.5px; font-weight: bold; text-align: left; width: 12%;">Ca Trực</th>
            <th style="border: 1px solid #000000; padding: 5px 4px; font-size: 7.5px; font-weight: bold; text-align: center; width: 12.5%;">Thứ 2</th>
            <th style="border: 1px solid #000000; padding: 5px 4px; font-size: 7.5px; font-weight: bold; text-align: center; width: 12.5%;">Thứ 3</th>
            <th style="border: 1px solid #000000; padding: 5px 4px; font-size: 7.5px; font-weight: bold; text-align: center; width: 12.5%;">Thứ 4</th>
            <th style="border: 1px solid #000000; padding: 5px 4px; font-size: 7.5px; font-weight: bold; text-align: center; width: 12.5%;">Thứ 5</th>
            <th style="border: 1px solid #000000; padding: 5px 4px; font-size: 7.5px; font-weight: bold; text-align: center; width: 12.5%;">Thứ 6</th>
            <th style="border: 1px solid #000000; padding: 5px 4px; font-size: 7.5px; font-weight: bold; text-align: center; width: 12.5%; background-color: #fafafa;">Thứ 7</th>
            <th style="border: 1px solid #000000; padding: 5px 4px; font-size: 7.5px; font-weight: bold; text-align: center; width: 12.5%; background-color: #fafafa;">Chủ Nhật</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #000000;">
            <td style="border: 1px solid #000000; padding: 5px 6px; font-size: 8px; font-weight: bold;">
              Ca Sáng<br><span style="font-size: 6.5px; font-weight: normal; color: #52525b;">(${todayShifts?.morningHours || ''})</span>
            </td>
            <td style="border: 1px solid #000000; padding: 5px; font-size: 8px; font-weight: bold; text-align: center;">${getCell('morning', 'monday')}</td>
            <td style="border: 1px solid #000000; padding: 5px; font-size: 8px; font-weight: bold; text-align: center;">${getCell('morning', 'tuesday')}</td>
            <td style="border: 1px solid #000000; padding: 5px; font-size: 8px; font-weight: bold; text-align: center;">${getCell('morning', 'wednesday')}</td>
            <td style="border: 1px solid #000000; padding: 5px; font-size: 8px; font-weight: bold; text-align: center;">${getCell('morning', 'thursday')}</td>
            <td style="border: 1px solid #000000; padding: 5px; font-size: 8px; font-weight: bold; text-align: center;">${getCell('morning', 'friday')}</td>
            <td style="border: 1px solid #000000; padding: 5px; font-size: 8px; font-weight: bold; text-align: center; background-color: #fafafa;">${getCell('morning', 'saturday')}</td>
            <td style="border: 1px solid #000000; padding: 5px; font-size: 8px; font-weight: bold; text-align: center; background-color: #fafafa;">${getCell('morning', 'sunday')}</td>
          </tr>
          <tr style="border-bottom: 1px solid #000000;">
            <td style="border: 1px solid #000000; padding: 5px 6px; font-size: 8px; font-weight: bold;">
              Ca Giữa<br><span style="font-size: 6.5px; font-weight: normal; color: #52525b;">(${todayShifts?.middleHours || ''})</span>
            </td>
            <td style="border: 1px solid #000000; padding: 5px; font-size: 8px; font-weight: bold; text-align: center;">${getCell('middle', 'monday')}</td>
            <td style="border: 1px solid #000000; padding: 5px; font-size: 8px; font-weight: bold; text-align: center;">${getCell('middle', 'tuesday')}</td>
            <td style="border: 1px solid #000000; padding: 5px; font-size: 8px; font-weight: bold; text-align: center;">${getCell('middle', 'wednesday')}</td>
            <td style="border: 1px solid #000000; padding: 5px; font-size: 8px; font-weight: bold; text-align: center;">${getCell('middle', 'thursday')}</td>
            <td style="border: 1px solid #000000; padding: 5px; font-size: 8px; font-weight: bold; text-align: center;">${getCell('middle', 'friday')}</td>
            <td style="border: 1px solid #000000; padding: 5px; font-size: 8px; font-weight: bold; text-align: center; background-color: #fafafa;">${getCell('middle', 'saturday')}</td>
            <td style="border: 1px solid #000000; padding: 5px; font-size: 8px; font-weight: bold; text-align: center; background-color: #fafafa;">${getCell('middle', 'sunday')}</td>
          </tr>
          <tr style="border-bottom: 1px solid #000000;">
            <td style="border: 1px solid #000000; padding: 5px 6px; font-size: 8px; font-weight: bold;">
              Ca Chiều<br><span style="font-size: 6.5px; font-weight: normal; color: #52525b;">(${todayShifts?.afternoonHours || ''})</span>
            </td>
            <td style="border: 1px solid #000000; padding: 5px; font-size: 8px; font-weight: bold; text-align: center;">${getCell('afternoon', 'monday')}</td>
            <td style="border: 1px solid #000000; padding: 5px; font-size: 8px; font-weight: bold; text-align: center;">${getCell('afternoon', 'tuesday')}</td>
            <td style="border: 1px solid #000000; padding: 5px; font-size: 8px; font-weight: bold; text-align: center;">${getCell('afternoon', 'wednesday')}</td>
            <td style="border: 1px solid #000000; padding: 5px; font-size: 8px; font-weight: bold; text-align: center;">${getCell('afternoon', 'thursday')}</td>
            <td style="border: 1px solid #000000; padding: 5px; font-size: 8px; font-weight: bold; text-align: center;">${getCell('afternoon', 'friday')}</td>
            <td style="border: 1px solid #000000; padding: 5px; font-size: 8px; font-weight: bold; text-align: center; background-color: #fafafa;">${getCell('afternoon', 'saturday')}</td>
            <td style="border: 1px solid #000000; padding: 5px; font-size: 8px; font-weight: bold; text-align: center; background-color: #fafafa;">${getCell('afternoon', 'sunday')}</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  // Complete Opening Checklist Items with Checkbox styling
  const openingItemsHTML = OPENING_CHECKLIST_TEMPLATE.map(item => {
    const isChecked = openingChecks[item.id];
    const note = openingNotes[item.id];
    const checkSymbol = isChecked ? '☑' : '☐';
    const noteHTML = note ? `<span style="color: #c2410c; font-weight: bold;"> (⚠️: ${note})</span>` : '';
    
    return `
      <div style="display: flex; align-items: flex-start; gap: 6px; padding: 5px 0; border-bottom: 1px dashed #cccccc; page-break-inside: avoid;">
        <span style="font-family: monospace; font-size: 13px; font-weight: bold; line-height: 1; margin-top: 1px;">${checkSymbol}</span>
        <span style="font-size: 10px; color: ${isChecked ? '#000000' : '#52525b'};">
          <span style="font-weight: 800; font-size: 7.5px; text-transform: uppercase; color: #71717a; margin-right: 4px;">[${item.category}]</span> 
          ${item.task}${noteHTML}
        </span>
      </div>
    `;
  }).join('');

  // 5. Selling checklists table (Only if template is standard)
  let sellingHoursSectionHTML = '';
  if (template === 'standard') {
    const sellingRows = SELLING_HOUR_TEMPLATE.map(item => {
      const checks = sellingChecks[item.id] || {};
      const times = ['11AM', '2PM', '5PM', '7PM'];
      const cells = times.map(t => {
        const isChecked = checks[t];
        return `<td style="text-align: center; border: 1px solid #000000; padding: 6px; font-family: monospace; font-size: 13px; font-weight: bold;">
          ${isChecked ? '☑' : '☐'}
        </td>`;
      }).join('');

      return `
        <tr style="border-bottom: 1px solid #000000;">
          <td style="border: 1px solid #000000; padding: 6px 10px; font-size: 10px; font-weight: 500;">${item.task}</td>
          ${cells}
        </tr>
      `;
    }).join('');

    sellingHoursSectionHTML = `
      <div class="section-block" style="margin-top: 25px; page-break-inside: avoid;">
        <div class="form-section-header">III. Checklist Hoạt Động Trong Ca / Selling Hours Checklists</div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
          <thead>
            <tr style="background-color: #f4f4f5;">
              <th style="border: 1px solid #000000; text-align: left; padding: 8px 10px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; width: 60%;">Hạng Mục Công Việc / Task Description</th>
              <th style="border: 1px solid #000000; text-align: center; padding: 8px 6px; font-size: 9px; width: 10%; font-weight: bold;">11:00</th>
              <th style="border: 1px solid #000000; text-align: center; padding: 8px 6px; font-size: 9px; width: 10%; font-weight: bold;">14:00</th>
              <th style="border: 1px solid #000000; text-align: center; padding: 8px 6px; font-size: 9px; width: 10%; font-weight: bold;">17:00</th>
              <th style="border: 1px solid #000000; text-align: center; padding: 8px 6px; font-size: 9px; width: 10%; font-weight: bold;">19:00</th>
            </tr>
          </thead>
          <tbody>
            ${sellingRows}
          </tbody>
        </table>
        
        ${sellingIssues.length > 0 ? `
          <div style="border: 1px solid #000000; border-top: none; padding: 12px; background-color: #fafafa; font-size: 10px;">
            <div style="font-size: 8px; font-weight: bold; text-transform: uppercase; margin-bottom: 4px; color: #52525b; letter-spacing: 0.05em;">
              ⚠️ Sự Cố & Ghi Chú Phát Sinh Trong Ca:
            </div>
            <ul style="margin: 0; padding-left: 15px; line-height: 1.5;">
              ${sellingIssues.map(iss => `<li><strong>${iss.task}:</strong> <em>${iss.note}</em></li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  }

  // 6. KPI Summary Table
  const kpiRowsHTML = KPI_TEMPLATES.map(kpi => {
    const vals = kpiValues[kpi.key] || { target: '', actual: '', actionPlan: '' };
    const targetVal = parseFloat(vals.target);
    const actualVal = parseFloat(vals.actual);
    let pctStr = '--';
    
    if (!isNaN(targetVal) && !isNaN(actualVal) && targetVal > 0) {
      pctStr = `${Math.round((actualVal / targetVal) * 100)}%`;
    }

    const targetFmt = kpi.format === 'number' && vals.target ? Number(vals.target).toLocaleString('vi-VN') : vals.target || '--';
    const actualFmt = kpi.format === 'number' && vals.actual ? Number(vals.actual).toLocaleString('vi-VN') : vals.actual || '--';
    const unitLabel = kpi.unit;

    return `
      <tr style="border-bottom: 1px solid #000000; page-break-inside: avoid;">
        <td style="border: 1px solid #000000; padding: 8px 10px; font-size: 10px; font-weight: bold; text-transform: uppercase; width: 30%;">${kpi.label}</td>
        <td style="border: 1px solid #000000; padding: 8px 10px; font-family: 'JetBrains Mono', monospace; font-size: 11px; text-align: right; width: 18%;">${targetFmt} <span style="font-size: 8px; color: #52525b;">${unitLabel}</span></td>
        <td style="border: 1px solid #000000; padding: 8px 10px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: bold; text-align: right; width: 18%;">${actualFmt} <span style="font-size: 8px; color: #52525b;">${unitLabel}</span></td>
        <td style="border: 1px solid #000000; padding: 8px 10px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: bold; text-align: center; width: 12%;">${pctStr}</td>
        <td style="border: 1px solid #000000; padding: 8px 10px; font-size: 10px; font-style: italic; color: #3f3f46;">${vals.actionPlan || '<span style="color: #d1d5db; font-style: normal;">--</span>'}</td>
      </tr>
    `;
  }).join('');

  // Calculate opening checklists counts
  const totalOpening = OPENING_CHECKLIST_TEMPLATE.length;
  const completedOpening = OPENING_CHECKLIST_TEMPLATE.filter(item => openingChecks[item.id]).length;
  const openingProgress = Math.round((completedOpening / totalOpening) * 100);

  const kpiCount = template === 'standard' ? 'IV' : 'III';
  const posCount = todayShifts ? '2' : '1';
  const shelfCount = todayShifts ? '3' : '2';

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LUSH Daily Shift Log - ${storeName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,400;1,700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --color-black: #000000;
      --color-white: #ffffff;
      --font-sans: 'Roboto', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      background-color: #ffffff;
      color: #000000;
      font-family: var(--font-sans);
      line-height: 1.4;
      padding: 40px 20px;
    }
    
    .form-wrapper {
      max-width: 800px;
      margin: 0 auto;
      border: 2px solid var(--color-black);
      padding: 30px;
      position: relative;
    }
    
    /* Header form style */
    .form-header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 25px;
    }
    
    .form-header-table td {
      border: 1px solid #000000;
      padding: 12px;
      vertical-align: middle;
    }
    
    .logo-container {
      width: 120px;
      text-align: center;
      font-weight: 900;
      font-size: 26px;
      letter-spacing: 0.15em;
      background-color: #000000;
      color: #ffffff;
      padding: 15px 0;
    }
    
    .title-container {
      text-align: center;
    }
    
    .form-main-title {
      font-size: 18px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }
    
    .form-subtitle {
      font-size: 10px;
      font-weight: 500;
      text-transform: uppercase;
      color: #52525b;
      letter-spacing: 0.05em;
    }
    
    /* Form input blocks */
    .form-fields-row {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      margin-bottom: 25px;
      border: 1px solid #000000;
    }
    
    .form-field {
      padding: 8px 12px;
      border-right: 1px solid #000000;
    }
    
    .form-field:last-child {
      border-right: none;
    }
    
    .field-label {
      font-size: 8px;
      font-weight: 800;
      text-transform: uppercase;
      color: #52525b;
      display: block;
      margin-bottom: 2px;
      letter-spacing: 0.05em;
    }
    
    .field-value {
      font-size: 13px;
      font-weight: 700;
      color: #000000;
    }
    
    /* Section style */
    .form-section-header {
      background-color: #000000;
      color: #ffffff;
      padding: 6px 12px;
      font-size: 10px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
    }
    
    .section-block {
      margin-bottom: 25px;
    }
    
    .grid-roster {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 8px;
      margin-bottom: 15px;
    }
    
    .grid-shelves {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
      gap: 6px;
    }
    
    .checklist-container-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 20px;
      border: 1px solid #000000;
      padding: 12px 15px;
      margin-bottom: 10px;
    }
    
    .footer-note {
      margin-top: 35px;
      border-top: 1px solid #000000;
      padding-top: 15px;
      text-align: center;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #71717a;
    }
    
    @media print {
      body {
        padding: 0;
        background-color: #ffffff;
      }
      .form-wrapper {
        border: none;
        padding: 0;
        max-width: 100%;
      }
      .no-print {
        display: none;
      }
    }
    
    @media (max-width: 640px) {
      body {
        padding: 15px 10px;
      }
      .form-wrapper {
        padding: 15px;
      }
      .form-fields-row {
        grid-template-columns: 1fr;
      }
      .form-field {
        border-right: none;
        border-bottom: 1px solid #000000;
      }
      .form-field:last-child {
        border-bottom: none;
      }
      .checklist-container-2col {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>

  <div class="form-wrapper">
    <!-- Header Block -->
    <table class="form-header-table">
      <tr>
        <td class="logo-container">LUSH</td>
        <td class="title-container">
          <h1 class="form-main-title">Bản Ghi Vận Hành Hàng Ngày</h1>
          <span class="form-subtitle">Daily Operation & Shift Log Form</span>
        </td>
        <td class="no-print" style="width: 120px; text-align: center;">
          <button onclick="window.print()" style="background-color: #000000; color: #ffffff; border: none; padding: 8px 12px; font-family: var(--font-sans); font-size: 9px; font-weight: bold; text-transform: uppercase; cursor: pointer; letter-spacing: 0.05em;">
            In Biểu Mẫu / PDF
          </button>
        </td>
      </tr>
    </table>

    <!-- Basic Form Fields -->
    <div class="form-fields-row">
      <div class="form-field">
        <span class="field-label">Cửa hàng / Store Location</span>
        <span class="field-value">${storeName}</span>
      </div>
      <div class="form-field">
        <span class="field-label">Ngày thực hiện / Date Record</span>
        <span class="field-value">${dateStr}</span>
      </div>
    </div>

    <!-- I. Duty Roster & Shifts -->
    <div class="section-block">
      <div class="form-section-header">I. Phân Bổ Nhân Sự Ca Làm Việc / Shift Assignment</div>
      
      <!-- 1. Today's shifts schedule -->
      ${todayShiftsHTML}

      <div style="font-size: 8px; font-weight: bold; text-transform: uppercase; margin-bottom: 6px; color: #52525b; letter-spacing: 0.05em;">
        ${posCount}. Vị Trí Vận Hành Cửa Hàng (Positions)
      </div>
      <div class="grid-roster">
        ${rosterHTML}
      </div>
      
      <div style="font-size: 8px; font-weight: bold; text-transform: uppercase; margin-top: 15px; margin-bottom: 6px; color: #52525b; letter-spacing: 0.05em;">
        ${shelfCount}. Phụ Trách Khu Vực Kệ Sản Phẩm (Shelves Allocation)
      </div>
      <div class="grid-shelves">
        ${shelfHTML}
      </div>

      <!-- 4. Weekly Shifts Roster table -->
      ${weeklyRosterHTML}
    </div>

    <!-- II. Checklist Mở Cửa (Opening) -->
    <div class="section-block">
      <div class="form-section-header">II. Checklist Mở Cửa Cửa Hàng / Opening Operations Checklist</div>
      
      <div class="checklist-container-2col">
        ${openingItemsHTML}
      </div>
      
      <div style="border: 1px solid #000000; padding: 10px 15px; display: flex; align-items: center; justify-content: space-between; font-size: 10px; font-weight: bold; background-color: #fafafa;">
        <span>Tổng kết tiến độ hoàn thành Opening:</span>
        <span style="font-family: var(--font-mono);">${completedOpening}/${totalOpening} (${openingProgress}%) - ${openingProgress === 100 ? 'ĐẠT CHUẨN (PASSED)' : 'CÓ LƯU Ý (ATTENTION)'}</span>
      </div>
    </div>

    <!-- III. Checklist Trong Ca -->
    ${sellingHoursSectionHTML}

    <!-- IV. KPIs & Sales Tracking Table -->
    <div class="section-block">
      <div class="form-section-header">${kpiCount}. Chỉ Số KPI & Doanh Số / Performance KPI Tracking</div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
        <thead>
          <tr style="background-color: #f4f4f5;">
            <th style="border: 1px solid #000000; text-align: left; padding: 8px 10px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold;">Chỉ Số KPI / Metric</th>
            <th style="border: 1px solid #000000; text-align: right; padding: 8px 10px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; width: 18%;">Chỉ Tiêu / Target</th>
            <th style="border: 1px solid #000000; text-align: right; padding: 8px 10px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; width: 18%;">Đạt Được / Actual</th>
            <th style="border: 1px solid #000000; text-align: center; padding: 8px 10px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; width: 12%;">Tỷ Lệ / %</th>
            <th style="border: 1px solid #000000; text-align: left; padding: 8px 10px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; width: 22%;">Kế Hoạch / Ghi Chú</th>
          </tr>
        </thead>
        <tbody>
          ${kpiRowsHTML}
        </tbody>
      </table>
    </div>

    <!-- Footer Signatures -->
    <div style="margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; page-break-inside: avoid;">
      <div style="text-align: center;">
        <div style="font-size: 8px; font-weight: bold; text-transform: uppercase; color: #52525b; margin-bottom: 50px; letter-spacing: 0.05em;">
          Người Lập Biểu Mẫu / Logged By
        </div>
        <div style="font-size: 11px; font-weight: bold; border-top: 1px solid #000000; display: inline-block; width: 150px; padding-top: 5px;">
          ${leader || 'Chữ ký Leader'}
        </div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 8px; font-weight: bold; text-transform: uppercase; color: #52525b; margin-bottom: 50px; letter-spacing: 0.05em;">
          Store Manager / Quản Lý Xác Nhận
        </div>
        <div style="font-size: 11px; font-weight: bold; border-top: 1px solid #000000; display: inline-block; width: 150px; padding-top: 5px;">
          Xác Nhận / Chữ Ký
        </div>
      </div>
    </div>

    <!-- System Info Footer -->
    <div class="footer-note">
      Báo cáo được khởi tạo tự động từ hệ thống LUSH Operation Portal<br>
      <span style="font-family: var(--font-mono); font-size: 8px;">Generated at ${new Date().toLocaleString('vi-VN')}</span>
    </div>
  </div>

</body>
</html>
`;
}
