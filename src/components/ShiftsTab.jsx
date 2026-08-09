import React, { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Info,
  MapPin,
  Plus,
  RotateCcw,
  Table2,
  Trash2,
  UsersRound
} from 'lucide-react';
import { getStoreShift, STORES } from '../data/initialData';

const DAYS = [
  { key: 'monday', label: 'Thứ 2', shortLabel: 'T2', isWeekend: false },
  { key: 'tuesday', label: 'Thứ 3', shortLabel: 'T3', isWeekend: false },
  { key: 'wednesday', label: 'Thứ 4', shortLabel: 'T4', isWeekend: false },
  { key: 'thursday', label: 'Thứ 5', shortLabel: 'T5', isWeekend: false },
  { key: 'friday', label: 'Thứ 6', shortLabel: 'T6', isWeekend: false },
  { key: 'saturday', label: 'Thứ 7', shortLabel: 'T7', isWeekend: true },
  { key: 'sunday', label: 'Chủ Nhật', shortLabel: 'CN', isWeekend: true }
];

const SHIFT_ROWS = [
  { key: 'morning', label: 'Ca sáng', note: 'Chuẩn bị & mở cửa', tone: 'morning', number: '01' },
  { key: 'middle', label: 'Ca giữa', note: 'Vận hành giữa ngày', tone: 'middle', number: '02' },
  { key: 'afternoon', label: 'Ca chiều', note: 'Bàn giao & đóng ca', tone: 'afternoon', number: '03' }
];

const SHIFT_CODES = [
  { code: 'A', label: 'Ca sáng', tone: 'a' },
  { code: 'B', label: 'Ca chiều', tone: 'b' },
  { code: 'M', label: 'Ca giữa', tone: 'm' },
  { code: 'OFF', label: 'Nghỉ', tone: 'off' },
  { code: 'AL', label: 'Nghỉ phép', tone: 'al' }
];

const BREAK_RULES = [
  { title: 'Ca sáng', time: '12h – 12h30', detail: '1 nhân sự ca sáng' },
  { title: 'Ca giữa', time: '13h30 – 14h', detail: '1 nhân sự ca giữa' },
  { title: 'Ca chiều', time: '15h – 15h30', detail: '1 nhân sự ca chiều' }
];

function splitTimeValue(value) {
  if (!value) return { range: '', duration: '' };
  const [range, duration] = value.split('(');
  return {
    range: range.trim(),
    duration: duration ? duration.replace(')', '').trim() : ''
  };
}

function HandoverChip({ value }) {
  const { range, duration } = splitTimeValue(value);

  return (
    <div className="shift-handover-chip">
      <span>{range}</span>
      {duration && <small>{duration}</small>}
    </div>
  );
}

const getEmployeeId = (name, index) => {
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'nhan-vien';

  return `legacy-${index}-${slug}`;
};

const migrateLegacyRoster = (legacyRoster = {}) => {
  const names = [];

  SHIFT_ROWS.forEach(shift => {
    Object.values(legacyRoster[shift.key] || {}).forEach(value => {
      String(value || '')
        .split(';;')
        .map(name => name.trim())
        .filter(Boolean)
        .forEach(name => {
          if (!names.includes(name)) names.push(name);
        });
    });
  });

  const employees = names.map((name, index) => ({ id: getEmployeeId(name, index), name }));
  const employeeIds = new Map(employees.map(employee => [employee.name, employee.id]));
  const legacyCodeByShift = { morning: 'A', middle: 'M', afternoon: 'B' };
  const days = {};

  SHIFT_ROWS.forEach(shift => {
    DAYS.forEach(day => {
      const namesForDay = String(legacyRoster[shift.key]?.[day.key] || '')
        .split(';;')
        .map(name => name.trim())
        .filter(Boolean);

      if (namesForDay.length === 0) return;
      days[day.key] = { ...(days[day.key] || {}) };
      namesForDay.forEach(name => {
        const employeeId = employeeIds.get(name);
        if (employeeId) days[day.key][employeeId] = legacyCodeByShift[shift.key];
      });
    });
  });

  return { employees, days };
};

