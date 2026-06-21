import React from 'react';
import { useCarbonStore } from '../store/useCarbonStore';
import { Check, Zap, Award, Flame, Calendar, Info, HelpCircle } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

const DEF_HABITS: Habit[] = [
  { id: 'habit-1', name: 'Meat-Free Day', description: 'Skipped meat meals today, replacing them with plant alternatives.', impact: 'medium' },
  { id: 'habit-2', name: 'Commuted by Bike/Foot/Transit', description: 'Left the personal petrol/diesel car parked and used low-carbon transit.', impact: 'high' },
  { id: 'habit-3', name: 'Turned off Standby Devices', description: 'Shut down completely unplugging unused chargers and appliances.', impact: 'low' },
  { id: 'habit-4', name: 'Line-Dried Laundry', description: 'Avoided the energy-hungry clothes dryer and dried clothes on a rack/line.', impact: 'low' },
  { id: 'habit-5', name: 'Zero Food Waste Today', description: 'Ate leftovers, planned portions, and discarded zero edible food.', impact: 'medium' },
  { id: 'habit-6', name: 'Used Reusables Only', description: 'Avoided single-use plastics, using reusable bags, mugs, and water bottles.', impact: 'low' },
  { id: 'habit-7', name: 'Shortened Shower (<5 min)', description: 'Conserved heated water usage by finishing your shower quickly.', impact: 'low' },
  { id: 'habit-8', name: 'Adjusted Thermostat 1°C', description: 'Kept cooling slightly warmer or heating slightly cooler today.', impact: 'medium' },
];

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji
  color: string;
}

const ALL_BADGES: Badge[] = [
  { id: 'first-habit', name: 'Sprout', description: 'Completed your first daily green habit.', icon: '🌱', color: 'bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600' },
  { id: 'super-green-day', name: 'Eco-Warrior', description: 'Logged 4 or more sustainable habits in a single day.', icon: '🛡️', color: 'bg-teal-100 dark:bg-teal-950/20 text-teal-600' },
  { id: 'consistent-tracker', name: 'Deep Roots', description: 'Logged habits on 5 unique days.', icon: '🌳', color: 'bg-green-100 dark:bg-green-950/20 text-green-600' },
  { id: 'streak-3', name: 'Green Spark', description: 'Maintained a 3-day habit streak.', icon: '✨', color: 'bg-amber-100 dark:bg-amber-950/20 text-amber-600' },
  { id: 'streak-7', name: 'Forest Guardian', description: 'Maintained a 7-day habit streak.', icon: '🌲', color: 'bg-sky-100 dark:bg-sky-950/20 text-sky-600' },
  { id: 'first-reduction', name: 'First Step', description: 'Completed your first action plan task.', icon: '👣', color: 'bg-orange-100 dark:bg-orange-950/20 text-orange-600' },
  { id: 'eco-champion', name: 'Planet Guardian', description: 'Completed 5 action plan tasks.', icon: '🌍', color: 'bg-indigo-100 dark:bg-indigo-950/20 text-indigo-600' },
];

export default function HabitTracker() {
  const { completedHabitsToday, toggleHabitToday, streakCount, badges, habitsHistory } = useCarbonStore();

  const getImpactBadge = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400';
      case 'medium': return 'bg-amber-500/10 text-amber-700 dark:text-amber-400';
      case 'low': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Grid: Streaks and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Streak Card */}
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between items-center text-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-muted-foreground opacity-10">
            <Flame className="w-24 h-24 stroke-[1.5]" />
          </div>
          
          <div className="space-y-1 relative z-10">
            <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest block">Daily Streak</span>
            <h3 className="text-xl font-bold text-emerald-950 dark:text-emerald-50">Consistency Tracker</h3>
          </div>

          <div className="my-6 relative z-10 flex items-center justify-center">
            {/* Pulsing Flame Ring */}
            <div className="relative w-28 h-28 rounded-full bg-amber-500/10 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-dashed border-amber-500/20 animate-spin" style={{ animationDuration: '20s' }}></div>
              <div className="flex flex-col items-center justify-center">
                <Flame className="w-10 h-10 text-amber-500 fill-amber-500/20 animate-pulse" />
                <span className="text-2xl font-black text-emerald-950 dark:text-emerald-50 mt-1">{streakCount}</span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Days Active</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground relative z-10 max-w-[200px] leading-relaxed">
            {streakCount > 0 
              ? 'Excellent job! Keep logging daily habits to maintain your streak.' 
              : 'Log at least one habit today to ignite your green streak!'}
          </p>
        </div>

        {/* Habit Checklist Card */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 md:col-span-2 shadow-sm space-y-4">
          <div>
            <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-50">Daily Action Log</h3>
            <p className="text-xs text-muted-foreground">Select the sustainable habits you completed today.</p>
          </div>

          {/* Checklist grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto no-scrollbar pr-1 border-t border-border/40 pt-3">
            {DEF_HABITS.map((habit) => {
              const isChecked = completedHabitsToday.includes(habit.id);
              return (
                <button
                  key={habit.id}
                  onClick={() => toggleHabitToday(habit.id)}
                  className={`p-3 text-left rounded-xl border flex gap-3 transition-all ${
                    isChecked
                      ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-950/10 shadow-sm'
                      : 'border-border bg-card hover:bg-emerald-50/10 dark:hover:bg-emerald-950/2'
                  }`}
                >
                  {/* Circle Checkbox */}
                  <div className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center transition-all ${
                    isChecked
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-border bg-background'
                  }`}>
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${isChecked ? 'text-emerald-900 dark:text-emerald-100' : 'text-foreground'}`}>
                        {habit.name}
                      </span>
                      <span className={`text-[8px] font-extrabold px-1 rounded uppercase tracking-wide shrink-0 ${getImpactBadge(habit.impact)}`}>
                        {habit.impact}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground leading-snug block">
                      {habit.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Badges / Achievements Section */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-50">Milestones & Achievements</h3>
          <p className="text-xs text-muted-foreground">Unlock rewards by tracking habits, streaks, and reducing carbon totals.</p>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 pt-2 border-t border-border/40">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = badges.includes(badge.id);
            return (
              <div 
                key={badge.id}
                className={`flex flex-col items-center justify-center p-4 border rounded-2xl text-center transition-all ${
                  isUnlocked
                    ? 'border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/5 scale-100 shadow-sm'
                    : 'border-border/60 bg-slate-500/[0.02] opacity-50 scale-95 select-none'
                }`}
              >
                {/* Badge Icon circle */}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner ${
                  isUnlocked ? badge.color : 'bg-border text-muted-foreground/60 filter grayscale'
                }`}>
                  {badge.icon}
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-xs font-extrabold text-emerald-950 dark:text-emerald-100 leading-snug">
                    {badge.name}
                  </h4>
                  <p className="text-[9px] text-muted-foreground leading-snug max-w-[100px] mx-auto">
                    {badge.description}
                  </p>
                </div>

                {isUnlocked ? (
                  <span className="mt-2.5 text-[8px] font-black uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[4]" /> Unlocked
                  </span>
                ) : (
                  <span className="mt-2.5 text-[8px] font-bold uppercase text-muted-foreground/70">
                    Locked
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
