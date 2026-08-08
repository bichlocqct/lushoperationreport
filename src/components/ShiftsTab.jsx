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
import { STORES } from '../data/initialData';

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
  setWeeklyShifts
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

  const scheduleStats = useMemo(() => {
    const assigned = SHIFT_ROWS.reduce((total, shift) => {
      return total + DAYS.reduce((dayTotal, day) => {
        const value = weeklyShifts[selectedStoreId]?.[shift.key]?.[day.key] || '';
        return dayTotal + value.split(';;').filter(name => name.trim()).length;
      }, 0);
    }, 0);

    return { assigned, shiftCount: SHIFT_ROWS.length, dayCount: DAYS.length };
  }, [selectedStoreId, weeklyShifts]);

  const handleRegionChange = (region) => {
    setActiveRegion(region);
    const regionalStores = STORES.filter(store => store.region === region);
    if (regionalStores.length > 0) setSelectedStoreId(regionalStores[0].id);
  };

  const updateShiftState = (shiftKey, dayKey, value) => {
    setWeeklyShifts(prev => {
      const storeData = prev[selectedStoreId] || {};
      const shiftData = storeData[shiftKey] || {};

      return {
        ...prev,
        [selectedStoreId]: {
          ...storeData,
          [shiftKey]: { ...shiftData, [dayKey]: value }
        }
      };
    });
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
    updateShiftState(
      shiftKey,
      dayKey,
      names.filter((_, nameIndex) => nameIndex !== index).join(';;')
    );
  };

  const handleResetWeeklyShifts = () => {
    if (!window.confirm('Đặt lại toàn bộ bảng phân ca của cửa hàng này?')) return;

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
              <p>Nhập tên nhân sự vào từng ngày. Khung giờ và thời gian giao ca được tự động hiển thị.</p>
            </div>
          </div>
          <button type="button" onClick={handleResetWeeklyShifts} className="shift-reset-button">
            <RotateCcw size={14} />
            <span>Đặt lại lịch</span>
          </button>
        </div>

        <div className="shift-roster-toolbar">
          <div className="shift-toolbar-note">
            <Info size={15} />
            <span>Mỗi ô có thể thêm nhiều nhân sự. Nhấn <strong>Thêm nhân sự</strong> khi cần bổ sung.</span>
          </div>
          <div className="shift-toolbar-status">
            <CheckCircle2 size={15} />
            <span>{scheduleStats.assigned > 0 ? 'Đã cập nhật lịch' : 'Chưa có nhân sự được xếp'}</span>
          </div>
        </div>

        <div className="shift-table-scroll">
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
                    const hours = day.isWeekend
                      ? selectedStore.shifts.weekend[shift.key]
                      : selectedStore.shifts.weekday[shift.key];
                    const names = getShiftNames(shift.key, day.key);
                    const assignedCount = names.filter(name => name.trim()).length;

                    return (
                      <td key={day.key} className={`shift-edit-cell ${shift.tone} ${assignedCount ? 'has-assignees' : ''}`}>
                        <div className="shift-cell-heading">
                          <span>{assignedCount ? `${assignedCount} người` : 'Chưa xếp'}</span>
                          <small>{hours}</small>
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
                          >
                            <Plus size={13} />
                            <span>Thêm nhân sự</span>
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
                  const handover = day.isWeekend
                    ? selectedStore.shifts.weekend.handover
                    : selectedStore.shifts.weekday.handover;

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
