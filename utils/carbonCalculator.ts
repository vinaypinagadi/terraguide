import { CarbonInputs } from '../store/useCarbonStore';

export interface CarbonBreakdown {
  home: number;        // kg CO2e / year
  transport: number;   // kg CO2e / year
  food: number;        // kg CO2e / year
  consumption: number; // kg CO2e / year
  total: number;       // kg CO2e / year
}

export const GLOBAL_AVERAGE_CO2 = 4700; // kg CO2e per person per year
export const US_AVERAGE_CO2 = 16000;    // kg CO2e per person per year
export const EUROPE_AVERAGE_CO2 = 6400;  // kg CO2e per person per year

export function calculateCarbonDetails(inputs: CarbonInputs): CarbonBreakdown {
  // 1. Home Category (scaled to per-person based on household size)
  const electricityAnnual = inputs.electricityBill * 12 * 0.38;
  
  let heatingAnnual = 0;
  if (inputs.heatingSource === 'gas') {
    heatingAnnual = inputs.heatingAmount * 12 * 0.18;
  } else if (inputs.heatingSource === 'oil') {
    heatingAnnual = inputs.heatingAmount * 12 * 0.26;
  } else if (inputs.heatingSource === 'electricity') {
    heatingAnnual = inputs.heatingAmount * 12 * 0.38;
  }
  
  const homeTotal = Math.round((electricityAnnual + heatingAnnual) / Math.max(1, inputs.householdSize));

  // 2. Transport Category
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

  // Public transport: hours/week * 52 weeks * 20 miles/hour * 0.09 kg CO2e/mile
  const publicTransitAnnual = inputs.publicTransportHours * 52 * 20 * 0.09;
  
  // Flights: short (<3h) is ~150 kg, long (>3h) is ~800 kg per flight
  const shortFlightAnnual = inputs.shortFlights * 150;
  const longFlightAnnual = inputs.longFlights * 800;
  
  const transportTotal = Math.round(carAnnual + publicTransitAnnual + shortFlightAnnual + longFlightAnnual);

  // 3. Food Category
  let foodDietBase = 2000; // default average
  if (inputs.dietType === 'meat-heavy') foodDietBase = 2900;
  else if (inputs.dietType === 'low-meat') foodDietBase = 1500;
  else if (inputs.dietType === 'vegetarian') foodDietBase = 1200;
  else if (inputs.dietType === 'vegan') foodDietBase = 800;

  let foodWasteAdj = 0;
  if (inputs.foodWaste === 'high') foodWasteAdj = 200;
  else if (inputs.foodWaste === 'low') foodWasteAdj = -100;

  // Local food reduction: max -50kg
  const foodLocalAdj = -0.5 * inputs.localFoodRatio;
  
  const foodTotal = Math.round(Math.max(0, foodDietBase + foodWasteAdj + foodLocalAdj));

  // 4. Consumption Category
  const shoppingAnnual = inputs.shoppingSpend * 12 * 0.50;
  
  let recyclingAdj = 0;
  if (inputs.recyclingHabits === 'none') recyclingAdj = 100;
  else if (inputs.recyclingHabits === 'detailed') recyclingAdj = -150;
  
  const consumptionTotal = Math.round(Math.max(0, shoppingAnnual + recyclingAdj));

  // Totals
  const total = homeTotal + transportTotal + foodTotal + consumptionTotal;

  return {
    home: homeTotal,
    transport: transportTotal,
    food: foodTotal,
    consumption: consumptionTotal,
    total,
  };
}

export function formatCO2(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)} t`;
  }
  return `${Math.round(kg)} kg`;
}
