import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CarbonInputs {
  // Home
  electricityBill: number; // kWh/month
  heatingSource: 'gas' | 'oil' | 'electricity' | 'none';
  heatingAmount: number; // kWh/month
  householdSize: number;

  // Transport
  carType: 'petrol' | 'diesel' | 'hybrid' | 'electric' | 'none';
  annualMileage: number; // miles/year
  publicTransportHours: number; // hours/week
  shortFlights: number; // flights/year
  longFlights: number; // flights/year

  // Food
  dietType: 'meat-heavy' | 'average' | 'low-meat' | 'vegetarian' | 'vegan';
  foodWaste: 'high' | 'medium' | 'low';
  localFoodRatio: number; // percentage (0-100)

  // Consumption
  shoppingSpend: number; // $/month
  recyclingHabits: 'none' | 'some' | 'detailed';
}

export interface HabitLog {
  date: string; // YYYY-MM-DD
  habits: string[];
}

export interface CarbonState {
  hasCalculated: boolean;
  inputs: CarbonInputs;
  habitsHistory: HabitLog[];
  completedHabitsToday: string[];
  streakCount: number;
  lastActiveDate: string | null;
  badges: string[]; // List of badge IDs
  activeRecommendations: string[]; // List of tip IDs added to personal action plan
  completedRecommendations: string[]; // List of tip IDs completed
  
  // Actions
  setInputs: (inputs: Partial<CarbonInputs>) => void;
  setHasCalculated: (val: boolean) => void;
  toggleHabitToday: (habitId: string) => void;
  checkStreak: () => void;
  addRecommendationToPlan: (tipId: string) => void;
  removeRecommendationFromPlan: (tipId: string) => void;
  toggleRecommendationComplete: (tipId: string) => void;
  resetAllData: () => void;
  importData: (imported: Partial<CarbonState>) => boolean;
}

const initialInputs: CarbonInputs = {
  electricityBill: 250,
  heatingSource: 'gas',
  heatingAmount: 100,
  householdSize: 2,
  carType: 'petrol',
  annualMileage: 6000,
  publicTransportHours: 3,
  shortFlights: 1,
  longFlights: 0,
  dietType: 'average',
  foodWaste: 'medium',
  localFoodRatio: 30,
  shoppingSpend: 150,
  recyclingHabits: 'some',
};

const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const getYesterdayString = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

