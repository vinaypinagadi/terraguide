import React, { useState } from 'react';
import { useCarbonStore } from '../store/useCarbonStore';
import { calculateCarbonDetails, formatCO2 } from '../utils/carbonCalculator';
import { ScenarioProjectionChart } from './DashboardCharts';
import { Sparkles, HelpCircle, Save, Info, RefreshCw } from 'lucide-react';

export default function ScenarioModel() {
  const { inputs, setInputs } = useCarbonStore();

  // Local scenario simulator variables
  const [meatFreeDays, setMeatFreeDays] = useState(0);
  const [mileageReduction, setMileageReduction] = useState(0); // percentage (0-100)
  const [flightReduction, setFlightReduction] = useState(0);   // percentage (0-100)
  const [shoppingReduction, setShoppingReduction] = useState(0); // percentage (0-100)
  const [solarPanels, setSolarPanels] = useState(false);
  const [insulationUpgrade, setInsulationUpgrade] = useState(false);

  // Compute baseline carbon footprint
  const originalBreakdown = calculateCarbonDetails(inputs);
  const originalTotal = originalBreakdown.total;

  // Compute simulated footprint on-the-fly based on slider states
  const calculateSimulatedTotal = () => {
    // 1. Home Sector
    let electricityAnnual = inputs.electricityBill * 12 * 0.38;
    if (solarPanels) {
      electricityAnnual *= 0.35; // Solar cuts electricity grid footprint by 65%
    }
    
    let heatingAnnual = 0;
    if (inputs.heatingSource === 'gas') {
      heatingAnnual = inputs.heatingAmount * 12 * 0.18;
    } else if (inputs.heatingSource === 'oil') {
      heatingAnnual = inputs.heatingAmount * 12 * 0.26;
    } else if (inputs.heatingSource === 'electricity') {
      heatingAnnual = inputs.heatingAmount * 12 * 0.38;
    }
    if (insulationUpgrade) {
      heatingAnnual *= 0.70; // Insulation cuts heating footprint by 30%
    }
    
    const simulatedHome = Math.round((electricityAnnual + heatingAnnual) / Math.max(1, inputs.householdSize));

    // 2. Transport Sector
    let carAnnual = 0;
    if (inputs.carType === 'petrol') {
      carAnnual = inputs.annualMileage * 0.30;
    } else if (inputs.carType === 'diesel') {
      carAnnual = inputs.annualMileage * 0.27;
    } else if (inputs.carType === 'hybrid') {
      carAnnual = inputs.annualMileage * 0.16;
    } else if (inputs.carType === 'electric') {
      carAnnual = inputs.annualMileage * 0.08;
    }
    carAnnual *= (1 - mileageReduction / 100); // apply mileage reduction slider

    const publicTransitAnnual = inputs.publicTransportHours * 52 * 20 * 0.09;
    
    let flightAnnual = (inputs.shortFlights * 150) + (inputs.longFlights * 800);
    flightAnnual *= (1 - flightReduction / 100); // apply flights reduction slider

    const simulatedTransport = Math.round(carAnnual + publicTransitAnnual + flightAnnual);

    // 3. Food Sector
    let foodDietBase = 2000;
    if (inputs.dietType === 'meat-heavy') foodDietBase = 2900;
    else if (inputs.dietType === 'low-meat') foodDietBase = 1500;
    else if (inputs.dietType === 'vegetarian') foodDietBase = 1200;
    else if (inputs.dietType === 'vegan') foodDietBase = 800;

    // Apply meat free days slider (reduces diet emissions towards vegetarian base)
    // Vegetarian base is 1200. Meat free days lowers it from base diet to 1200.
    if (inputs.dietType !== 'vegetarian' && inputs.dietType !== 'vegan') {
      const dietDiff = foodDietBase - 1200;
      const dietSavings = dietDiff * (meatFreeDays / 7);
      foodDietBase -= dietSavings;
    }

    let foodWasteAdj = 0;
    if (inputs.foodWaste === 'high') foodWasteAdj = 200;
    else if (inputs.foodWaste === 'low') foodWasteAdj = -100;

    const foodLocalAdj = -0.5 * inputs.localFoodRatio;
    const simulatedFood = Math.round(Math.max(0, foodDietBase + foodWasteAdj + foodLocalAdj));

    // 4. Consumption Sector
    let shoppingAnnual = inputs.shoppingSpend * 12 * 0.50;
    shoppingAnnual *= (1 - shoppingReduction / 100); // apply shopping reduction slider

    let recyclingAdj = 0;
    if (inputs.recyclingHabits === 'none') recyclingAdj = 100;
    else if (inputs.recyclingHabits === 'detailed') recyclingAdj = -150;
    
    const simulatedConsumption = Math.round(Math.max(0, shoppingAnnual + recyclingAdj));

    return simulatedHome + simulatedTransport + simulatedFood + simulatedConsumption;
  };

  const simulatedTotal = calculateSimulatedTotal();
  const savings = originalTotal - simulatedTotal;
  const savingsPercentage = originalTotal > 0 ? (savings / originalTotal) * 100 : 0;

  // Reset simulator inputs
  const handleReset = () => {
    setMeatFreeDays(0);
    setMileageReduction(0);
    setFlightReduction(0);
    setShoppingReduction(0);
    setSolarPanels(false);
    setInsulationUpgrade(false);
  };

  // Permanently apply simulation settings to profile
  const handleApplyToProfile = () => {
    // 1. Calculate new values
    const newMileage = Math.round(inputs.annualMileage * (1 - mileageReduction / 100));
    
    let newShortFlights = inputs.shortFlights;
    let newLongFlights = inputs.longFlights;
    if (flightReduction >= 50) {
      newShortFlights = Math.round(inputs.shortFlights * 0.5);
      newLongFlights = Math.round(inputs.longFlights * 0.5);
    }
    
    const newShopping = Math.round(inputs.shoppingSpend * (1 - shoppingReduction / 100));
    
    let newDiet = inputs.dietType;
    if (meatFreeDays >= 5) {
      newDiet = 'vegetarian';
    } else if (meatFreeDays >= 2 && inputs.dietType === 'meat-heavy') {
      newDiet = 'average';
    }

    setInputs({
      annualMileage: newMileage,
      shortFlights: newShortFlights,
      longFlights: newLongFlights,
      shoppingSpend: newShopping,
      dietType: newDiet,
    });

    alert('Simulation applied! Your profile calculator inputs have been updated with these targets.');
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-emerald-950 dark:text-emerald-50">Future Scenario Modeling</h2>
        <p className="text-xs text-muted-foreground">Adjust sliders to forecast how lifestyle modifications shrink your footprint.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Sliders */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-widest border-b border-border/40 pb-2 flex justify-between items-center">
            Lifestyle Modifiers
            <button onClick={handleReset} className="text-[10px] text-muted-foreground hover:text-rose-500 flex items-center gap-1 cursor-pointer font-bold capitalize">
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </h3>

          {/* Meat Free Days Slider */}
          {inputs.dietType !== 'vegetarian' && inputs.dietType !== 'vegan' && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-950 dark:text-emerald-100">Meat-Free Days</span>
                <span className="text-emerald-600 dark:text-emerald-400">{meatFreeDays} days/week</span>
              </div>
              <input
                type="range"
                min="0"
                max="7"
                value={meatFreeDays}
                onChange={(e) => setMeatFreeDays(parseInt(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}

          {/* Car Mileage Reduction Slider */}
          {inputs.carType !== 'none' && inputs.annualMileage > 0 && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-950 dark:text-emerald-100">Reduce Car Driving</span>
                <span className="text-emerald-600 dark:text-emerald-400">-{mileageReduction}% mileage</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={mileageReduction}
                onChange={(e) => setMileageReduction(parseInt(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}

          {/* Flights Reduction Slider */}
          {(inputs.shortFlights > 0 || inputs.longFlights > 0) && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-950 dark:text-emerald-100">Reduce Air Travel</span>
                <span className="text-emerald-600 dark:text-emerald-400">-{flightReduction}% flights</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={flightReduction}
                onChange={(e) => setFlightReduction(parseInt(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}

          {/* Shopping Spend Reduction Slider */}
          {inputs.shoppingSpend > 0 && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-950 dark:text-emerald-100">Reduce Shopping Spend</span>
                <span className="text-emerald-600 dark:text-emerald-400">-{shoppingReduction}% spending</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={shoppingReduction}
                onChange={(e) => setShoppingReduction(parseInt(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}

          {/* Clean Home Checkboxes */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Home Upgrades</span>
            
            <label className="flex items-center gap-3 p-3 border border-border rounded-xl bg-card hover:bg-emerald-500/[0.02] cursor-pointer">
              <input
                type="checkbox"
                checked={solarPanels}
                onChange={(e) => setSolarPanels(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-border text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-emerald-950 dark:text-emerald-100">Install Solar Panels</span>
                <span className="text-[10px] text-muted-foreground block">Cuts household grid electricity reliance by 65%.</span>
              </div>
            </label>

            {inputs.heatingSource !== 'none' && (
              <label className="flex items-center gap-3 p-3 border border-border rounded-xl bg-card hover:bg-emerald-500/[0.02] cursor-pointer">
                <input
                  type="checkbox"
                  checked={insulationUpgrade}
                  onChange={(e) => setInsulationUpgrade(e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-border text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-emerald-950 dark:text-emerald-100">Upgrade Home Insulation</span>
                  <span className="text-[10px] text-muted-foreground block">Saves up to 30% of heating oil/gas/electric power drafts.</span>
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Right Column: Scenario Projection & Stats */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-50 uppercase tracking-widest border-b border-border/40 pb-2">
              Carbon Projections
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Below is your simulated carbon transition timeline. The line charts your drop from your current footprint down to your target lifestyle levels.
            </p>
          </div>

          {/* Scenario Chart */}
          <ScenarioProjectionChart originalTotal={originalTotal} simulatedTotal={simulatedTotal} />

          {/* Scenario Details summary box */}
          <div className="bg-emerald-500/5 dark:bg-emerald-950/15 border border-emerald-500/20 rounded-2xl p-4 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-semibold">Current Footprint:</span>
              <span className="text-xs font-bold text-emerald-950 dark:text-emerald-50">{formatCO2(originalTotal)}/yr</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-semibold">Simulated Footprint:</span>
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{formatCO2(simulatedTotal)}/yr</span>
            </div>
            <div className="border-t border-emerald-500/10 pt-2.5 flex justify-between items-center">
              <span className="text-sm font-extrabold text-emerald-800 dark:text-emerald-200">Potential Savings:</span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                {formatCO2(savings)} / year (-{savingsPercentage.toFixed(0)}%)
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleApplyToProfile}
            disabled={savings <= 0}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-border disabled:text-muted-foreground disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/5 transition-all"
          >
            <Save className="w-4 h-4" /> Apply Simulation to Profile
          </button>
        </div>

      </div>
    </div>
  );
}
