
import React from 'react';
import { BusinessProfile, Employee, Transaction, Role, ServiceItem, RoleType } from '../types.ts';
import { Dashboard } from './Dashboard.tsx';
import { ShieldAlert, Trash2, Edit3, Search, User } from 'lucide-react';

export type InsightView = 'Data Analyst' | 'Employment' | 'Transaction';

interface InsightTerminalProps {
  profile: BusinessProfile;
  view: InsightView;
  sharedTransactions: Transaction[];
  sharedEmployees: Employee[];
  sharedRoles: Role[];
  setEmployees: (e: Employee[]) => void;
  setRoles: (r: Role[]) => void;
  services: ServiceItem[];
  currentRole: RoleType;
}

export const InsightTerminal: React.FC<InsightTerminalProps> = ({ profile, view, sharedTransactions, sharedEmployees, sharedRoles, setEmployees, services, currentRole }) => {
  const isEmployee = currentRole === 'EMPLOYEE';

  if (isEmployee) {
    return (
      <div className="h-full w-full flex items-center justify-center p-10 bg-white dark:bg-slate-950">
        <div className="max-w-lg w-full bg-bone-100 dark:bg-slate-900 border border-bone-300 dark:border-white/10 rounded-[2.5rem] p-16 text-center shadow-premium">
          <ShieldAlert className="mx-auto text-rose-500 mb-8" size={64} strokeWidth={1} />
          <h2 className="text-3xl font-black text-gold-700 dark:text-white uppercase tracking-tighter mb-4">Access Restricted</h2>
          <p className="text-gold-600/40 text-[10px] font-black uppercase tracking-[0.4em] leading-loose">Boardroom data is exclusively accessible to Executive Identities.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white dark:bg-slate-950">
      {view === 'Data Analyst' && (
        <Dashboard 
          profile={profile} 
          transactions={sharedTransactions} 
          employees={sharedEmployees} 
          roles={sharedRoles} 
          services={services} 
          currentRole={currentRole}
        />
      )}
      {view === 'Employment' && <EmploymentView employees={sharedEmployees} setEmployees={setEmployees} currentRole={currentRole} />}
      {view === 'Transaction' && <TransactionView transactions={sharedTransactions} services={services} />}
    </div>
  );
};

const EmploymentView = ({ employees, setEmployees, currentRole }: any) => {
  const isOwner = currentRole === 'OWNER';

  return (
    <div className="px-8 lg:px-12 py-12 space-y-12">
      <div className="flex flex-col sm:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-gold-700 dark:text-white uppercase tracking-tighter">Personnel Registry</h2>
          <p className="text-[10px] text-gold-600/40 font-black uppercase tracking-[0.5em] mt-3">Governance of Human Capital</p>
        </div>
        {isOwner && <button className="bg-gold-600 text-white px-10 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest">Recruit Identity</button>}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-bone-300 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-premium">
        <table className="w-full text-left">
          <thead className="bg-bone-100 dark:bg-slate-800 text-gold-600 font-black text-[9px] uppercase tracking-widest border-b border-bone-300 dark:border-white/10">
            <tr>
              <th className="px-10 py-5">Credential</th>
              <th className="px-10 py-5">Designation</th>
              {isOwner && <th className="px-10 py-5">Yield Scale</th>}
              <th className="px-10 py-5">Status</th>
              <th className="px-10 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bone-200 dark:divide-white/5">
            {employees.map((e: any) => (
              <tr key={e.id} className="hover:bg-bone-50 dark:hover:bg-white/5 transition-all group">
                <td className="px-10 py-6">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-bone-100 dark:bg-slate-800 flex items-center justify-center text-gold-600 font-black">{e.name[0]}</div>
                      <span className="font-black text-gold-700 dark:text-white uppercase text-sm">{e.name}</span>
                   </div>
                </td>
                <td className="px-10 py-6 text-[10px] font-black text-gold-600/40 uppercase tracking-widest">{e.role}</td>
                {isOwner && <td className="px-10 py-6 font-black text-gold-700 dark:text-white">₹{e.salary.toLocaleString()}</td>}
                <td className="px-10 py-6">
                   <span className="px-3 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase tracking-widest">{e.status}</span>
                </td>
                <td className="px-10 py-6 text-right">
                   <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="text-gold-400 hover:text-gold-700"><Edit3 size={14}/></button>
                      <button onClick={() => setEmployees(employees.filter((emp:any)=>emp.id !== e.id))} className="text-rose-400 hover:text-rose-600"><Trash2 size={14}/></button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TransactionView = ({ transactions }: any) => (
  <div className="px-8 lg:px-12 py-12 space-y-12 pb-24">
    <div className="flex flex-col sm:flex-row justify-between items-end gap-6">
      <div>
        <h2 className="text-4xl font-black text-gold-700 dark:text-white uppercase tracking-tighter">Settlement Ledger</h2>
        <p className="text-[10px] text-gold-600/40 font-black uppercase tracking-[0.5em] mt-3">Immutable Audit of All Exchanges</p>
      </div>
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-400" size={16} />
        <input className="w-full bg-bone-100 dark:bg-slate-900 border border-bone-300 dark:border-white/10 rounded-xl py-3 pl-12 pr-6 text-xs text-gold-700 outline-none" placeholder="Search Audit IDs..." />
      </div>
    </div>
    
    <div className="bg-white dark:bg-slate-900 border border-bone-300 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-premium">
      <table className="w-full text-left">
        <thead className="bg-bone-100 dark:bg-slate-800 text-gold-600 font-black text-[9px] uppercase tracking-widest border-b border-bone-300 dark:border-white/10">
          <tr>
            <th className="px-10 py-5">Client Identity</th>
            <th className="px-10 py-5">Registry ID</th>
            <th className="px-10 py-5">Settlement Tier</th>
            <th className="px-10 py-5">Value</th>
            <th className="px-10 py-5 text-right">Audit Stamp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-bone-200 dark:divide-white/5">
          {transactions.map((tx: any) => (
            <tr key={tx.id} className="hover:bg-bone-50 dark:hover:bg-white/5 transition-all group">
              <td className="px-10 py-7">
                 <div className="flex items-center gap-4">
                    <User className="text-gold-400" size={18} />
                    <span className="font-black text-gold-700 dark:text-white uppercase text-sm">{tx.customer.name}</span>
                 </div>
              </td>
              <td className="px-10 py-7 font-mono text-gold-600/40 text-[10px] tracking-widest uppercase">{tx.id}</td>
              <td className="px-10 py-7"><span className="px-3 py-1 rounded-md bg-gold-50 dark:bg-gold-950 border border-gold-400/20 text-gold-600 text-[8px] font-black uppercase tracking-widest">{tx.paymentMethod}</span></td>
              <td className="px-10 py-7 font-black text-2xl text-gold-700 dark:text-white tracking-tighter">₹{tx.totalAmount}</td>
              <td className="px-10 py-7 text-right text-gold-600/40 text-[9px] font-black uppercase tracking-widest">{new Date(tx.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