export const useCarbonStore = create<CarbonState>()(
  persist(
    (set, get) => ({
      hasCalculated: false,
      inputs: initialInputs,
      habitsHistory: [],
      completedHabitsToday: [],
      streakCount: 0,
      lastActiveDate: null,
      badges: [],
      activeRecommendations: [],
      completedRecommendations: [],


      setInputs: (newInputs) =>
        set((state) => ({
          inputs: { ...state.inputs, ...newInputs },
        })),

      setHasCalculated: (val) => set({ hasCalculated: val }),

      toggleHabitToday: (habitId) => {
        const todayStr = getTodayString();
        const state = get();
        
        let newCompletedToday = [...state.completedHabitsToday];
        if (newCompletedToday.includes(habitId)) {
          newCompletedToday = newCompletedToday.filter((id) => id !== habitId);
        } else {
          newCompletedToday.push(habitId);
        }

        // Update habits history
        let newHistory = [...state.habitsHistory];
        const existingLogIndex = newHistory.findIndex((log) => log.date === todayStr);

        if (existingLogIndex >= 0) {
          if (newCompletedToday.length === 0) {
            // Remove log if empty
            newHistory = newHistory.filter((log) => log.date !== todayStr);
          } else {
            newHistory[existingLogIndex] = { date: todayStr, habits: newCompletedToday };
          }
        } else if (newCompletedToday.length > 0) {
          newHistory.push({ date: todayStr, habits: newCompletedToday });
        }

        // Update active recommendation completions if applicable
        // Check achievements/badges
        const updatedBadges = [...state.badges];
        
        // Badge 1: First Habit Completed
        if (!updatedBadges.includes('first-habit') && newCompletedToday.length > 0) {
          updatedBadges.push('first-habit');
        }

        // Badge 2: Super Green Day (completed 4+ habits in one day)
        if (!updatedBadges.includes('super-green-day') && newCompletedToday.length >= 4) {
          updatedBadges.push('super-green-day');
        }

        // Badge 3: Consistent (history length >= 5 days)
        const uniqueDaysLogged = new Set(newHistory.map((h) => h.date)).size;
        if (!updatedBadges.includes('consistent-tracker') && uniqueDaysLogged >= 5) {
          updatedBadges.push('consistent-tracker');
        }

        set({
          completedHabitsToday: newCompletedToday,
          habitsHistory: newHistory,
          badges: updatedBadges,
        });

        // Re-evaluate streak
        get().checkStreak();
      },

      checkStreak: () => {
        const todayStr = getTodayString();
        const yesterdayStr = getYesterdayString();
        const { habitsHistory, lastActiveDate, streakCount } = get();

        // Find out if user logged anything today or yesterday
        const loggedToday = habitsHistory.some((h) => h.date === todayStr && h.habits.length > 0);
        const loggedYesterday = habitsHistory.some((h) => h.date === yesterdayStr && h.habits.length > 0);

        let newStreak = streakCount;

        if (loggedToday) {
          if (lastActiveDate === yesterdayStr) {
            newStreak = streakCount + 1;
          } else if (lastActiveDate !== todayStr) {
            // Streak broken but restarted today, or first login ever
            newStreak = 1;
          }
          // If lastActiveDate was today, streak count doesn't change
          set({ streakCount: newStreak, lastActiveDate: todayStr });
        } else if (!loggedYesterday && lastActiveDate && lastActiveDate !== todayStr) {
          // Streak broken
          set({ streakCount: 0 });
        }

        // Streak badges
        const updatedBadges = [...get().badges];
        if (newStreak >= 3 && !updatedBadges.includes('streak-3')) {
          updatedBadges.push('streak-3');
        }
        if (newStreak >= 7 && !updatedBadges.includes('streak-7')) {
          updatedBadges.push('streak-7');
        }
        set({ badges: updatedBadges });
      },

      addRecommendationToPlan: (tipId) => {
        const { activeRecommendations } = get();
        if (!activeRecommendations.includes(tipId)) {
          set({ activeRecommendations: [...activeRecommendations, tipId] });
        }
      },

      removeRecommendationFromPlan: (tipId) => {
        set((state) => ({
          activeRecommendations: state.activeRecommendations.filter((id) => id !== tipId),
          completedRecommendations: state.completedRecommendations.filter((id) => id !== tipId),
        }));
      },

      toggleRecommendationComplete: (tipId) => {
        const { completedRecommendations, badges } = get();
        let newCompleted = [...completedRecommendations];
        
        if (newCompleted.includes(tipId)) {
          newCompleted = newCompleted.filter((id) => id !== tipId);
        } else {
          newCompleted.push(tipId);
        }

        const updatedBadges = [...badges];
        if (newCompleted.length >= 1 && !updatedBadges.includes('first-reduction')) {
          updatedBadges.push('first-reduction');
        }
        if (newCompleted.length >= 5 && !updatedBadges.includes('eco-champion')) {
          updatedBadges.push('eco-champion');
        }

        set({
          completedRecommendations: newCompleted,
          badges: updatedBadges,
        });
      },

      resetAllData: () => {
        set({
          hasCalculated: false,
          inputs: initialInputs,
          habitsHistory: [],
          completedHabitsToday: [],
          streakCount: 0,
          lastActiveDate: null,
          badges: [],
          activeRecommendations: [],
          completedRecommendations: [],
        });
      },

      importData: (imported) => {
        try {
          if (!imported || typeof imported !== 'object') return false;
          
          const rawImport = imported as Record<string, unknown>;
          if (!rawImport.inputs || typeof rawImport.inputs !== 'object') return false;
          
          const rawInputs = rawImport.inputs as Record<string, unknown>;
          
          // Explicitly clone allowed inputs to prevent prototype pollution and type issues
          const cleanInputs: Record<string, string | number> = {};
          const allowedKeys: (keyof CarbonInputs)[] = [
            'electricityBill', 'heatingSource', 'heatingAmount', 'householdSize',
            'carType', 'annualMileage', 'publicTransportHours', 'shortFlights', 'longFlights',
            'dietType', 'foodWaste', 'localFoodRatio', 'shoppingSpend', 'recyclingHabits'
          ];
          
          for (const key of allowedKeys) {
            if (key in rawInputs) {
              const val = rawInputs[key];
              if (key === 'heatingSource') {
                if (['gas', 'oil', 'electricity', 'none'].includes(val as string)) {
                  cleanInputs[key] = val as string;
                }
              } else if (key === 'carType') {
                if (['petrol', 'diesel', 'hybrid', 'electric', 'none'].includes(val as string)) {
                  cleanInputs[key] = val as string;
                }
              } else if (key === 'dietType') {
                if (['meat-heavy', 'average', 'low-meat', 'vegetarian', 'vegan'].includes(val as string)) {
                  cleanInputs[key] = val as string;
                }
              } else if (key === 'foodWaste') {
                if (['high', 'medium', 'low'].includes(val as string)) {
                  cleanInputs[key] = val as string;
                }
              } else if (key === 'recyclingHabits') {
                if (['none', 'some', 'detailed'].includes(val as string)) {
                  cleanInputs[key] = val as string;
                }
              } else if (typeof val === 'number' && !isNaN(val)) {
                cleanInputs[key] = val;
              }
            }
          }
          
          // Check that we have a valid inputs object populated
          if (Object.keys(cleanInputs).length === 0) return false;

          // Safe arrays cloning
          const cleanArray = (arr: unknown) => Array.isArray(arr) ? arr.filter((x): x is string => typeof x === 'string') : [];
          
          // Safe habitsHistory validation
          const rawHistory = rawImport.habitsHistory;
          const cleanHistory: HabitLog[] = [];
          if (Array.isArray(rawHistory)) {
            for (const log of rawHistory) {
              if (log && typeof log === 'object' && 'date' in log && 'habits' in log) {
                const logObj = log as Record<string, unknown>;
                if (typeof logObj.date === 'string' && Array.isArray(logObj.habits)) {
                  cleanHistory.push({
                    date: logObj.date,
                    habits: logObj.habits.filter((h): h is string => typeof h === 'string'),
                  });
                }
              }
            }
          }

          set({
            hasCalculated: typeof rawImport.hasCalculated === 'boolean' ? rawImport.hasCalculated : true,
            inputs: { ...initialInputs, ...(cleanInputs as unknown as CarbonInputs) },
            habitsHistory: cleanHistory,
            completedHabitsToday: cleanArray(rawImport.completedHabitsToday),
            streakCount: typeof rawImport.streakCount === 'number' ? rawImport.streakCount : 0,
            lastActiveDate: typeof rawImport.lastActiveDate === 'string' ? rawImport.lastActiveDate : null,
            badges: cleanArray(rawImport.badges),
            activeRecommendations: cleanArray(rawImport.activeRecommendations),
            completedRecommendations: cleanArray(rawImport.completedRecommendations),
          });
          
          // Re-evaluate streak after import
          get().checkStreak();
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'terraguide-state',
      storage: createJSONStorage(() => 
        typeof window !== 'undefined' 
          ? window.localStorage 
          : (({
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }) as unknown as Storage)
      ),
    }
  )
);
