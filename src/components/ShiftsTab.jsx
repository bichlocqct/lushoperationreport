import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Table, RefreshCw, Calendar } from 'lucide-react';
import { STORES } from '../data/initialData';

const DAYS = [
  { key: 'monday', label: 'Thứ 2', isWeekend: false },
  { key: 'tuesday', label: 'Thứ 3', isWeekend: false },
  { key: 'wednesday', label: 'Thứ 4', isWeekend: false },
  { key: 'thursday', label: 'Thứ 5', isWeekend: false },
  { key: 'friday', label: 'Thứ 6', isWeekend: false },
  { key: 'saturday', label: 'Thứ 7', isWeekend: true },
  { key: 'sunday', label: 'Chủ Nhật', isWeekend: true }
];

export default function ShiftsTab({ 
  selectedStoreId, 
  setSelectedStoreId, 
  weeklyShifts = {}, 
  setWeeklyShifts 
}) {
  const selectedStore = STORES.find(store => store.id === selectedStoreId) || STORES[0];
  const [activeRegion, setActiveRegion] = useState(selectedStore.region);

  // Sync active region with selected store on load
  useEffect(() => {
    if (selectedStore) {
      setActiveRegion(selectedStore.region);
    }
  }, [selectedStoreId]);

  const formatHandoverTime = (timeStr) => {
    if (!timeStr) return null;
    if (timeStr.includes('(')) {
      const parts = timeStr.split('(');
      const timeRange = parts[0].trim();
      const duration = parts[1].replace(')', '').trim();
      return (
        <div className="flex flex-col items-center justify-center leading-normal">
          <span className="font-mono font-bold text-[9px] text-slate-800 block whitespace-nowrap">{timeRange}</span>
          <span className="text-[8px] text-text-muted font-bold block mt-0.5 whitespace-nowrap bg-slate-100 border border-slate-200/60 px-1.5 py-0.5 rounded-full">
            {duration}
          </span>
        </div>
      );
    }
    return <span className="font-mono font-bold text-[9px] text-slate-800 block whitespace-nowrap">{timeStr}</span>;
  };

  const formatLeftHandover = (timeStr) => {
    if (!timeStr) return null;
    if (timeStr.includes('(')) {
      const parts = timeStr.split('(');
      const timeRange = parts[0].trim();
      const duration = parts[1].replace(')', '').trim();
      return (
        <div className="mt-0.5 leading-tight">
          <span className="text-[9px] text-text-muted block">Giao ca chuẩn:</span>
          <span className="text-[10px] text-text-dark font-mono font-bold block mt-0.5 whitespace-nowrap">{timeRange}</span>
          <span className="text-[9px] text-text-muted font-medium block whitespace-nowrap">({duration})</span>
        </div>
      );
    }
    return <span className="text-[9px] text-text-dark font-semibold mt-0.5 block">{timeStr}</span>;
  };

  const formatDirectoryHandover = (timeStr) => {
    if (!timeStr) return null;
    if (timeStr.includes('(')) {
      const parts = timeStr.split('(');
      const timeRange = parts[0].trim();
      const duration = parts[1].replace(')', '').trim();
      return (
        <span className="text-xs whitespace-nowrap">
          <strong className="font-mono text-slate-800">{timeRange}</strong> <span className="text-[10px] text-text-muted">({duration})</span>
        </span>
      );
    }
    return <span className="text-xs font-mono font-bold text-slate-800">{timeStr}</span>;
  };

  const handleRegionChange = (region) => {
    setActiveRegion(region);
    const regionalStores = STORES.filter(store => store.region === region);
    if (regionalStores.length > 0) {
      // Auto-select first store of selected region
      setSelectedStoreId(regionalStores[0].id);
    }
  };

  const handleShiftNameChange = (shiftKey, dayKey, index, value, currentArray) => {
    const nextArray = [...currentArray];
    nextArray[index] = value;
    const joinedValue = nextArray.join(';;');
    updateShiftState(shiftKey, dayKey, joinedValue);
  };

  const handleAddNameField = (shiftKey, dayKey, currentArray) => {
    const nextArray = [...currentArray, ''];
    const joinedValue = nextArray.join(';;');
    updateShiftState(shiftKey, dayKey, joinedValue);
  };

  const handleRemoveNameField = (shiftKey, dayKey, index, currentArray) => {
    const nextArray = currentArray.filter((_, i) => i !== index);
    const joinedValue = nextArray.join(';;');
    updateShiftState(shiftKey, dayKey, joinedValue);
  };

  const updateShiftState = (shiftKey, dayKey, value) => {
    setWeeklyShifts(prev => {
      const storeData = prev[selectedStoreId] || {};
      const shiftData = storeData[shiftKey] || {};
      return {
        ...prev,
        [selectedStoreId]: {
          ...storeData,
          [shiftKey]: {
            ...shiftData,
            [dayKey]: value
          }
        }
      };
    });
  };

  const getShiftValue = (shiftKey, dayKey) => {
    return weeklyShifts[selectedStoreId]?.[shiftKey]?.[dayKey] || '';
  };

  const handleResetWeeklyShifts = () => {
    if (window.confirm('Đặt lại toàn bộ bảng phân ca làm việc trong tuần của cửa hàng này?')) {
      setWeeklyShifts(prev => {
        const next = { ...prev };
        delete next[selectedStoreId];
        return next;
      });
    }
  };

  const filteredStores = STORES.filter(store => store.region === activeRegion);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* PDF Styled Section Header Bar */}
      <div className="pdf-section-header">
        <span>CA LÀM VIỆC TẠI CỬA HÀNG</span>
        <span className="pdf-section-header-sub">Chapter 3 • Daily Operation Report</span>
      </div>

      {/* Region Selector (Placed prominently ABOVE the Store Selector) */}
      <div className="bento-card bg-slate-50/50 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-display font-bold uppercase tracking-wider text-black">
              Chọn khu vực & Cửa hàng làm việc
            </h4>
          </div>

          {/* Region Filter Chips */}
          <div className="subtabs-container">
            {['HCM', 'HN'].map(reg => {
              const isActive = activeRegion === reg;
              return (
                <button
                  key={reg}
                  onClick={() => handleRegionChange(reg)}
                  className={`subtab-btn ${isActive ? 'active' : ''}`}
                >
                  {reg === 'HCM' ? 'Hồ Chí Minh' : 'Hà Nội'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Store Selector Dropdown */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2 border-t border-light">
          <label className="text-xs font-display font-bold uppercase tracking-wider text-text-dark flex items-center gap-1.5">
            <MapPin size={14} className="text-emerald-600" />
            Cửa hàng hoạt động:
          </label>
          <select
            value={selectedStoreId}
            onChange={(e) => setSelectedStoreId(e.target.value)}
            className="select-box bg-white font-display text-xs font-bold border border-medium cursor-pointer uppercase tracking-wider w-80"
          >
            {filteredStores.map(store => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200/60 text-text-muted text-[10px] font-bold tracking-wide uppercase whitespace-nowrap mt-1 sm:mt-0">
            <Clock size={11} className="text-slate-500" />
            Thời gian mở cửa: {selectedStore.hours.weekday}
          </span>
        </div>
      </div>

      {/* Interactive Weekly Shift Roster Sheet */}
      <div className="bento-card space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-light pb-3">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-emerald-600" />
            <div>
              <h3 className="text-sm font-display font-bold uppercase tracking-wider text-text-dark">
                Bảng Phân Ca Làm Việc Trong Tuần (Weekly Shift Roster)
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Nhập tên nhân viên tương ứng vào ca trực của từng ngày. Khung giờ ca sẽ tự động hiển thị phía dưới ô nhập.
              </p>
            </div>
          </div>
          <button 
            onClick={handleResetWeeklyShifts}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-emerald-600 font-display font-bold uppercase tracking-wider transition-colors"
          >
            <RefreshCw size={12} />
            Đặt lại lịch trực
          </button>
        </div>

        {/* Weekly Shifts Grid */}
        <div className="table-container overflow-x-auto">
          <table className="lush-table text-left w-full border-collapse">
            <thead>
              <tr>
                <th className="p-3 text-xs font-bold border-b border-medium min-w-[180px]">Ca trực</th>
                {DAYS.map(day => (
                  <th key={day.key} className="p-3 text-xs font-bold border-b border-medium text-center min-w-[130px]">
                    {day.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Morning Shift */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 border-b border-medium">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-text-dark">Ca sáng</span>
                    <span className="text-[9px] text-text-muted">Giờ chuẩn: {selectedStore.shifts.weekday.morning}</span>
                  </div>
                </td>
                {DAYS.map(day => {
                  const hours = day.isWeekend 
                    ? selectedStore.shifts.weekend.morning 
                    : selectedStore.shifts.weekday.morning;
                  const val = getShiftValue('morning', day.key);
                  const nameArray = typeof val === 'string' && val ? val.split(';;') : [''];
                  return (
                    <td key={day.key} className="p-2 border-b border-medium cell-highlight">
                      <div className="flex flex-col gap-1.5 items-center w-full min-w-[130px]">
                        {nameArray.map((name, idx) => (
                          <div key={idx} className="flex items-center gap-1 w-full px-1">
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => handleShiftNameChange('morning', day.key, idx, e.target.value, nameArray)}
                              placeholder={`Nhân sự ${idx + 1}`}
                              className="table-input text-center font-semibold text-[10px] h-[26px] py-0 px-2 border border-slate-200 focus:border-emerald-500 rounded bg-white w-full"
                            />
                            {nameArray.length > 1 && (
                              <button
                                onClick={() => handleRemoveNameField('morning', day.key, idx, nameArray)}
                                className="text-red-500 hover:text-red-700 text-xs font-bold px-1 transition-colors"
                                title="Xóa nhân sự"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddNameField('morning', day.key, nameArray)}
                          className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-0.5 rounded border border-emerald-100 transition-colors w-fit"
                        >
                          +
                        </button>
                        <span className="text-[8px] text-text-muted mt-0.5 font-mono whitespace-nowrap">{hours}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Middle Shift */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 border-b border-medium">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-text-dark">Ca giữa</span>
                    <span className="text-[9px] text-text-muted">Giờ chuẩn: {selectedStore.shifts.weekday.middle}</span>
                  </div>
                </td>
                {DAYS.map(day => {
                  const hours = day.isWeekend 
                    ? selectedStore.shifts.weekend.middle 
                    : selectedStore.shifts.weekday.middle;
                  const val = getShiftValue('middle', day.key);
                  const nameArray = typeof val === 'string' && val ? val.split(';;') : [''];
                  return (
                    <td key={day.key} className="p-2 border-b border-medium cell-highlight">
                      <div className="flex flex-col gap-1.5 items-center w-full min-w-[130px]">
                        {nameArray.map((name, idx) => (
                          <div key={idx} className="flex items-center gap-1 w-full px-1">
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => handleShiftNameChange('middle', day.key, idx, e.target.value, nameArray)}
                              placeholder={`Nhân sự ${idx + 1}`}
                              className="table-input text-center font-semibold text-[10px] h-[26px] py-0 px-2 border border-slate-200 focus:border-emerald-500 rounded bg-white w-full"
                            />
                            {nameArray.length > 1 && (
                              <button
                                onClick={() => handleRemoveNameField('middle', day.key, idx, nameArray)}
                                className="text-red-500 hover:text-red-700 text-xs font-bold px-1 transition-colors"
                                title="Xóa nhân sự"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddNameField('middle', day.key, nameArray)}
                          className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-0.5 rounded border border-emerald-100 transition-colors w-fit"
                        >
                          +
                        </button>
                        <span className="text-[8px] text-text-muted mt-0.5 font-mono whitespace-nowrap">{hours}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Afternoon Shift */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 border-b border-medium">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-text-dark">Ca chiều</span>
                    <span className="text-[9px] text-text-muted">Giờ chuẩn: {selectedStore.shifts.weekday.afternoon}</span>
                  </div>
                </td>
                {DAYS.map(day => {
                  const hours = day.isWeekend 
                    ? selectedStore.shifts.weekend.afternoon 
                    : selectedStore.shifts.weekday.afternoon;
                  const val = getShiftValue('afternoon', day.key);
                  const nameArray = typeof val === 'string' && val ? val.split(';;') : [''];
                  return (
                    <td key={day.key} className="p-2 border-b border-medium cell-highlight">
                      <div className="flex flex-col gap-1.5 items-center w-full min-w-[130px]">
                        {nameArray.map((name, idx) => (
                          <div key={idx} className="flex items-center gap-1 w-full px-1">
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => handleShiftNameChange('afternoon', day.key, idx, e.target.value, nameArray)}
                              placeholder={`Nhân sự ${idx + 1}`}
                              className="table-input text-center font-semibold text-[10px] h-[26px] py-0 px-2 border border-slate-200 focus:border-emerald-500 rounded bg-white w-full"
                            />
                            {nameArray.length > 1 && (
                              <button
                                onClick={() => handleRemoveNameField('afternoon', day.key, idx, nameArray)}
                                className="text-red-500 hover:text-red-700 text-xs font-bold px-1 transition-colors"
                                title="Xóa nhân sự"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddNameField('afternoon', day.key, nameArray)}
                          className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-0.5 rounded border border-emerald-100 transition-colors w-fit"
                        >
                          +
                        </button>
                        <span className="text-[8px] text-text-muted mt-0.5 font-mono whitespace-nowrap">{hours}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Handover Time (Static, no input box) */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 border-b border-medium">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">Giờ giao ca</span>
                    {formatLeftHandover(selectedStore.shifts.weekday.handover)}
                  </div>
                </td>
                {DAYS.map(day => {
                  const hours = day.isWeekend 
                    ? selectedStore.shifts.weekend.handover 
                    : selectedStore.shifts.weekday.handover;
                  return (
                    <td key={day.key} className="p-2 border-b border-medium text-center">
                      {formatHandoverTime(hours)}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Lịch nghỉ giữa ca (Quy định giờ đi ăn - Slide 16) */}
      <div className="bento-card space-y-4">
        <div className="flex items-center gap-2 border-b border-light pb-2">
          <Clock size={16} className="text-emerald-600 animate-pulse" />
          <div>
            <h3 className="text-sm font-display font-bold uppercase tracking-wider text-text-dark">
              Lịch Nghỉ Giữa Ca (Quy Định Giờ Đi Ăn)
            </h3>
            <p className="text-xs text-text-muted mt-0.5">Thời gian đi ăn tiêu chuẩn cho từng ca làm việc tại cửa hàng.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 table-container">
            <table className="lush-table text-left w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-xs font-bold border-b border-medium w-1/2">Ca sáng</th>
                  <th className="p-2 text-xs font-bold border-b border-medium w-1/2">Ca chiều</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-2 border-b border-medium text-xs font-semibold text-slate-800">
                    12h - 12h30: <span className="font-normal text-text-muted">1 nhân sự ca sáng</span>
                  </td>
                  <td className="p-2 border-b border-medium text-xs font-semibold text-slate-800">
                    15h - 15h30: <span className="font-normal text-text-muted">1 nhân sự ca chiều</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-2 border-b border-medium text-xs font-semibold text-slate-800">
                    12h30 - 13h: <span className="font-normal text-text-muted">1 nhân sự ca sáng</span>
                  </td>
                  <td className="p-2 border-b border-medium text-xs font-semibold text-slate-800">
                    15h30 - 16h: <span className="font-normal text-text-muted">1 nhân sự ca chiều</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-2 border-b border-medium text-xs font-semibold text-slate-800">
                    13h30 - 14h: <span className="font-normal text-text-muted">1 nhân sự ca giữa</span>
                  </td>
                  <td className="p-2 border-b border-medium text-xs font-semibold text-slate-800">
                    16h30 - 17h: <span className="font-normal text-text-muted">1 nhân sự ca chiều</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="md:col-span-1 border-l-4 border-emerald-500 bg-emerald-50 bg-opacity-40 p-4 rounded-r-lg flex items-center border-t border-b border-r border-emerald-100/50">
            <p className="text-[11px] text-emerald-950 leading-relaxed font-semibold">
              💡 <strong>Lưu ý quan trọng:</strong> Nếu có nhiều nhân sự hơn thì đẩy đi ăn sớm hơn hoặc sắp xếp đi ăn 1 lần 2 người nếu có thể để đảm bảo nhân lực phục vụ khách tại cửa hàng.
            </p>
          </div>
        </div>
      </div>

      {/* Directory of all Stores (Slide 12-15 replica) */}
      <div className="bento-card space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-light pb-3">
          <div className="flex items-center gap-2">
            <Table size={18} className="text-emerald-600" />
            <div>
              <h3 className="text-sm font-display font-bold uppercase tracking-wider text-text-dark">
                Danh Mục Ca Làm Việc Toàn Hệ Thống ({activeRegion === 'HCM' ? 'Hồ Chí Minh' : 'Hà Nội'})
              </h3>
              <p className="text-xs text-text-muted mt-0.5">Bảng tra cứu giờ hoạt động và giờ giao ca của các cửa hàng.</p>
            </div>
          </div>
        </div>

        {/* Dynamic Regional Shifts directory tables */}
        <div className="space-y-6 pt-2">
          {/* Weekday Table */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold font-display uppercase tracking-wider text-emerald-800 bg-emerald-50 w-fit px-2.5 py-1 rounded-full border border-emerald-100 block">
              Lịch trực ngày thường (Thứ 2 - Thứ 6)
            </span>
            <div className="table-container overflow-x-auto">
              <table className="lush-table text-left w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-3 text-xs font-bold border-b border-medium min-w-[180px]">Cửa hàng</th>
                    <th className="p-3 text-xs font-bold border-b border-medium">Thời gian hoạt động</th>
                    <th className="p-3 text-xs font-bold border-b border-medium">Ca sáng</th>
                    <th className="p-3 text-xs font-bold border-b border-medium">Ca giữa</th>
                    <th className="p-3 text-xs font-bold border-b border-medium">Ca chiều</th>
                    <th className="p-3 text-xs font-bold border-b border-medium min-w-[150px]">Giờ giao ca</th>
                  </tr>
                </thead>
                <tbody>
                  {STORES.filter(store => store.region === activeRegion).map(store => (
                    <tr key={store.id} className="hover:bg-slate-50/50">
                      <td className="p-3 border-b border-medium font-bold text-xs text-text-dark">{store.name}</td>
                      <td className="p-3 border-b border-medium text-xs font-mono font-semibold">{store.hours.weekday}</td>
                      <td className="p-3 border-b border-medium text-xs font-mono">{store.shifts.weekday.morning}</td>
                      <td className="p-3 border-b border-medium text-xs font-mono">{store.shifts.weekday.middle}</td>
                      <td className="p-3 border-b border-medium text-xs font-mono">{store.shifts.weekday.afternoon}</td>
                      <td className="p-3 border-b border-medium">{formatDirectoryHandover(store.shifts.weekday.handover)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Weekend Table */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold font-display uppercase tracking-wider text-indigo-800 bg-indigo-50 w-fit px-2.5 py-1 rounded-full border border-indigo-100 block">
              Lịch trực cuối tuần (Thứ 7 - Chủ Nhật)
            </span>
            <div className="table-container overflow-x-auto">
              <table className="lush-table text-left w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-3 text-xs font-bold border-b border-medium min-w-[180px]">Cửa hàng</th>
                    <th className="p-3 text-xs font-bold border-b border-medium">Thời gian hoạt động</th>
                    <th className="p-3 text-xs font-bold border-b border-medium">Ca sáng</th>
                    <th className="p-3 text-xs font-bold border-b border-medium">Ca giữa</th>
                    <th className="p-3 text-xs font-bold border-b border-medium">Ca chiều</th>
                    <th className="p-3 text-xs font-bold border-b border-medium min-w-[150px]">Giờ giao ca</th>
                  </tr>
                </thead>
                <tbody>
                  {STORES.filter(store => store.region === activeRegion).map(store => (
                    <tr key={store.id} className="hover:bg-slate-50/50">
                      <td className="p-3 border-b border-medium font-bold text-xs text-text-dark">{store.name}</td>
                      <td className="p-3 border-b border-medium text-xs font-mono font-semibold">{store.hours.weekend}</td>
                      <td className="p-3 border-b border-medium text-xs font-mono">{store.shifts.weekend.morning}</td>
                      <td className="p-3 border-b border-medium text-xs font-mono">{store.shifts.weekend.middle}</td>
                      <td className="p-3 border-b border-medium text-xs font-mono">{store.shifts.weekend.afternoon}</td>
                      <td className="p-3 border-b border-medium">{formatDirectoryHandover(store.shifts.weekend.handover)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Highlighted Important Policy Notes (Slide 16) */}
      <div className="border-l-4 border-amber-500 bg-amber-50/50 rounded-r-xl p-5 border-t border-b border-r border-amber-100/50 space-y-3">
        <h4 className="text-xs font-display font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
          ⚠️ Quy định đi ca & chấm công đặc thù
        </h4>
        <ol className="space-y-3 text-xs text-amber-900 pl-4 list-decimal font-semibold leading-relaxed">
          <li>Nhân viên ca sáng vô sớm hơn giờ hoạt động cửa hàng 1 tiếng để dọn dẹp vệ sinh và chuẩn bị mở cửa.</li>
          <li>Ca chiều hoàn tất đi ăn trước 17h và cả 2 ca có bấm vân tay khi đi ăn.</li>
          <li>Giờ làm việc không bao gồm giờ trang điểm và ăn sáng. Nếu có thì đi sớm hơn giờ làm việc 30 phút để thực hiện.</li>
        </ol>
      </div>
    </div>
  );
}
