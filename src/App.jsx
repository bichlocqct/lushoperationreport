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
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);

  // Master Stores Data State
  const [storesData, setStoresData] = useState(() => {
    const saved = localStorage.getItem('lush_stores_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Try migration from old session
    const oldSession = localStorage.getItem('lush_active_session');
    if (oldSession) {
      try {
        const session = JSON.parse(oldSession);
        if (session.storeId) {
          return {
            [session.storeId]: {
              leader: session.leader || '',
              openingChecks: session.openingChecks || {},
              openingNotes: session.openingNotes || {},
              sellingChecks: session.sellingChecks || {},
              sellingNotes: session.sellingNotes || {},
              kpiValues: session.kpiValues || {},
              rosterShelf: session.rosterShelf || SHELF_DIVISION.map(item => ({ ...item, staff: '' })),
              rosterPos: session.rosterPos || POSITION_DIVISION.map(item => ({ ...item, staff: '' }))
            }
          };
        }
      } catch (e) {}
    }
    return {};
  });

  // Derived state for the active store
  const activeStoreData = storesData[selectedStoreId] || {
    leader: '',
    openingChecks: {},
    openingNotes: {},
    sellingChecks: {},
    sellingNotes: {},
    kpiValues: {},
    rosterShelf: SHELF_DIVISION.map(item => ({ ...item, staff: '' })),
    rosterPos: POSITION_DIVISION.map(item => ({ ...item, staff: '' }))
  };

  const shiftLeader = activeStoreData.leader || '';
  const openingChecks = activeStoreData.openingChecks || {};
  const openingNotes = activeStoreData.openingNotes || {};
  const sellingChecks = activeStoreData.sellingChecks || {};
  const sellingNotes = activeStoreData.sellingNotes || {};
  const kpiValues = activeStoreData.kpiValues || {};
  const rosterShelf = activeStoreData.rosterShelf || SHELF_DIVISION.map(item => ({ ...item, staff: '' }));
  const rosterPos = activeStoreData.rosterPos || POSITION_DIVISION.map(item => ({ ...item, staff: '' }));

  // Helper setter that updates the state for the active store
  const updateActiveStoreData = (key, val) => {
    setStoresData(prev => {
      const currentStoreData = prev[selectedStoreId] || {
        leader: '',
        openingChecks: {},
        openingNotes: {},
        sellingChecks: {},
        sellingNotes: {},
        kpiValues: {},
        rosterShelf: SHELF_DIVISION.map(item => ({ ...item, staff: '' })),
        rosterPos: POSITION_DIVISION.map(item => ({ ...item, staff: '' }))
      };
      
      const nextVal = typeof val === 'function' ? val(currentStoreData[key]) : val;
      
      return {
        ...prev,
        [selectedStoreId]: {
          ...currentStoreData,
          [key]: nextVal
        }
      };
    });
  };

  const setShiftLeader = (val) => updateActiveStoreData('leader', val);
  const setOpeningChecks = (val) => updateActiveStoreData('openingChecks', val);
  const setOpeningNotes = (val) => updateActiveStoreData('openingNotes', val);
  const setSellingChecks = (val) => updateActiveStoreData('sellingChecks', val);
  const setSellingNotes = (val) => updateActiveStoreData('sellingNotes', val);
  const setKpiValues = (val) => updateActiveStoreData('kpiValues', val);
  const setRosterShelf = (val) => updateActiveStoreData('rosterShelf', val);
  const setRosterPos = (val) => updateActiveStoreData('rosterPos', val);
  
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
  }, []);

  // Save storesData state to localStorage on modification
  useEffect(() => {
    localStorage.setItem('lush_stores_data', JSON.stringify(storesData));
  }, [storesData]);

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
      setStoresData(prev => ({
        ...prev,
        [selectedStoreId]: {
          leader: '',
          openingChecks: {},
          openingNotes: {},
          sellingChecks: {},
          sellingNotes: {},
          kpiValues: {},
          rosterShelf: SHELF_DIVISION.map(item => ({ ...item, staff: '' })),
          rosterPos: POSITION_DIVISION.map(item => ({ ...item, staff: '' }))
        }
      }));
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
              <label className="lush-label font-display" style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '10px' }}>CỬA HÀNG</label>
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
              <label className="lush-label font-display" style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '10px' }}>LEADER</label>
              <input 
                type="text" 
                value={shiftLeader}
                onChange={(e) => setShiftLeader(e.target.value)}
                placeholder="Nhập tên leader..."
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
        leader={shiftLeader}
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
