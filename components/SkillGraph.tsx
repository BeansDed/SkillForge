'use client';

import { motion } from 'framer-motion';

interface SkillNode {
  id: string;
  name: string;
  x: number;
  y: number;
  completed: boolean;
  locked: boolean;
}

interface SkillEdge {
  from: string;
  to: string;
}

interface SkillGraphProps {
  nodes: SkillNode[];
  edges: SkillEdge[];
  onNodeClick?: (nodeId: string) => void;
}

export function SkillGraph({ nodes, edges, onNodeClick }: SkillGraphProps) {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-auto">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {edges.map((edge) => {
        const from = nodes.find((n) => n.id === edge.from);
        const to = nodes.find((n) => n.id === edge.to);
        if (!from || !to) return null;
        return (
          <line
            key={`${edge.from}-${edge.to}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={to.locked ? '#374151' : '#6366F1'}
            strokeWidth={2}
            strokeDasharray={to.locked ? '5,5' : undefined}
          />
        );
      })}

      {nodes.map((node) => (
        <motion.g
          key={node.id}
          whileHover={{ scale: 1.1 }}
          onClick={() => !node.locked && onNodeClick?.(node.id)}
          style={{ cursor: node.locked ? 'not-allowed' : 'pointer' }}
        >
          <circle
            cx={node.x}
            cy={node.y}
            r={30}
            fill={node.completed ? '#22C55E' : node.locked ? '#374151' : '#6366F1'}
            filter={node.completed ? 'url(#glow)' : undefined}
          />
          <text
            x={node.x}
            y={node.y + 50}
            textAnchor="middle"
            fill="white"
            fontSize={12}
          >
            {node.name}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}
