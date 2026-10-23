
import React, { useState, useMemo } from 'react';
import { BusinessProfile, Employee, Role, ServiceItem, Customer, PaymentMethod, Transaction, InventoryItem, Unit, RoleType } from '../types.ts';
import { Banknote, Smartphone, Split, ShoppingCart, Layers, ChevronLeft, ChevronRight, User, Trash2, Search, Package, AlertTriangle, Edit2, Check, Store, X, Plus, Save } from 'lucide-react';

export type ShopView = 'Services' | 'Inventory' | 'Catalog';

interface ShopTerminalProps {
  profile: BusinessProfile;
  view: ShopView;
  services: ServiceItem[];
  employees: Employee[];
  roles: Role[];
  inventory?: InventoryItem[];
  currentRole: RoleType;
  onTransactionComplete: (tx: Transaction) => void;
  onUpdateInventory?: (items: InventoryItem[]) => void;
  onUpdateServices?: (items: ServiceItem[]) => void;
}

export const ShopTerminal: React.FC<ShopTerminalProps> = ({ profile, view, services, employees, roles, inventory = [], currentRole, onTransactionComplete, onUpdateInventory, onUpdateServices }) => {
  return (
    <div className="h-full w-full bg-bone-100 dark:bg-slate-950 relative">
      {view === 'Services' && <ServicesWizard services={services} employees={employees} roles={roles} onComplete={onTransactionComplete} />}
      {view === 'Catalog' && <CatalogView services={services} currentRole={currentRole} onUpdateServices={onUpdateServices!} />}
      {view === 'Inventory' && <InventoryView inventory={inventory} currentRole={currentRole} onUpdateInventory={onUpdateInventory!} />}
    </div>
  );
};

