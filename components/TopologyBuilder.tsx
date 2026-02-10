import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Node, Link, DeviceType, TopologyType, Packet } from '../types';
import { DEVICE_ICONS, COLORS, TOPOLOGY_INFO } from '../constants';
import { detectTopology, findPath } from '../utils/graphUtils';
import { Trash2, Play, RefreshCw, AlertTriangle, Plus, ZapOff, CheckCircle2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const TopologyBuilder: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [packets, setPackets] = useState<Packet[]>([]);
  const [currentTopology, setCurrentTopology] = useState<TopologyType>('Unknown');
  const [mode, setMode] = useState<'BUILD' | 'SIMULATE' | 'FAILURE'>('BUILD');
  
  const svgRef = useRef<SVGSVGElement>(null);

  // Detect topology whenever graph changes
  useEffect(() => {
    const topo = detectTopology(nodes, links);
    setCurrentTopology(topo);
  }, [nodes, links]);

  // Simulation Loop
  useEffect(() => {
    if (packets.length === 0) return;

    const interval = setInterval(() => {
      setPackets(prevPackets => {
        const nextPackets: Packet[] = [];
        
        prevPackets.forEach(p => {
           // Move packet logic
           const newProgress = p.progress + 0.05; // Speed
           
           if (newProgress >= 1) {
             // Reached end of current edge
             // Logic to find next edge in path
             const pathIndex = p.path.indexOf(p.targetId); // Simplified: current target is just the next hop
             // In a real robust sim, we'd track current hop index. 
             // Simplification: Packet moves 1 hop at a time.
             
             // If we want multi-hop, we need to spawn a new packet for the next segment or update this one.
             // For this MVP, let's just make packets disappear at destination for visual clarity,
             // OR implemented multi-hop logic if 'path' has more nodes.
             
             // Let's implement multi-hop:
             const currentHopIndex = p.path.findIndex(id => id === p.sourceId); // Actually source of *link*
             // We need to know where we are.
             // Let's simplify: A packet object represents one hop movement.
             
             // When it finishes, if it's not the final destination, spawn new packet(s).
           } else {
             nextPackets.push({ ...p, progress: newProgress });
           }
        });

        return nextPackets;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [packets]);

  const handleAddNode = (type: DeviceType) => {
    const id = uuidv4();
    // Place randomly near center
    const x = 300 + Math.random() * 100;
    const y = 200 + Math.random() * 100;
    setNodes([...nodes, { id, type, x, y, label: type }]);
  };

  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (mode === 'BUILD') {
        if (selectedNodeId && selectedNodeId !== id) {
            // Try to link
            const exists = links.find(l => 
                (l.sourceId === selectedNodeId && l.targetId === id) ||
                (l.sourceId === id && l.targetId === selectedNodeId)
            );
            
            if (!exists) {
                setLinks([...links, { id: uuidv4(), sourceId: selectedNodeId, targetId: id, isBroken: false }]);
                setSelectedNodeId(null);
            } else {
                setSelectedNodeId(id);
            }
        } else {
            setDraggingNodeId(id);
            setSelectedNodeId(id);
        }
    } else if (mode === 'SIMULATE') {
        // Send packet from this node to... random other node?
        // Or select start/end.
        if (!selectedNodeId) {
            setSelectedNodeId(id); // Source
        } else {
            // Target
            triggerSimulation(selectedNodeId, id);
            setSelectedNodeId(null);
        }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId && mode === 'BUILD') {
        const svg = svgRef.current;
        if (!svg) return;
        const CTM = svg.getScreenCTM();
        if (!CTM) return;
        const x = (e.clientX - CTM.e) / CTM.a;
        const y = (e.clientY - CTM.f) / CTM.d;

        setNodes(nodes.map(n => n.id === draggingNodeId ? { ...n, x, y } : n));
    }
  };

  const handleCanvasMouseUp = () => {
    setDraggingNodeId(null);
  };

  const handleLinkClick = (id: string) => {
      if (mode === 'BUILD') {
          // Delete link
          setLinks(links.filter(l => l.id !== id));
      } else if (mode === 'FAILURE') {
          // Toggle break
          setLinks(links.map(l => l.id === id ? { ...l, isBroken: !l.isBroken } : l));
      }
  };

  const triggerSimulation = (startId: string, endId: string) => {
      const path = findPath(nodes, links, startId, endId);
      if (path && path.length > 1) {
          // Break path into hops
          const newPackets: Packet[] = [];
          
          // We'll just animate the first hop for now, and rely on a 'useEffect' to chain them if we were building a complex engine.
          // For MVP visual, let's just create a packet for every segment in the path and stagger them? 
          // Better: Create one packet for the first segment.
          
          // Actually, let's keep it simple: Just show a packet traveling the full path?
          // No, needs to be segment based for SVG paths.
          
          // Implementation: Add one packet for the first leg.
          // In a real app, I'd have a PacketManager.
          // Let's do a simple broadcast visual for Bus/Hub, Unicast for Switch.
          
          // VISUAL HACK for "Simulation Mode":
          // Instead of complex physics, we just animate a dot along the calculated path SVG.
          
          // Let's spawn a packet that knows its entire route.
          // But our renderer draws packets on edges.
          
          // Let's keep it extremely simple for the user:
          // Just animate along all valid links involved in the path.
          
          for (let i = 0; i < path.length - 1; i++) {
              const u = path[i];
              const v = path[i+1];
              const link = links.find(l => (l.sourceId === u && l.targetId === v) || (l.sourceId === v && l.targetId === u));
              if (link) {
                  // We delay the start of subsequent segments
                  setTimeout(() => {
                    setPackets(prev => [...prev, {
                        id: uuidv4(),
                        sourceId: u,
                        targetId: v,
                        currentEdgeId: link.id,
                        progress: 0,
                        path: path,
                        color: COLORS.warning
                    }]);
                  }, i * 1000);
              }
          }
      } else {
          alert("No path found! (Check for broken cables)");
      }
  };

  const clearCanvas = () => {
      setNodes([]);
      setLinks([]);
      setPackets([]);
  };

  return (
    <div className="flex flex-col h-full bg-dark-bg text-white relative">
        {/* Toolbar */}
        <div className="h-16 border-b border-dark-border flex items-center px-4 justify-between bg-dark-panel z-10">
            <div className="flex items-center gap-4">
                <div className="flex bg-slate-700 rounded-lg p-1">
                    <button 
                        onClick={() => setMode('BUILD')}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${mode === 'BUILD' ? 'bg-brand-600 text-white' : 'text-slate-300 hover:text-white'}`}
                    >
                        Build
                    </button>
                    <button 
                        onClick={() => setMode('SIMULATE')}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${mode === 'SIMULATE' ? 'bg-brand-600 text-white' : 'text-slate-300 hover:text-white'}`}
                    >
                        Simulate
                    </button>
                    <button 
                        onClick={() => setMode('FAILURE')}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${mode === 'FAILURE' ? 'bg-red-600 text-white' : 'text-slate-300 hover:text-white'}`}
                    >
                        Break
                    </button>
                </div>

                <div className="h-6 w-px bg-slate-600 mx-2" />

                <div className="flex gap-2">
                    <button onClick={() => handleAddNode(DeviceType.PC)} className="p-2 hover:bg-slate-700 rounded text-slate-300" title="Add PC"><DeviceTypeIcon type={DeviceType.PC} /></button>
                    <button onClick={() => handleAddNode(DeviceType.SWITCH)} className="p-2 hover:bg-slate-700 rounded text-slate-300" title="Add Switch"><DeviceTypeIcon type={DeviceType.SWITCH} /></button>
                    <button onClick={() => handleAddNode(DeviceType.HUB)} className="p-2 hover:bg-slate-700 rounded text-slate-300" title="Add Hub"><DeviceTypeIcon type={DeviceType.HUB} /></button>
                    <button onClick={() => handleAddNode(DeviceType.ROUTER)} className="p-2 hover:bg-slate-700 rounded text-slate-300" title="Add Router"><DeviceTypeIcon type={DeviceType.ROUTER} /></button>
                </div>
            </div>

            <div className="flex items-center gap-4">
                 <div className={`px-3 py-1 rounded border ${currentTopology === 'Unknown' ? 'border-slate-500 text-slate-400' : 'border-green-500 text-green-400 bg-green-500/10'}`}>
                    Detected: <span className="font-bold">{currentTopology}</span>
                 </div>
                 <button onClick={clearCanvas} className="text-red-400 hover:text-red-300"><Trash2 size={20} /></button>
            </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 relative overflow-hidden">
            {/* Instruction Overlay */}
            <div className="absolute top-4 left-4 pointer-events-none bg-black/60 backdrop-blur p-2 rounded text-sm text-slate-300 border border-slate-700">
                {mode === 'BUILD' && "Drag to move. Click node to select. Click another to connect."}
                {mode === 'SIMULATE' && "Click Source Node -> Click Destination Node to send data."}
                {mode === 'FAILURE' && "Click any cable to break/fix it."}
            </div>

            <svg 
                ref={svgRef}
                className="w-full h-full cursor-crosshair"
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseDown={() => setSelectedNodeId(null)} // Deselect on background click
            >
                {/* Grid Pattern */}
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Links */}
                {links.map(link => {
                    const source = nodes.find(n => n.id === link.sourceId);
                    const target = nodes.find(n => n.id === link.targetId);
                    if (!source || !target) return null;

                    return (
                        <g key={link.id} onClick={(e) => { e.stopPropagation(); handleLinkClick(link.id); }}>
                            <line 
                                x1={source.x} y1={source.y} 
                                x2={target.x} y2={target.y} 
                                stroke={link.isBroken ? COLORS.danger : (mode === 'FAILURE' ? COLORS.warning : COLORS.nodeBorder)} 
                                strokeWidth="4"
                                strokeDasharray={link.isBroken ? "5,5" : "0"}
                                className="transition-colors duration-300 hover:stroke-white cursor-pointer"
                            />
                            {link.isBroken && (
                                <ZapOff x={(source.x + target.x)/2 - 12} y={(source.y + target.y)/2 - 12} className="text-red-500" />
                            )}
                        </g>
                    );
                })}

                {/* Packets */}
                {packets.map(p => {
                    const link = links.find(l => l.id === p.currentEdgeId);
                    if (!link || link.isBroken) return null;
                    const s = nodes.find(n => n.id === (p.sourceId === link.sourceId ? link.sourceId : link.targetId)); // Start of this segment
                    const t = nodes.find(n => n.id === (p.sourceId === link.sourceId ? link.targetId : link.sourceId)); // End of this segment
                    
                    // Simple interpolation
                    if(!s || !t) return null;
                    const cx = s.x + (t.x - s.x) * p.progress;
                    const cy = s.y + (t.y - s.y) * p.progress;

                    return (
                        <circle key={p.id} cx={cx} cy={cy} r="6" fill={p.color} className="animate-pulse shadow-lg shadow-yellow-500/50" />
                    );
                })}

                {/* Nodes */}
                {nodes.map(node => {
                    const Icon = DEVICE_ICONS[node.type];
                    const isSelected = selectedNodeId === node.id;
                    return (
                        <g 
                            key={node.id} 
                            transform={`translate(${node.x}, ${node.y})`}
                            onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                            className="cursor-pointer transition-transform hover:scale-110"
                        >
                            <circle 
                                r="24" 
                                fill={COLORS.nodeBg} 
                                stroke={isSelected ? COLORS.primary : COLORS.nodeBorder} 
                                strokeWidth={isSelected ? 3 : 2}
                            />
                            <foreignObject x="-12" y="-12" width="24" height="24" className="pointer-events-none">
                                <Icon className="text-slate-200 w-full h-full" />
                            </foreignObject>
                            <text y="40" textAnchor="middle" fill="#94a3b8" fontSize="10" className="pointer-events-none select-none">
                                {node.type}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
        
        {/* Context Panel (Bottom) */}
        <div className="h-32 bg-dark-panel border-t border-dark-border p-4 flex gap-6 overflow-y-auto custom-scrollbar">
            <div className="w-1/3 border-r border-dark-border pr-4">
                <h4 className="text-sm font-bold text-slate-300 mb-2">Topology Analysis</h4>
                {currentTopology === 'Unknown' ? (
                    <p className="text-xs text-slate-500">Add nodes and connect them to form a standard topology.</p>
                ) : (
                    <div>
                        <p className="text-brand-500 font-bold mb-1">{currentTopology} Topology</p>
                        <p className="text-xs text-slate-400">{TOPOLOGY_INFO[currentTopology]}</p>
                    </div>
                )}
            </div>
            <div className="w-1/3 border-r border-dark-border pr-4">
                 <h4 className="text-sm font-bold text-slate-300 mb-2">Simulation Status</h4>
                 <div className="flex items-center gap-2 mb-1">
                     <span className="text-xs text-slate-400">Packets in transit:</span>
                     <span className="text-xs font-mono bg-slate-800 px-1 rounded">{packets.length}</span>
                 </div>
                 {packets.length > 0 && <p className="text-xs text-yellow-500 animate-pulse">Data transmission active...</p>}
            </div>
             <div className="w-1/3">
                 <h4 className="text-sm font-bold text-slate-300 mb-2">AI Tutor</h4>
                 <p className="text-xs text-slate-500 italic">"Try breaking the central switch in the Star topology to see what happens."</p>
            </div>
        </div>
    </div>
  );
};

const DeviceTypeIcon = ({ type }: { type: DeviceType }) => {
    const Icon = DEVICE_ICONS[type];
    return <Icon size={20} />;
};
