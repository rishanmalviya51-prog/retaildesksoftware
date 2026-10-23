
import React, { useState } from 'react';
import { Sector, Role, ServiceItem, Employee, InventoryItem, Transaction, Customer } from '../types.ts';
import { ArrowRight, Building2 } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: any) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState<Sector | ''>('');

  const bootstrap = () => {
    const s = sector as Sector;
    
    const mockRoles: Role[] = [
      { id: 'r1', name: 'Executive Manager', isServiceProvider: false },
      { id: 'r2', name: 'Senior Specialist', isServiceProvider: true },
      { id: 'r3', name: 'Junior Associate', isServiceProvider: true },
      { id: 'r4', name: 'Support Staff', isServiceProvider: false }
    ];

    const mockServices: ServiceItem[] = [
      { id: 's1', name: 'Signature Ritual', price: 2400, category: 'Premium', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&fit=crop' },
      { id: 's2', name: 'Essential Care', price: 1200, category: 'Core', image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&fit=crop' },
      { id: 's3', name: 'Advanced Recovery', price: 3500, category: 'Elite', image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&fit=crop' },
      { id: 's4', name: 'Rapid Refresh', price: 800, category: 'Express', image: 'https://images.unsplash.com/photo-1570172619996-23b241c2f180?w=600&fit=crop' },
      { id: 's5', name: 'Master Consultation', price: 4500, category: 'Executive', image: 'https://images.unsplash.com/photo-1616391182219-e080b4d1043a?w=600&fit=crop' },
      { id: 's6', name: 'Dynamic Analysis', price: 1800, category: 'Core', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&fit=crop' }
    ];

    const mockEmps: Employee[] = [
      { id: 'e1', name: 'Alexander Vance', role: 'Executive Manager', salary: 85000, status: 'Active', joinedDate: '2023-01-15' },
      { id: 'e2', name: 'Sarah Montgomery', role: 'Senior Specialist', salary: 62000, status: 'Active', joinedDate: '2023-03-10' },
      { id: 'e3', name: 'Julian Thorne', role: 'Senior Specialist', salary: 58000, status: 'Active', joinedDate: '2023-05-22' },
      { id: 'e4', name: 'Elena Rodriguez', role: 'Junior Associate', salary: 42000, status: 'Active', joinedDate: '2023-08-01' },
      { id: 'e5', name: 'Marcus Chen', role: 'Junior Associate', salary: 40000, status: 'Active', joinedDate: '2023-11-12' },
      { id: 'e6', name: 'Dominic S.', role: 'Support Staff', salary: 35000, status: 'Active', joinedDate: '2024-01-05' }
    ];

    const mockInventory: InventoryItem[] = [
      { id: 'i1', name: 'Artisan Extract Alpha', quantity: 42, unit: 'ltr', category: 'Raw Material', minLevel: 15 },
      { id: 'i2', name: 'Premium Catalyst', quantity: 12, unit: 'kg', category: 'Operational', minLevel: 20 },
      { id: 'i3', name: 'Executive Solvent', quantity: 85, unit: 'ltr', category: 'Operational', minLevel: 30 },
      { id: 'i4', name: 'Service Modules X1', quantity: 200, unit: 'pcs', category: 'Consumables', minLevel: 50 },
      { id: 'i5', name: 'Sterile Dispatch Kits', quantity: 8, unit: 'kits', category: 'Consumables', minLevel: 10 },
      { id: 'i6', name: 'Finish Compound 4', quantity: 15, unit: 'tubes', category: 'Raw Material', minLevel: 5 },
      { id: 'i7', name: 'Audit Seals', quantity: 500, unit: 'pcs', category: 'Administrative', minLevel: 100 }
    ];

    // Generate 15 varied transactions for the past 7 days
    const mockTransactions: Transaction[] = Array.from({ length: 15 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(i / 2));
      const amount = 1500 + Math.floor(Math.random() * 5000);
      const customers: Customer[] = [
        { name: 'James Wilson', phone: '555-0101' },
        { name: 'Sophia Chen', phone: '555-0102' },
        { name: 'Liam O’Connor', phone: '555-0103' },
        { name: 'Emma Watson', phone: '555-0104' },
        { name: 'Noah Miller', phone: '555-0105' }
      ];
      return {
        id: `TX-${100000 + i}`,
        employeeIds: [mockEmps[Math.floor(Math.random() * 3) + 1].id],
        serviceIds: [mockServices[Math.floor(Math.random() * mockServices.length)].id],
        customer: customers[Math.floor(Math.random() * customers.length)],
        paymentMethod: i % 3 === 0 ? 'UPI' : i % 3 === 1 ? 'CASH' : 'SPLIT',
        totalAmount: amount,
        date: date.toISOString()
      };
    });

    onComplete({
      profile: { companyName, sector: s, branches: [{ id: '1', name: 'Metropolis Central', location: 'District 4' }] },
      roles: mockRoles,
      services: mockServices,
      inventory: mockInventory,
      employees: mockEmps,
      transactions: mockTransactions
    });
  };

  return (
    <div className="h-full w-full bg-bone-100 flex items-center justify-center p-8 overflow-y-auto custom-scrollbar">
      <div className="w-full max-w-2xl bg-white border border-bone-300 rounded-[4rem] shadow-premium p-16 lg:p-24 flex flex-col items-center text-center relative overflow-hidden backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-400/[0.05] rounded-full -mr-40 -mt-40 blur-3xl pointer-events-none"></div>
        
        <div className="w-24 h-24 bg-gradient-to-br from-gold-600 to-gold-700 rounded-[2.5rem] flex items-center justify-center text-white font-black text-4xl shadow-2xl mb-16 border border-white/20">R</div>
        
        <h1 className="text-6xl font-black text-gold-700 uppercase tracking-tighter mb-6 leading-none animate-in slide-in-from-top-4 duration-700">Initialize<br/>Boardroom</h1>
        <p className="text-[11px] text-gold-600/40 font-black uppercase tracking-[0.6em] mb-20 animate-in fade-in duration-1000">System Automation & Executive Registry Setup</p>

        <div className="w-full space-y-12 relative z-10 text-left">
          <div className="space-y-5">
            <label className="text-[10px] font-black text-gold-600/40 uppercase tracking-[0.4em] ml-6 block">Executive Entity Name</label>
            <div className="relative group">
              <Building2 className="absolute left-8 top-1/2 -translate-y-1/2 text-gold-300 group-focus-within:text-gold-600 transition-colors" size={24} />
              <input value={companyName} onChange={e=>setCompanyName(e.target.value)} className="w-full bg-bone-50 border border-bone-200 rounded-3xl py-7 pl-20 pr-10 text-2xl font-black text-gold-700 outline-none focus:border-gold-400 transition-all shadow-inner" placeholder="Corporate Title..." />
            </div>
          </div>

          <div className="space-y-6">
            <label className="text-[10px] font-black text-gold-600/40 uppercase tracking-[0.4em] ml-6 block">Operative Sector</label>
            <div className="grid grid-cols-2 gap-6">
              {[Sector.CAFE, Sector.AUTO, Sector.SALON, Sector.MEDICAL].map(s => (
                <button key={s} onClick={() => setSector(s)} className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 group ${sector === s ? 'bg-gold-600 text-white border-gold-600 shadow-xl scale-105' : 'bg-bone-50 border-bone-200 text-gold-600/40 hover:border-gold-400 active:scale-95'}`}>
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-center leading-tight">{s}</span>
                </button>
              ))}
            </div>
          </div>

          <button onClick={bootstrap} disabled={!companyName || !sector} className="w-full py-7 bg-gold-700 text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-sm flex items-center justify-center gap-6 hover:bg-gold-800 transition-all shadow-2xl disabled:opacity-20 mt-12 active:scale-95">
            <span>Initialize Master Registry</span>
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
