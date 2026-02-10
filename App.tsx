import React, { useState } from 'react';
import { NetworkScopeScene } from './components/NetworkScopeScene';
import { TopologyBuilder } from './components/TopologyBuilder';
import { Layout, GitBranch, Settings, GraduationCap } from 'lucide-react';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'TYPES' | 'TOPOLOGY'>('TOPOLOGY');

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-dark-bg text-white font-sans">
      {/* Sidebar Navigation */}
      <div className="w-20 bg-dark-panel border-r border-dark-border flex flex-col items-center py-6 gap-8 z-20">
        <div className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/30">
          <Settings className="text-white" size={24} />
        </div>

        <nav className="flex flex-col gap-6 w-full items-center">
            <button 
                onClick={() => setActiveModule('TYPES')}
                className={`flex flex-col items-center gap-1 transition-all ${activeModule === 'TYPES' ? 'text-brand-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <div className={`p-3 rounded-xl ${activeModule === 'TYPES' ? 'bg-brand-900/50' : ''}`}>
                    <Layout size={24} />
                </div>
                <span className="text-[10px] font-medium">Types</span>
            </button>

            <button 
                onClick={() => setActiveModule('TOPOLOGY')}
                className={`flex flex-col items-center gap-1 transition-all ${activeModule === 'TOPOLOGY' ? 'text-brand-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <div className={`p-3 rounded-xl ${activeModule === 'TOPOLOGY' ? 'bg-brand-900/50' : ''}`}>
                    <GitBranch size={24} />
                </div>
                <span className="text-[10px] font-medium">Topology</span>
            </button>
        </nav>

        <div className="mt-auto">
            <button className="text-slate-500 hover:text-slate-300">
                <GraduationCap size={24} />
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 h-full flex flex-col">
          {activeModule === 'TYPES' ? <NetworkScopeScene /> : <TopologyBuilder />}
      </main>
    </div>
  );
};

export default App;