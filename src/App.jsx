import React, { useState, useEffect } from 'react';
import lushLogo from './assets/lush-logo.png';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  TrendingUp, 
  Users, 
  Clock, 
  History, 
  FileText, 
  MapPin, 
  User, 
  RotateCcw,
  Sparkles,
  Calendar,
  Coffee
} from 'lucide-react';

import { STORES, SHELF_DIVISION, POSITION_DIVISION, OPENING_CHECKLIST_TEMPLATE } from './data/initialData';
import ChecklistsTab from './components/ChecklistsTab';
import ShiftsTab from './components/ShiftsTab';
import ShelvesTab from './components/ShelvesTab';
import PositionsTab from './components/PositionsTab';
import ReportModal from './components/ReportModal';
import HistoryTab from './components/HistoryTab';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedStoreId, setSelectedStoreId] = useState('dong-khoi');
  const [shiftLeader, setShiftLeader] = useState('');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Checklist State
  const [openingChecks, setOpeningChecks] = useState({});
  const [openingNotes, setOpeningNotes] = useState({});
  const [sellingChecks, setSellingChecks] = useState({});
  const [sellingNotes, setSellingNotes] = useState({});
  
  // KPI values: { sales: { target: '', actual: '', actionPlan: '' } }
  const [kpiValues, setKpiValues] = useState({});
  
  // Roster State
  const [rosterShelf, setRosterShelf] = useState(SHELF_DIVISION.map(item => ({ ...item, staff: item.defaultStaff })));
  const [rosterPos, setRosterPos] = useState(POSITION_DIVISION.map(item => ({ ...item, staff: item.defaultStaff })));
  
  // Weekly Lunch Schedule State: { [storeId]: { [slotKey]: { [day]: '' } } }
  const [lunchStaff, setLunchStaff] = useState({});
  
  // Weekly Store Shifts Roster State: { [storeId]: { [shiftKey]: { [day]: '' } } }
  const [weeklyShifts, setWeeklyShifts] = useState({});
  
  // Reports History
  const [reports, setReports] = useState([]);
  
  // Modal visibility
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Load reports and today's session from localStorage on mount
  useEffect(() => {
    const savedReports = localStorage.getItem('lush_operation_reports');
    if (savedReports) {
      try {
        setReports(JSON.parse(savedReports));
      } catch (e) {
        console.error('Error parsing reports from localStorage', e);
      }
    }

    const savedLunchStaff = localStorage.getItem('lush_lunch_staff');
    if (savedLunchStaff) {
      try {
        setLunchStaff(JSON.parse(savedLunchStaff));
      } catch (e) {
        console.error('Error parsing lunch staff from localStorage', e);
      }
    }

    const savedWeeklyShifts = localStorage.getItem('lush_weekly_shifts');
    if (savedWeeklyShifts) {
      try {
        setWeeklyShifts(JSON.parse(savedWeeklyShifts));
      } catch (e) {
        console.error('Error parsing weekly shifts from localStorage', e);
      }
    }

    // Load active session if matches today
    const savedSession = localStorage.getItem('lush_active_session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (session.date === new Date().toISOString().split('T')[0]) {
          if (session.storeId) setSelectedStoreId(session.storeId);
          if (session.leader) setShiftLeader(session.leader);
          if (session.openingChecks) setOpeningChecks(session.openingChecks);
          if (session.openingNotes) setOpeningNotes(session.openingNotes);
          if (session.sellingChecks) setSellingChecks(session.sellingChecks);
          if (session.sellingNotes) setSellingNotes(session.sellingNotes);
          if (session.kpiValues) setKpiValues(session.kpiValues);
          if (session.rosterShelf) setRosterShelf(session.rosterShelf);
          if (session.rosterPos) setRosterPos(session.rosterPos);
        }
      } catch (e) {
        console.error('Error parsing session from localStorage', e);
      }
    }
  }, []);

  // Save session state to localStorage on modification
  useEffect(() => {
    const sessionData = {
      date: new Date().toISOString().split('T')[0],
      storeId: selectedStoreId,
      leader: shiftLeader,
      openingChecks,
      openingNotes,
      sellingChecks,
      sellingNotes,
      kpiValues,
      rosterShelf,
      rosterPos
    };
    localStorage.setItem('lush_active_session', JSON.stringify(sessionData));
  }, [
    selectedStoreId, 
    shiftLeader, 
    openingChecks, 
    openingNotes, 
    sellingChecks, 
    sellingNotes, 
    kpiValues, 
    rosterShelf, 
    rosterPos
  ]);

  // Save weekly lunch schedule independently
  useEffect(() => {
    localStorage.setItem('lush_lunch_staff', JSON.stringify(lunchStaff));
  }, [lunchStaff]);

  // Save weekly store shifts independently
  useEffect(() => {
    localStorage.setItem('lush_weekly_shifts', JSON.stringify(weeklyShifts));
  }, [weeklyShifts]);

  const handleSaveReport = (newReport) => {
    const updatedReports = [newReport, ...reports];
    setReports(updatedReports);
    localStorage.setItem('lush_operation_reports', JSON.stringify(updatedReports));
  };

  const handleDeleteReport = (reportId) => {
    const updatedReports = reports.filter(r => r.id !== reportId);
    setReports(updatedReports);
    localStorage.setItem('lush_operation_reports', JSON.stringify(updatedReports));
  };

  const handleClearForm = () => {
    if (window.confirm('Bạn có muốn xóa toàn bộ biểu mẫu hôm nay? (Lịch sử đã lưu sẽ được giữ lại)')) {
      setOpeningChecks({});
      setOpeningNotes({});
      setSellingChecks({});
      setSellingNotes({});
      setKpiValues({});
      setShiftLeader('');
      setRosterShelf(SHELF_DIVISION.map(item => ({ ...item, staff: item.defaultStaff })));
      setRosterPos(POSITION_DIVISION.map(item => ({ ...item, staff: item.defaultStaff })));
      localStorage.removeItem('lush_active_session');
    }
  };

  const selectedStore = STORES.find(store => store.id === selectedStoreId) || STORES[0];

  // Calculations for stats
  const totalOpening = OPENING_CHECKLIST_TEMPLATE.length;
  const completedOpening = OPENING_CHECKLIST_TEMPLATE.filter(item => openingChecks[item.id]).length;
  const openingProgress = Math.round((completedOpening / totalOpening) * 100);

  // Compute average KPI progress
  const kpiKeys = Object.keys(kpiValues);
  let averageKpiProgress = 0;
  let activeKpisCount = 0;
  
  kpiKeys.forEach(key => {
    const vals = kpiValues[key];
    if (vals && vals.target && vals.actual) {
      const targetVal = parseFloat(vals.target);
      const actualVal = parseFloat(vals.actual);
      if (targetVal > 0) {
        averageKpiProgress += (actualVal / targetVal) * 100;
        activeKpisCount++;
      }
    }
  });
  const kpiProgressPercent = activeKpisCount > 0 ? Math.round(averageKpiProgress / activeKpisCount) : 0;

  const getShelfBadgeClass = (area) => {
    const norm = area.toLowerCase();
    if (norm.includes('shower')) return 'badge-shelf-shower';
    if (norm.includes('hair')) return 'badge-shelf-hair';
    if (norm.includes('fragrance') || norm.includes('gift')) return 'badge-shelf-fragrance';
    if (norm.includes('face')) return 'badge-shelf-face';
    if (norm.includes('hand') || norm.includes('body')) return 'badge-shelf-handbody';
    return 'badge-shelf-cashier';
  };
  const getPosBadgeClass = (pos) => {
    const norm = pos.toLowerCase();
    if (norm.includes('tester')) return 'badge-pos-tester';
    if (norm.includes('kho')) return 'badge-pos-kho';
    if (norm.includes('vmd')) return 'badge-pos-vmd';
    if (norm.includes('vệ sinh')) return 'badge-pos-vesinh';
    return 'badge-bw';
  };

  return (
    <div className="app-layout">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand-wrapper">
            <img 
              src={lushLogo} 
              alt="LUSH Logo" 
              className="lush-logo" 
            />
            <div className="sidebar-brand-sub">Ops Portal</div>
          </div>
        </div>

        {/* Vertical Navigation Link List */}
        <nav className="sidebar-nav">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <LayoutDashboard size={16} />
            Tổng quan
          </button>
          <button 
            onClick={() => setActiveTab('shelves')} 
            className={`nav-item ${activeTab === 'shelves' ? 'active' : ''}`}
          >
            <Users size={16} />
            Phân Chia Kệ
          </button>
          <button 
            onClick={() => setActiveTab('positions')} 
            className={`nav-item ${activeTab === 'positions' ? 'active' : ''}`}
          >
            <Users size={16} />
            Phân Chia Vị Trí
          </button>
          <button 
            onClick={() => setActiveTab('shifts')} 
            className={`nav-item ${activeTab === 'shifts' ? 'active' : ''}`}
          >
            <Clock size={16} />
            Ca Làm Việc Tại CH
          </button>
          <button 
            onClick={() => setActiveTab('checklists')} 
            className={`nav-item ${activeTab === 'checklists' ? 'active' : ''}`}
          >
            <ClipboardCheck size={16} />
            Daily Operation Checklist
          </button>
          <button 
            onClick={() => setActiveTab('history')} 
            className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
          >
            <History size={16} />
            Lịch Sử Báo Cáo
          </button>
        </nav>

        {/* Sidebar Footer (Settings & Action) */}
        <div className="sidebar-footer">
          {/* Quick config */}
          <div className="space-y-2">
            <div>
              <label className="lush-label text-[10px] text-text-muted">Cửa hàng</label>
              <select 
                value={selectedStoreId} 
                onChange={(e) => setSelectedStoreId(e.target.value)}
                className="select-box py-1.5 px-2.5 text-xs bg-bg-inset-dark border-border-dark text-white"
              >
                {STORES.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="lush-label text-[10px] text-text-muted font-display">Trưởng ca (Shift Leader)</label>
              <input 
                type="text" 
                value={shiftLeader}
                onChange={(e) => setShiftLeader(e.target.value)}
                placeholder="Nhập tên trưởng ca..."
                className={`input-text py-1.5 px-2.5 text-xs bg-bg-inset-dark border-border-dark text-white ${!shiftLeader ? 'sidebar-input-pulse' : ''}`}
              />
            </div>
          </div>

          {/* Action button */}
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="btn-white text-xs w-full py-2.5 flex items-center justify-center gap-1.5"
          >
            <FileText size={14} />
            Xuất Báo Cáo
          </button>

          <button 
            onClick={handleClearForm}
            className="text-[10px] text-text-muted hover:text-white transition-colors flex items-center justify-center gap-1 font-display uppercase tracking-wider"
          >
            <RotateCcw size={10} />
            Reset Dữ Liệu Hôm Nay
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="main-content">
        {/* Dynamic Panel renderer */}
        <div className="animate-fadeIn">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Slide 1 Cover Page replica */}
              <div className="sticky-dates-cover rounded-2xl flex flex-col justify-between min-h-[300px]">
                <div className="sticky-dates-logo-wrapper">
                  <svg 
                    className="w-full text-white" 
                    viewBox="348 518 54 24" 
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="LUSH Logo"
                    style={{ filter: 'drop-shadow(0 4px 12px rgba(255, 255, 255, 0.1))' }}
                  >
                    <path 
                      d="M 399.03312,520.35843 L 394.18937,521.10843 L 392.56437,528.98343 L 388.40812,529.13968 L 389.78312,521.79593 L 385.37687,522.35843 L 382.25187,538.45218 L 386.81437,538.45218 L 387.87687,532.67093 L 392.00187,532.67093 L 391.12687,538.45218 L 395.56437,538.45218 L 399.03312,520.35843 z M 378.12687,523.01468 C 377.2556,523.01468 376.34187,523.42968 375.62687,523.79593 C 374.90937,524.16218 373.97312,524.96968 373.56437,525.60843 C 373.1556,526.24717 373.41812,525.77218 373.00187,526.85843 C 373.13934,526.49969 372.40937,528.32468 373.31437,529.48343 C 373.91439,530.25093 374.30187,530.73968 375.75187,531.79593 C 376.7294,532.50719 376.85687,532.63968 377.12687,533.20218 C 377.3819,533.72969 377.37687,534.26718 377.37687,534.79593 C 377.37684,535.18469 377.32062,535.55843 377.00187,535.76468 C 376.65562,535.98843 376.60187,535.96343 376.15812,535.95218 C 375.73184,535.94093 375.38437,535.66968 375.31437,535.23343 C 375.18063,534.37843 375.23312,534.34718 375.22062,533.35843 L 371.50187,533.35843 C 371.50186,533.35844 371.37687,533.86343 371.37687,534.29593 C 371.37685,534.90969 371.41437,535.86093 371.84562,536.92093 C 372.42311,538.33842 373.90812,538.67093 373.90812,538.67093 C 374.36313,538.86592 374.77687,538.90468 375.22062,538.92093 C 375.84436,538.94468 376.08062,538.88718 376.47062,538.85843 C 377.29434,538.79842 377.66812,538.64718 378.25187,538.42093 C 378.83561,538.19593 379.44437,537.80593 379.87687,537.38968 C 380.30938,536.97218 380.61062,536.48218 380.84562,535.92093 C 381.07811,535.35968 381.10437,535.32093 381.22062,534.67093 C 381.38438,533.75594 381.24937,532.50843 380.72062,531.70218 C 380.07652,530.71944 379.51942,530.39993 378.93937,529.82718 C 378.93936,529.82719 377.59312,528.70468 377.34562,528.38968 C 377.0994,528.07469 376.63687,526.97968 377.09562,526.38968 C 377.53686,525.81967 378.76062,525.82093 378.78312,526.76468 C 378.80562,527.70969 378.75187,528.26468 378.75187,528.26468 L 382.31437,528.26468 C 382.31439,528.26468 382.57687,525.61593 382.31437,524.88968 C 382.01314,524.05593 381.33062,523.54593 380.97062,523.38968 L 380.84562,523.35843 C 379.50814,522.92093 379.29562,523.01468 378.12687,523.01468 z M 371.62687,524.13968 L 368.00187,524.60843 L 366.25187,533.26468 C 365.89187,534.74843 365.83937,535.55467 365.50187,535.76468 C 365.14312,535.98968 365.01313,536.12843 364.40812,535.79593 C 363.95812,535.54843 364.07186,535.00718 364.06437,534.67093 L 365.87687,524.95218 L 362.68937,525.32718 L 360.72062,533.82718 C 360.49687,534.95218 360.4519,536.22718 360.84562,537.07718 C 361.27187,537.99968 361.59184,538.32094 362.06437,538.54593 C 362.91687,538.95343 363.39439,539.07718 364.50187,539.07718 C 365.41687,539.07718 365.70564,539.04594 366.59562,538.70218 C 367.58437,538.31968 367.68434,538.22093 368.31437,537.54593 C 368.77812,537.04843 368.84438,536.48343 369.06437,535.79593 C 369.06437,535.79593 369.28312,535.10843 369.26561,534.81467 L 369.62687,533.57718 L 371.62687,524.13968 z M 357.56437,526.07718 L 353.56437,526.67093 L 351.03312,538.95218 L 358.68937,538.95218 L 359.22062,536.01468 L 355.28312,536.01468 L 357.56437,526.07718 z" 
                      fill="#ffffff"
                    />
                  </svg>
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold mt-1" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>Fresh Handmade Cosmetics</div>
                </div>
                <div>
                  <h1 className="sticky-dates-title">Daily Operation Guideline</h1>
                  <p className="text-xs mt-1 font-semibold" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Tài liệu hướng dẫn vận hành hàng ngày của trưởng ca & nhân sự LUSH.</p>
                </div>
              </div>

              {/* Slide 2 Table of Contents */}
              <div className="bento-card space-y-4">
                <div className="border-b border-light pb-2 mb-4">
                  <h3 className="text-xs font-display font-bold uppercase tracking-wider text-text-dark">Nội Dung Chính</h3>
                </div>
                <div className="toc-card-grid">
                  {[
                    { text: 'Phân chia kệ tại cửa hàng', tab: 'shelves' },
                    { text: 'Phân chia vị trí tại cửa hàng', tab: 'positions' },
                    { text: 'Ca làm việc tại cửa hàng', tab: 'shifts' },
                    { text: 'Daily Operation Checklist', tab: 'checklists' }
                  ].map(item => (
                    <div 
                      key={item.tab} 
                      onClick={() => setActiveTab(item.tab)}
                      className="toc-item-card"
                    >
                      <span className="toc-text">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shelves' && (
            <ShelvesTab 
              rosterShelf={rosterShelf}
              setRosterShelf={setRosterShelf}
            />
          )}

          {activeTab === 'positions' && (
            <PositionsTab 
              rosterPos={rosterPos}
              setRosterPos={setRosterPos}
            />
          )}

          {activeTab === 'shifts' && (
            <ShiftsTab 
              selectedStoreId={selectedStoreId}
              setSelectedStoreId={setSelectedStoreId}
              weeklyShifts={weeklyShifts}
              setWeeklyShifts={setWeeklyShifts}
            />
          )}



          {activeTab === 'checklists' && (
            <ChecklistsTab 
              openingChecks={openingChecks}
              setOpeningChecks={setOpeningChecks}
              openingNotes={openingNotes}
              setOpeningNotes={setOpeningNotes}
              sellingChecks={sellingChecks}
              setSellingChecks={setSellingChecks}
              sellingNotes={sellingNotes}
              setSellingNotes={setSellingNotes}
              kpiValues={kpiValues}
              setKpiValues={setKpiValues}
            />
          )}

          {activeTab === 'history' && (
            <HistoryTab 
              reports={reports}
              onDeleteReport={handleDeleteReport}
            />
          )}
        </div>
      </main>

      {/* Operations Report Generator Modal */}
      <ReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        storeName={selectedStore.name}
        rosterShelf={rosterShelf}
        rosterPos={rosterPos}
        openingChecks={openingChecks}
        openingNotes={openingNotes}
        sellingChecks={sellingChecks}
        sellingNotes={sellingNotes}
        kpiValues={kpiValues}
        onSaveReport={handleSaveReport}
      />
    </div>
  );
}
