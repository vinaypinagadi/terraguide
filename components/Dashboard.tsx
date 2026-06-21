import React from 'react';
import { useCarbonStore } from '../store/useCarbonStore';
import { calculateCarbonDetails, formatCO2, GLOBAL_AVERAGE_CO2 } from '../utils/carbonCalculator';
import { CategoryDonutChart, ComparisonBarChart } from './DashboardCharts';
import { AlertTriangle, TrendingDown, Award, Zap, ChevronRight, HelpCircle } from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { inputs, streakCount, completedHabitsToday, badges } = useCarbonStore();
  const breakdown = calculateCarbonDetails(inputs);

  // Define chart colors and icons for the donut chart
  const chartData = [
    { name: 'home', value: breakdown.home, color: '#10b981' },
    { name: 'transport', value: breakdown.transport, color: '#3b82f6' },
    { name: 'food', value: breakdown.food, color: '#f59e0b' },
    { name: 'consumption', value: breakdown.consumption, color: '#ec4899' },
  ];

  // Find top emitting category
  const categories = [
    { name: 'Home Utilities', value: breakdown.home, action: 'home', desc: 'Focus on insulation and clean energy plans.' },
    { name: 'Transport & Travel', value: breakdown.transport, action: 'transport', desc: 'Swap car trips with transit or go electric.' },
    { name: 'Food & Diet', value: breakdown.food, action: 'food', desc: 'Opt for low-meat days or plan zero-food-waste menus.' },
    { name: 'Consumption & Goods', value: breakdown.consumption, action: 'consumption', desc: 'Try secondhand shopping and composting.' },
  ];
  
  const topCategory = [...categories].sort((a, b) => b.value - a.value)[0];
  const totalCO2 = breakdown.total;
  const carbonDelta = totalCO2 - GLOBAL_AVERAGE_CO2;
  const isBelowAverage = totalCO2 < GLOBAL_AVERAGE_CO2;

  return (
    <div className="space-y-6">
      
      {/* Top Banner Summary Card */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        {/* Abstract vector leaf shapes in background */}
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10 scale-150">
          <svg width="200" height="200" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L7.79 16.83C9.87 11.66 12 10.5 17 8M22 2C22 2 14.36 2.74 9.57 7.53C5.9 11.2 5.9 17.17 5.9 17.17C5.9 17.17 11.87 17.17 15.54 13.5C20.33 8.71 21.07 1 21.07 1M20.12 3C19.25 7.15 15.15 11.25 11 12.12C12.44 10.68 15.15 7.97 16.13 7C14.71 7 13.3 8.41 12.3 9.41C11.3 10.41 11.3 12.12 11.3 12.12C11.3 12.12 13 12.12 14 11.12C15 10.12 16.41 8.71 16.41 7.29C15.44 8.27 12.73 11 11.29 12.44C12.16 8.29 16.26 4.19 20.41 3.32" />
          </svg>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-wider bg-emerald-500/30 px-3 py-1 rounded-full text-emerald-100">
              Personal Carbon Budget
            </span>
            <h1 className="text-3xl sm:text-4xl font-black">
              {formatCO2(totalCO2)} CO₂e / Year
            </h1>
            <p className="text-emerald-100 text-sm max-w-lg leading-relaxed font-medium">
              {isBelowAverage 
                ? `Fantastic! Your carbon emissions are ${formatCO2(Math.abs(carbonDelta))} below the global average. Let's keep driving it down to safe levels.`
                : `Your emissions are ${formatCO2(carbonDelta)} above the global average. Using TerraGuide tips can help you shrink your footprint to safe target ranges.`
              }
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider">Climate Comparison</span>
            <div className="text-2xl font-black mt-1">
              {isBelowAverage ? (
                <span className="text-emerald-300 flex items-center gap-1.5 justify-center">
                  <TrendingDown className="w-6 h-6" /> -{((Math.abs(carbonDelta) / GLOBAL_AVERAGE_CO2) * 100).toFixed(0)}%
                </span>
              ) : (
                <span className="text-amber-300 flex items-center gap-1.5 justify-center">
                  +{((carbonDelta / GLOBAL_AVERAGE_CO2) * 100).toFixed(0)}%
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-100 mt-1">vs. Global Average ({formatCO2(GLOBAL_AVERAGE_CO2)})</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl shrink-0">
            <Zap className="w-5 h-5 fill-amber-500/10" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted-foreground block uppercase">Active Streak</span>
            <span className="text-lg font-extrabold text-emerald-950 dark:text-emerald-50">{streakCount} {streakCount === 1 ? 'Day' : 'Days'}</span>
          </div>
        </div>

        {/* Habits Today */}
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted-foreground block uppercase">Habits Today</span>
            <span className="text-lg font-extrabold text-emerald-950 dark:text-emerald-50">{completedHabitsToday.length} complete</span>
          </div>
        </div>

        {/* Badges Earned */}
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted-foreground block uppercase">Badges</span>
            <span className="text-lg font-extrabold text-emerald-950 dark:text-emerald-50">{badges.length} unlocked</span>
          </div>
        </div>

        {/* Top Category */}
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <span className="text-[10px] font-bold text-muted-foreground block uppercase">Top Source</span>
            <span className="text-sm font-extrabold text-emerald-950 dark:text-emerald-50 truncate block capitalize">
              {topCategory.action}
            </span>
          </div>
        </div>
      </div>

      {/* Main Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Donut Chart Card */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
          <h2 className="text-lg font-bold text-emerald-950 dark:text-emerald-50 mb-1 flex items-center gap-2">
            Category Breakdown
          </h2>
          <p className="text-xs text-muted-foreground mb-4">Emissions distribution across daily lifestyle sectors.</p>
          <CategoryDonutChart data={chartData} total={totalCO2} />
        </div>

        {/* Comparison Bar Card */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
          <h2 className="text-lg font-bold text-emerald-950 dark:text-emerald-50 mb-1">
            Global Benchmarks
          </h2>
          <p className="text-xs text-muted-foreground mb-4">How your footprint measures against national and scientific levels.</p>
          <ComparisonBarChart userTotal={totalCO2} />
        </div>

      </div>

      {/* Alert / Next Step Insight Callout */}
      <div className="bg-rose-50 dark:bg-rose-950/15 border border-rose-100 dark:border-rose-950/40 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="p-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl shrink-0">
          <AlertTriangle className="w-6 h-6 animate-pulse" />
        </div>
        <div className="flex-1 space-y-1">
          <h4 className="text-sm font-bold text-rose-950 dark:text-rose-100">
            Top Footprint Sector: {topCategory.name}
          </h4>
          <p className="text-xs text-rose-800/80 dark:text-rose-300/80 leading-relaxed">
            {topCategory.desc} Sparing simple activities in this area yields the highest reduction of your carbon impact.
          </p>
        </div>
        <button 
          onClick={() => onNavigate('tips')}
          className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:underline flex items-center gap-1 shrink-0 cursor-pointer self-end sm:self-center"
        >
          View Recommendations <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
