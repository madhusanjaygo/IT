import React, { useState } from 'react';
import { NetworkScope } from '../types';
import { SCOPE_INFO, COLORS } from '../constants';
import { Smartphone, Laptop, Globe, Building2, Wifi, Zap } from 'lucide-react';

export const NetworkScopeScene: React.FC = () => {
  const [scope, setScope] = useState<NetworkScope>('PAN');
  const [showDataFlow, setShowDataFlow] = useState(false);

  const renderScene = () => {
    switch (scope) {
      case 'PAN':
        return (
          <div className="relative w-64 h-64 mx-auto mt-10">
            {/* Bluetooth range */}
            <div className={`absolute inset-0 rounded-full border-2 border-dashed border-blue-500/30 flex items-center justify-center transition-all duration-1000 ${showDataFlow ? 'scale-110 opacity-100' : 'scale-100 opacity-50'}`}>
               <span className="absolute -top-6 text-xs text-blue-400">Bluetooth Range (~10m)</span>
            </div>
            {/* User */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center z-10 shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                <Smartphone className="text-white" />
              </div>
            </div>
            {/* Devices */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-700 p-2 rounded-lg">
                <div className="text-[10px] text-center mb-1">Smart Watch</div>
            </div>
            <div className="absolute bottom-0 right-0 bg-slate-700 p-2 rounded-lg">
                <div className="text-[10px] text-center mb-1">Earbuds</div>
            </div>
            
            {showDataFlow && (
               <>
                 <div className="absolute top-1/2 left-1/2 w-full h-[2px] -translate-y-1/2 -translate-x-1/2 bg-blue-500/20 rotate-45" />
                 <div className="absolute top-1/2 left-1/2 w-[10px] h-[10px] bg-yellow-400 rounded-full animate-ping" style={{ transform: 'translate(40px, -40px)' }} />
               </>
            )}
          </div>
        );
      case 'LAN':
        return (
          <div className="relative w-full max-w-lg h-64 mx-auto mt-10 border-2 border-slate-600 rounded-xl p-4 bg-slate-800/50">
             <div className="absolute top-2 left-4 text-xs text-slate-400">Office Building (Floor 1)</div>
             
             {/* Switch */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-8 bg-green-600 rounded flex items-center justify-center shadow-lg z-10">
                <Wifi size={16} />
             </div>

             {/* Workstations */}
             <div className="absolute top-4 left-10 text-center">
                <Laptop className="mx-auto text-slate-300" />
                <span className="text-[10px]">PC 1</span>
             </div>
             <div className="absolute top-4 right-10 text-center">
                <Laptop className="mx-auto text-slate-300" />
                <span className="text-[10px]">PC 2</span>
             </div>
             <div className="absolute bottom-4 left-10 text-center">
                <Laptop className="mx-auto text-slate-300" />
                <span className="text-[10px]">Printer</span>
             </div>
             <div className="absolute bottom-4 right-10 text-center">
                <Laptop className="mx-auto text-slate-300" />
                <span className="text-[10px]">Server</span>
             </div>

             {/* Cables */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="20%" y1="20%" x2="50%" y2="50%" stroke={COLORS.primary} strokeWidth="2" />
                <line x1="80%" y1="20%" x2="50%" y2="50%" stroke={COLORS.primary} strokeWidth="2" />
                <line x1="20%" y1="80%" x2="50%" y2="50%" stroke={COLORS.primary} strokeWidth="2" />
                <line x1="80%" y1="80%" x2="50%" y2="50%" stroke={COLORS.primary} strokeWidth="2" />
                
                {showDataFlow && (
                    <circle r="4" fill={COLORS.warning}>
                        <animateMotion dur="1s" repeatCount="indefinite" path="M 100 50 L 250 128" />
                    </circle>
                )}
             </svg>
          </div>
        );
      case 'MAN':
        return (
            <div className="relative w-full max-w-lg h-64 mx-auto mt-10">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/city-fields.png')]"></div>
                
                {/* City Nodes */}
                <div className="absolute top-10 left-10 flex flex-col items-center">
                    <Building2 className="text-purple-400" />
                    <span className="text-[10px] bg-black/50 px-1 rounded">Hospital</span>
                </div>
                <div className="absolute bottom-10 right-10 flex flex-col items-center">
                    <Building2 className="text-purple-400" />
                    <span className="text-[10px] bg-black/50 px-1 rounded">University</span>
                </div>
                <div className="absolute top-10 right-20 flex flex-col items-center">
                    <Building2 className="text-purple-400" />
                    <span className="text-[10px] bg-black/50 px-1 rounded">City Hall</span>
                </div>

                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path d="M 60 50 Q 250 50 400 50" stroke={COLORS.secondary} strokeWidth="4" fill="none" />
                    <path d="M 400 50 Q 400 200 420 220" stroke={COLORS.secondary} strokeWidth="4" fill="none" />
                    {showDataFlow && (
                        <circle r="5" fill={COLORS.accent}>
                            <animateMotion dur="2s" repeatCount="indefinite" path="M 60 50 Q 250 50 400 50" />
                        </circle>
                    )}
                </svg>
            </div>
        );
      case 'WAN':
        return (
            <div className="relative w-full max-w-lg h-64 mx-auto mt-10">
                <Globe className="w-48 h-48 mx-auto text-slate-700 opacity-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                
                <div className="absolute top-1/2 left-10 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_red]"></div>
                <div className="absolute top-1/3 right-10 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_red]"></div>
                <div className="absolute bottom-10 left-1/3 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_red]"></div>

                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <line x1="15%" y1="50%" x2="85%" y2="33%" stroke={COLORS.danger} strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="15%" y1="50%" x2="33%" y2="85%" stroke={COLORS.danger} strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="85%" y1="33%" x2="33%" y2="85%" stroke={COLORS.danger} strokeWidth="1" strokeDasharray="4 4" />
                </svg>
            </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Module 1: Types of Networks</h2>
        <p className="text-slate-400">Use the slider to scale the network from a single room to the entire globe.</p>
      </div>

      {/* Controls */}
      <div className="flex justify-center mb-8 gap-4">
        {(['PAN', 'LAN', 'MAN', 'WAN'] as NetworkScope[]).map((s) => (
            <button
                key={s}
                onClick={() => setScope(s)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    scope === s 
                    ? 'bg-brand-600 text-white shadow-lg scale-105' 
                    : 'bg-dark-panel text-slate-400 hover:bg-slate-700'
                }`}
            >
                {s}
            </button>
        ))}
      </div>

      {/* Visualization Area */}
      <div className="flex-1 bg-dark-bg rounded-2xl border border-dark-border relative overflow-hidden flex flex-col">
          <div className="absolute top-4 left-4 z-20">
              <h3 className="text-xl font-bold text-brand-500">{SCOPE_INFO[scope].title}</h3>
              <p className="text-sm text-slate-400">{SCOPE_INFO[scope].range}</p>
          </div>
          
          <div className="flex-1 relative">
            {renderScene()}
          </div>

          <div className="p-4 bg-dark-panel border-t border-dark-border z-20">
              <p className="text-slate-300 text-sm mb-4">{SCOPE_INFO[scope].description}</p>
              <button 
                onClick={() => setShowDataFlow(!showDataFlow)}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-md transition-colors w-full justify-center"
              >
                  <Zap size={18} fill={showDataFlow ? "currentColor" : "none"} />
                  {showDataFlow ? "Stop Data Flow" : "Simulate Data Flow"}
              </button>
          </div>
      </div>
    </div>
  );
};