import { CarbonInputs } from '../store/useCarbonStore';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'home' | 'transport' | 'food' | 'consumption';
  co2Savings: number; // Annual kg CO2e saved
  impact: 'high' | 'medium' | 'low';
  ease: 'easy' | 'medium' | 'hard';
  actionText: string;
}

export const ALL_RECOMMENDATIONS: (Recommendation & { trigger: (inputs: CarbonInputs) => boolean })[] = [
  // --- HOME ---
  {
    id: 'led-bulbs',
    title: 'Switch to Smart LED Bulbs',
    description: 'Replace standard light bulbs with high-efficiency LEDs. They use up to 80% less energy.',
    category: 'home',
    co2Savings: 90,
    impact: 'low',
    ease: 'easy',
    actionText: 'Replace all remaining incandescent and CFL bulbs with LEDs.',
    trigger: () => true,
  },
  {
    id: 'thermostat-down',
    title: 'Lower Thermostat by 1°C',
    description: 'Reducing your heating temperature slightly can save major amounts of fuel and electrical heating costs.',
    category: 'home',
    co2Savings: 280,
    impact: 'medium',
    ease: 'easy',
    actionText: 'Set your winter thermostat to 19°C (68°F) and put on a cozy sweater.',
    trigger: (inputs) => inputs.heatingSource !== 'none',
  },
  {
    id: 'solar-panels',
    title: 'Install Rooftop Solar Panels',
    description: 'Transitioning to clean, on-site solar power dramatically drops your home grid dependence and electric emissions.',
    category: 'home',
    co2Savings: 1500,
    impact: 'high',
    ease: 'hard',
    actionText: 'Request a home solar survey and check local clean energy tax credits.',
    trigger: (inputs) => inputs.electricityBill > 120 && inputs.householdSize >= 2,
  },
  {
    id: 'unplug-vampires',
    title: 'Eliminate "Vampire Draw"',
    description: 'Electronics draw power even when turned off. Plugging them into smart power strips that shut down completely solves this.',
    category: 'home',
    co2Savings: 60,
    impact: 'low',
    ease: 'easy',
    actionText: 'Use power strips with switches for TVs, game consoles, and chargers, and switch them off at night.',
    trigger: () => true,
  },
  {
    id: 'home-insulation',
    title: 'Upgrade Attic & Wall Insulation',
    description: 'Prevent heat loss during winter and keep cool in summer by sealing drafts and upgrading insulation.',
    category: 'home',
    co2Savings: 600,
    impact: 'high',
    ease: 'hard',
    actionText: 'Seal air leaks around windows/doors and check your attic insulation levels.',
    trigger: (inputs) => inputs.heatingSource !== 'none' && inputs.heatingAmount > 80,
  },

  // --- TRANSPORT ---
  {
    id: 'car-free-day',
    title: 'Implement one Car-Free Day per Week',
    description: 'Leave the car parked at home once a week. Walk, cycle, or use public transit instead.',
    category: 'transport',
    co2Savings: 450,
    impact: 'medium',
    ease: 'medium',
    actionText: 'Choose a day (e.g., Wednesday) to commute entirely without a car.',
    trigger: (inputs) => inputs.carType !== 'none' && inputs.annualMileage > 2000,
  },
  {
    id: 'electric-vehicle',
    title: 'Transition to an Electric Car',
    description: 'When buying your next car, choose electric. Electric engines emit far less CO2 per mile, even when powered by grid electricity.',
    category: 'transport',
    co2Savings: 1600,
    impact: 'high',
    ease: 'hard',
    actionText: 'Research electric car models, ranges, and state incentives.',
    trigger: (inputs) => inputs.carType === 'petrol' || inputs.carType === 'diesel',
  },
  {
    id: 'reduce-long-flight',
    title: 'Replace one Long-Haul Flight',
    description: 'Aviation is carbon-dense. Replacing one long flight with a train journey or a local vacation saves immense amounts of CO2.',
    category: 'transport',
    co2Savings: 800,
    impact: 'high',
    ease: 'medium',
    actionText: 'Plan a staycation or choose a train-accessible destination for your next trip.',
    trigger: (inputs) => inputs.longFlights > 0,
  },
  {
    id: 'bike-short-commutes',
    title: 'Bike or Walk for Trips under 2 Miles',
    description: 'Over half of urban car trips are under 2 miles. Riding a bike is healthy, fast, and yields zero carbon emissions.',
    category: 'transport',
    co2Savings: 180,
    impact: 'low',
    ease: 'easy',
    actionText: 'Commit to walking or cycling for all neighborhood errands under 2 miles.',
    trigger: (inputs) => inputs.carType !== 'none' && inputs.annualMileage > 1000,
  },
  {
    id: 'eco-driving',
    title: 'Adopt Eco-Driving Habits',
    description: 'Drive smoothly, avoid excessive idling, keep tires inflated, and clear roof racks to decrease fuel usage by 10-15%.',
    category: 'transport',
    co2Savings: 200,
    impact: 'medium',
    ease: 'easy',
    actionText: 'Check tire pressures monthly and avoid rapid acceleration/deceleration.',
    trigger: (inputs) => inputs.carType !== 'none' && inputs.carType !== 'electric',
  },

  // --- FOOD ---
  {
    id: 'vegetarian-days',
    title: 'Go Vegetarian 3 Days/Week',
    description: 'Rethink your plates. Swapping beef, pork, and chicken for grains, beans, and vegetables significantly lowers agricultural footprints.',
    category: 'food',
    co2Savings: 500,
    impact: 'medium',
    ease: 'easy',
    actionText: 'Plan a vegetarian menu for Mondays, Wednesdays, and Fridays.',
    trigger: (inputs) => inputs.dietType === 'meat-heavy' || inputs.dietType === 'average',
  },
  {
    id: 'vegan-diet',
    title: 'Adopt a Plant-Based Diet',
    description: 'Going vegan is one of the most powerful personal moves. It cuts food emissions by more than half compared to the average diet.',
    category: 'food',
    co2Savings: 1200,
    impact: 'high',
    ease: 'hard',
    actionText: 'Gradually replace dairy and meat with plant-based milks, legumes, tofu, and meat alternatives.',
    trigger: (inputs) => inputs.dietType !== 'vegan',
  },
  {
    id: 'zero-food-waste',
    title: 'Target Zero Food Waste',
    description: 'Roughly 30% of global food is wasted. Planning meals, storing food correctly, and freezing leftovers directly saves energy and resources.',
    category: 'food',
    co2Savings: 180,
    impact: 'medium',
    ease: 'easy',
    actionText: 'Write a shopping list before shopping and commit to eating leftovers before they spoil.',
    trigger: (inputs) => inputs.foodWaste === 'high' || inputs.foodWaste === 'medium',
  },
  {
    id: 'local-seasonal',
    title: 'Buy Local and Seasonal Food',
    description: 'Sourcing food locally cuts down transit and refrigeration greenhouse gases. Seasonal fruits and vegetables are also healthier.',
    category: 'food',
    co2Savings: 80,
    impact: 'low',
    ease: 'medium',
    actionText: 'Visit local farmers markets and buy produce grown locally in its natural season.',
    trigger: (inputs) => inputs.localFoodRatio < 50,
  },

  // --- CONSUMPTION ---
  {
    id: 'secondhand-first',
    title: 'Buy Secondhand First',
    description: 'Manufacturing new clothes and electronics is carbon-heavy. Thrift shopping and buying refurbished gear bypasses production emissions.',
    category: 'consumption',
    co2Savings: 350,
    impact: 'medium',
    ease: 'easy',
    actionText: 'Look on eBay, thrift stores, or refurbish shops before buying brand new clothing or gadgets.',
    trigger: (inputs) => inputs.shoppingSpend > 80,
  },
  {
    id: 'composting-recycling',
    title: 'Begin Composting Organic Waste',
    description: 'Food waste in landfills produces methane. Composting converts organic material into healthy soil nutrients anaerobically.',
    category: 'consumption',
    co2Savings: 140,
    impact: 'medium',
    ease: 'medium',
    actionText: 'Start a backyard compost pile or obtain a countertop composting bin.',
    trigger: (inputs) => inputs.recyclingHabits !== 'detailed',
  },
  {
    id: 'repair-dont-replace',
    title: 'Repair Items Instead of Replacing',
    description: 'Extend the lifespan of tools, clothes, and electronics. Stitch a seam, replace a phone battery, or repair furniture.',
    category: 'consumption',
    co2Savings: 180,
    impact: 'medium',
    ease: 'medium',
    actionText: 'Use local repair cafes or search YouTube tutorials to repair broken household items.',
    trigger: (inputs) => inputs.shoppingSpend > 50,
  },
  {
    id: 'minimalist-shopping',
    title: 'Adopt a Minimalist Shopping Rule',
    description: 'Before buying non-essential items, wait 48 hours. This simple cooling-off rule cuts unnecessary shopping and emissions.',
    category: 'consumption',
    co2Savings: 250,
    impact: 'medium',
    ease: 'easy',
    actionText: 'Implement a 48-hour delay rule for any non-essential online shopping purchases.',
    trigger: (inputs) => inputs.shoppingSpend > 120,
  },
];

export function getRecommendationsForUser(inputs: CarbonInputs): Recommendation[] {
  return ALL_RECOMMENDATIONS
    .filter((rec) => rec.trigger(inputs))
    .map(({ id, title, description, category, co2Savings, impact, ease, actionText }) => ({
      id,
      title,
      description,
      category,
      co2Savings,
      impact,
      ease,
      actionText,
    }))
    .sort((a, b) => b.co2Savings - a.co2Savings);
}
