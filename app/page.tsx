"use client";

import React, { useState, useEffect } from 'react';
import { useCarbonStore } from '../store/useCarbonStore';
import Preloader from '../components/Preloader';
import Calculator from '../components/Calculator';
import Dashboard from '../components/Dashboard';
import Recommendations from '../components/Recommendations';
import HabitTracker from '../components/HabitTracker';
import ScenarioModel from '../components/ScenarioModel';
import Settings from '../components/Settings';
import PrintReport from '../components/PrintReport';
import { Leaf, LayoutDashboard, Calculator as CalcIcon, Lightbulb, CheckSquare, BarChart3, Settings as SettingsIcon, Printer, ShieldCheck } from 'lucide-react';

export default function Home() {
  const { hasCalculated, streakCount, checkStreak } = useCarbonStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Trigger streak check on load
  useEffect(() => {
    setMounted(true);
    checkStreak();
    
    // Set initial tab based on whether footprint is calculated
    if (!hasCalculated) {
      setActiveTab('calculator');
    } else {
      setActiveTab('dashboard');
    }
  }, [hasCalculated, checkStreak]);

  // Loading state during hydration to prevent SSR flashing
  if (!mounted) {
    return <Preloader message="TerraGuide initializing..." fullscreen={true} />;
  }

  const handlePrint = () => {
    window.print();
  };

  const renderContent = () => {
    if (!hasCalculated) {
      return <Calculator />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
      case 'calculator':
        return <Calculator />;
      case 'tips':
        return <Recommendations />;
      case 'habits':
        return <HabitTracker />;
      case 'scenario':
        return <ScenarioModel />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  // Nav Item configurations
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, visible: hasCalculated },
    { id: 'calculator', label: hasCalculated ? 'Recalculate' : 'Calculator', icon: <CalcIcon className="w-4 h-4" />, visible: true },
    { id: 'tips', label: 'Tips & Planner', icon: <Lightbulb className="w-4 h-4" />, visible: hasCalculated },
    { id: 'habits', label: 'Daily Habits', icon: <CheckSquare className="w-4 h-4" />, visible: hasCalculated },
    { id: 'scenario', label: 'Simulator', icon: <BarChart3 className="w-4 h-4" />, visible: hasCalculated },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-4 h-4" />, visible: true },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      
      {/* Printable Report Overlay (Hidden in screen media, only renders when printing) */}
      <PrintReport />

      {/* Screen Interface */}
      <div className="flex-1 flex flex-col no-print bg-background text-foreground">
        
        {/* Navigation Header */}
        <header className="sticky top-0 z-40 bg-card border-b border-border/80 backdrop-blur-md shadow-sm">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            
            {/* Logo */}
            <div className="flex items-center gap-2 select-none">
              <div className="p-1.5 bg-emerald-600 text-white rounded-xl shadow-sm shadow-emerald-600/10">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-emerald-950 dark:text-emerald-50 block">TerraGuide</span>
                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest block -mt-1">Carbon Planner</span>
              </div>
            </div>

            {/* Offline and Print Buttons */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/10">
                <ShieldCheck className="w-3.5 h-3.5" /> Offline Sandbox
              </span>
              
              {hasCalculated && (
                <button
                  onClick={handlePrint}
                  className="p-2 border border-border text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 text-xs font-semibold"
                  title="Export Report PDF"
                >
                  <Printer className="w-4.5 h-4.5" /> <span className="hidden sm:inline">Export PDF</span>
                </button>
              )}
            </div>

          </div>
        </header>

        {/* Main Workspace Frame */}
        <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 flex flex-col md:flex-row gap-6 mb-16 md:mb-6">
          
          {/* Side Sidebar Navigation (Desktop) */}
          <aside className="hidden md:block w-52 shrink-0 self-start">
            <nav className="bg-card border border-border rounded-2xl p-3.5 space-y-1.5 shadow-sm">
              <span className="px-2.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-2.5">
                Navigator
              </span>
              {navItems.filter(item => item.visible).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 cursor-pointer transition-all ${
                    activeTab === item.id
                      ? 'bg-emerald-600 text-white font-extrabold shadow-md shadow-emerald-600/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-emerald-50/25 dark:hover:bg-emerald-950/5'
                  }`}
                >
                  {item.icon}
                  {item.label}
                  {item.id === 'habits' && streakCount > 0 && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-amber-500" />
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* Core Content Area */}
          <main className="flex-1 min-w-0">
            {renderContent()}
          </main>

        </div>

        {/* Mobile Navigation Bar (Fixed Bottom) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-lg border-t border-border px-4 py-2 shadow-lg flex justify-around">
          {navItems.filter(item => item.visible).map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center p-1 cursor-pointer transition-all relative ${
                  isActive ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105' : 'text-muted-foreground'
                }`}
              >
                <div className={`p-1 rounded-full ${isActive ? 'bg-emerald-500/10' : ''}`}>
                  {item.icon}
                </div>
                <span className="text-[9px] font-semibold mt-0.5 tracking-tight capitalize">
                  {item.id === 'tips' ? 'Tips' : item.id === 'habits' ? 'Habits' : item.id === 'scenario' ? 'Sim' : item.label}
                </span>
                {item.id === 'habits' && streakCount > 0 && (
                  <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-amber-500" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <footer className="mt-auto border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} TerraGuide Carbon Footprint Tracker. Built 100% Client-Side.</p>
        </footer>

      </div>
    </div>
  );
}
