import { DeviceType, NetworkScope, TopologyType } from "./types";
import { 
  Smartphone, 
  Laptop, 
  Monitor, 
  Server, 
  Router, 
  Network, 
  CircleDot 
} from 'lucide-react';

export const COLORS = {
  primary: '#0ea5e9',
  secondary: '#6366f1',
  accent: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  text: '#e2e8f0',
  grid: '#1e293b',
  nodeBg: '#334155',
  nodeBorder: '#475569',
};

export const DEVICE_ICONS = {
  [DeviceType.PHONE]: Smartphone,
  [DeviceType.LAPTOP]: Laptop,
  [DeviceType.PC]: Monitor,
  [DeviceType.SERVER]: Server,
  [DeviceType.ROUTER]: Router,
  [DeviceType.SWITCH]: Network, // Lucide Network icon looks like a switch
  [DeviceType.HUB]: CircleDot,
};

export const SCOPE_INFO: Record<NetworkScope, { title: string; range: string; description: string }> = {
  PAN: {
    title: "Personal Area Network",
    range: "1 - 10 meters",
    description: "Connects devices centered around an individual person (e.g., Bluetooth headphones, smartwatch, phone)."
  },
  LAN: {
    title: "Local Area Network",
    range: "10m - 1km",
    description: "Connects devices within a limited area such as a residence, school, or office building."
  },
  MAN: {
    title: "Metropolitan Area Network",
    range: "5km - 50km",
    description: "A larger network that usually spans a city or a large campus."
  },
  WAN: {
    title: "Wide Area Network",
    range: "100km - Global",
    description: "Extends over a large geographical distance. The Internet is the biggest WAN."
  }
};

export const TOPOLOGY_INFO: Record<TopologyType, string> = {
  Bus: "All devices share a single communication line or cable. Cheap but single point of failure.",
  Star: "All devices connect to a central device (switch/hub). Easy to troubleshoot, but if the center fails, all fail.",
  Ring: "Each device connects to exactly two other devices, forming a circle. Data travels in one direction.",
  Mesh: "Devices are interconnected. Full mesh means every device connects to every other device. Extremely reliable but expensive.",
  Tree: "A variation of Star. Central hubs connected to a secondary hub. Scalable.",
  Hybrid: "A combination of two or more different topologies.",
  Unknown: "Custom or incomplete layout."
};