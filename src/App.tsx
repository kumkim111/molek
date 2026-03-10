import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layers, 
  Database, 
  GitBranch, 
  ArrowRightLeft, 
  Plus, 
  Trash2, 
  RotateCcw,
  Info,
  ChevronRight,
  Terminal,
  Cpu,
  Box,
  Share2,
  Zap,
  LayoutGrid,
  List
} from 'lucide-react';

// --- Types ---
type DSItem = {
  id: string;
  value: string;
};

type Collection = {
  id: number;
  type: string;
  data: string; // JSON string of DSItem[]
};

// --- API Helpers ---
const API = {
  getCollections: async () => {
    const res = await fetch('/api/collections');
    return res.json();
  },
  saveCollection: async (type: string, data: DSItem[]) => {
    const res = await fetch('/api/collections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data })
    });
    return res.json();
  },
  updateCollection: async (id: number, data: DSItem[]) => {
    const res = await fetch(`/api/collections/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data })
    });
    return res.json();
  },
  deleteCollection: async (id: number) => {
    const res = await fetch(`/api/collections/${id}`, { method: 'DELETE' });
    return res.json();
  },
  reset: async () => {
    const res = await fetch('/api/reset', { method: 'POST' });
    return res.json();
  }
};

// --- Components ---

const LabHeader = () => (
  <header className="bg-zinc-950 border-b border-zinc-800/50 p-4 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 animate-pulse"></div>
          <div className="relative bg-zinc-900 border border-indigo-500/30 p-2.5 rounded-xl">
            <Cpu className="text-indigo-400 w-6 h-6" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            DS-LAB <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20 uppercase tracking-widest">v2.0</span>
          </h1>
          <p className="text-zinc-500 text-[11px] uppercase tracking-tighter font-mono">Experimental Data Structure Environment</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-lg text-[10px] text-zinc-400 font-mono">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          SQL SERVER: CONNECTED
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  </header>
);

const LabSidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: any) => void }) => {
  const tabs = [
    { id: 'linear', label: 'Linear', icon: Layers, color: 'text-indigo-400' },
    { id: 'nonlinear', label: 'Non-Linear', icon: GitBranch, color: 'text-emerald-400' },
    { id: 'console', label: 'SQL Console', icon: Terminal, color: 'text-amber-400' }
  ];

  return (
    <div className="w-full md:w-64 flex flex-col gap-2 p-4 border-r border-zinc-800/50 min-h-[calc(100vh-73px)]">
      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-2 px-2">Navigation</p>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
            ${activeTab === tab.id 
              ? 'bg-zinc-900 border border-zinc-800 text-white shadow-xl shadow-black/20' 
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'}
          `}
        >
          <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? tab.color : 'text-zinc-600 group-hover:text-zinc-400'}`} />
          <span className="font-medium">{tab.label}</span>
          {activeTab === tab.id && (
            <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
          )}
        </button>
      ))}
      
      <div className="mt-auto p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-3 h-3 text-amber-400" />
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Quick Tip</span>
        </div>
        <p className="text-[11px] text-zinc-500 leading-relaxed italic">
          "Linear structures connect elements sequentially, while Non-Linear structures allow complex relationships."
        </p>
      </div>
    </div>
  );
};

const DSPlayground = ({ 
  type, 
  items, 
  onAdd, 
  onRemove, 
  onReset,
  accentColor = "indigo"
}: { 
  type: string, 
  items: DSItem[], 
  onAdd: (val: string) => void, 
  onRemove: (id: string) => void,
  onReset: () => void,
  accentColor?: string
}) => {
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [items]);

  const colorMap: any = {
    indigo: "text-indigo-400 border-indigo-500/30 bg-indigo-500",
    emerald: "text-emerald-400 border-emerald-500/30 bg-emerald-500",
    amber: "text-amber-400 border-amber-500/30 bg-amber-500",
    rose: "text-rose-400 border-rose-500/30 bg-rose-500"
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-6 mb-6 hover:bg-zinc-900/60 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-zinc-800 border ${colorMap[accentColor].split(' ')[1]}`}>
            <Box className={`w-4 h-4 ${colorMap[accentColor].split(' ')[0]}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">{type}</h3>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-tighter">Persistent Data Structure</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Value..."
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all w-28"
            />
            <button 
              type="submit"
              className={`${colorMap[accentColor].split(' ')[2]} hover:opacity-90 text-white px-3 py-2 rounded-xl transition-all active:scale-95 shadow-lg shadow-black/20`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
          <button 
            onClick={onReset}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 p-2 rounded-xl transition-all"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="min-h-[160px] flex items-center justify-center bg-zinc-950/50 border border-zinc-800/50 rounded-2xl p-8 overflow-x-auto custom-scrollbar relative"
      >
        <div className="absolute top-4 left-4 flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
        </div>

        <div className={`flex gap-4 items-center ${type === 'Stack' ? 'flex-col-reverse' : 'flex-row'}`}>
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ scale: 0.8, opacity: 0, y: type === 'Stack' ? 20 : 0, x: type !== 'Stack' ? -20 : 0 }}
                animate={{ scale: 1, opacity: 1, y: 0, x: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center gap-4"
              >
                <div
                  className={`
                    relative group min-w-[70px] h-14 flex items-center justify-center 
                    bg-zinc-900 border border-zinc-800 rounded-xl text-white font-mono text-sm
                    shadow-xl shadow-black/40 hover:border-indigo-500/50 transition-all
                    ${index === 0 && type === 'Queue' ? 'ring-1 ring-indigo-500 ring-offset-4 ring-offset-zinc-950' : ''}
                    ${index === items.length - 1 && type === 'Stack' ? 'ring-1 ring-indigo-500 ring-offset-4 ring-offset-zinc-950' : ''}
                    ${type === 'Linked-List' ? 'border-l-2 border-l-indigo-500' : ''}
                  `}
                >
                  <span className="opacity-30 text-[9px] absolute top-1 left-2">0x{index.toString(16).padStart(2, '0')}</span>
                  {item.value}
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                  
                  {/* Labels */}
                  {type === 'Queue' && index === 0 && (
                    <span className="absolute -bottom-6 text-[8px] text-indigo-400 uppercase font-bold tracking-widest">Front</span>
                  )}
                  {type === 'Stack' && index === items.length - 1 && (
                    <span className="absolute -right-10 text-[8px] text-indigo-400 uppercase font-bold tracking-widest">Top</span>
                  )}
                  {type === 'Linked-List' && index === 0 && (
                    <span className="absolute -top-6 text-[8px] text-indigo-400 uppercase font-bold tracking-widest">Head</span>
                  )}
                </div>

                {/* Arrows for Linked-List */}
                {type === 'Linked-List' && index < items.length - 1 && (
                  <div className="flex items-center text-zinc-700">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {items.length === 0 && (
            <div className="flex flex-col items-center gap-2 opacity-20">
              <Database className="w-8 h-8" />
              <p className="text-xs italic font-mono uppercase tracking-widest">Empty Buffer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SQLConsole = ({ collections }: { collections: Collection[] }) => {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col h-[calc(100vh-180px)]">
      <div className="bg-zinc-900/50 border-b border-zinc-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Database Console</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
        </div>
      </div>
      <div className="p-6 overflow-y-auto custom-scrollbar font-mono text-xs leading-relaxed">
        <div className="text-emerald-500 mb-4">-- Data Structure Lab SQL Dump --</div>
        <div className="text-zinc-500 mb-6">-- Last Updated: {new Date().toLocaleTimeString()} --</div>
        
        {collections.length === 0 ? (
          <div className="text-zinc-700 italic">No records found in 'collections' table.</div>
        ) : (
          <div className="space-y-6">
            {collections.map((col) => (
              <div key={col.id} className="bg-zinc-900/30 border border-zinc-800/50 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-amber-500">SELECT * FROM collections WHERE id = {col.id};</span>
                  <span className="text-zinc-600 text-[10px]">Type: {col.type}</span>
                </div>
                <pre className="text-zinc-400 whitespace-pre-wrap break-all">
                  {JSON.stringify(JSON.parse(col.data), null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 flex items-center gap-2 text-zinc-600">
          <span className="animate-pulse">_</span>
          <span>Waiting for input...</span>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'linear' | 'nonlinear' | 'console'>('linear');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  // Local states for playgrounds
  const [stackItems, setStackItems] = useState<DSItem[]>([]);
  const [queueItems, setQueueItems] = useState<DSItem[]>([]);
  const [arrayItems, setArrayItems] = useState<DSItem[]>([]);
  const [linkedListItems, setLinkedListItems] = useState<DSItem[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await API.getCollections();
      setCollections(data);
      
      const stack = data.find((c: any) => c.type === 'Stack');
      const queue = data.find((c: any) => c.type === 'Queue');
      const array = data.find((c: any) => c.type === 'Array');
      const linkedList = data.find((c: any) => c.type === 'Linked-List');

      setStackItems(stack ? JSON.parse(stack.data) : []);
      setQueueItems(queue ? JSON.parse(queue.data) : []);
      setArrayItems(array ? JSON.parse(array.data) : []);
      setLinkedListItems(linkedList ? JSON.parse(linkedList.data) : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (type: string, newItems: DSItem[]) => {
    const existing = collections.find(c => c.type === type);
    if (existing) {
      await API.updateCollection(existing.id, newItems);
    } else {
      await API.saveCollection(type, newItems);
    }
    fetchData();
  };

  const addItem = (type: string, value: string) => {
    const newItem = { id: Math.random().toString(36).substr(2, 9), value };
    let updated: DSItem[] = [];
    
    if (type === 'Stack') {
      updated = [...stackItems, newItem];
      setStackItems(updated);
    } else if (type === 'Queue') {
      updated = [...queueItems, newItem];
      setQueueItems(updated);
    } else if (type === 'Array') {
      updated = [...arrayItems, newItem];
      setArrayItems(updated);
    } else if (type === 'Linked-List') {
      updated = [...linkedListItems, newItem];
      setLinkedListItems(updated);
    }
    
    handleUpdate(type, updated);
  };

  const removeItem = (type: string, id: string) => {
    let updated: DSItem[] = [];
    if (type === 'Stack') {
      updated = stackItems.filter(i => i.id !== id);
      setStackItems(updated);
    } else if (type === 'Queue') {
      updated = queueItems.filter(i => i.id !== id);
      setQueueItems(updated);
    } else if (type === 'Array') {
      updated = arrayItems.filter(i => i.id !== id);
      setArrayItems(updated);
    } else if (type === 'Linked-List') {
      updated = linkedListItems.filter(i => i.id !== id);
      setLinkedListItems(updated);
    }
    handleUpdate(type, updated);
  };

  const resetStructure = async (type: string) => {
    if (type === 'Stack') setStackItems([]);
    if (type === 'Queue') setQueueItems([]);
    if (type === 'Array') setArrayItems([]);
    if (type === 'Linked-List') setLinkedListItems([]);
    
    const existing = collections.find(c => c.type === type);
    if (existing) {
      await API.deleteCollection(existing.id);
    }
    fetchData();
  };

  const globalReset = async () => {
    if (confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดใช่หรือไม่?')) {
      await API.reset();
      setStackItems([]);
      setQueueItems([]);
      setArrayItems([]);
      setLinkedListItems([]);
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30">
      <LabHeader />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        <LabSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6 pb-24 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'linear' && (
              <motion.div
                key="linear"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Linear Data Structures</h2>
                  <p className="text-zinc-500 text-sm max-w-2xl">
                    โครงสร้างข้อมูลที่สมาชิกแต่ละตัวจะเชื่อมกับสมาชิกตัวถัดไปเพียงตัวเดียวและมีลำดับที่ต่อเนื่อง
                  </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <DSPlayground 
                    type="Array" 
                    items={arrayItems} 
                    onAdd={(v) => addItem('Array', v)} 
                    onRemove={(id) => removeItem('Array', id)}
                    onReset={() => resetStructure('Array')}
                    accentColor="indigo"
                  />
                  <DSPlayground 
                    type="Stack" 
                    items={stackItems} 
                    onAdd={(v) => addItem('Stack', v)} 
                    onRemove={(id) => removeItem('Stack', id)}
                    onReset={() => resetStructure('Stack')}
                    accentColor="emerald"
                  />
                  <DSPlayground 
                    type="Queue" 
                    items={queueItems} 
                    onAdd={(v) => addItem('Queue', v)} 
                    onRemove={(id) => removeItem('Queue', id)}
                    onReset={() => resetStructure('Queue')}
                    accentColor="amber"
                  />
                  <DSPlayground 
                    type="Linked-List" 
                    items={linkedListItems} 
                    onAdd={(v) => addItem('Linked-List', v)} 
                    onRemove={(id) => removeItem('Linked-List', id)}
                    onReset={() => resetStructure('Linked-List')}
                    accentColor="rose"
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'nonlinear' && (
              <motion.div
                key="nonlinear"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Non-Linear Data Structures</h2>
                  <p className="text-zinc-500 text-sm max-w-2xl">
                    โครงสร้างที่ไม่มีคุณสมบัติของเชิงเส้น สามารถใช้แสดงความสัมพันธ์ที่ซับซ้อนได้มากกว่า
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-[2rem] group hover:bg-zinc-900/60 transition-all">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-indigo-500/10 p-3 rounded-2xl border border-indigo-500/20">
                        <GitBranch className="text-indigo-400 w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Tree (ทรี)</h3>
                        <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">Hierarchical Model</p>
                      </div>
                    </div>
                    <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
                      โครงสร้างข้อมูลที่มีลักษณะเป็นลำดับชั้น (Hierarchy) มีโหนดราก (Root) และโหนดลูก (Children) 
                      ข้อมูลหนึ่งตัวมีความสัมพันธ์กับข้อมูลอื่นได้หลายตัวในทิศทางเดียว
                    </p>
                    <div className="relative h-64 flex items-center justify-center bg-zinc-950/50 rounded-3xl border border-zinc-800/50 overflow-hidden">
                      <div className="flex flex-col items-center gap-12 relative z-10">
                        <motion.div 
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 4 }}
                          className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white font-bold shadow-2xl shadow-indigo-500/40 border border-indigo-400/30"
                        >
                          ROOT
                        </motion.div>
                        <div className="flex gap-20">
                          <div className="w-10 h-10 rounded-xl border border-zinc-700 flex items-center justify-center text-zinc-500 bg-zinc-900 text-xs">A</div>
                          <div className="w-10 h-10 rounded-xl border border-zinc-700 flex items-center justify-center text-zinc-500 bg-zinc-900 text-xs">B</div>
                        </div>
                      </div>
                      <div className="absolute inset-0 pointer-events-none opacity-20">
                         <svg className="w-full h-full stroke-indigo-500 stroke-2 fill-none">
                           <line x1="50%" y1="35%" x2="35%" y2="65%" />
                           <line x1="50%" y1="35%" x2="65%" y2="65%" />
                         </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-[2rem] group hover:bg-zinc-900/60 transition-all">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20">
                        <ArrowRightLeft className="text-emerald-400 w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Graph (กราฟ)</h3>
                        <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">Network Model</p>
                      </div>
                    </div>
                    <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
                      ประกอบด้วยเซตของโหนด (Vertices) และเส้นเชื่อม (Edges) 
                      ใช้แสดงความสัมพันธ์ที่ไม่มีทิศทางแน่นอนหรือซับซ้อน เช่น เครือข่ายสังคมออนไลน์
                    </p>
                    <div className="relative h-64 flex items-center justify-center bg-zinc-950/50 rounded-3xl border border-zinc-800/50 overflow-hidden">
                      <div className="relative w-40 h-40">
                        <motion.div 
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 5 }}
                          className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-xs text-emerald-400 shadow-lg shadow-emerald-500/20"
                        >
                          V1
                        </motion.div>
                        <motion.div 
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                          className="absolute bottom-0 left-0 w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-xs text-emerald-400 shadow-lg shadow-emerald-500/20"
                        >
                          V2
                        </motion.div>
                        <motion.div 
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 6, delay: 0.5 }}
                          className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-xs text-emerald-400 shadow-lg shadow-emerald-500/20"
                        >
                          V3
                        </motion.div>
                        <svg className="absolute inset-0 w-full h-full stroke-emerald-500/20 stroke-1 fill-none -z-10">
                          <line x1="50%" y1="15%" x2="15%" y2="85%" />
                          <line x1="50%" y1="15%" x2="85%" y2="85%" />
                          <line x1="15%" y1="85%" x2="85%" y2="85%" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'console' && (
              <motion.div
                key="console"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white tracking-tight mb-2">System Console</h2>
                  <p className="text-zinc-500 text-sm max-w-2xl">
                    ตรวจสอบข้อมูลดิบที่ถูกบันทึกไว้ใน SQL Database แบบ Real-time
                  </p>
                </div>
                <SQLConsole collections={collections} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Global Actions Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-800/50 p-4 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-mono uppercase tracking-widest">
              <Share2 className="w-3 h-3 text-indigo-500" />
              <span>Session Persistence Active</span>
            </div>
            <div className="h-4 w-px bg-zinc-800"></div>
            <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-mono uppercase tracking-widest">
              <Database className="w-3 h-3 text-emerald-500" />
              <span>{collections.length} Tables Syncing</span>
            </div>
          </div>
          <button 
            onClick={globalReset}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest active:scale-95 border border-rose-500/20"
          >
            <Trash2 className="w-3 h-3" /> Factory Reset
          </button>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
    </div>
  );
}
