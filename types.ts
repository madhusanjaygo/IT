export type NetworkScope = 'PAN' | 'LAN' | 'MAN' | 'WAN';

export enum DeviceType {
  PC = 'PC',
  SERVER = 'SERVER',
  ROUTER = 'ROUTER',
  SWITCH = 'SWITCH',
  HUB = 'HUB',
  PHONE = 'PHONE',
  LAPTOP = 'LAPTOP'
}

export interface Node {
  id: string;
  type: DeviceType;
  x: number;
  y: number;
  label: string;
}

export interface Link {
  id: string;
  sourceId: string;
  targetId: string;
  isBroken: boolean;
}

export interface Packet {
  id: string;
  sourceId: string;
  targetId: string; // Final destination
  currentEdgeId: string;
  progress: number; // 0 to 1
  path: string[]; // Array of Node IDs to visit
  color: string;
}

export type TopologyType = 'Bus' | 'Star' | 'Ring' | 'Mesh' | 'Tree' | 'Hybrid' | 'Unknown';

export interface ModuleConfig {
  id: string;
  title: string;
  description: string;
}