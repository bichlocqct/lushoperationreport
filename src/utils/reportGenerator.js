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
    gradingScores = {},
    overallComments = '',
    todayShifts,
    weeklyShiftsRoster,
    employeeScheduleRoster,
    fileName
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
  if (weeklyShiftsRoster && !employeeScheduleRoster) {
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

  // 5. Employee-first weekly roster table
  let employeeRosterHTML = '';
  if (employeeScheduleRoster?.employees?.length) {
    const rosterDays = [
      { key: 'monday', label: 'Thá»© 2' },
      { key: 'tuesday', label: 'Thá»© 3' },
      { key: 'wednesday', label: 'Thá»© 4' },
      { key: 'thursday', label: 'Thá»© 5' },
      { key: 'friday', label: 'Thá»© 6' },
      { key: 'saturday', label: 'Thá»© 7' },
      { key: 'sunday', label: 'Chá»§ Nháº­t' }
    ];
    const getEmployeeCode = (employeeId, dayKey) => (
      employeeScheduleRoster.days?.[dayKey]?.[employeeId] || '--'
    );
    const formatEmployeeCode = value => (
      String(value).startsWith('OTHER:') ? `Khác: ${String(value).slice(6) || '--'}` : value
    );

    const employeeRows = employeeScheduleRoster.employees.map(employee => `
      <tr>
        <td style="border: 1px solid #000000; padding: 6px 8px; font-size: 8px; font-weight: bold; text-align: left;">${employee.name || '--'}</td>
        <td style="border: 1px solid #000000; padding: 6px 4px; font-size: 8px; font-weight: bold; text-align: center;">${employee.position || '--'}</td>
        ${rosterDays.map(day => `
          <td style="border: 1px solid #000000; padding: 6px 4px; font-family: var(--font-mono); font-size: 9px; font-weight: bold; text-align: center;">${formatEmployeeCode(getEmployeeCode(employee.id, day.key))}</td>
        `).join('')}
      </tr>
    `).join('');

    employeeRosterHTML = `
      <div style="font-size: 8px; font-weight: bold; text-transform: uppercase; margin-top: 15px; margin-bottom: 6px; color: #52525b; letter-spacing: 0.05em; page-break-inside: avoid;">
        4. Lịch Làm Việc Theo Nhân Viên / Employee Weekly Roster
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-top: 5px; page-break-inside: avoid;">
        <thead>
          <tr style="background-color: #f4f4f5;">
            <th style="border: 1px solid #000000; padding: 6px 8px; font-size: 7.5px; font-weight: bold; text-align: left; width: 22%;">Nhân viên</th>
            <th style="border: 1px solid #000000; padding: 6px 4px; font-size: 7.5px; font-weight: bold; text-align: center; width: 9%;">Vị trí</th>
            ${rosterDays.map(day => `<th style="border: 1px solid #000000; padding: 6px 4px; font-size: 7.5px; font-weight: bold; text-align: center;">${day.label}</th>`).join('')}
          </tr>
        </thead>
        <tbody>${employeeRows}</tbody>
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

  // 7. Operations Grading & Comments HTML
  let gradingSectionHTML = '';
  if (gradingScores && Object.keys(gradingScores).length > 0) {
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
      return `
        <tr style="border-bottom: 1px solid #000000; page-break-inside: avoid;">
          <td style="border: 1px solid #000000; padding: 6px 10px; font-size: 10px; font-weight: bold; width: 35%;">${cat.label}</td>
          <td style="border: 1px solid #000000; padding: 6px 10px; font-family: var(--font-mono); font-size: 11px; font-weight: bold; text-align: center; width: 20%;">${data.score !== '' ? `${data.score} / 10` : '--'}</td>
          <td style="border: 1px solid #000000; padding: 6px 10px; font-size: 10px; font-style: italic; color: #3f3f46; width: 45%;">${data.note || '--'}</td>
        </tr>
      `;
    }).join('');

    const average = gradedCount > 0 ? (totalGradedScore / gradedCount).toFixed(1) : '--';
    let ratingLabel = 'N/A';
    if (average !== '--') {
      const avg = parseFloat(average);
      if (avg >= 9.0) ratingLabel = 'XUẤT SẮC (EXCELLENT)';
      else if (avg >= 7.0) ratingLabel = 'KHÁ TỐT (GOOD)';
      else if (avg >= 5.0) ratingLabel = 'TRUNG BÌNH (AVERAGE)';
      else ratingLabel = 'CẦN CẢI THIỆN (IMPROVEMENT)';
    }

    const nextSecNum = template === 'standard' ? 'V' : 'IV';

    gradingSectionHTML = `
      <div class="section-block" style="margin-top: 25px; page-break-inside: avoid;">
        <div class="form-section-header">${nextSecNum}. Đánh Giá Vận Hành & Nhận Xét Chung / Operations Grading & Comments</div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
          <thead>
            <tr style="background-color: #f4f4f5;">
              <th style="border: 1px solid #000000; text-align: left; padding: 8px 10px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold;">Hạng Mục Đánh Giá / Category</th>
              <th style="border: 1px solid #000000; text-align: center; padding: 8px 10px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold;">Điểm Số / Score</th>
              <th style="border: 1px solid #000000; text-align: left; padding: 8px 10px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold;">Chi Tiết / Notes</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
            <tr style="background-color: #fafafa; font-weight: bold;">
              <td style="border: 1px solid #000000; padding: 8px 10px; font-size: 10px; text-transform: uppercase;">ĐIỂM VẬN HÀNH TRUNG BÌNH</td>
              <td style="border: 1px solid #000000; padding: 8px 10px; font-family: var(--font-mono); font-size: 11px; text-align: center;">${average} / 10</td>
              <td style="border: 1px solid #000000; padding: 8px 10px; font-size: 9px; text-transform: uppercase;">XẾP LOẠI: ${ratingLabel}</td>
            </tr>
          </tbody>
        </table>

        ${overallComments ? `
          <div style="border: 1px solid #000000; padding: 12px; background-color: #f9fafb; margin-top: 15px;">
            <div style="font-size: 8px; font-weight: bold; text-transform: uppercase; margin-bottom: 6px; color: #52525b; letter-spacing: 0.05em;">
              ✍️ Nhận xét chung của Ca trưởng / Shift Leader's Overall Comments:
            </div>
            <div style="font-size: 11px; font-style: italic; white-space: pre-wrap; line-height: 1.5; color: #0f172a;">
              "${overallComments.replace(/"/g, '&quot;')}"
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

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

  <!-- Floating/Sticky Toolbar for Web View (no-print) -->
  <div class="no-print" style="position: sticky; top: 0; left: 0; right: 0; background-color: #000000; color: #ffffff; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px rgba(0,0,0,0.15); z-index: 1000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; border-bottom: 2px solid #ffffff;">
    <div style="font-weight: 900; font-size: 14px; letter-spacing: 0.1em;">LUSH OPERATION REPORT</div>
    <div style="display: flex; gap: 12px;">
      <button onclick="window.print()" style="background-color: #ffffff; color: #000000; border: 1px solid #ffffff; padding: 6px 16px; font-size: 11px; font-weight: bold; cursor: pointer; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.05em; transition: all 0.2s;">
        In Báo Cáo / PDF
      </button>
      <button id="git-push-btn" onclick="pushToGit('${fileName}')" style="background-color: #24292e; color: #ffffff; border: 1px solid #444d56; padding: 6px 16px; font-size: 11px; font-weight: bold; cursor: pointer; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.05em; transition: all 0.2s; display: flex; align-items: center; gap: 6px;">
        Đưa lên GitHub
      </button>
      <button onclick="downloadSelf()" style="background-color: transparent; color: #ffffff; border: 1px solid #ffffff; padding: 6px 16px; font-size: 11px; font-weight: bold; cursor: pointer; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.05em; transition: all 0.2s;">
        Tải File HTML
      </button>
    </div>
  </div>

  <script>
    async function pushToGit(fileName) {
      const btn = document.getElementById('git-push-btn');
      const originalText = btn.innerText;
      btn.disabled = true;
      btn.innerText = 'Đang đưa lên GitHub...';
      try {
        const response = await fetch('/api/git-push', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ fileName })
        });
        const result = await response.json();
        if (result.success) {
          alert('Đã đưa báo cáo lên GitHub thành công!');
        } else {
          alert('Lỗi khi đẩy Git: ' + result.error);
        }
      } catch (e) {
        alert('Không thể kết nối đến backend server để đẩy Git. Tính năng này chỉ hoạt động khi chạy local.');
      } finally {
        btn.disabled = false;
        btn.innerText = originalText;
      }
    }

    function downloadSelf() {
      // Nhân bản document và loại bỏ thanh toolbar no-print trước khi tải về
      const docClone = document.documentElement.cloneNode(true);
      const toolbar = docClone.querySelector('.no-print');
      if (toolbar) toolbar.remove();
      
      const htmlContent = '<!DOCTYPE html>\n' + docClone.outerHTML;
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = '${fileName}';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  </script>

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
      ${employeeRosterHTML}
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

    <!-- V. Operations Grading & Comments -->
    ${gradingSectionHTML}

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