const ServicesWizard: React.FC<{ services: ServiceItem[], employees: Employee[], roles: Role[], onComplete: (tx: Transaction) => void }> = ({ services, employees, roles, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedStaff, setSelectedStaff] = useState<Record<string, string>>({}); 
  const [cart, setCart] = useState<(ServiceItem & {qty: number})[]>([]);
  const [customer, setCustomer] = useState<Customer>({ name: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');

  const totalAmount = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.qty), 0), [cart]);

  const finalize = () => {
    onComplete({
      id: `TX-${Date.now().toString().slice(-6)}`,
      employeeIds: Object.values(selectedStaff).filter(Boolean),
      serviceIds: cart.flatMap(i => Array(i.qty).fill(i.id)),
      customer, paymentMethod, totalAmount, date: new Date().toISOString()
    });
    setStep(1); setSelectedStaff({}); setCart([]); setCustomer({name:'', phone:''});
    alert("Transaction Registered into Master Audit.");
  };

  return (
    <div className="flex flex-col h-full bg-bone-100 dark:bg-slate-950">
      <div className="bg-white/80 dark:bg-slate-900/60 glass border-b border-bone-300 dark:border-white/5 py-8 shrink-0 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex justify-between px-10">
          {[1, 2, 3, 4, 5].map(s => (
            <div key={s} className="flex flex-col items-center flex-1 relative">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[11px] font-black border transition-all duration-500 shadow-sm ${step === s ? 'bg-gold-600 text-white border-gold-600 scale-110 shadow-lg' : step > s ? 'bg-gold-800 border-gold-800 text-white' : 'bg-white dark:bg-slate-800 text-gold-600/20 border-bone-300 dark:border-white/5'}`}>
                {step > s ? <Check size={16} strokeWidth={3} /> : s}
              </div>
              <p className={`mt-4 text-[8px] font-black uppercase tracking-[0.4em] ${step === s ? 'text-gold-700 dark:text-white' : 'text-gold-600/20'}`}>Tier {s}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto py-10">
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {employees.filter(e => e.status === 'Active').map(emp => (
                <button key={emp.id} onClick={() => setSelectedStaff({...selectedStaff, default: emp.id})} className={`p-10 rounded-[2.5rem] border transition-all flex flex-col items-center gap-6 group ${selectedStaff.default === emp.id ? 'bg-gold-600 text-white border-gold-600 shadow-premium scale-[1.05]' : 'bg-white dark:bg-slate-900 border-bone-300 dark:border-white/10 hover:border-gold-400 shadow-sm'}`}>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner transition-all ${selectedStaff.default === emp.id ? 'bg-gold-700 text-white' : 'bg-bone-100 dark:bg-slate-800 text-gold-400 group-hover:text-gold-600'}`}>{emp.name[0]}</div>
                  <div className="text-center">
                    <span className="font-black text-[11px] uppercase tracking-[0.2em] block mb-1">Specialist</span>
                    <span className="font-black text-lg uppercase tracking-tighter truncate">{emp.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
             <div className="flex flex-col lg:flex-row gap-12 animate-in fade-in duration-700">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                   {services.map(s => {
                      const qty = cart.find(i => i.id === s.id)?.qty || 0;
                      return (
                        <div key={s.id} onClick={() => {
                           const ex = cart.find(i => i.id === s.id);
                           if(ex) setCart(cart.map(i => i.id === s.id ? {...i, qty: i.qty+1} : i));
                           else setCart([...cart, {...s, qty:1}]);
                        }} className={`bg-white dark:bg-slate-900 border p-6 rounded-[2.5rem] flex flex-col gap-6 cursor-pointer hover:shadow-premium transition-all hover:-translate-y-1 ${qty > 0 ? 'border-gold-600 ring-4 ring-gold-600/5' : 'border-bone-300 dark:border-white/10 shadow-sm'}`}>
                           <div className="w-full aspect-video rounded-2xl overflow-hidden bg-bone-100 border border-bone-200">
                             <img src={s.image} className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-700" />
                           </div>
                           <div className="flex justify-between items-center px-1">
                             <h4 className="font-black text-xs text-gold-700 dark:text-white uppercase tracking-tight truncate flex-1 pr-4">{s.name}</h4>
                             {qty > 0 && <span className="bg-gold-800 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg">x{qty}</span>}
                           </div>
                           <p className="font-black text-2xl tracking-tighter text-gold-600 px-1">₹{s.price}</p>
                        </div>
                      )
                   })}
                </div>
                <div className="w-full lg:w-[420px] bg-white dark:bg-slate-900 border border-bone-300 dark:border-white/10 rounded-[3rem] p-12 flex flex-col sticky top-10 h-fit shadow-premium backdrop-blur-xl">
                   <h3 className="text-[11px] font-black text-gold-600/40 uppercase tracking-[0.5em] mb-12 flex items-center gap-5"><ShoppingCart size={18} className="text-gold-400"/> Registry</h3>
                   <div className="space-y-6 max-h-[350px] overflow-y-auto custom-scrollbar pr-2 min-h-[250px]">
                      {cart.length === 0 ? (
                         <div className="h-full flex flex-col items-center justify-center py-16 opacity-10 text-gold-600 space-y-6">
                           <Layers size={64} />
                           <p className="font-black uppercase tracking-[0.5em] text-[10px]">Registry Empty</p>
                         </div>
                      ) : cart.map(i => (
                        <div key={i.id} className="bg-bone-50 dark:bg-slate-950 p-6 rounded-2xl flex justify-between items-center border border-bone-200 dark:border-white/5 animate-in slide-in-from-right-4 shadow-sm group">
                           <div className="flex flex-col pr-4 min-w-0">
                             <span className="text-[11px] font-black uppercase text-gold-700 dark:text-white tracking-widest truncate">{i.name}</span>
                             <span className="text-[9px] text-gold-600/30 font-black uppercase tracking-widest mt-1">Units x{i.qty}</span>
                           </div>
                           <div className="flex items-center gap-6 shrink-0">
                             <span className="font-black text-gold-600 text-lg tracking-tighter">₹{i.price * i.qty}</span>
                             <button onClick={(e) => { e.stopPropagation(); setCart(cart.filter(item => item.id !== i.id)); }} className="text-gold-300 hover:text-rose-600 transition-all hover:scale-110"><Trash2 size={16}/></button>
                           </div>
                        </div>
                      ))}
                   </div>
                   <div className="mt-12 pt-10 border-t-2 border-bone-100 dark:border-white/5 flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase text-gold-600/20 tracking-[0.4em]">Settled Value</span>
                      <span className="text-5xl font-black text-gold-700 dark:text-white tracking-tighter">₹{totalAmount}</span>
                   </div>
                </div>
             </div>
          )}

          {step === 3 && (
            <div className="max-w-2xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700 py-16">
              <div className="bg-white dark:bg-slate-900 border border-bone-300 dark:border-white/10 p-16 rounded-[3rem] shadow-premium relative overflow-hidden backdrop-blur-xl">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gold-600"></div>
                <h3 className="text-3xl font-black text-gold-700 dark:text-white uppercase tracking-tighter mb-16 flex items-center gap-6">
                  <User size={32} className="text-gold-400" /> Client Validation
                </h3>
                <div className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gold-600/40 uppercase tracking-[0.4em] ml-4 block">Identity Name</label>
                    <input autoFocus value={customer.name} onChange={e=>setCustomer({...customer, name:e.target.value})} className="w-full bg-bone-50 dark:bg-slate-950 p-6 rounded-2xl font-black text-gold-700 dark:text-white text-2xl outline-none border border-transparent focus:border-gold-400 transition-all shadow-inner" placeholder="E.g. Alexander Vance" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gold-600/40 uppercase tracking-[0.4em] ml-4 block">Comms Channel</label>
                    <input type="tel" value={customer.phone} onChange={e=>setCustomer({...customer, phone:e.target.value})} className="w-full bg-bone-50 dark:bg-slate-950 p-6 rounded-2xl font-black text-gold-700 dark:text-white text-2xl outline-none border border-transparent focus:border-gold-400 transition-all shadow-inner" placeholder="Registry Phone..." />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-5xl mx-auto animate-in fade-in duration-700 py-16">
              {(['CASH', 'UPI', 'SPLIT'] as PaymentMethod[]).map(m => (
                <button key={m} onClick={() => setPaymentMethod(m)} className={`p-16 rounded-[3rem] border flex flex-col items-center gap-10 transition-all shadow-premium ${paymentMethod === m ? 'bg-gold-600 text-white border-gold-600 shadow-2xl scale-105' : 'bg-white dark:bg-slate-900 border-bone-300 dark:border-white/10 hover:border-gold-400'}`}>
                  <div className={`p-6 rounded-3xl transition-all ${paymentMethod === m ? 'bg-gold-700' : 'bg-bone-100 dark:bg-slate-800 text-gold-600'}`}>
                    {m === 'CASH' ? <Banknote size={48} strokeWidth={1}/> : m === 'UPI' ? <Smartphone size={48} strokeWidth={1}/> : <Split size={48} strokeWidth={1}/>}
                  </div>
                  <span className="font-black text-[11px] uppercase tracking-[0.5em]">{m} Protocol</span>
                </button>
              ))}
            </div>
          )}

          {step === 5 && (
            <div className="max-w-3xl mx-auto bg-gold-700 text-white p-20 rounded-[4rem] shadow-premium animate-in slide-in-from-bottom-12 duration-1000 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
               <h3 className="text-5xl font-black tracking-tighter uppercase mb-16 leading-none">Master Registry<br/>Archival</h3>
               <div className="space-y-10 border-t border-white/10 pt-12">
                  <div className="flex justify-between font-black uppercase text-[11px] tracking-[0.4em]"><span className="opacity-40">Tier Identity</span><span>{customer.name}</span></div>
                  <div className="flex justify-between font-black uppercase text-[11px] tracking-[0.4em]"><span className="opacity-40">Protocol</span><span>{paymentMethod}</span></div>
                  <div className="flex justify-between font-black uppercase text-[11px] tracking-[0.4em] pt-12 border-t border-white/5 items-end">
                    <span className="opacity-40 mb-4">Finalized Sum</span>
                    <span className="text-7xl tracking-tighter">₹{totalAmount}</span>
                  </div>
               </div>
               <div className="mt-16 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.6em] opacity-30">Authentic_Audit_Token_Registered</p>
               </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/95 dark:bg-slate-900/95 glass border-t border-bone-300 dark:border-white/10 p-8 flex justify-between items-center px-12 shrink-0 sticky bottom-0 z-20">
         <button onClick={() => setStep(s => s - 1)} disabled={step===1} className={`flex items-center gap-4 px-12 py-4 bg-bone-200 dark:bg-slate-800 text-gold-700 dark:text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] transition-all ${step===1 ? 'opacity-0' : 'hover:bg-bone-300 dark:hover:bg-slate-700 active:scale-95'}`}><ChevronLeft size={16} /> Back</button>
         {step < 5 ? (
           <button onClick={() => setStep(s => s + 1)} disabled={(step===2 && cart.length === 0) || (step===1 && !selectedStaff.default) || (step===3 && !customer.name)} className="flex items-center gap-6 px-16 py-4 bg-gold-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-gold-700 shadow-xl transition-all active:scale-95">Next Tier <ChevronRight size={16} /></button>
         ) : (
           <button onClick={finalize} className="px-24 py-4 bg-emerald-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] shadow-xl hover:bg-emerald-800 transition-all active:scale-95">Commit Registry</button>
         )}
      </div>
    </div>
  );
};

const InventoryView = ({ inventory, onUpdateInventory, currentRole }: any) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const handleSave = (item: InventoryItem) => {
    if (editingItem) {
      onUpdateInventory(inventory.map((i: any) => i.id === editingItem.id ? item : i));
    } else {
      onUpdateInventory([...inventory, item]);
    }
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Confirm material deletion from master ledger?")) {
      onUpdateInventory(inventory.filter((i: any) => i.id !== id));
    }
  };

  return (
    <div className="w-full px-8 lg:px-12 py-12 space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <h2 className="text-5xl font-black text-gold-700 dark:text-white uppercase tracking-tighter flex items-center gap-6">
            <Package className="size-12 text-gold-400" strokeWidth={1} /> Material Ledger
          </h2>
          <p className="text-[10px] text-gold-600/40 font-black uppercase tracking-[0.5em] mt-5 pl-1">Surveillance / Operational Inputs Registry</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setIsFormOpen(true); }}
          className="bg-gold-600 text-white px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gold-700 shadow-xl transition-all active:scale-95 flex items-center gap-3"
        >
          <Plus size={16} /> Register Material
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-24">
        {inventory.map((item: any) => (
          <div key={item.id} className="bg-white dark:bg-slate-900 border border-bone-300 dark:border-white/10 p-10 rounded-[2.5rem] shadow-premium hover:border-gold-400 transition-all group overflow-hidden relative">
            <div className="flex justify-between items-start mb-8 relative z-10">
               <span className="bg-bone-100 dark:bg-slate-800 px-4 py-1.5 rounded-xl text-[9px] font-black text-gold-600 uppercase tracking-widest border border-bone-200 dark:border-white/5">{item.category}</span>
               {item.quantity < (item.minLevel || 5) && <AlertTriangle size={18} className="text-rose-500 animate-pulse" />}
            </div>
            <h4 className="font-black text-gold-700 dark:text-white uppercase text-xl tracking-tight truncate mb-10 relative z-10">{item.name}</h4>
            <div className="flex justify-between items-end relative z-10">
              <div className="text-5xl font-black text-gold-600 tracking-tighter">{item.quantity}<span className="text-[11px] ml-2 text-gold-400 uppercase tracking-widest font-black">{item.unit}</span></div>
              <div className="flex gap-2">
                <button 
                  onClick={() => { setEditingItem(item); setIsFormOpen(true); }}
                  className="p-3 bg-bone-50 dark:bg-slate-800 rounded-xl text-gold-400 hover:text-gold-700 border border-bone-200 dark:border-white/5 shadow-sm transition-all"
                >
                  <Edit2 size={16}/>
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-3 bg-bone-50 dark:bg-slate-800 rounded-xl text-gold-300 hover:text-rose-500 border border-bone-200 dark:border-white/5 shadow-sm transition-all"
                >
                  <Trash2 size={16}/>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <InventoryForm 
          onSave={handleSave} 
          onClose={() => setIsFormOpen(false)} 
          initialData={editingItem} 
        />
      )}
    </div>
  );
};

