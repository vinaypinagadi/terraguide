import React, { useState } from 'react';
import { useCarbonStore } from '../store/useCarbonStore';
import { getRecommendationsForUser, ALL_RECOMMENDATIONS } from '../utils/recommendations';
import { formatCO2 } from '../utils/carbonCalculator';
import { Plus, Check, Leaf, ClipboardList, Lightbulb, CheckCircle2 } from 'lucide-react';

export default function Recommendations() {
  const { 
    inputs, 
    activeRecommendations, 
    completedRecommendations, 
    addRecommendationToPlan, 
    removeRecommendationFromPlan, 
    toggleRecommendationComplete 
  } = useCarbonStore();

  const [activeCategory, setActiveCategory] = useState<'all' | 'home' | 'transport' | 'food' | 'consumption'>('all');
  const [activeTab, setActiveTab] = useState<'explore' | 'plan'>('explore');

  const recommendedTips = getRecommendationsForUser(inputs);
  const activePlanTips = ALL_RECOMMENDATIONS.filter((rec) => activeRecommendations.includes(rec.id));

  // Filter recommendations based on selected category
  const filteredRecommendations = recommendedTips.filter(
    (rec) => activeCategory === 'all' || rec.category === activeCategory
  );

  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high': return 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-400';
      case 'medium': return 'bg-amber-500/10 text-amber-700 dark:text-amber-400';
      case 'low': return 'bg-slate-500/10 text-slate-700 dark:text-slate-400';
    }
  };

  const getEaseColor = (ease: 'easy' | 'medium' | 'hard') => {
    switch (ease) {
      case 'easy': return 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/10 text-emerald-800 dark:text-emerald-300';
      case 'medium': return 'border-amber-200 dark:border-amber-900 bg-amber-50/30 dark:bg-amber-950/10 text-amber-800 dark:text-amber-300';
      case 'hard': return 'border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/10 text-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Tab Switcher */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('explore')}
          role="tab"
          aria-selected={activeTab === 'explore'}
          className={`pb-3 px-6 text-sm font-semibold flex items-center gap-2 border-b-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none rounded-t-lg transition-all ${
            activeTab === 'explore'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Lightbulb className="w-4 h-4" /> Explore Tips
        </button>
        <button
          onClick={() => setActiveTab('plan')}
          role="tab"
          aria-selected={activeTab === 'plan'}
          className={`pb-3 px-6 text-sm font-semibold flex items-center gap-2 border-b-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none rounded-t-lg transition-all relative ${
            activeTab === 'plan'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <ClipboardList className="w-4 h-4" /> My Action Plan
          {activeRecommendations.length > 0 && (
            <span className="absolute top-0 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          )}
        </button>
      </div>

      {activeTab === 'explore' ? (
        // EXPLORE VIEW
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-emerald-950 dark:text-emerald-50">Personalized Insights</h2>
              <p className="text-xs text-muted-foreground">Tailored ideas to lower your highest emissions.</p>
            </div>
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {(['all', 'home', 'transport', 'food', 'consumption'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs capitalize font-semibold cursor-pointer border transition-all ${
                    activeCategory === cat
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm'
                      : 'border-border bg-card text-muted-foreground hover:bg-emerald-50/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tips List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRecommendations.length > 0 ? (
              filteredRecommendations.map((tip) => {
                const isAdded = activeRecommendations.includes(tip.id);
                const isCompleted = completedRecommendations.includes(tip.id);
                
                return (
                  <div 
                    key={tip.id} 
                    className={`bg-card border rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-md ${
                      isCompleted 
                        ? 'border-emerald-500/30 bg-emerald-50/5 dark:bg-emerald-950/2' 
                        : isAdded 
                          ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/5' 
                          : 'border-border'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-950/20 px-2 py-0.5 rounded">
                          {tip.category}
                        </span>
                        <div className="flex gap-1.5 shrink-0">
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded capitalize ${getImpactColor(tip.impact)}`}>
                            {tip.impact} Impact
                          </span>
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border capitalize ${getEaseColor(tip.ease)}`}>
                            {tip.ease}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-50 leading-snug">
                        {tip.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {tip.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] text-muted-foreground font-semibold block">Potential Savings</span>
                        <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                          {formatCO2(tip.co2Savings)} / year
                        </span>
                      </div>

                      {isCompleted ? (
                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" /> Completed
                        </div>
                      ) : isAdded ? (
                        <button
                          onClick={() => removeRecommendationFromPlan(tip.id)}
                          className="px-3.5 py-1.5 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/20 flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" /> Added to Plan
                        </button>
                      ) : (
                        <button
                          onClick={() => addRecommendationToPlan(tip.id)}
                          className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-600/5 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add to Plan
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 text-center p-12 border border-dashed border-border rounded-2xl bg-card">
                <Leaf className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                <h3 className="text-sm font-bold text-muted-foreground">No matches found</h3>
                <p className="text-xs text-muted-foreground/80 mt-1">Try modifying your category filters or recalculate your profile.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // PLAN VIEW
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-emerald-950 dark:text-emerald-50">My Action Plan</h2>
            <p className="text-xs text-muted-foreground">Commit to these simple adjustments and track your carbon reduction.</p>
          </div>

          {activePlanTips.length > 0 ? (
            <div className="space-y-4">
              {activePlanTips.map((tip) => {
                const isCompleted = completedRecommendations.includes(tip.id);
                return (
                  <div 
                    key={tip.id} 
                    className={`bg-card border rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all ${
                      isCompleted 
                        ? 'border-emerald-500/20 bg-emerald-50/5 dark:bg-emerald-950/2 opacity-75' 
                        : 'border-border'
                    }`}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {tip.category}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          Saves {formatCO2(tip.co2Savings)} CO2e/year
                        </span>
                      </div>
                      <h3 className={`text-base font-bold text-emerald-950 dark:text-emerald-50 ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                        {tip.title}
                      </h3>
                      <div className="bg-emerald-500/5 dark:bg-emerald-950/10 border border-emerald-500/5 rounded-xl p-3 text-xs text-emerald-900 dark:text-emerald-200">
                        <strong className="block text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold mb-1">Action Task:</strong>
                        {tip.actionText}
                      </div>
                    </div>

                    <div className="flex items-center sm:flex-col justify-between sm:justify-center gap-3 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-6 shrink-0">
                      <button
                        onClick={() => toggleRecommendationComplete(tip.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1.5 transition-all ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                        }`}
                      >
                        <Check className="w-4 h-4" /> {isCompleted ? 'Completed' : 'Mark Done'}
                      </button>

                      <button
                        onClick={() => removeRecommendationFromPlan(tip.id)}
                        className="text-xs font-semibold text-rose-500 hover:text-rose-700 cursor-pointer"
                      >
                        Remove Plan
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Total Impact Summary Card */}
              <div className="bg-emerald-600/10 dark:bg-emerald-950/15 border border-emerald-500/20 rounded-2xl p-5 text-center">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest block mb-1">Estimated Annual Reduction</span>
                <span className="text-3xl font-black text-emerald-800 dark:text-emerald-100">
                  {formatCO2(activePlanTips.filter(t => completedRecommendations.includes(t.id)).reduce((acc, t) => acc + t.co2Savings, 0))} CO₂e
                </span>
                <p className="text-xs text-muted-foreground mt-2">
                  of savings achieved by completing {completedRecommendations.filter(id => activeRecommendations.includes(id)).length} of {activePlanTips.length} actions in your planner.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center p-12 border border-dashed border-border rounded-2xl bg-card">
              <ClipboardList className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <h3 className="text-sm font-bold text-muted-foreground">Your action plan is empty</h3>
              <p className="text-xs text-muted-foreground/80 mt-1 mb-4">You have not added any recommendations to your plan yet.</p>
              <button
                onClick={() => setActiveTab('explore')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 cursor-pointer"
              >
                Browse Recommendations
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
