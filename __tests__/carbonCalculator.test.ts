import { calculateCarbonDetails } from '../utils/carbonCalculator';
import { CarbonInputs } from '../store/useCarbonStore';

const mockInputs: CarbonInputs = {
  electricityBill: 100, // 100 * 12 * 0.38 = 456
  heatingSource: 'gas',
  heatingAmount: 50, // 50 * 12 * 0.18 = 108
  householdSize: 2, // (456 + 108) / 2 = 282
  carType: 'petrol',
  annualMileage: 5000, // 5000 * 0.30 = 1500
  publicTransportHours: 2, // 2 * 52 * 20 * 0.09 = 187.2
  shortFlights: 1, // 150
  longFlights: 0, // 0
  dietType: 'vegetarian', // 1200
  foodWaste: 'medium', // 0
  localFoodRatio: 20, // -0.5 * 20 = -10
  shoppingSpend: 100, // 100 * 12 * 0.5 = 600
  recyclingHabits: 'some', // 0
};

describe('Carbon Footprint Calculator Utilities', () => {
  it('correctly calculates home, transit, food, and consumption categories', () => {
    const breakdown = calculateCarbonDetails(mockInputs);
    
    // Home: (456 + 108) / 2 = 282
    expect(breakdown.home).toBe(282);
    
    // Transport: car (1500) + transit (187.2) + flight (150) = 1837
    expect(breakdown.transport).toBe(1837);
    
    // Food: vegetarian base (1200) + waste (0) + local (-10) = 1190
    expect(breakdown.food).toBe(1190);
    
    // Consumption: shopping (600) + recycling (0) = 600
    expect(breakdown.consumption).toBe(600);
    
    // Total
    expect(breakdown.total).toBe(282 + 1837 + 1190 + 600);
  });

  it('varies home emissions based on household size split', () => {
    const singleBreakdown = calculateCarbonDetails({ ...mockInputs, householdSize: 1 });
    const familyBreakdown = calculateCarbonDetails({ ...mockInputs, householdSize: 4 });
    
    expect(singleBreakdown.home).toBe(564); // 456 + 108
    expect(familyBreakdown.home).toBe(141);  // (456 + 108) / 4
  });

  it('correctly handles different vehicle choices', () => {
    const electricMileage = calculateCarbonDetails({ ...mockInputs, carType: 'electric' });
    const noneMileage = calculateCarbonDetails({ ...mockInputs, carType: 'none' });
    
    // Electric car: 5000 * 0.08 = 400
    // Petrol car: 5000 * 0.30 = 1500
    // Difference is 1100
    expect(mockInputs.carType).toBe('petrol');
    const petrolBreakdown = calculateCarbonDetails(mockInputs);
    expect(petrolBreakdown.transport - electricMileage.transport).toBe(1100);
    expect(noneMileage.transport).toBe(Math.round(2 * 52 * 20 * 0.09) + 150); // only transit + short flight
  });
});