const CatalogView = ({ services, onUpdateServices, currentRole }: any) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const isExecutionTier = currentRole === 'EMPLOYEE';

  const handleSave = (service: ServiceItem) => {
    if (editingItem) {
      onUpdateServices(services.map((s: any) => s.id === editingItem.id ? service : s));
    } else {
      // Ensure the newly added item has a unique ID
      const newService = { ...service, id: `SVC-${Date.now()}` };
      onUpdateServices([...services, newService]);
    }
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Confirm protocol deletion from active catalog?")) {
      onUpdateServices(services.filter((s: any) => s.id !== id));
    }
  };

  return (
    <div className="w-full px-8 lg:px-12 py-12 space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
         <div>
           <h2 className="text-5xl font-black text-gold-700 dark:text-white uppercase tracking-tighter flex items-center gap-6">
             <Store className="size-12 text-gold-400" strokeWidth={1} /> Protocol Portfolio
           </h2>
           <p className="text-[10px] text-gold-600/40 font-black uppercase tracking-[0.5em] mt-5 pl-1">Governance / Active Service Catalogs</p>
         </div>
         {!isExecutionTier && (
           <button 
             onClick={() => { setEditingItem(null); setIsFormOpen(true); }}
             className="bg-gold-600 text-white px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gold-700 shadow-xl transition-all active:scale-95 flex items-center gap-3"
           >
             <Plus size={16} /> Register Protocol
           </button>
         )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 pb-32">
        {services.map((s: any) => (
          <div key={s.id} className="bg-white dark:bg-slate-900 border border-bone-300 dark:border-white/10 rounded-[3rem] overflow-hidden hover:border-gold-400 transition-all shadow-premium group relative backdrop-blur-md">
            <div className="h-52 overflow-hidden border-b border-bone-100 dark:border-white/5 bg-bone-50 relative">
              <img src={s.image} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-90 group-hover:opacity-100" />
              {!isExecutionTier && (
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                   <button onClick={() => { setEditingItem(s); setIsFormOpen(true); }} className="p-3 bg-white/90 glass text-gold-600 rounded-xl hover:text-gold-900 shadow-xl"><Edit2 size={16}/></button>
                   <button onClick={() => handleDelete(s.id)} className="p-3 bg-white/90 glass text-rose-500 rounded-xl hover:text-rose-700 shadow-xl"><Trash2 size={16}/></button>
                </div>
              )}
            </div>
            <div className="p-8">
              <p className="text-[9px] text-gold-600/30 font-black uppercase tracking-widest mb-3">{s.category}</p>
              <h4 className="font-black text-gold-700 dark:text-white uppercase text-lg tracking-tight truncate mb-8">{s.name}</h4>
              <p className="text-2xl font-black text-gold-600 tracking-tighter">₹{s.price}</p>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <CatalogForm 
          onSave={handleSave} 
          onClose={() => setIsFormOpen(false)} 
          initialData={editingItem} 
        />
      )}
    </div>
  );
};

const InventoryForm = ({ onSave, onClose, initialData }: { onSave: (item: InventoryItem) => void, onClose: () => void, initialData: InventoryItem | null }) => {
  const [formData, setFormData] = useState<InventoryItem>(initialData || {
    id: `MAT-${Date.now().toString().slice(-6)}`,
    name: '',
    quantity: 0,
    unit: 'pcs',
    category: 'Materials',
    minLevel: 5
  });

  const units: Unit[] = ['kg', 'lbs', 'pcs', 'ltr', 'gal', 'box', 'packs', 'tubes', 'kits'];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 glass bg-bone-900/40">
       <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-bone-300 dark:border-white/10 animate-in zoom-in-95 duration-300">
          <div className="bg-bone-100 dark:bg-slate-800 p-8 flex justify-between items-center border-b border-bone-300 dark:border-white/5">
             <h3 className="text-[11px] font-black text-gold-700 dark:text-white uppercase tracking-[0.5em]">Material Registry Update</h3>
             <button onClick={onClose} className="p-2 text-gold-400 hover:text-rose-500 transition-colors"><X size={20}/></button>
          </div>
          <div className="p-10 space-y-8">
             <div className="space-y-3">
                <label className="text-[10px] font-black text-gold-600/40 uppercase tracking-widest ml-4">Identifier</label>
                <input value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-bone-50 dark:bg-slate-950 p-5 rounded-2xl font-black text-gold-700 dark:text-white text-lg outline-none border border-transparent focus:border-gold-400 transition-all shadow-inner" placeholder="E.g. Roasted Bean - Grade A" />
             </div>
             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-gold-600/40 uppercase tracking-widest ml-4">Tier Category</label>
                   <input value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full bg-bone-50 dark:bg-slate-950 p-4 rounded-2xl font-black text-gold-700 dark:text-white text-sm outline-none border border-transparent focus:border-gold-400 transition-all shadow-inner" placeholder="E.g. Supplies" />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-gold-600/40 uppercase tracking-widest ml-4">Metric Unit</label>
                   <select value={formData.unit} onChange={e=>setFormData({...formData, unit: e.target.value as Unit})} className="w-full bg-bone-50 dark:bg-slate-950 p-4 rounded-2xl font-black text-gold-700 dark:text-white text-sm outline-none border border-transparent focus:border-gold-400 transition-all shadow-inner appearance-none">
                      {units.map(u => <option key={u} value={u}>{u.toUpperCase()}</option>)}
                   </select>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-gold-600/40 uppercase tracking-widest ml-4">Current Stock</label>
                   <input type="number" value={formData.quantity} onChange={e=>setFormData({...formData, quantity: parseInt(e.target.value) || 0})} className="w-full bg-bone-50 dark:bg-slate-950 p-4 rounded-2xl font-black text-gold-700 dark:text-white text-sm outline-none border border-transparent focus:border-gold-400 transition-all shadow-inner" />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-gold-600/40 uppercase tracking-widest ml-4">Audit Threshold</label>
                   <input type="number" value={formData.minLevel} onChange={e=>setFormData({...formData, minLevel: parseInt(e.target.value) || 0})} className="w-full bg-bone-50 dark:bg-slate-950 p-4 rounded-2xl font-black text-gold-700 dark:text-white text-sm outline-none border border-transparent focus:border-gold-400 transition-all shadow-inner" />
                </div>
             </div>
             <button onClick={() => onSave(formData)} disabled={!formData.name} className="w-full py-6 bg-gold-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] shadow-xl hover:bg-gold-800 transition-all disabled:opacity-20 flex items-center justify-center gap-4 mt-4">
                <Save size={18} /> Commit Ledger Update
             </button>
          </div>
       </div>
    </div>
  );
};

