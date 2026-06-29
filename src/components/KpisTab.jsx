import React from 'react';
import { 
  TrendingUp, 
  Coins, 
  Receipt, 
  Percent, 
  ShoppingBag, 
  UserPlus, 
  Gift, 
  Users 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { KPI_TEMPLATES } from '../data/initialData';

const getKpiIcon = (key) => {
  const size = 18;
  switch (key) {
    case 'sales': return <Coins size={size} className="text-emerald-600" />;
    case 'atv': return <Receipt size={size} className="text-indigo-600" />;
    case 'conversion': return <Percent size={size} className="text-blue-600" />;
    case 'upt': return <ShoppingBag size={size} className="text-rose-600" />;
    case 'memberSignUp': return <UserPlus size={size} className="text-purple-600" />;
    case 'samplingQty': return <Gift size={size} className="text-orange-600" />;
    case 'repeatCustomer': return <Users size={size} className="text-teal-600" />;
    default: return <TrendingUp size={size} className="text-slate-600" />;
  }
};

export default function KpisTab({ kpiValues, setKpiValues }) {
  const handleValChange = (key, field, val) => {
    setKpiValues(prev => {
      const currentKpi = prev[key] || { target: '', actual: '', actionPlan: '' };
      return {
        ...prev,
        [key]: {
          ...currentKpi,
          [field]: val
        }
      };
    });
  };

  const calculateAchievement = (target, actual) => {
    const t = parseFloat(target);
    const a = parseFloat(actual);
    if (isNaN(t) || isNaN(a) || t === 0) return null;
    return Math.round((a / t) * 100);
  };

  const getStatusBadge = (percent) => {
    if (percent === null) return { text: 'N/A', className: 'bg-slate-50 text-slate-400 border border-slate-100 font-bold' };
    if (percent >= 100) return { text: 'Đạt chỉ tiêu', className: 'bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold' };
    if (percent >= 80) return { text: 'Gần đạt', className: 'bg-amber-50 text-amber-700 border border-amber-100 font-bold' };
    return { text: 'Cần chú ý', className: 'bg-rose-50 text-rose-700 border border-rose-100 font-bold' };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 15 } }
  };

  // Calculate average performance
  let activeKpiCount = 0;
  let totalPerformance = 0;
  let highestPerf = { label: 'Chưa có', val: 0 };

  KPI_TEMPLATES.forEach(kpi => {
    const vals = kpiValues[kpi.key];
    if (vals && vals.target && vals.actual) {
      const targetVal = parseFloat(vals.target);
      const actualVal = parseFloat(vals.actual);
      if (targetVal > 0) {
        const perf = Math.round((actualVal / targetVal) * 100);
        totalPerformance += perf;
        activeKpiCount++;
        if (perf > highestPerf.val) {
          highestPerf = { label: kpi.label, val: perf };
        }
      }
    }
  });

  const avgPerf = activeKpiCount > 0 ? Math.round(totalPerformance / activeKpiCount) : 0;

  return (
    <div className="space-y-6">
      {/* Bento Grid Header stats */}
      <div className="bento-grid">
        <div className="bento-card bento-col-6 flex flex-col justify-between">
          <div>
            <h3 className="text-md font-display font-bold uppercase tracking-wider mb-1">KPI & Báo Cáo Doanh Số (Báo cáo 17H)</h3>
            <p className="text-xs text-text-muted">
              Nhập doanh số và chỉ số bán hàng thực tế của ca trực để tính hiệu suất đạt được so với mục tiêu.
            </p>
          </div>
        </div>
        
        <div className="bento-card bento-col-3 flex flex-col justify-between p-5">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Hiệu suất chung</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl font-black font-mono text-emerald-600">{avgPerf}%</span>
            <span className="text-[10px] text-text-muted font-bold font-mono">AVG</span>
          </div>
        </div>

        <div className="bento-card bento-col-3 flex flex-col justify-between p-5">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Chỉ số cao nhất</span>
          <div className="mt-2">
            <span className="text-xs font-bold font-display text-text-dark block line-clamp-1">{highestPerf.label}</span>
            <span className="text-md font-black font-mono text-indigo-600">{highestPerf.val > 0 ? `${highestPerf.val}%` : '--'}</span>
          </div>
        </div>
      </div>

      <div className="table-container p-6 space-y-4">
        {/* Table Headers */}
        <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b border-medium text-xs font-bold text-text-dark uppercase tracking-wider font-display">
          <div className="col-span-3">Chỉ số KPI</div>
          <div className="col-span-2 text-right">Chỉ tiêu (Target)</div>
          <div className="col-span-2 text-right">Thực tế (Actual)</div>
          <div className="col-span-2 text-center">Tỷ lệ %</div>
          <div className="col-span-3">Hành động khắc phục / Ghi chú</div>
        </div>

        {/* KPI Rows */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-1"
        >
          {KPI_TEMPLATES.map(kpi => {
            const vals = kpiValues[kpi.key] || { target: '', actual: '', actionPlan: '' };
            const percent = calculateAchievement(vals.target, vals.actual);
            const status = getStatusBadge(percent);

            return (
              <motion.div 
                key={kpi.key} 
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 py-3.5 border-b border-light items-center hover:bg-slate-50/50 rounded-lg transition-colors px-2"
              >
                {/* Title / Info with visual icons */}
                <div className="col-span-3 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center">
                    {getKpiIcon(kpi.key)}
                  </div>
                  <div>
                    <span className="text-xs font-bold font-display uppercase tracking-wider text-text-dark block leading-tight">{kpi.label}</span>
                    <span className="text-[10px] text-text-muted font-display block mt-1">Đơn vị: {kpi.unit}</span>
                  </div>
                </div>

                {/* Target Input */}
                <div className="col-span-2 flex items-center md:justify-end gap-2">
                  <span className="text-xs text-text-muted md:hidden font-display w-24">Target:</span>
                  <input
                    type="number"
                    value={vals.target}
                    onChange={(e) => handleValChange(kpi.key, 'target', e.target.value)}
                    placeholder="Nhập target"
                    className="input-text text-right font-mono text-xs py-1.5 px-3 bg-white w-full md:w-auto"
                  />
                </div>

                {/* Actual Input */}
                <div className="col-span-2 flex items-center md:justify-end gap-2">
                  <span className="text-xs text-text-muted md:hidden font-display w-24">Actual:</span>
                  <input
                    type="number"
                    value={vals.actual}
                    onChange={(e) => handleValChange(kpi.key, 'actual', e.target.value)}
                    placeholder="Nhập thực tế"
                    className="input-text text-right font-mono text-xs py-1.5 px-3 bg-white w-full md:w-auto"
                  />
                </div>

                {/* Achievement display with progress bar */}
                <div className="col-span-2 flex flex-col gap-1.5 py-2 md:py-0 border-t border-b border-light/50 md:border-none">
                  <div className="flex items-center justify-between md:justify-center md:gap-3">
                    <span className="text-xs text-text-muted md:hidden font-display">Hiệu suất:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black font-mono text-text-dark">
                        {percent !== null ? `${percent}%` : '--'}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full ${status.className}`}>
                        {status.text}
                      </span>
                    </div>
                  </div>
                  {percent !== null && (
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          percent >= 100 
                            ? 'bg-emerald-600' 
                            : percent >= 80 
                              ? 'bg-amber-500' 
                              : 'bg-rose-500'
                        }`} 
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Action Plan */}
                <div className="col-span-3 flex items-center gap-2">
                  <span className="text-xs text-text-muted md:hidden font-display w-24">Ghi chú:</span>
                  <input
                    type="text"
                    value={vals.actionPlan}
                    onChange={(e) => handleValChange(kpi.key, 'actionPlan', e.target.value)}
                    placeholder={percent !== null && percent < 100 ? "Kế hoạch hành động..." : "Ghi chú thêm..."}
                    className="input-text text-xs py-1.5 px-3 bg-transparent border-border-medium w-full"
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
