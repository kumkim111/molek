import React, { useState, useEffect } from 'react';
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
  ChevronDown,
  Activity
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

const Header = () => (
  <header className="bg-zinc-900 border-b border-zinc-800 p-6 sticky top-0 z-50">
    <div className="max-w-6xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-emerald-500 p-2 rounded-lg">
          <Database className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Data Structure Explorer</h1>
          <p className="text-zinc-400 text-sm italic font-serif">เรียนรู้โครงสร้างข้อมูลแบบเข้าใจง่าย</p>
        </div>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="text-zinc-400 hover:text-white transition-colors"
      >
        <RotateCcw className="w-5 h-5" />
      </button>
    </div>
  </header>
);

const SectionHeader = ({ title, icon: Icon, description }: { title: string, icon: any, description: string }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-2">
      <Icon className="text-emerald-400 w-6 h-6" />
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
    </div>
    <p className="text-zinc-400 max-w-2xl">{description}</p>
  </div>
);

const Visualizer = ({ 
  type, 
  items, 
  onAdd, 
  onRemove, 
  onReset 
}: { 
  type: string, 
  items: DSItem[], 
  onAdd: (val: string) => void, 
  onRemove: (id: string) => void,
  onReset: () => void
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-8 hover:border-emerald-500/30 transition-all group">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-medium text-emerald-400 uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4 group-hover:animate-pulse" /> {type} Playground
        </h3>
        <div className="flex items-center gap-2">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="ใส่ข้อมูล..."
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors w-32"
            />
            <button 
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
            >
              <Plus className="w-5 h-5" />
            </button>
          </form>
          <button 
            onClick={onReset}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 p-2 rounded-lg transition-all"
            title="Reset this structure"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="min-h-[200px] flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl p-8 overflow-x-auto custom-scrollbar">
        <div className={`flex gap-4 items-center ${type === 'Stack' ? 'flex-col-reverse' : 'flex-row'}`}>
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                <motion.div
                  layout
                  initial={{ scale: 0.8, opacity: 0, y: type === 'Stack' ? 20 : 0, x: type !== 'Stack' ? -20 : 0 }}
                  animate={{ scale: 1, opacity: 1, y: 0, x: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className={`
                    relative group min-w-[80px] h-16 flex items-center justify-center 
                    bg-zinc-800 border border-zinc-700 rounded-xl text-white font-mono text-lg
                    shadow-lg shadow-black/20
                    ${index === 0 && type === 'Queue' ? 'ring-2 ring-emerald-500 ring-offset-4 ring-offset-zinc-900' : ''}
                    ${index === items.length - 1 && type === 'Stack' ? 'ring-2 ring-emerald-500 ring-offset-4 ring-offset-zinc-900' : ''}
                    ${type === 'Linked-List' ? 'border-l-4 border-l-emerald-500' : ''}
                  `}
                >
                  {item.value}
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  
                  {/* Labels */}
                  {type === 'Queue' && index === 0 && (
                    <span className="absolute -bottom-6 text-[10px] text-emerald-500 uppercase font-bold tracking-tighter">Front</span>
                  )}
                  {type === 'Stack' && index === items.length - 1 && (
                    <span className="absolute -right-12 text-[10px] text-emerald-500 uppercase font-bold tracking-tighter">Top</span>
                  )}
                  {type === 'Linked-List' && index === 0 && (
                    <span className="absolute -top-6 text-[10px] text-emerald-500 uppercase font-bold tracking-tighter">Head</span>
                  )}
                </motion.div>

                {/* Arrows for Linked-List */}
                {type === 'Linked-List' && index < items.length - 1 && (
                  <motion.div 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    className="flex items-center text-emerald-500/50"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </AnimatePresence>
          {items.length === 0 && (
            <p className="text-zinc-600 italic">ไม่มีข้อมูลในขณะนี้...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'linear' | 'nonlinear'>('linear');
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
      
      // Load specific collections into state
      const stack = data.find((c: any) => c.type === 'Stack');
      const queue = data.find((c: any) => c.type === 'Queue');
      const array = data.find((c: any) => c.type === 'Array');
      const linkedList = data.find((c: any) => c.type === 'Linked-List');

      if (stack) setStackItems(JSON.parse(stack.data));
      if (queue) setQueueItems(JSON.parse(queue.data));
      if (array) setArrayItems(JSON.parse(array.data));
      if (linkedList) setLinkedListItems(JSON.parse(linkedList.data));
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      <Header />

      <main className="max-w-6xl mx-auto p-6 pb-24">
        {/* Tab Navigation */}
        <div className="flex gap-4 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl mb-12 w-fit mx-auto md:mx-0">
          <button 
            onClick={() => setActiveTab('linear')}
            className={`px-6 py-2 rounded-xl transition-all font-medium flex items-center gap-2 ${activeTab === 'linear' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-zinc-400 hover:text-white'}`}
          >
            <Layers className="w-4 h-4" /> Linear
          </button>
          <button 
            onClick={() => setActiveTab('nonlinear')}
            className={`px-6 py-2 rounded-xl transition-all font-medium flex items-center gap-2 ${activeTab === 'nonlinear' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-zinc-400 hover:text-white'}`}
          >
            <GitBranch className="w-4 h-4" /> Non-Linear
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'linear' ? (
            <motion.div
              key="linear"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SectionHeader 
                title="Linear Data Structures"
                icon={Layers}
                description="โครงสร้างข้อมูลที่สมาชิกแต่ละตัวจะเชื่อมกับสมาชิกตัวถัดไปเพียงตัวเดียวและมีลำดับที่ต่อเนื่อง"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                {[
                  { name: 'Array', desc: 'เก็บข้อมูลเรียงต่อกัน เข้าถึงด้วย Index' },
                  { name: 'Stack', desc: 'LIFO: เข้าทีหลัง ออกก่อน' },
                  { name: 'Queue', desc: 'FIFO: เข้าก่อน ออกก่อน' },
                  { name: 'Linked-List', desc: 'เชื่อมต่อกันด้วย Pointer/Reference' }
                ].map((ds) => (
                  <div key={ds.name} className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl hover:bg-zinc-800 transition-colors">
                    <h4 className="text-emerald-400 font-bold mb-1">{ds.name}</h4>
                    <p className="text-xs text-zinc-500 leading-tight">{ds.desc}</p>
                  </div>
                ))}
              </div>

              <Visualizer 
                type="Array" 
                items={arrayItems} 
                onAdd={(v) => addItem('Array', v)} 
                onRemove={(id) => removeItem('Array', id)}
                onReset={() => resetStructure('Array')}
              />

              <Visualizer 
                type="Stack" 
                items={stackItems} 
                onAdd={(v) => addItem('Stack', v)} 
                onRemove={(id) => removeItem('Stack', id)}
                onReset={() => resetStructure('Stack')}
              />
              
              <Visualizer 
                type="Queue" 
                items={queueItems} 
                onAdd={(v) => addItem('Queue', v)} 
                onRemove={(id) => removeItem('Queue', id)}
                onReset={() => resetStructure('Queue')}
              />

              <Visualizer 
                type="Linked-List" 
                items={linkedListItems} 
                onAdd={(v) => addItem('Linked-List', v)} 
                onRemove={(id) => removeItem('Linked-List', id)}
                onReset={() => resetStructure('Linked-List')}
              />
            </motion.div>
          ) : (
            <motion.div
              key="nonlinear"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SectionHeader 
                title="Non-Linear Data Structures"
                icon={GitBranch}
                description="โครงสร้างที่ไม่มีคุณสมบัติของเชิงเส้น สามารถแสดงความสัมพันธ์ที่ซับซ้อนได้ ข้อมูลหนึ่งตัวมีความสัมพันธ์กับข้อมูลอื่นได้หลายตัว"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl group hover:border-emerald-500/50 transition-all shadow-xl shadow-black/40"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-emerald-500/10 p-3 rounded-2xl">
                      <GitBranch className="text-emerald-400 w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Tree (ทรี)</h3>
                      <p className="text-zinc-500 text-sm">Hierarchical Structure</p>
                    </div>
                  </div>
                  <p className="text-zinc-400 mb-8 leading-relaxed">
                    โครงสร้างข้อมูลที่มีลักษณะเป็นลำดับชั้น (Hierarchy) มีโหนดราก (Root) และโหนดลูก (Children) 
                    เหมาะสำหรับเก็บข้อมูลที่มีความสัมพันธ์แบบพ่อ-ลูก หรือการจัดหมวดหมู่
                  </p>
                  <div className="relative h-48 flex items-center justify-center bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden">
                    <div className="flex flex-col items-center gap-8 relative z-10">
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20"
                      >
                        R
                      </motion.div>
                      <div className="flex gap-12">
                        <div className="w-10 h-10 rounded-full border-2 border-emerald-500/50 flex items-center justify-center text-zinc-400 bg-zinc-900">A</div>
                        <div className="w-10 h-10 rounded-full border-2 border-emerald-500/50 flex items-center justify-center text-zinc-400 bg-zinc-900">B</div>
                      </div>
                    </div>
                    <div className="absolute inset-0 pointer-events-none">
                       <svg className="w-full h-full stroke-zinc-700 stroke-2 fill-none">
                         <line x1="50%" y1="35%" x2="35%" y2="60%" />
                         <line x1="50%" y1="35%" x2="65%" y2="60%" />
                       </svg>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl group hover:border-emerald-500/50 transition-all shadow-xl shadow-black/40"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-emerald-500/10 p-3 rounded-2xl">
                      <ArrowRightLeft className="text-emerald-400 w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Graph (กราฟ)</h3>
                      <p className="text-zinc-500 text-sm">Network Structure</p>
                    </div>
                  </div>
                  <p className="text-zinc-400 mb-8 leading-relaxed">
                    ประกอบด้วยเซตของโหนด (Vertices) และเส้นเชื่อม (Edges) 
                    ใช้แสดงความสัมพันธ์ที่ไม่มีทิศทางแน่นอนหรือซับซ้อน เช่น เครือข่ายสังคมออนไลน์ หรือแผนที่
                  </p>
                  <div className="relative h-48 flex items-center justify-center bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden">
                    <div className="relative w-32 h-32">
                      <motion.div 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-xs text-emerald-400"
                      >
                        1
                      </motion.div>
                      <motion.div 
                        animate={{ x: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 3.5 }}
                        className="absolute bottom-0 left-0 w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-xs text-emerald-400"
                      >
                        2
                      </motion.div>
                      <motion.div 
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 4.5 }}
                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-xs text-emerald-400"
                      >
                        3
                      </motion.div>
                      <svg className="absolute inset-0 w-full h-full stroke-emerald-500/30 stroke-1 fill-none -z-10">
                        <line x1="50%" y1="15%" x2="15%" y2="85%" />
                        <line x1="50%" y1="15%" x2="85%" y2="85%" />
                        <line x1="15%" y1="85%" x2="85%" y2="85%" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer / Global Actions */}
      <footer className="fixed bottom-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-xl border-t border-zinc-800 p-4 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <Info className="w-4 h-4 text-emerald-500" />
            <span className="hidden sm:inline">ข้อมูลถูกบันทึกอัตโนมัติไปยัง SQL Database</span>
            <span className="sm:hidden">บันทึกอัตโนมัติ</span>
          </div>
          <button 
            onClick={globalReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all font-medium text-sm active:scale-95"
          >
            <Trash2 className="w-4 h-4" /> รีเซ็ตข้อมูลทั้งหมด
          </button>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
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
