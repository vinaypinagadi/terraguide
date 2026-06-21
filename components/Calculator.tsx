import React, { useState } from 'react';
import { useCarbonStore, CarbonInputs } from '../store/useCarbonStore';
import { Home, Car, Utensils, ShoppingBag, ArrowRight, ArrowLeft, Leaf, Plus, Minus } from 'lucide-react';
import Preloader from './Preloader';

export default function Calculator() {
  const { inputs, setInputs, setHasCalculated } = useCarbonStore();
  const [step, setStep] = useState(1);
  const [calculating, setCalculating] = useState(false);

  // Local state to store intermediate edits before applying/submitting if wanted,
  // but direct binding to store inputs is very dynamic and responsive!
  const handleChange = (key: keyof CarbonInputs, value: any) => {
    setInputs({ [key]: value });
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);
    // Simulate complex local carbon modeling with preloader
    setTimeout(() => {
      setCalculating(false);
      setHasCalculated(true);
    }, 1800);
  };

  const increment = (key: keyof CarbonInputs, stepVal: number = 1, max: number = 99999) => {
    const val = Number(inputs[key]) || 0;
    handleChange(key, Math.min(max, val + stepVal));
  };

  const decrement = (key: keyof CarbonInputs, stepVal: number = 1, min: number = 0) => {
    const val = Number(inputs[key]) || 0;
    handleChange(key, Math.max(min, val - stepVal));
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {calculating && <Preloader message="Generating carbon analytics..." />}

      {/* Title & Description */}
      <div className="text-center mb-8">
        <div className="inline-flex p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-full text-emerald-600 dark:text-emerald-400 mb-3 animate-float">
          <Leaf className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-emerald-950 dark:text-emerald-50 font-sans tracking-tight">
          Calculate Your Footprint
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto mt-2">
          TerraGuide evaluates your footprint locally. Fill out these quick categories to build your personalized profile.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 px-4">
        <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground mb-3">
          <span className={step >= 1 ? "text-emerald-600 dark:text-emerald-400" : ""}>Home</span>
          <span className={step >= 2 ? "text-emerald-600 dark:text-emerald-400" : ""}>Transport</span>
          <span className={step >= 3 ? "text-emerald-600 dark:text-emerald-400" : ""}>Diet & Food</span>
          <span className={step >= 4 ? "text-emerald-600 dark:text-emerald-400" : ""}>Consumption</span>
        </div>
        <div className="h-2 w-full bg-border rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-300 ease-out" 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Wizard */}
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        
        {/* STEP 1: HOME */}
        {step === 1 && (
          <div className="animate-fade-in space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-emerald-950 dark:text-emerald-50">Home Energy</h2>
                <p className="text-xs text-muted-foreground">Electricity, heating, and household details.</p>
              </div>
            </div>

            {/* Household Size */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Household Size</label>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{inputs.householdSize} {inputs.householdSize === 1 ? 'person' : 'people'}</span>
              </div>
              <p className="text-xs text-muted-foreground">Emissions from shared utilities are split among housemates.</p>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => decrement('householdSize', 1, 1)}
                  className="p-2 border border-border rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={inputs.householdSize}
                  onChange={(e) => handleChange('householdSize', parseInt(e.target.value))}
                  className="flex-1 accent-emerald-500 h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => increment('householdSize', 1, 8)}
                  className="p-2 border border-border rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Electricity Usage */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Monthly Electricity</label>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{inputs.electricityBill} kWh/month</span>
              </div>
              <p className="text-xs text-muted-foreground">Average household is ~250-400 kWh/month depending on size.</p>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => decrement('electricityBill', 50, 0)}
                  className="p-2 border border-border rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="range"
                  min="0"
                  max="1200"
                  step="50"
                  value={inputs.electricityBill}
                  onChange={(e) => handleChange('electricityBill', parseInt(e.target.value))}
                  className="flex-1 accent-emerald-500 h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => increment('electricityBill', 50, 1200)}
                  className="p-2 border border-border rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Heating Source */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Heating Energy Source</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['gas', 'electricity', 'oil', 'none'] as const).map((source) => (
                  <button
                    key={source}
                    type="button"
                    onClick={() => handleChange('heatingSource', source)}
                    className={`p-3 text-center rounded-xl border text-sm capitalize font-medium transition-all ${
                      inputs.heatingSource === source
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold shadow-sm'
                        : 'border-border hover:bg-emerald-50/20 dark:hover:bg-emerald-950/5 text-muted-foreground'
                    }`}
                  >
                    {source === 'none' ? 'No Heating' : source}
                  </button>
                ))}
              </div>
            </div>

            {/* Heating Amount */}
            {inputs.heatingSource !== 'none' && (
              <div className="space-y-2 animate-fade-in">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Monthly Heating Bill/Use</label>
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{inputs.heatingAmount} kWh/month</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => decrement('heatingAmount', 25, 0)}
                    className="p-2 border border-border rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="600"
                    step="25"
                    value={inputs.heatingAmount}
                    onChange={(e) => handleChange('heatingAmount', parseInt(e.target.value))}
                    className="flex-1 accent-emerald-500 h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => increment('heatingAmount', 25, 600)}
                    className="p-2 border border-border rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: TRANSPORT */}
        {step === 2 && (
          <div className="animate-fade-in space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-emerald-950 dark:text-emerald-50">Transport & Travel</h2>
                <p className="text-xs text-muted-foreground">Cars, public transit, and flights details.</p>
              </div>
            </div>

            {/* Car Type */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Primary Vehicle Fuel Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {(['petrol', 'diesel', 'hybrid', 'electric', 'none'] as const).map((fuel) => (
                  <button
                    key={fuel}
                    type="button"
                    onClick={() => handleChange('carType', fuel)}
                    className={`p-3 text-center rounded-xl border text-xs capitalize font-medium transition-all ${
                      inputs.carType === fuel
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold shadow-sm'
                        : 'border-border hover:bg-emerald-50/20 dark:hover:bg-emerald-950/5 text-muted-foreground'
                    }`}
                  >
                    {fuel === 'none' ? 'No Car' : fuel}
                  </button>
                ))}
              </div>
            </div>

            {/* Annual Mileage */}
            {inputs.carType !== 'none' && (
              <div className="space-y-2 animate-fade-in">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Annual Driving Mileage</label>
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{inputs.annualMileage.toLocaleString()} miles/year</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => decrement('annualMileage', 500, 0)}
                    className="p-2 border border-border rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="30000"
                    step="500"
                    value={inputs.annualMileage}
                    onChange={(e) => handleChange('annualMileage', parseInt(e.target.value))}
                    className="flex-1 accent-emerald-500 h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => increment('annualMileage', 500, 30000)}
                    className="p-2 border border-border rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Public Transport */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Public Transit Commute</label>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{inputs.publicTransportHours} hours/week</span>
              </div>
              <p className="text-xs text-muted-foreground">Buses, subways, and trains commuter hours.</p>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => decrement('publicTransportHours', 1, 0)}
                  className="p-2 border border-border rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={inputs.publicTransportHours}
                  onChange={(e) => handleChange('publicTransportHours', parseInt(e.target.value))}
                  className="flex-1 accent-emerald-500 h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => increment('publicTransportHours', 1, 40)}
                  className="p-2 border border-border rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Flights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Short Flights (&lt; 3 hrs)</label>
                <p className="text-xs text-muted-foreground">Domestic or short regional flights per year.</p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => decrement('shortFlights', 1, 0)}
                    className="p-2 border border-border rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-emerald-950 dark:text-emerald-50">{inputs.shortFlights}</span>
                  <button
                    type="button"
                    onClick={() => increment('shortFlights', 1, 50)}
                    className="p-2 border border-border rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Long Flights (&gt; 3 hrs)</label>
                <p className="text-xs text-muted-foreground">Transcontinental or international flights per year.</p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => decrement('longFlights', 1, 0)}
                    className="p-2 border border-border rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-emerald-950 dark:text-emerald-50">{inputs.longFlights}</span>
                  <button
                    type="button"
                    onClick={() => increment('longFlights', 1, 30)}
                    className="p-2 border border-border rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: FOOD */}
        {step === 3 && (
          <div className="animate-fade-in space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-emerald-950 dark:text-emerald-50">Diet & Food Habits</h2>
                <p className="text-xs text-muted-foreground">Your diet footprint and shopping values.</p>
              </div>
            </div>

            {/* Diet Type */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Primary Diet Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {([
                  { key: 'meat-heavy', label: 'Meat Heavy', desc: 'Eat beef/pork daily' },
                  { key: 'average', label: 'Average', desc: 'Regular mixed diet' },
                  { key: 'low-meat', label: 'Low Meat', desc: 'Mostly poultry/fish' },
                  { key: 'vegetarian', label: 'Vegetarian', desc: 'No meat, yes dairy' },
                  { key: 'vegan', label: 'Vegan', desc: 'Strictly plant-based' }
                ] as const).map((diet) => (
                  <button
                    key={diet.key}
                    type="button"
                    onClick={() => handleChange('dietType', diet.key)}
                    className={`p-3 text-center rounded-xl border flex flex-col items-center justify-center transition-all ${
                      inputs.dietType === diet.key
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold shadow-sm'
                        : 'border-border hover:bg-emerald-50/20 dark:hover:bg-emerald-950/5 text-muted-foreground'
                    }`}
                  >
                    <span className="text-xs font-semibold">{diet.label}</span>
                    <span className="text-[10px] opacity-75 mt-0.5 leading-tight">{diet.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Food Waste */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Food Waste Frequency</label>
              <p className="text-xs text-muted-foreground">How much purchased food gets thrown away or spoiled?</p>
              <div className="grid grid-cols-3 gap-3">
                {(['low', 'medium', 'high'] as const).map((waste) => (
                  <button
                    key={waste}
                    type="button"
                    onClick={() => handleChange('foodWaste', waste)}
                    className={`p-3 text-center rounded-xl border text-sm capitalize font-medium transition-all ${
                      inputs.foodWaste === waste
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold shadow-sm'
                        : 'border-border hover:bg-emerald-50/20 dark:hover:bg-emerald-950/5 text-muted-foreground'
                    }`}
                  >
                    {waste === 'low' ? 'Low (< 10%)' : waste === 'medium' ? 'Medium (10-25%)' : 'High (> 25%)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Local Food Ratio */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Local & Seasonal Food Share</label>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{inputs.localFoodRatio}% of diet</span>
              </div>
              <p className="text-xs text-muted-foreground">Percentage of food sourced locally (reduces transit mileage emissions).</p>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => decrement('localFoodRatio', 10, 0)}
                  className="p-2 border border-border rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={inputs.localFoodRatio}
                  onChange={(e) => handleChange('localFoodRatio', parseInt(e.target.value))}
                  className="flex-1 accent-emerald-500 h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => increment('localFoodRatio', 10, 100)}
                  className="p-2 border border-border rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: CONSUMPTION */}
        {step === 4 && (
          <div className="animate-fade-in space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-emerald-950 dark:text-emerald-50">Goods & Consumption</h2>
                <p className="text-xs text-muted-foreground">Shopping habits and waste management.</p>
              </div>
            </div>

            {/* Shopping spend */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Monthly Shopping Budget</label>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">${inputs.shoppingSpend}/month</span>
              </div>
              <p className="text-xs text-muted-foreground">Non-essential spending (clothes, tech gadgets, furniture).</p>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => decrement('shoppingSpend', 25, 0)}
                  className="p-2 border border-border rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="range"
                  min="0"
                  max="1500"
                  step="25"
                  value={inputs.shoppingSpend}
                  onChange={(e) => handleChange('shoppingSpend', parseInt(e.target.value))}
                  className="flex-1 accent-emerald-500 h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => increment('shoppingSpend', 25, 1500)}
                  className="p-2 border border-border rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Recycling Habits */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Recycling and Waste Sorting</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {([
                  { key: 'none', label: 'Minimal', desc: 'Put all trash together' },
                  { key: 'some', label: 'Basic Sorting', desc: 'Separate paper & plastic' },
                  { key: 'detailed', label: 'Eco-Champion', desc: 'Compost, sort, glass, metal' }
                ] as const).map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleChange('recyclingHabits', opt.key)}
                    className={`p-3 text-left rounded-xl border flex flex-col transition-all ${
                      inputs.recyclingHabits === opt.key
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold shadow-sm'
                        : 'border-border hover:bg-emerald-50/20 dark:hover:bg-emerald-950/5 text-muted-foreground'
                    }`}
                  >
                    <span className="text-sm font-semibold capitalize">{opt.label}</span>
                    <span className="text-[10px] opacity-75 mt-0.5 leading-tight">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between gap-4 border-t border-border pt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-5 py-2.5 border border-border rounded-xl font-medium text-emerald-800 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/25 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 flex items-center gap-2 cursor-pointer transition-colors"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/10 hover:shadow-emerald-700/20 transition-all animate-pulse"
            >
              <Leaf className="w-4 h-4" /> Calculate Footprint
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