function DirectoryTable({ stores, scheduleKey, title }) {
  return (
    <div className="shift-directory-block">
      <div className="shift-directory-label">
        <span className="shift-directory-dot" />
        {title}
      </div>
      <div className="shift-directory-scroll">
        <table className="shift-directory-table">
          <thead>
            <tr>
              <th>Cửa hàng</th>
              <th>Hoạt động</th>
              <th>Ca sáng</th>
              <th>Ca giữa</th>
              <th>Ca chiều</th>
              <th>Giao ca</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(store => (
              <tr key={store.id}>
                <td>
                  <div className="shift-directory-store">
                    <span>{store.name}</span>
                    <small>{store.region}</small>
                  </div>
                </td>
                <td className="shift-directory-time">{store.hours[scheduleKey]}</td>
                <td>{store.shifts[scheduleKey].morning}</td>
                <td>{store.shifts[scheduleKey].middle}</td>
                <td>{store.shifts[scheduleKey].afternoon}</td>
                <td><HandoverChip value={store.shifts[scheduleKey].handover} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ShiftsTab({
  selectedStoreId,
  setSelectedStoreId,
  weeklyShifts = {},
  setWeeklyShifts,
  employeeRoster = {},
  setEmployeeRoster
}) {
  const selectedStore = STORES.find(store => store.id === selectedStoreId) || STORES[0];
  const [activeRegion, setActiveRegion] = useState(selectedStore.region);

  useEffect(() => {
    if (selectedStore) setActiveRegion(selectedStore.region);
  }, [selectedStore, selectedStoreId]);

  const filteredStores = useMemo(
    () => STORES.filter(store => store.region === activeRegion),
    [activeRegion]
  );

  const legacyRoster = useMemo(
    () => migrateLegacyRoster(weeklyShifts[selectedStoreId] || {}),
    [selectedStoreId, weeklyShifts]
  );

  const activeEmployeeRoster = employeeRoster[selectedStoreId] || legacyRoster;
  const employees = activeEmployeeRoster.employees || [];
  const rosterDays = activeEmployeeRoster.days || {};

  const scheduleStats = {
    assigned: DAYS.reduce((total, day) => (
      total + employees.filter(employee => rosterDays[day.key]?.[employee.id]).length
    ), 0),
    employeeCount: employees.length,
    dayCount: DAYS.length
  };

  const handleRegionChange = (region) => {
    setActiveRegion(region);
    const regionalStores = STORES.filter(store => store.region === region);
    if (regionalStores.length > 0) setSelectedStoreId(regionalStores[0].id);
  };

  const updateEmployeeRoster = updater => {
    setEmployeeRoster(prev => {
      const current = prev[selectedStoreId] || activeEmployeeRoster;
      return {
        ...prev,
        [selectedStoreId]: updater(current)
      };
    });
  };

  const addEmployee = () => {
    const employeeNumber = employees.length + 1;
    updateEmployeeRoster(current => ({
      ...current,
      employees: [
        ...(current.employees || []),
        { id: `employee-${Date.now()}`, name: `Nhân sự ${employeeNumber}` }
      ]
    }));
  };

  const updateEmployeeName = (employeeId, name) => {
    updateEmployeeRoster(current => ({
      ...current,
      employees: (current.employees || []).map(employee => (
        employee.id === employeeId ? { ...employee, name } : employee
      ))
    }));
  };

  const removeEmployee = employeeId => {
    updateEmployeeRoster(current => {
      const nextDays = Object.fromEntries(
        Object.entries(current.days || {}).map(([dayKey, dayValues]) => {
          const remaining = { ...dayValues };
          delete remaining[employeeId];
          return [dayKey, remaining];
        })
      );

      return {
        ...current,
        employees: (current.employees || []).filter(employee => employee.id !== employeeId),
        days: nextDays
      };
    });
  };

  const updateEmployeeCode = (dayKey, employeeId, code) => {
    updateEmployeeRoster(current => ({
      ...current,
      days: {
        ...(current.days || {}),
        [dayKey]: {
          ...(current.days?.[dayKey] || {}),
          [employeeId]: code
        }
      }
    }));
  };

  // Keep the previous roster shape readable for saved reports created before the matrix update.
  const updateShiftState = (shiftKey, dayKey, value) => {
    setWeeklyShifts(prev => ({
      ...prev,
      [selectedStoreId]: {
        ...(prev[selectedStoreId] || {}),
        [shiftKey]: {
          ...(prev[selectedStoreId]?.[shiftKey] || {}),
          [dayKey]: value
        }
      }
    }));
  };

  const getShiftNames = (shiftKey, dayKey) => {
    const value = weeklyShifts[selectedStoreId]?.[shiftKey]?.[dayKey] || '';
    return value ? value.split(';;') : [''];
  };

  const updateName = (shiftKey, dayKey, index, value, names) => {
    const nextNames = [...names];
    nextNames[index] = value;
    updateShiftState(shiftKey, dayKey, nextNames.join(';;'));
  };

  const addName = (shiftKey, dayKey, names) => {
    updateShiftState(shiftKey, dayKey, [...names, ''].join(';;'));
  };

  const removeName = (shiftKey, dayKey, index, names) => {
    updateShiftState(shiftKey, dayKey, names.filter((_, nameIndex) => nameIndex !== index).join(';;'));
  };

  const handleResetEmployeeRoster = () => {
    if (!window.confirm('Đặt lại toàn bộ bảng phân ca của cửa hàng này?')) return;

    setEmployeeRoster(prev => {
      const next = { ...prev };
      delete next[selectedStoreId];
      return next;
    });

    setWeeklyShifts(prev => {
      const next = { ...prev };
      delete next[selectedStoreId];
      return next;
    });
  };

  return (
    <div className="shifts-page animate-fadeIn">
      <section className="shift-hero">
        <div className="shift-hero-copy">
          <div className="shift-kicker">
            <span className="shift-kicker-mark" />
            <span>LUSH / VẬN HÀNH CỬA HÀNG</span>
          </div>
          <h1>Ca làm việc tại cửa hàng</h1>
          <p>Phân bổ nhân sự theo từng ca, theo dõi thời gian giao ca và chuẩn hóa vận hành trong tuần.</p>
        </div>
        <div className="shift-hero-meta">
          <div className="shift-hero-meta-icon"><CalendarDays size={18} /></div>
          <div>
            <span>Tuần vận hành</span>
            <strong>Thứ 2 – Chủ Nhật</strong>
          </div>
        </div>
      </section>

      <section className="shift-control-panel">
        <div className="shift-control-heading">
          <div className="shift-section-icon"><Building2 size={18} /></div>
          <div>
            <span className="shift-eyebrow">Thiết lập ca trực</span>
            <h2>Chọn khu vực và cửa hàng</h2>
            <p>Thông tin lịch làm việc sẽ được cập nhật theo cửa hàng đang chọn.</p>
          </div>
        </div>

        <div className="shift-control-fields">
          <div className="shift-field">
            <label htmlFor="shift-region">Khu vực</label>
            <div className="shift-segmented" id="shift-region">
              {['HCM', 'HN'].map(region => (
                <button
                  key={region}
                  type="button"
                  onClick={() => handleRegionChange(region)}
                  className={activeRegion === region ? 'is-active' : ''}
                  aria-pressed={activeRegion === region}
                >
                  {region === 'HCM' ? 'Hồ Chí Minh' : 'Hà Nội'}
                </button>
              ))}
            </div>
          </div>

          <div className="shift-field shift-store-field">
            <label htmlFor="shift-store">Cửa hàng hoạt động</label>
            <div className="shift-select-wrap">
              <MapPin size={16} />
              <select
                id="shift-store"
                value={selectedStoreId}
                onChange={event => setSelectedStoreId(event.target.value)}
              >
                {filteredStores.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
              <ChevronDown size={16} aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="shift-store-summary">
          <div className="shift-summary-store">
            <span className="shift-summary-label">Đang thao tác</span>
            <strong>{selectedStore.name}</strong>
          </div>
          <div className="shift-summary-divider" />
          <div className="shift-summary-item">
            <Clock3 size={15} />
            <span>Giờ mở cửa</span>
            <strong>{selectedStore.hours.weekday}</strong>
          </div>
          <div className="shift-summary-item">
            <UsersRound size={15} />
            <span>Đã xếp</span>
            <strong>{scheduleStats.assigned} nhân sự</strong>
          </div>
        </div>
      </section>

      <section className="shift-roster-card">
        <div className="shift-roster-header">
          <div className="shift-roster-title">
            <div className="shift-section-icon shift-section-icon-dark"><CalendarDays size={18} /></div>
            <div>
              <span className="shift-eyebrow">Lịch tuần / {selectedStore.name}</span>
              <h2>Bảng phân ca làm việc</h2>
              <p>Mỗi cột là một nhân viên, mỗi hàng là một ngày. Chọn mã A, B, M, AL hoặc OFF cho từng ô.</p>
            </div>
          </div>
          <div className="shift-roster-actions">
            <button type="button" onClick={addEmployee} className="shift-add-employee-button">
              <Plus size={15} />
              <span>Thêm nhân viên</span>
            </button>
            <button type="button" onClick={handleResetEmployeeRoster} className="shift-reset-button">
              <RotateCcw size={14} />
              <span>Đặt lại lịch</span>
            </button>
          </div>
        </div>

        <div className="shift-roster-toolbar">
          <div className="shift-toolbar-note">
            <Info size={15} />
            <span>Mỗi hàng là một nhân viên, mỗi cột là một ngày; chọn mã ca trực tiếp trong từng ô.</span>
          </div>
          <div className="shift-toolbar-status">
            <CheckCircle2 size={15} />
            <span>{scheduleStats.assigned > 0 ? 'Đã cập nhật lịch' : 'Chưa có nhân sự được xếp'}</span>
          </div>
        </div>

        <div className="shift-employee-table-scroll">
          <table className="shift-employee-table">
            <thead>
              <tr>
                <th className="shift-employee-name-column-header">Nhân viên</th>
                {DAYS.map(day => (
                  <th key={day.key} className={`shift-employee-day-header ${day.isWeekend ? 'is-weekend' : ''}`}>
                    <span>{day.shortLabel}</span>
                    <strong>{day.label}</strong>
                    {day.isWeekend && <small>Cuối tuần</small>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? employees.map(employee => (
                <tr key={employee.id}>
                  <th className="shift-employee-name-cell">
                    <div className="shift-employee-name-wrap">
                      <UsersRound size={15} aria-hidden="true" />
                      <input
                        type="text"
                        value={employee.name}
                        onChange={event => updateEmployeeName(employee.id, event.target.value)}
                        aria-label={`Tên nhân viên ${employee.name}`}
                        className="shift-employee-name-input"
                      />
                      <button
                        type="button"
                        onClick={() => removeEmployee(employee.id)}
                        className="shift-employee-remove"
                        aria-label={`Xóa ${employee.name}`}
                        title="Xóa nhân viên"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </th>
                  {DAYS.map(day => {
                    const code = rosterDays[day.key]?.[employee.id] || '';
                    const codeTone = SHIFT_CODES.find(option => option.code === code)?.tone || 'empty';

                    return (
                      <td key={day.key} className={`shift-employee-code-cell code-${codeTone}`}>
                        <select
                          value={code}
                          onChange={event => updateEmployeeCode(day.key, employee.id, event.target.value)}
                          className="shift-code-select"
                          aria-label={`${day.label}, ${employee.name}`}
                        >
                          <option value="">Chọn mã</option>
                          {SHIFT_CODES.map(option => (
                            <option key={option.code} value={option.code}>{option.code}</option>
                          ))}
                        </select>
                      </td>
                    );
                  })}
                </tr>
              )) : (
                <tr>
                  <td className="shift-employee-empty-cell" colSpan={DAYS.length + 1}>
                    Nhấn “Thêm nhân viên” để bắt đầu xếp lịch.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="shift-code-legend" aria-label="Chú giải mã ca">
          <span className="shift-code-legend-label">Mã ca:</span>
          {SHIFT_CODES.map(option => (
            <span key={option.code} className={`shift-code-badge code-${option.tone}`}>
              <strong>{option.code}</strong>
              <small>{option.label}</small>
            </span>
          ))}
        </div>

        <div className="legacy-shift-table-scroll">
          <table className="shift-roster-table">
            <thead>
              <tr>
                <th className="shift-label-header">Ca trực</th>
                {DAYS.map(day => (
                  <th key={day.key} className={day.isWeekend ? 'is-weekend' : ''}>
                    <span className="shift-day-short">{day.shortLabel}</span>
                    <span className="shift-day-full">{day.label}</span>
                    {day.isWeekend && <small>Cuối tuần</small>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SHIFT_ROWS.map(shift => (
                <tr key={shift.key}>
                  <th className={`shift-label-cell ${shift.tone}`}>
                    <span className="shift-number">{shift.number}</span>
                    <div>
                      <strong>{shift.label}</strong>
                      <span>{shift.note}</span>
                      <small>Chuẩn: {selectedStore.shifts.weekday[shift.key]}</small>
                    </div>
                  </th>
                  {DAYS.map(day => {
                    const daySchedule = getStoreShift(
                      selectedStore,
                      day.isWeekend ? 'weekend' : 'weekday',
                      day.key
                    );
                    const hours = daySchedule[shift.key];
                    const names = getShiftNames(shift.key, day.key);
                    const assignedCount = names.filter(name => name.trim()).length;

                    return (
                      <td key={day.key} className={`shift-edit-cell ${shift.tone} ${assignedCount ? 'has-assignees' : ''}`}>
                        <div className="shift-cell-heading">
                          <span>{assignedCount ? `${assignedCount} người` : 'Chưa xếp'}</span>
                          <strong className="shift-cell-hours">{hours}</strong>
                        </div>
                        <div className="shift-input-stack">
                          {names.map((name, index) => (
                            <div className="shift-input-row" key={`${day.key}-${shift.key}-${index}`}>
                              <UsersRound size={14} aria-hidden="true" />
                              <input
                                type="text"
                                value={name}
                                onChange={event => updateName(shift.key, day.key, index, event.target.value, names)}
                                placeholder={`Nhân sự ${index + 1}`}
                                aria-label={`${shift.label}, ${day.label}, nhân sự ${index + 1}`}
                              />
                              {names.length > 1 && (
                                <button
                                  type="button"
                                  className="shift-remove-button"
                                  onClick={() => removeName(shift.key, day.key, index, names)}
                                  aria-label={`Xóa nhân sự ${index + 1}`}
                                  title="Xóa nhân sự"
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            className="shift-add-button"
                            onClick={() => addName(shift.key, day.key, names)}
                            aria-label={`Thêm nhân sự cho ${shift.label}, ${day.label}`}
                            title="Thêm nhân sự"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="shift-handover-row">
                <th className="shift-label-cell handover">
                  <span className="shift-number"><Clock3 size={15} /></span>
                  <div>
                    <strong>Giao ca</strong>
                    <span>Khung giờ bàn giao</span>
                    <small>Thời lượng chuẩn</small>
                  </div>
                </th>
                {DAYS.map(day => {
                  const daySchedule = getStoreShift(
                    selectedStore,
                    day.isWeekend ? 'weekend' : 'weekday',
                    day.key
                  );
                  const handover = daySchedule.handover;

                  return (
                    <td key={day.key} className="shift-handover-cell">
                      <HandoverChip value={handover} />
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="shift-roster-footer">
          <span>Cuộn ngang để xem đầy đủ các ngày trên màn hình nhỏ.</span>
          <span className="shift-footer-key"><span className="shift-footer-dot" /> Khung giờ được lấy tự động theo cửa hàng</span>
        </div>
      </section>

      <section className="shift-break-card">
        <div className="shift-content-heading">
          <div className="shift-section-icon"><Clock3 size={18} /></div>
          <div>
            <span className="shift-eyebrow">Quy định vận hành</span>
            <h2>Lịch nghỉ giữa ca</h2>
            <p>Khung giờ nghỉ ăn tiêu chuẩn để đảm bảo luôn đủ nhân sự phục vụ khách.</p>
          </div>
        </div>
        <div className="shift-break-grid">
          {BREAK_RULES.map(rule => (
            <div className="shift-break-item" key={rule.title}>
              <span>{rule.title}</span>
              <strong>{rule.time}</strong>
              <small>{rule.detail}</small>
            </div>
          ))}
          <div className="shift-break-note">
            <Info size={17} />
            <p><strong>Lưu ý:</strong> Nếu có nhiều nhân sự, có thể chia thành hai lượt để đảm bảo quầy luôn có người phục vụ.</p>
          </div>
        </div>
      </section>

      <section className="shift-directory-card">
        <div className="shift-content-heading">
          <div className="shift-section-icon"><Table2 size={18} /></div>
          <div>
            <span className="shift-eyebrow">Tra cứu hệ thống</span>
            <h2>Danh mục ca làm việc</h2>
            <p>Tham khảo giờ hoạt động và khung giờ giao ca của các cửa hàng trong khu vực.</p>
          </div>
        </div>
        <div className="shift-directory-list">
          <DirectoryTable
            stores={filteredStores}
            scheduleKey="weekday"
            title="Ngày thường / Thứ 2 – Thứ 6"
          />
          <DirectoryTable
            stores={filteredStores}
            scheduleKey="weekend"
            title="Cuối tuần / Thứ 7 – Chủ Nhật"
          />
        </div>
      </section>

      <section className="shift-policy-card">
        <div className="shift-policy-heading">
          <Info size={17} />
          <strong>Quy định đi ca và chấm công</strong>
        </div>
        <ol>
          <li>Nhân viên ca sáng vào sớm hơn giờ hoạt động cửa hàng 1 tiếng để dọn dẹp và chuẩn bị mở cửa.</li>
          <li>Ca chiều hoàn tất đi ăn trước 17h; cả hai ca cần chấm vân tay khi đi ăn.</li>
          <li>Giờ làm việc không bao gồm thời gian trang điểm và ăn sáng. Nếu cần, hãy đến sớm hơn 30 phút.</li>
        </ol>
      </section>
    </div>
  );
}
