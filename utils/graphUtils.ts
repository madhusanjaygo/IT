import { Node, Link, TopologyType } from "../types";

// Determine topology type based on graph structure
export const detectTopology = (nodes: Node[], links: Link[]): TopologyType => {
  if (nodes.length < 3) return 'Unknown';

  const adjacency: Record<string, string[]> = {};
  nodes.forEach(n => adjacency[n.id] = []);
  links.forEach(l => {
    if (!l.isBroken) {
      adjacency[l.sourceId]?.push(l.targetId);
      adjacency[l.targetId]?.push(l.sourceId);
    }
  });

  const degrees = Object.values(adjacency).map(n => n.length);
  const maxDegree = Math.max(...degrees);
  const leafNodes = degrees.filter(d => d === 1).length;
  const twoDegreeNodes = degrees.filter(d => d === 2).length;
  const totalNodes = nodes.length;

  // Star: One central node connected to everyone else, everyone else has degree 1
  if (maxDegree === totalNodes - 1 && leafNodes === totalNodes - 1) return 'Star';

  // Bus: Linear backbone. (Simplified check: line structure)
  // Real bus has a backbone cable, but logically it looks like a line graph or a central 'wire' node.
  // In this app, we might represent a Bus as a specific 'Backbone' node type, but structurally:
  // If it's a line: 2 endpoints (deg 1), rest are deg 2.
  if (leafNodes === 2 && twoDegreeNodes === totalNodes - 2) return 'Bus';

  // Ring: Everyone has degree 2
  if (twoDegreeNodes === totalNodes) return 'Ring';

  // Mesh: High connectivity. Full mesh = n*(n-1)/2 links.
  const linkCount = links.filter(l => !l.isBroken).length;
  if (linkCount >= (totalNodes * (totalNodes - 1)) / 2) return 'Mesh';
  
  // Basic Mesh threshold
  if (maxDegree > 2 && linkCount > totalNodes) return 'Mesh';

  return 'Hybrid';
};

// Breadth-First Search to find path
export const findPath = (nodes: Node[], links: Link[], startId: string, endId: string): string[] | null => {
  const adjacency: Record<string, string[]> = {};
  nodes.forEach(n => adjacency[n.id] = []);
  links.forEach(l => {
    if (!l.isBroken) {
      adjacency[l.sourceId]?.push(l.targetId);
      adjacency[l.targetId]?.push(l.sourceId);
    }
  });

  const queue: string[][] = [[startId]];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const path = queue.shift()!;
    const node = path[path.length - 1];

    if (node === endId) return path;

    if (!visited.has(node)) {
      visited.add(node);
      const neighbors = adjacency[node] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push([...path, neighbor]);
        }
      }
    }
  }

  return null;
};
