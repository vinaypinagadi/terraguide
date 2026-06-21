import React, { useState } from 'react';
import { formatCO2 } from '../utils/carbonCalculator';

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
  icon?: React.ReactNode;
}

// 1. Donut Chart
interface DonutProps {
  data: ChartDataItem[];
  total: number;
}

export function CategoryDonutChart({ data, total }: DonutProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // SVG parameters
  const radius = 50;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius; // ~314.16

  const segments = data.reduce<{
    accumulated: number;
    items: (ChartDataItem & { percentage: number; strokeLength: number; strokeOffset: number })[];
  }>((acc, item) => {
    const percentage = total > 0 ? item.value / total : 0;
    const strokeLength = percentage * circumference;
    const strokeOffset = circumference - (acc.accumulated * circumference);
    return {
      accumulated: acc.accumulated + percentage,
      items: [...acc.items, { ...item, percentage, strokeLength, strokeOffset }]
    };
  }, { accumulated: 0, items: [] }).items;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-4">
      {/* SVG Donut */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
          {/* Base circle background */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="var(--border)"
            strokeWidth={strokeWidth - 2}
          />
          
          {segments.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            
            if (item.value === 0) return null;

            return (
              <circle
                key={item.name}
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
                strokeDasharray={`${item.strokeLength} ${circumference}`}
                strokeDashoffset={item.strokeOffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  transformOrigin: '60px 60px',
                  transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                }}
              />
            );
          })}
        </svg>

        {/* Central Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none text-center p-3">
          {hoveredIdx !== null ? (
            <>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                {data[hoveredIdx].name}
              </span>
              <span className="text-lg font-extrabold text-emerald-950 dark:text-emerald-50">
                {formatCO2(data[hoveredIdx].value)}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                {((data[hoveredIdx].value / total) * 100).toFixed(0)}%
              </span>
            </>
          ) : (
            <>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Total Annual
              </span>
              <span className="text-xl font-black text-emerald-950 dark:text-emerald-50">
                {formatCO2(total)}
              </span>
              <span className="text-[9px] text-muted-foreground mt-0.5">
                CO2 Equivalent
              </span>
            </>
          )}
        </div>
      </div>

      {/* Legend Grid */}
      <div className="flex-1 w-full space-y-2.5">
        {data.map((item, idx) => {
          const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
          return (
            <div 
              key={item.name}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                hoveredIdx === idx 
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-500/30' 
                  : 'bg-transparent border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                <span 
                  className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 capitalize">
                  {item.name}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-emerald-950 dark:text-emerald-50">
                  {formatCO2(item.value)}
                </span>
                <span className="text-xs text-muted-foreground ml-2 font-medium">
                  ({pct}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 2. Comparison Bar Chart (Horizontal)
interface BarProps {
  userTotal: number;
}

export function ComparisonBarChart({ userTotal }: BarProps) {
  const targets = [
    { name: 'Your Footprint', value: userTotal, color: '#059669', isUser: true },
    { name: 'Global Average', value: 4700, color: '#6b7280', isUser: false },
    { name: 'Europe Average', value: 6400, color: '#4b5563', isUser: false },
    { name: 'US Average', value: 16000, color: '#b91c1c', isUser: false },
    { name: 'Climate Safe Target', value: 2000, color: '#06b6d4', isUser: false },
  ];

  // Find max value to scale the bars
  const maxValue = Math.max(...targets.map((t) => t.value));

  return (
    <div className="space-y-4 p-4">
      {targets.map((target) => {
        const percentage = maxValue > 0 ? (target.value / maxValue) * 100 : 0;
        return (
          <div key={target.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className={target.isUser ? 'text-emerald-700 dark:text-emerald-300 font-extrabold' : 'text-muted-foreground'}>
                {target.name} {target.isUser && ' (Calculated)'}
              </span>
              <span className="font-bold text-emerald-950 dark:text-emerald-50">
                {formatCO2(target.value)} / year
              </span>
            </div>
            
            {/* Outer Bar */}
            <div className="h-6 w-full bg-border rounded-lg overflow-hidden relative shadow-inner">
              {/* Inner Filled Bar */}
              <div
                className="h-full rounded-r-md transition-all duration-700 ease-out flex items-center justify-end pr-2"
                style={{ 
                  width: `${percentage}%`, 
                  backgroundColor: target.color,
                  opacity: target.isUser ? 1 : 0.8
                }}
              >
                {percentage > 18 && (
                  <span className="text-[10px] font-bold text-white tracking-wide">
                    {((target.value / 16000) * 100).toFixed(0)}% of US avg
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <p className="text-[10px] text-muted-foreground text-center italic mt-2">
        To avoid runaway climate change, scientists target a global average footprint of under 2,000 kg (2 tons) CO2e/year per person.
      </p>
    </div>
  );
}

// 3. Line/Area Projection Chart for Scenario Simulator
interface LineProps {
  originalTotal: number;
  simulatedTotal: number;
}

export function ScenarioProjectionChart({ originalTotal, simulatedTotal }: LineProps) {
  const points = [
    { label: 'Current', value: originalTotal },
    { label: 'Short Term', value: originalTotal - (originalTotal - simulatedTotal) * 0.4 },
    { label: 'Medium Term', value: originalTotal - (originalTotal - simulatedTotal) * 0.75 },
    { label: 'Target Scenario', value: simulatedTotal },
  ];

  // SVG coordinate calculations
  const width = 300;
  const height = 120;
  const padding = 15;
  
  const minVal = Math.min(...points.map((p) => p.value)) * 0.8;
  const maxVal = Math.max(...points.map((p) => p.value)) * 1.1;
  const range = maxVal - minVal;

  // Compute coordinates
  const coords = points.map((p, idx) => {
    const x = padding + (idx * (width - 2 * padding)) / (points.length - 1);
    const y = height - padding - ((p.value - minVal) / range) * (height - 2 * padding);
    return { x, y, ...p };
  });

  // Create SVG path string
  const pathD = coords.reduce((acc, coord, idx) => {
    return acc + `${idx === 0 ? 'M' : 'L'} ${coord.x} ${coord.y} `;
  }, '');

  // Area path string (goes down to bottom and closes)
  const areaD = pathD + `L ${coords[coords.length - 1].x} ${height - padding} L ${coords[0].x} ${height - padding} Z`;

  return (
    <div className="flex flex-col items-center justify-center p-3">
      <div className="w-full max-w-sm h-36 bg-emerald-500/5 dark:bg-emerald-950/10 rounded-xl p-2 border border-emerald-500/10 relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          {/* Grid lines */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--border)" strokeWidth="1" />
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3 3" />
          
          {/* Filled Area */}
          <path d={areaD} fill="url(#chartGrad)" opacity="0.3" className="transition-all duration-500" />
          
          {/* Line Path */}
          <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" className="transition-all duration-500" />
          
          {/* Interactive circles */}
          {coords.map((coord, idx) => (
            <g key={idx}>
              <circle
                cx={coord.x}
                cy={coord.y}
                r="4.5"
                fill="#ffffff"
                stroke="#059669"
                strokeWidth="2"
                className="transition-all duration-500 hover:r-6 cursor-pointer"
              />
              {/* Tooltip labels for endpoints */}
              {(idx === 0 || idx === coords.length - 1) && (
                <text
                  x={coord.x}
                  y={coord.y - 8}
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="8"
                  fontWeight="bold"
                  className="fill-emerald-900 dark:fill-emerald-100"
                >
                  {formatCO2(coord.value)}
                </text>
              )}
            </g>
          ))}
          
          {/* Definitions for Gradients */}
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Labels under coordinates */}
        <div className="flex justify-between px-3 text-[9px] font-bold text-muted-foreground mt-1 select-none">
          {points.map((p, idx) => (
            <span key={idx}>{p.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