const CatalogForm = ({ onSave, onClose, initialData }: { onSave: (service: ServiceItem) => void, onClose: () => void, initialData: ServiceItem | null }) => {
  const [formData, setFormData] = useState<ServiceItem>(initialData || {
    id: `SVC-${Date.now().toString().slice(-6)}`,
    name: '',
    price: 0,
    category: 'Core',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&fit=crop'
  });

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 glass bg-bone-900/40">
       <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[4rem] shadow-2xl overflow-hidden border border-bone-300 dark:border-white/10 animate-in zoom-in-95 duration-300">
          <div className="bg-bone-100 dark:bg-slate-800 p-8 flex justify-between items-center border-b border-bone-300 dark:border-white/5">
             <h3 className="text-[11px] font-black text-gold-700 dark:text-white uppercase tracking-[0.5em]">Protocol Catalog Entry</h3>
             <button onClick={onClose} className="p-2 text-gold-400 hover:text-rose-500 transition-colors"><X size={20}/></button>
          </div>
          <div className="flex flex-col md:flex-row">
             <div className="md:w-1/2 p-10 border-r border-bone-200 dark:border-white/5 bg-bone-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-8">
                <div className="w-full aspect-video rounded-[2rem] overflow-hidden shadow-premium border border-white/20">
                   <img src={formData.image} className="w-full h-full object-cover" />
                </div>
                <div className="w-full space-y-3">
                   <label className="text-[10px] font-black text-gold-600/40 uppercase tracking-widest ml-4 block">Visual URL</label>
                   <input value={formData.image} onChange={e=>setFormData({...formData, image: e.target.value})} className="w-full bg-white dark:bg-slate-900 p-4 rounded-xl font-bold text-xs text-gold-600 outline-none border border-bone-200 dark:border-white/5 focus:border-gold-400" placeholder="Unsplash/Image URL..." />
                </div>
             </div>
             <div className="flex-1 p-10 space-y-8">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-gold-600/40 uppercase tracking-widest ml-4">Protocol Identity</label>
                   <input value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-bone-50 dark:bg-slate-950 p-5 rounded-2xl font-black text-gold-700 dark:text-white text-lg outline-none border border-transparent focus:border-gold-400 transition-all shadow-inner" placeholder="E.g. Signature Blend" />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-gold-600/40 uppercase tracking-widest ml-4">Tier Category</label>
                   <input value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full bg-bone-50 dark:bg-slate-950 p-4 rounded-2xl font-black text-gold-700 dark:text-white text-sm outline-none border border-transparent focus:border-gold-400 transition-all shadow-inner" placeholder="E.g. Core Menu" />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-gold-600/40 uppercase tracking-widest ml-4">Settlement Price (₹)</label>
                   <input type="number" value={formData.price} onChange={e=>setFormData({...formData, price: parseInt(e.target.value) || 0})} className="w-full bg-bone-50 dark:bg-slate-950 p-5 rounded-2xl font-black text-gold-700 dark:text-white text-2xl outline-none border border-transparent focus:border-gold-400 transition-all shadow-inner" />
                </div>
                <button onClick={() => onSave(formData)} disabled={!formData.name} className="w-full py-6 bg-gold-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] shadow-xl hover:bg-gold-800 transition-all disabled:opacity-20 flex items-center justify-center gap-4 mt-4">
                   <Save size={18} /> Finalize Protocol
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};
