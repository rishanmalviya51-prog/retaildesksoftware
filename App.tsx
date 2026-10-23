
import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding.tsx';
import { InsightTerminal, InsightView } from './components/InsightTerminal.tsx';
import { ShopTerminal, ShopView } from './components/ShopTerminal.tsx';
import { BusinessProfile, Transaction, Employee, Role, ServiceItem, InventoryItem, RoleType } from './types.ts';
import { Store, BarChart2, LogOut, User, Shield, ChevronDown, Lock, Moon, Sun } from 'lucide-react';

const SHOP_TABS: ShopView[] = ['Services', 'Inventory', 'Catalog'];
const INSIGHT_TABS: InsightView[] = ['Data Analyst', 'Employment', 'Transaction'];

const App: React.FC = () => {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  
  const [activeMain, setActiveMain] = useState<'SHOP' | 'INSIGHT'>('SHOP');
  const [activeShopTab, setActiveShopTab] = useState<ShopView>('Services');
  const [activeInsightTab, setActiveInsightTab] = useState<InsightView>('Data Analyst');
  
  const [currentRole, setCurrentRole] = useState<RoleType | null>(null);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('retailDesk_db');
    if (saved) {
      try {
        const db = JSON.parse(saved);
        setProfile(db.profile);
        setTransactions(db.transactions || []);
        setEmployees(db.employees || []);
        setRoles(db.roles || []);
        setServices(db.services || []);
        setInventory(db.inventory || []);
      } catch (e) {
        console.error("Registry Fault", e);
      }
    }
    
    const savedTheme = localStorage.getItem('retailDesk_theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.className = savedTheme;
    } else {
      document.documentElement.className = 'light';
    }
    
    setLoading(false);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.className = newTheme;
    localStorage.setItem('retailDesk_theme', newTheme);
  };

  const saveToLocal = (data: any) => {
    localStorage.setItem('retailDesk_db', JSON.stringify(data));
  };

  const handleOnboardingComplete = (data: any) => {
    setProfile(data.profile);
    setTransactions(data.transactions);
    setEmployees(data.employees);
    setRoles(data.roles);
    setServices(data.services);
    setInventory(data.inventory);
    saveToLocal(data);
  };

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => {
      const updated = [tx, ...prev];
      saveToLocal({ profile, transactions: updated, employees, roles, services, inventory });
      return updated;
    });
  };

  const updateInventory = (items: InventoryItem[]) => {
    setInventory(items);
    saveToLocal({ profile, transactions, employees, roles, services, inventory: items });
  };

  const handleUpdateServices = (items: ServiceItem[]) => {
    setServices(items);
    saveToLocal({ profile, transactions, employees, roles, services: items, inventory });
  };

  const handleExit = () => {
    if(confirm("Confirm protocol termination? Data will be archived for audit.")) {
      localStorage.removeItem('retailDesk_db');
      setProfile(null);
      setCurrentRole(null);
      window.location.reload();
    }
  };

  if (loading) return (
    <div className="h-full w-full bg-bone-100 flex flex-col items-center justify-center space-y-6">
      <div className="w-16 h-1 w-16 border-t-2 border-gold-600 rounded-full animate-spin"></div>
      <div className="text-gold-600 font-black uppercase tracking-[0.6em] text-[10px] animate-pulse">Initializing_Retail_Kernel</div>
    </div>
  );

  if (!profile) return <Onboarding onComplete={handleOnboardingComplete} />;

  if (!currentRole) {
    return (
      <div className="h-full w-full overflow-y-auto bg-bone-100 dark:bg-slate-950 px-6 py-20 flex flex-col items-center">
        <div className="w-full max-w-6xl">
           <div className="text-center mb-16 animate-in fade-in duration-1000">
              <div className="w-20 h-20 bg-gradient-to-br from-gold-600 to-gold-700 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-premium border border-white/20">
                <Shield className="text-white" size={36} />
              </div>
              <h2 className="text-6xl font-black dark:text-white text-gold-700 uppercase tracking-tighter mb-4">Boardroom Access</h2>
              <p className="dark:text-slate-500 text-gold-600/40 font-bold uppercase text-[11px] tracking-[0.6em]">Establish Identity Tier to Enter Operational Module</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <RoleCard 
                role="OWNER" 
                desc="Unrestricted Governance. Executive capital analytics and full personnel authority."
                icon={<Lock className="text-gold-700" size={32} />}
                onClick={() => setCurrentRole('OWNER')}
             />
             <RoleCard 
                role="MANAGER" 
                desc="Operational Oversight. Surveillance of inventory and specialist deployment."
                icon={<Shield className="text-gold-600" size={32} />}
                onClick={() => setCurrentRole('MANAGER')}
             />
             <RoleCard 
                role="EMPLOYEE" 
                desc="Service Execution. High-velocity billing and specialist fulfillment."
                icon={<User className="text-gold-500" size={32} />}
                onClick={() => setCurrentRole('EMPLOYEE')}
             />
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col overflow-hidden dark:bg-slate-950 bg-bone-100 dark:text-slate-200 text-gold-700">
      <header className="dark:bg-slate-900/60 bg-white/95 glass border-b dark:border-white/5 border-bone-300 shrink-0 z-50">
        <div className="flex h-16 items-center px-8 justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gold-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg border border-white/10 shrink-0">R</div>
              <div>
                <h1 className="text-lg font-black tracking-tight dark:text-white text-gold-700 uppercase leading-none">RetailDesk</h1>
                <p className="text-[8px] dark:text-gold-400 text-gold-600 font-black uppercase tracking-[0.4em] mt-1">Operative OS v.4</p>
              </div>
            </div>

            <nav className="flex items-center space-x-1">
               <NavButton active={activeMain === 'SHOP'} onClick={() => setActiveMain('SHOP')} icon={<Store size={14} />} label="Terminal" />
               {currentRole !== 'EMPLOYEE' && (
                 <NavButton active={activeMain === 'INSIGHT'} onClick={() => setActiveMain('INSIGHT')} icon={<BarChart2 size={14} />} label="Governance" />
               )}
            </nav>
          </div>

          <div className="flex items-center space-x-6">
             <button onClick={toggleTheme} className="p-2.5 rounded-xl hover:bg-bone-100 dark:hover:bg-white/5 text-gold-600 transition-all border border-transparent hover:border-bone-300">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
             </button>

             <div className="relative">
               <button 
                  onClick={() => setShowRoleSelector(!showRoleSelector)}
                  className="bg-white dark:bg-slate-950 border border-bone-300 dark:border-white/10 px-4 py-1.5 rounded-xl flex items-center gap-4 hover:border-gold-400 transition-all shadow-sm"
               >
                  <div className={`w-1.5 h-1.5 rounded-full ${currentRole === 'OWNER' ? 'bg-emerald-600' : 'bg-gold-500'}`}></div>
                  <p className="text-[10px] font-black dark:text-white text-gold-700 uppercase tracking-widest flex items-center gap-2">{currentRole} <ChevronDown size={10} /></p>
               </button>
               
               {showRoleSelector && (
                 <div className="absolute top-full right-0 mt-3 w-60 bg-white dark:bg-slate-900 border border-bone-300 dark:border-white/10 rounded-2xl shadow-premium p-2 z-[100] animate-in fade-in slide-in-from-top-2">
                    {(['OWNER', 'MANAGER', 'EMPLOYEE'] as RoleType[]).map(r => (
                      <button 
                        key={r} 
                        onClick={() => { setCurrentRole(r); setShowRoleSelector(false); setActiveMain('SHOP'); }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentRole === r ? 'bg-gold-600 text-white shadow-lg' : 'text-gold-600/50 hover:bg-bone-50 dark:hover:bg-white/5'}`}
                      >
                        {r} Access
                      </button>
                    ))}
                 </div>
               )}
             </div>

             <button onClick={handleExit} className="p-2.5 text-gold-400 hover:text-rose-600 transition-all active:scale-90">
               <LogOut size={22} />
             </button>
          </div>
        </div>

        <div className="px-8 flex items-center h-12 dark:bg-slate-900/40 bg-bone-100 border-t dark:border-white/5 border-bone-300">
            <div className="flex space-x-12 h-full">
               {(activeMain === 'SHOP' ? SHOP_TABS : INSIGHT_TABS).map(tab => (
                 <button
                   key={tab}
                   onClick={() => activeMain === 'SHOP' ? setActiveShopTab(tab as ShopView) : setActiveInsightTab(tab as InsightView)}
                   className={`h-full text-[10px] font-black uppercase tracking-[0.4em] border-b-2 transition-all px-2 ${ (activeMain === 'SHOP' ? activeShopTab === tab : activeInsightTab === tab) ? 'border-gold-600 text-gold-700 dark:text-white' : 'border-transparent text-gold-600/30 hover:text-gold-600'}`}
                 >
                   {tab}
                 </button>
               ))}
            </div>
        </div>
      </header>

      <main className="flex-1 relative overflow-y-auto custom-scrollbar bg-white dark:bg-slate-950">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1600px] h-[800px] bg-gold-400/[0.03] rounded-full blur-[180px] pointer-events-none"></div>
        {activeMain === 'SHOP' ? (
            <ShopTerminal 
              profile={profile} 
              view={activeShopTab} 
              services={services} 
              employees={employees} 
              roles={roles} 
              inventory={inventory}
              currentRole={currentRole}
              onTransactionComplete={addTransaction}
              onUpdateInventory={updateInventory}
              onUpdateServices={handleUpdateServices}
            />
        ) : (
            <InsightTerminal 
              profile={profile} 
              view={activeInsightTab} 
              sharedTransactions={transactions} 
              sharedEmployees={employees} 
              sharedRoles={roles} 
              setEmployees={setEmployees} 
              setRoles={setRoles} 
              services={services}
              currentRole={currentRole}
            />
        )}
      </main>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex items-center space-x-3 px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${active ? 'bg-bone-100 dark:bg-slate-800 text-gold-700 dark:text-white border border-bone-300 dark:border-white/10 shadow-sm' : 'text-gold-600/40 hover:text-gold-600'}`}>
    {icon}
    <span>{label}</span>
  </button>
);

const RoleCard = ({ role, desc, icon, onClick }: any) => (
  <button 
    onClick={onClick} 
    className="bg-white dark:bg-slate-900/40 border border-bone-300 dark:border-white/10 p-16 rounded-[2.5rem] text-center flex flex-col items-center group transition-all hover:scale-[1.03] hover:border-gold-400 hover:shadow-premium backdrop-blur-xl"
  >
     <div className="p-10 bg-bone-100 dark:bg-slate-950 rounded-2xl mb-12 group-hover:scale-110 transition-transform shadow-inner">
        {icon}
     </div>
     <h3 className="text-4xl font-black dark:text-white text-gold-700 uppercase tracking-tighter mb-6">{role}</h3>
     <p className="dark:text-slate-500 text-gold-600/50 text-[12px] font-medium uppercase tracking-[0.2em] leading-relaxed max-w-[280px] mb-16 h-16">{desc}</p>
     <div className="w-full py-6 bg-gold-600 text-white font-black uppercase text-[10px] tracking-[0.5em] rounded-2xl shadow-xl border border-white/10 transition-colors group-hover:bg-gold-700">
       Establish Tier
     </div>
  </button>
);

export default App;
