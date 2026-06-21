import React, { useState } from 'react';
import { useCarbonStore, CarbonInputs } from '../store/useCarbonStore';
import { Home, Car, Utensils, ShoppingBag, ArrowRight, ArrowLeft, Leaf, Plus, Minus } from 'lucide-react';
import Preloader from './Preloader';

interface NumberInputProps {
  label: string;
  sublabel?: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
}

function NumberInput({ label, sublabel, value, unit, min, max, step = 1, onChange }: NumberInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="text-sm font-medium text-emerald-900 dark:text-emerald-100">{label}</label>
        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          {value.toLocaleString()} {unit}
        </span>
      </div>
      {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - step))}
          aria-label={`Decrease ${label}`}
          className="p-2 border border-border rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          aria-label={label}
          className="flex-1 accent-emerald-500 h-1.5 bg-border rounded-lg appearance-none cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
        />
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + step))}
          aria-label={`Increase ${label}`}
          className="p-2 border border-border rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface CounterInputProps {
  label: string;
  sublabel?: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
}

function CounterInput({ label, sublabel, value, onChange, min = 0 }: CounterInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-emerald-900 dark:text-emerald-100">{label}</label>
      {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Decrease ${label}`}
          className="p-2 border border-border rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-12 text-center font-bold text-emerald-950 dark:text-emerald-50" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          aria-label={`Increase ${label}`}
          className="p-2 border border-border rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function Calculator() {
  const { inputs, setInputs, setHasCalculated } = useCarbonStore();
  const [step, setStep] = useState(1);
  const [calculating, setCalculating] = useState(false);

  const handleChange = <K extends keyof CarbonInputs>(key: K, value: CarbonInputs[K]) => {
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
            <NumberInput
              label="Household Size"
              sublabel="Emissions from shared utilities are split among housemates."
              value={inputs.householdSize}
              unit={inputs.householdSize === 1 ? 'person' : 'people'}
              min={1}
              max={8}
              onChange={(val) => handleChange('householdSize', val)}
            />

            {/* Electricity Usage */}
            <NumberInput
              label="Monthly Electricity"
              sublabel="Average household is ~250-400 kWh/month depending on size."
              value={inputs.electricityBill}
              unit="kWh/month"
              min={0}
              max={1200}
              step={50}
              onChange={(val) => handleChange('electricityBill', val)}
            />

            {/* Heating Source */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Heating Energy Source</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['gas', 'electricity', 'oil', 'none'] as const).map((source) => (
                  <button
                    key={source}
                    type="button"
                    onClick={() => handleChange('heatingSource', source)}
                    className={`p-3 text-center rounded-xl border text-sm capitalize font-semibold focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none transition-all cursor-pointer ${
                      inputs.heatingSource === source
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm'
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
              <NumberInput
                label="Monthly Heating Bill/Use"
                value={inputs.heatingAmount}
                unit="kWh/month"
                min={0}
                max={600}
                step={25}
                onChange={(val) => handleChange('heatingAmount', val)}
              />
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
                    className={`p-3 text-center rounded-xl border text-xs capitalize font-semibold focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none transition-all cursor-pointer ${
                      inputs.carType === fuel
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'border-border hover:bg-emerald-50/20 dark:hover:bg-emerald-950/5 text-muted-foreground'
                    }`}
                  >
                    {fuel === 'none' ? 'No Car' : fuel}
                  </button>
                ))}
              </div>
            </div>

            {/* Annual Driving Mileage */}
            {inputs.carType !== 'none' && (
              <NumberInput
                label="Annual Driving Mileage"
                value={inputs.annualMileage}
                unit="miles/year"
                min={0}
                max={30000}
                step={500}
                onChange={(val) => handleChange('annualMileage', val)}
              />
            )}

            {/* Public Transit Commute */}
            <NumberInput
              label="Public Transit Commute"
              sublabel="Buses, subways, and trains commuter hours."
              value={inputs.publicTransportHours}
              unit="hours/week"
              min={0}
              max={40}
              onChange={(val) => handleChange('publicTransportHours', val)}
            />

            {/* Flights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <CounterInput
                label="Short Flights (< 3 hrs)"
                sublabel="Domestic or short regional flights per year."
                value={inputs.shortFlights}
                onChange={(val) => handleChange('shortFlights', val)}
              />

              <CounterInput
                label="Long Flights (> 3 hrs)"
                sublabel="Transcontinental or international flights per year."
                value={inputs.longFlights}
                onChange={(val) => handleChange('longFlights', val)}
              />
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
                    className={`p-3 text-center rounded-xl border flex flex-col items-center justify-center focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none transition-all cursor-pointer ${
                      inputs.dietType === diet.key
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm'
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
                    className={`p-3 text-center rounded-xl border text-sm capitalize font-semibold focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none transition-all cursor-pointer ${
                      inputs.foodWaste === waste
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'border-border hover:bg-emerald-50/20 dark:hover:bg-emerald-950/5 text-muted-foreground'
                    }`}
                  >
                    {waste === 'low' ? 'Low (< 10%)' : waste === 'medium' ? 'Medium (10-25%)' : 'High (> 25%)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Local & Seasonal Food Share */}
            <NumberInput
              label="Local & Seasonal Food Share"
              sublabel="Percentage of food sourced locally (reduces transit mileage emissions)."
              value={inputs.localFoodRatio}
              unit="% of diet"
              min={0}
              max={100}
              step={5}
              onChange={(val) => handleChange('localFoodRatio', val)}
            />
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

            {/* Monthly Shopping Budget */}
            <NumberInput
              label="Monthly Shopping Budget"
              sublabel="Non-essential spending (clothes, tech gadgets, furniture)."
              value={inputs.shoppingSpend}
              unit="$/month"
              min={0}
              max={1500}
              step={25}
              onChange={(val) => handleChange('shoppingSpend', val)}
            />

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
                    className={`p-3 text-left rounded-xl border flex flex-col focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none transition-all cursor-pointer ${
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
              className="px-5 py-2.5 border border-border rounded-xl font-semibold text-emerald-800 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/25 flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none transition-colors"
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
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none transition-colors"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none shadow-md shadow-emerald-600/10 hover:shadow-emerald-700/20 transition-all animate-pulse"
            >
              <Leaf className="w-4 h-4" /> Calculate Footprint
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
