import { getRecommendationsForUser } from '../utils/recommendations';
import { CarbonInputs } from '../store/useCarbonStore';

const mockPerfectInputs: CarbonInputs = {
  electricityBill: 50,
  heatingSource: 'none',
  heatingAmount: 0,
  householdSize: 1,
  carType: 'none',
  annualMileage: 0,
  publicTransportHours: 0,
  shortFlights: 0,
  longFlights: 0,
  dietType: 'vegan',
  foodWaste: 'low',
  localFoodRatio: 100,
  shoppingSpend: 0,
  recyclingHabits: 'detailed',
};

describe('Recommendations Engine Rules', () => {
  it('returns only baseline global tips for a perfect zero-impact profile', () => {
    const tips = getRecommendationsForUser(mockPerfectInputs);
    const tipIds = tips.map((t) => t.id);
    
    // Always-on items
    expect(tipIds).toContain('led-bulbs');
    expect(tipIds).toContain('unplug-vampires');
    
    // Triggered conditional items should be missing
    expect(tipIds).not.toContain('thermostat-down');
    expect(tipIds).not.toContain('electric-vehicle');
    expect(tipIds).not.toContain('reduce-long-flight');
    expect(tipIds).not.toContain('vegan-diet');
    expect(tipIds).not.toContain('zero-food-waste');
  });

  it('correctly triggers driving recommendations when a car is present', () => {
    const carInputs = {
      ...mockPerfectInputs,
      carType: 'petrol' as const,
      annualMileage: 5000,
    };
    const tips = getRecommendationsForUser(carInputs);
    const tipIds = tips.map((t) => t.id);
    
    expect(tipIds).toContain('electric-vehicle');
    expect(tipIds).toContain('car-free-day');
    expect(tipIds).toContain('bike-short-commutes');
  });

  it('recommends zero food waste tips if waste levels are high or medium', () => {
    const wastefulInputs = {
      ...mockPerfectInputs,
      foodWaste: 'high' as const,
    };
    const tips = getRecommendationsForUser(wastefulInputs);
    const tipIds = tips.map((t) => t.id);
    
    expect(tipIds).toContain('zero-food-waste');
  });

  it('suggests dietary swaps if user eats meat', () => {
    const meatInputs = {
      ...mockPerfectInputs,
      dietType: 'average' as const,
    };
    const tips = getRecommendationsForUser(meatInputs);
    const tipIds = tips.map((t) => t.id);
    
    expect(tipIds).toContain('vegetarian-days');
    expect(tipIds).toContain('vegan-diet');
  });
});
