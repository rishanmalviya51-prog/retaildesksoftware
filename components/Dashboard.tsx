
import React, { useMemo, useState } from 'react';
import { BusinessProfile, Sector, Transaction, Employee, Role, ServiceItem, RoleType } from '../types.ts';
import { TrendingUp, UserCheck, Clock, Award, ShoppingBag, CreditCard, BarChart3, Lock, ShieldCheck } from 'lucide-react';
import { 
  PeakHoursChart, 
  EmployeePerformanceChart, 
  PaymentMethodChart, 
  TopItemsChart,
  RevenueTrendChart
} from './Charts.tsx';

interface DashboardProps {
  profile: BusinessProfile;
  transactions: Transaction[];
  employees: Employee[];
  roles: Role[];
  services: ServiceItem[];
  currentRole: RoleType;
}

type TimeFilter = 'Day' | 'Week' | 'Month';

export const Dashboard: React.FC<DashboardProps> = ({ profile, transactions, employees, roles, services, currentRole }) => {
  const [filter, setFilter] = useState<TimeFilter>('Day');
  const isOwner = currentRole === 'OWNER';

  const analysis = useMemo(() => {
    const totalRev = transactions.reduce((sum, tx) => sum + tx.totalAmount, 0);
    const totalOrders = transactions.length;
    const avgValue = totalOrders > 0 ? Math.round(totalRev / totalOrders) : 0;
    
    const timeLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const trendData = timeLabels.map(l => ({ label: l, revenue: Math.random() * 5000 + 3000, profit: Math.random() * 2000 + 1000 }));

    return {
      kpi: { totalRev, orders: totalOrders, avgValue, topExpert: 'Alexander V.' },
      trendData,
      hours: timeLabels.map(l => ({ time: l, sales: Math.floor(Math.random() * 20) })),
      items: [{name: 'Elite Espresso', value: 85}, {name: 'Matcha Supreme', value: 64}, {name: 'Artisan Croissant', value: 42}],
      staff: [{name: 'Alex', services: 120}, {name: 'Sarah', services: 98}],
      payments: [{name: 'UPI', value: 75}, {name: 'Cash', value: 25}]
    };
  }, [transactions, filter]);

  return (
    <div className="w-full px-8 lg:px-12 py-12 space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="animate-in slide-in-from-left-4 duration-700">
          <h1 className="text-5xl font-black dark:text-white text-gold-700 tracking-tighter uppercase leading-none">Intelligence Board</h1>
          <p className="text-[10px] text-gold-600/40 font-black uppercase tracking-[0.5em] mt-5 pl-1">Consolidated Governance / {profile.companyName}</p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 border border-bone-300 dark:border-white/10 p-1.5 rounded-2xl flex shadow-premium animate-in slide-in-from-right-4 duration-700">
          {(['Day', 'Week', 'Month'] as TimeFilter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-gold-600 text-white shadow-xl' : 'text-gold-600/30 hover:text-gold-600'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <SummaryCard label="Gross Revenue" value={`₹${analysis.kpi.totalRev.toLocaleString()}`} sub="Capital Inflow" icon={BarChart3} />
        <SummaryCard label="Order Velocity" value={analysis.kpi.orders} sub="Unit Throughput" icon={ShoppingBag} />
        <SummaryCard label="Avg Settlement" value={`₹${analysis.kpi.avgValue}`} sub="Customer Tier" icon={CreditCard} />
        <SummaryCard label="Prime Specialist" value={analysis.kpi.topExpert} sub="Efficiency Peak" icon={Award} />
      </div>

      {isOwner ? (
        <div className="bg-white dark:bg-slate-900/40 border border-bone-300 dark:border-white/10 rounded-[2.5rem] p-12 shadow-premium min-h-[500px] animate-in fade-in slide-in-from-bottom-8 duration-1000 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-16">
            <h3 className="text-[11px] font-black text-gold-600/40 uppercase tracking-[0.5em] flex items-center gap-5">
              <TrendingUp size={18} className="text-gold-500" /> Capital Yield Trajectory
            </h3>
            <div className="flex gap-10 items-center">
               <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-bone-300 dark:bg-slate-700"></div>
                  <span className="text-[9px] font-black text-gold-600/40 uppercase tracking-widest">Revenue</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 shadow-lg shadow-emerald-500/20"></div>
                  <span className="text-[9px] font-black text-gold-600/40 uppercase tracking-widest">Net Yield</span>
               </div>
            </div>
          </div>
          <div className="h-[380px]">
            <RevenueTrendChart data={analysis.trendData} />
          </div>
        </div>
      ) : (
        <div className="bg-bone-100 dark:bg-slate-900/20 border border-dashed border-bone-300 dark:border-white/10 rounded-[2.5rem] p-24 flex flex-col items-center justify-center text-center space-y-8">
           <div className="p-8 bg-white dark:bg-slate-950 rounded-full shadow-premium text-gold-300"><Lock size={48} strokeWidth={1} /></div>
           <div>
             <h3 className="text-3xl font-black dark:text-white text-gold-700 uppercase tracking-tighter">Governance Restricted</h3>
             <p className="text-gold-600/30 text-[10px] font-bold uppercase tracking-[0.5em] max-w-sm mx-auto mt-4 leading-loose">Capital growth surveillance is reserved for the Executive Owner Tier.</p>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ChartCard title="Peak Operational Hours" icon={Clock}><PeakHoursChart data={analysis.hours} /></ChartCard>
        <ChartCard title="Portfolio Utilization" icon={ShoppingBag}><TopItemsChart data={analysis.items} /></ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-24">
        <div className="lg:col-span-2">
          <ChartCard title="Specialist Output Matrix" icon={UserCheck}><EmployeePerformanceChart data={analysis.staff} /></ChartCard>
        </div>
        <ChartCard title="Settlement Protocol Mix" icon={CreditCard}><PaymentMethodChart data={analysis.payments} /></ChartCard>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, sub, icon: Icon }: any) => (
  <div className="bg-white dark:bg-slate-900 border border-bone-300 dark:border-white/10 p-10 rounded-[2.5rem] shadow-premium hover:border-gold-400 transition-all group overflow-hidden relative">
     <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/[0.02] rounded-full -mr-16 -mt-16 pointer-events-none"></div>
     <div className="flex justify-between items-start mb-10 relative z-10">
        <div className="p-3.5 bg-bone-100 dark:bg-slate-800 rounded-xl text-gold-600 group-hover:bg-gold-600 group-hover:text-white transition-all shadow-sm"><Icon size={22} strokeWidth={1.5} /></div>
        <ShieldCheck size={16} className="text-bone-200 dark:text-slate-700" />
     </div>
     <div className="relative z-10">
       <p className="text-[10px] font-black uppercase text-gold-600/30 tracking-[0.5em] mb-4">{label}</p>
       <h4 className="text-4xl font-black text-gold-700 dark:text-white tracking-tighter leading-none truncate mb-4">{value}</h4>
       <div className="h-px bg-bone-100 dark:bg-white/5 w-full mb-4"></div>
       <p className="text-[10px] font-bold text-gold-600/20 uppercase tracking-widest italic">{sub}</p>
     </div>
  </div>
);

const ChartCard = ({ title, icon: Icon, children }: any) => (
  <div className="bg-white dark:bg-slate-900/40 border border-bone-300 dark:border-white/10 rounded-[2.5rem] p-12 shadow-premium min-h-[450px] backdrop-blur-md">
    <h3 className="text-[11px] font-black text-gold-600/40 uppercase tracking-[0.5em] mb-12 flex items-center gap-5">
      <Icon size={18} className="text-gold-400" /> {title}
    </h3>
    <div className="flex-1 min-h-[280px]">{children}</div>
  </div>
);
