import React, { useState } from 'react';
import { User, Users, Info, ChevronRight, ChevronDown, CheckSquare, Target, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SHELF_DIVISION, POSITION_DIVISION, POSITION_SOP } from '../data/initialData';

export default function RosterTab({
  rosterShelf,
  setRosterShelf,
  rosterPos,
  setRosterPos
}) {
  const [activeSopTab, setActiveSopTab] = useState('kho'); // 'kho' | 'vmd' | 'vesinh'
  const [expandedTasks, setExpandedTasks] = useState({}); // { taskName: boolean }
  const [checkedSops, setCheckedSops] = useState({}); // { 'title-stepIndex': boolean }

  const getInitials = (name) => {
    if (!name || name.trim() === '') return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2);
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const toggleSopCheck = (taskName, stepIdx) => {
    const key = `${taskName}-${stepIdx}`;
    setCheckedSops(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleShelfStaffChange = (id, val) => {
    setRosterShelf(prev => prev.map(item => item.id === id ? { ...item, staff: val } : item));
  };

  const handlePosStaffChange = (id, val) => {
    setRosterPos(prev => prev.map(item => item.id === id ? { ...item, staff: val } : item));
  };

  const toggleTaskExpand = (taskName) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskName]: !prev[taskName]
    }));
  };

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

  const currentSop = POSITION_SOP[activeSopTab];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 15 } }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-medium pb-4">
        <h2 className="section-title text-gradient-lush">Phân Công Kệ & Vị Trí Trực (Roster)</h2>
        <p className="text-sm text-text-muted">Chỉ định nhân viên quản lý khu vực kệ và phụ trách các vị trí vận hành đặc thù trong ca.</p>
      </div>

      {/* Roster Assignment Panel */}
      <div className="split-grid">
        {/* Shelf Division */}
        <div className="bento-card space-y-4">
          <div className="flex items-center gap-2 border-b border-light pb-3">
            <span className="badge-bw text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">Khu vực kệ</span>
            <h3 className="text-sm font-display font-bold uppercase tracking-wider text-text-dark">Lịch Phân Chia Kệ</h3>
          </div>
          <div className="space-y-2">
            {rosterShelf.map(item => {
              const avatarColorClass = item.staff ? `avatar-bg-${(item.id % 6) + 1}` : 'avatar-bg-empty';
              const initials = getInitials(item.staff);
              return (
                <div key={item.id} className="flex items-center justify-between gap-4 p-2.5 bg-slate-50/50 border border-border-light rounded-xl hover:border-emerald-600/20 hover:bg-slate-50 transition-all duration-300">
                  <span className={`badge-bw text-xs font-bold ${getShelfBadgeClass(item.area)}`}>
                    {item.area}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className={`avatar-circle ${avatarColorClass}`}>
                      {initials}
                    </div>
                    <input
                      type="text"
                      value={item.staff}
                      onChange={(e) => handleShelfStaffChange(item.id, e.target.value)}
                      className="input-text text-xs py-1.5 px-2.5 bg-white border-border-medium text-right font-semibold w-32 focus:border-emerald-600"
                      placeholder="Nhập tên..."
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Position Division */}
        <div className="bento-card space-y-4">
          <div className="flex items-center gap-2 border-b border-light pb-3">
            <span className="badge-bw text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">Vị trí trực</span>
            <h3 className="text-sm font-display font-bold uppercase tracking-wider text-text-dark">Lịch Phân Vị Trí Vận Hành</h3>
          </div>
          <div className="space-y-2">
            {rosterPos.map(item => {
              const avatarColorClass = item.staff ? `avatar-bg-${((item.id + 3) % 6) + 1}` : 'avatar-bg-empty';
              const initials = getInitials(item.staff);
              return (
                <div key={item.id} className="flex items-center justify-between gap-4 p-2.5 bg-slate-50/50 border border-border-light rounded-xl hover:border-indigo-600/20 hover:bg-slate-50 transition-all duration-300">
                  <span className={`badge-bw text-xs font-bold ${getPosBadgeClass(item.position)}`}>
                    {item.position}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className={`avatar-circle ${avatarColorClass}`}>
                      {initials}
                    </div>
                    <input
                      type="text"
                      value={item.staff}
                      onChange={(e) => handlePosStaffChange(item.id, e.target.value)}
                      className="input-text text-xs py-1.5 px-2.5 bg-white border-border-medium text-right font-semibold w-32 focus:border-indigo-600"
                      placeholder="Nhập tên..."
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SOP Documentation Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-medium pb-2">
          <Info size={16} className="text-emerald-600" />
          <h3 className="text-sm font-display font-bold uppercase tracking-wider text-text-dark">Hướng Dẫn Vận Hành Theo Vị Trí (SOP)</h3>
        </div>

        {/* SOP Tabs Selection */}
        <div className="flex flex-wrap gap-2">
          {['kho', 'vmd', 'vesinh'].map(tabKey => {
            const label = tabKey === 'kho' ? 'SOP Vị trí Kho' : tabKey === 'vmd' ? 'SOP Vị trí VMD' : 'SOP Vệ sinh Cửa hàng';
            const isActive = activeSopTab === tabKey;
            return (
              <button
                key={tabKey}
                onClick={() => setActiveSopTab(tabKey)}
                className={`px-4 py-2 text-xs font-bold font-display uppercase tracking-wider border rounded-md transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-text-dark border-border-medium hover:border-emerald-600 hover:text-emerald-600'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Selected SOP Detail Card */}
        <div className="bento-card p-6 space-y-6">
          <div className="border-b border-light pb-3">
            <h4 className="text-md font-display font-bold uppercase tracking-wider text-text-dark">{currentSop.title}</h4>
            <p className="text-xs text-text-muted">Nhấp vào từng đầu việc bên dưới để xem hướng dẫn thực hiện chi tiết.</p>
          </div>

          <div className="space-y-6">
            {currentSop.sections.map((section, secIdx) => (
              <div key={secIdx} className="space-y-4">
                <span className="badge-bw text-[10px] py-1 px-3 bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1 w-fit font-mono font-bold">
                  <Clock size={12} className="text-emerald-600" /> Ca trực: {section.time}
                </span>

                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-3"
                >
                  {section.tasks.map((task, taskIdx) => {
                    const isExpanded = !!expandedTasks[task.name];
                    return (
                      <motion.div 
                        key={taskIdx} 
                        variants={itemVariants}
                        className="sop-item-container bg-white overflow-hidden border border-border-medium rounded-xl"
                      >
                        {/* Header Clickable */}
                        <div 
                          onClick={() => toggleTaskExpand(task.name)}
                          className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <CheckSquare size={16} className={isExpanded ? "text-emerald-600" : "text-slate-400"} />
                            <div>
                              <strong className="text-xs font-bold font-display uppercase tracking-wider text-text-dark block">{task.name}</strong>
                              <span className="text-[10px] text-text-muted block line-clamp-1">{task.purpose}</span>
                            </div>
                          </div>
                          {isExpanded ? <ChevronDown size={14} className="text-emerald-600" /> : <ChevronRight size={14} />}
                        </div>

                        {/* Expandable Steps */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                              className="overflow-hidden bg-slate-50/50 border-t border-light"
                            >
                              <div className="p-4 space-y-4">
                                <div>
                                  <span className="text-[9px] text-emerald-800 uppercase font-black tracking-wider font-display block mb-1">
                                    Mục tiêu công việc
                                  </span>
                                  <p className="text-xs text-text-dark font-medium leading-relaxed">{task.purpose}</p>
                                </div>
                                <div>
                                  <span className="text-[9px] text-emerald-800 uppercase font-black tracking-wider font-display block mb-2">
                                    Các bước thực hiện chuẩn
                                  </span>
                                  <ul className="space-y-2">
                                    {task.steps.map((step, stepIdx) => {
                                      const isChecked = !!checkedSops[`${task.name}-${stepIdx}`];
                                      return (
                                        <li 
                                          key={stepIdx} 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSopCheck(task.name, stepIdx);
                                          }}
                                          className={`flex items-start gap-3 text-xs leading-relaxed font-medium cursor-pointer p-2.5 rounded-lg border transition-all ${
                                            isChecked 
                                              ? 'bg-emerald-50/30 border-emerald-100/50 text-text-muted' 
                                              : 'bg-white border-border-light hover:border-emerald-300'
                                          }`}
                                        >
                                          <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-black border flex-shrink-0 mt-0.5 transition-all ${
                                            isChecked 
                                              ? 'bg-emerald-600 border-emerald-600 text-white' 
                                              : 'bg-slate-50 border-slate-300 text-slate-400'
                                          }`}>
                                            {isChecked ? '✓' : stepIdx + 1}
                                          </span>
                                          <span className={`flex-1 select-none ${isChecked ? 'line-through opacity-70' : 'text-text-dark'}`}>{step}</span>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
