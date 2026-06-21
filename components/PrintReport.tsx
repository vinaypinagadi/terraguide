import React from 'react';
import { useCarbonStore } from '../store/useCarbonStore';
import { calculateCarbonDetails, formatCO2 } from '../utils/carbonCalculator';
import { ALL_RECOMMENDATIONS } from '../utils/recommendations';

export default function PrintReport() {
  const { inputs, streakCount, badges, activeRecommendations, completedRecommendations } = useCarbonStore();
  const breakdown = calculateCarbonDetails(inputs);
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const activePlanTips = ALL_RECOMMENDATIONS.filter((rec) => activeRecommendations.includes(rec.id));
  const completedCount = completedRecommendations.filter((id) => activeRecommendations.includes(id)).length;
  
  return (
    <div className="print-only print-page space-y-8 bg-white text-black p-8 max-w-4xl mx-auto hidden">
      {/* Header */}
      <div className="border-b-2 border-emerald-800 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-emerald-950">TerraGuide Carbon Report</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Your Personal Sustainability Profile & Action Roadmap</p>
        </div>
        <div className="text-right text-xs text-gray-400 font-bold">
          <span>Generated: {today}</span>
        </div>
      </div>

      {/* Main Totals */}
      <div className="grid grid-cols-3 gap-6 items-center border border-gray-200 rounded-xl p-6 bg-gray-50/50 print-card">
        <div className="col-span-2 space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">Estimated Carbon Footprint</span>
          <h2 className="text-4xl font-black text-emerald-950">{formatCO2(breakdown.total)} CO₂e / Year</h2>
          <p className="text-xs text-gray-500 max-w-md">
            Calculated offline based on your lifestyle inputs across home utilities, transit commutes, dietary selections, and consumption.
          </p>
        </div>
        <div className="border-l border-gray-200 pl-6 space-y-1">
          <div className="text-xs text-gray-400 font-semibold uppercase">Category Totals</div>
          <div className="text-xs space-y-1 mt-2">
            <div className="flex justify-between"><span>Home utilities:</span> <strong>{formatCO2(breakdown.home)}</strong></div>
            <div className="flex justify-between"><span>Transport/Travel:</span> <strong>{formatCO2(breakdown.transport)}</strong></div>
            <div className="flex justify-between"><span>Food/Diet:</span> <strong>{formatCO2(breakdown.food)}</strong></div>
            <div className="flex justify-between"><span>Consumption/Goods:</span> <strong>{formatCO2(breakdown.consumption)}</strong></div>
          </div>
        </div>
      </div>

      {/* Profile Inputs Summary */}
      <div className="space-y-3 print-card">
        <h3 className="text-base font-bold text-emerald-950 border-b border-gray-200 pb-1.5 uppercase tracking-wide">Lifestyle Settings</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-gray-400 font-semibold block">Home & Heating</span>
            <span className="font-bold">Size: {inputs.householdSize} person(s)</span>
            <span className="text-[10px] text-gray-500 block">Electric: {inputs.electricityBill} kWh/mo</span>
            <span className="text-[10px] text-gray-500 block">Heat: {inputs.heatingSource} ({inputs.heatingAmount} kWh/mo)</span>
          </div>

          <div className="space-y-1">
            <span className="text-gray-400 font-semibold block">Transit & Travel</span>
            <span className="font-bold">Car: {inputs.carType !== 'none' ? `${inputs.carType} (${inputs.annualMileage} mi/yr)` : 'No Car'}</span>
            <span className="text-[10px] text-gray-500 block">Transit: {inputs.publicTransportHours} hrs/wk</span>
          </div>

          <div className="space-y-1">
            <span className="text-gray-400 font-semibold block">Aviation</span>
            <span className="font-bold">Short Flights: {inputs.shortFlights} /yr</span>
            <span className="text-[10px] text-gray-500 block">Long Flights: {inputs.longFlights} /yr</span>
          </div>

          <div className="space-y-1">
            <span className="text-gray-400 font-semibold block">Diet & Goods</span>
            <span className="font-bold capitalize">Diet: {inputs.dietType}</span>
            <span className="text-[10px] text-gray-500 block">Waste: {inputs.foodWaste}</span>
            <span className="text-[10px] text-gray-500 block">Spend: ${inputs.shoppingSpend}/mo</span>
          </div>
        </div>
      </div>

      {/* Active Action Planner */}
      <div className="space-y-3 print-card">
        <h3 className="text-base font-bold text-emerald-950 border-b border-gray-200 pb-1.5 uppercase tracking-wide">Roadmap Action Items</h3>
        {activePlanTips.length > 0 ? (
          <div className="space-y-2.5">
            {activePlanTips.map((tip) => {
              const isCompleted = completedRecommendations.includes(tip.id);
              return (
                <div key={tip.id} className="border border-gray-200 rounded-lg p-3 flex justify-between items-start gap-4 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        {tip.category}
                      </span>
                      <strong className="text-gray-800">{tip.title}</strong>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">{tip.actionText}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-emerald-700 block">Saves {formatCO2(tip.co2Savings)}/yr</span>
                    <span className={`text-[9px] font-bold uppercase mt-1 inline-block px-1.5 py-0.2 rounded ${
                      isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {isCompleted ? '✓ Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No action items added to your active planner yet.</p>
        )}
      </div>

      {/* Streaks and Badges unlocked */}
      <div className="grid grid-cols-2 gap-6 print-card">
        <div className="space-y-2.5">
          <h3 className="text-base font-bold text-emerald-950 border-b border-gray-200 pb-1.5 uppercase tracking-wide">Consistency Statistics</h3>
          <div className="text-xs space-y-1">
            <div className="flex justify-between"><span>Current Daily Habit Streak:</span> <strong>{streakCount} Days</strong></div>
            <div className="flex justify-between"><span>Total Achievement Badges:</span> <strong>{badges.length} Unlocked</strong></div>
          </div>
        </div>
        
        <div className="space-y-2.5">
          <h3 className="text-base font-bold text-emerald-950 border-b border-gray-200 pb-1.5 uppercase tracking-wide">Carbon Reduction Goal</h3>
          <div className="text-xs space-y-1">
            <div className="flex justify-between"><span>Total Scheduled Savings:</span> 
              <strong className="text-emerald-700">
                {formatCO2(activePlanTips.reduce((acc, t) => acc + t.co2Savings, 0))} CO2e/year
              </strong>
            </div>
            <div className="flex justify-between"><span>Total Achieved Savings:</span> 
              <strong className="text-emerald-700">
                {formatCO2(activePlanTips.filter(t => completedRecommendations.includes(t.id)).reduce((acc, t) => acc + t.co2Savings, 0))} CO2e/year
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 pt-6 text-center text-[10px] text-gray-400 font-medium">
        <p>TerraGuide is a private, client-side, open-source sustainability guide. No user profiles are synced to cloud databases.</p>
        <p className="mt-1">https://github.com/vinaypinagadi/AlgoFlow-AI-Powered-Algorithm-Flowchart-Generator</p>
      </div>
    </div>
  );
}
