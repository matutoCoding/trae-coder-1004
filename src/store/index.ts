import { create } from 'zustand';
import Taro from '@tarojs/taro';
import type { Pigeon, LoftArea, Race, TrainingRecord, RaceResult, SettlementItem } from '@/types';
import { mockPigeons, mockLoftAreas } from '@/data/mockPigeons';
import { mockRaces, mockTrainingRecords, mockRaceResults } from '@/data/mockRaces';
import { mockSettlements } from '@/data/mockSettlement';

interface AppState {
  pigeons: Pigeon[];
  loftAreas: LoftArea[];
  races: Race[];
  trainingRecords: TrainingRecord[];
  raceResults: RaceResult[];
  settlements: SettlementItem[];

  addPigeon: (pigeon: Pigeon) => void;
  updatePigeon: (id: string, patch: Partial<Pigeon>) => void;

  addLoftArea: (loft: LoftArea) => void;
  updateLoftArea: (id: string, patch: Partial<LoftArea>) => void;

  addRace: (race: Race) => void;
  updateRace: (id: string, patch: Partial<Race>) => void;
  startRace: (id: string) => void;
  addRaceResult: (raceId: string, result: RaceResult) => void;

  addTrainingRecord: (record: TrainingRecord) => void;

  addSettlement: (item: SettlementItem) => void;
  updateSettlement: (id: string, patch: Partial<SettlementItem>) => void;

  hydrate: () => void;
  persist: () => void;
}

const STORAGE_KEY = 'pigeon_loft_app_state_v1';

const getInitialState = () => {
  try {
    const stored = Taro.getStorageSync(STORAGE_KEY);
    if (stored && typeof stored === 'object' && stored.pigeons) {
      return stored;
    }
  } catch (e) {
    console.error('[Store] Failed to load from storage:', e);
  }
  return {
    pigeons: mockPigeons,
    loftAreas: mockLoftAreas,
    races: mockRaces,
    trainingRecords: mockTrainingRecords,
    raceResults: mockRaceResults,
    settlements: mockSettlements
  };
};

export const useAppStore = create<AppState>((set, get) => ({
  ...getInitialState(),

  addPigeon: (pigeon) => {
    console.log('[Store] addPigeon:', pigeon.ringNumber);
    set((state) => {
      const nextPigeons = [...state.pigeons, pigeon];
      const nextLoftAreas = state.loftAreas.map((loft) => {
        if (loft.name === pigeon.loftArea) {
          const newUsed = loft.used + 1;
          const isFull = newUsed >= loft.capacity;
          return {
            ...loft,
            used: newUsed,
            status: isFull ? 'full' : loft.status,
            statusText: isFull ? '已满' : loft.statusText
          };
        }
        return loft;
      });
      const next = { ...state, pigeons: nextPigeons, loftAreas: nextLoftAreas };
      try {
        Taro.setStorageSync(STORAGE_KEY, next);
      } catch (e) {
        console.error('[Store] persist error:', e);
      }
      return next;
    });
  },

  updatePigeon: (id, patch) => {
    console.log('[Store] updatePigeon:', id, patch);
    set((state) => {
      const nextPigeons = state.pigeons.map((p) => (p.id === id ? { ...p, ...patch } : p));
      const next = { ...state, pigeons: nextPigeons };
      try {
        Taro.setStorageSync(STORAGE_KEY, next);
      } catch (e) {
        console.error('[Store] persist error:', e);
      }
      return next;
    });
  },

  addLoftArea: (loft) => {
    console.log('[Store] addLoftArea:', loft.name);
    set((state) => {
      const next = { ...state, loftAreas: [...state.loftAreas, loft] };
      try {
        Taro.setStorageSync(STORAGE_KEY, next);
      } catch (e) {
        console.error('[Store] persist error:', e);
      }
      return next;
    });
  },

  updateLoftArea: (id, patch) => {
    console.log('[Store] updateLoftArea:', id, patch);
    set((state) => {
      const nextLoftAreas = state.loftAreas.map((l) => (l.id === id ? { ...l, ...patch } : l));
      const next = { ...state, loftAreas: nextLoftAreas };
      try {
        Taro.setStorageSync(STORAGE_KEY, next);
      } catch (e) {
        console.error('[Store] persist error:', e);
      }
      return next;
    });
  },

  addRace: (race) => {
    console.log('[Store] addRace:', race.name);
    set((state) => {
      const next = { ...state, races: [...state.races, race] };
      try {
        Taro.setStorageSync(STORAGE_KEY, next);
      } catch (e) {
        console.error('[Store] persist error:', e);
      }
      return next;
    });
  },

  updateRace: (id, patch) => {
    console.log('[Store] updateRace:', id, patch);
    set((state) => {
      const nextRaces = state.races.map((r) => (r.id === id ? { ...r, ...patch } : r));
      const next = { ...state, races: nextRaces };
      try {
        Taro.setStorageSync(STORAGE_KEY, next);
      } catch (e) {
        console.error('[Store] persist error:', e);
      }
      return next;
    });
  },

  startRace: (id) => {
    console.log('[Store] startRace:', id);
    const now = new Date();
    const releaseTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    set((state) => {
      const nextRaces = state.races.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'ongoing' as const,
              statusText: '进行中',
              releaseTime,
              date: dateStr
            }
          : r
      );
      const next = { ...state, races: nextRaces };
      try {
        Taro.setStorageSync(STORAGE_KEY, next);
      } catch (e) {
        console.error('[Store] persist error:', e);
      }
      return next;
    });
  },

  addRaceResult: (raceId, result) => {
    console.log('[Store] addRaceResult: raceId=', raceId, 'ringNumber=', result.ringNumber);
    set((state) => {
      const resultWithRace = { ...result, raceId };
      const nextResults = [...state.raceResults];
      const existingIdx = nextResults.findIndex(
        (r) => r.raceId === raceId && r.ringNumber === resultWithRace.ringNumber
      );
      let isNewRecord = true;
      if (existingIdx >= 0) {
        nextResults[existingIdx] = resultWithRace;
        isNewRecord = false;
      } else {
        nextResults.push(resultWithRace);
      }
      const sameRaceResults = nextResults
        .filter((r) => r.raceId === raceId)
        .sort((a, b) => b.speed - a.speed);
      sameRaceResults.forEach((r, idx) => {
        r.rank = idx + 1;
      });
      const finalResults = nextResults.map((r) => {
        if (r.raceId === raceId) {
          const found = sameRaceResults.find((s) => s.ringNumber === r.ringNumber);
          return found ? { ...r, rank: found.rank } : r;
        }
        return r;
      });
      let nextRaces = state.races;
      if (isNewRecord) {
        nextRaces = state.races.map((r) => {
          if (r.id === raceId) {
            return { ...r, returnedCount: r.returnedCount + 1 };
          }
          return r;
        });
      }
      const next = { ...state, raceResults: finalResults, races: nextRaces };
      try {
        Taro.setStorageSync(STORAGE_KEY, next);
      } catch (e) {
        console.error('[Store] persist error:', e);
      }
      return next;
    });
  },

  addTrainingRecord: (record) => {
    console.log('[Store] addTrainingRecord:', record.typeText);
    set((state) => {
      const next = { ...state, trainingRecords: [record, ...state.trainingRecords] };
      try {
        Taro.setStorageSync(STORAGE_KEY, next);
      } catch (e) {
        console.error('[Store] persist error:', e);
      }
      return next;
    });
  },

  addSettlement: (item) => {
    console.log('[Store] addSettlement:', item.typeText);
    set((state) => {
      const next = { ...state, settlements: [item, ...state.settlements] };
      try {
        Taro.setStorageSync(STORAGE_KEY, next);
      } catch (e) {
        console.error('[Store] persist error:', e);
      }
      return next;
    });
  },

  updateSettlement: (id, patch) => {
    console.log('[Store] updateSettlement:', id, patch);
    set((state) => {
      const nextSettlements = state.settlements.map((s) =>
        s.id === id ? { ...s, ...patch } : s
      );
      const next = { ...state, settlements: nextSettlements };
      try {
        Taro.setStorageSync(STORAGE_KEY, next);
      } catch (e) {
        console.error('[Store] persist error:', e);
      }
      return next;
    });
  },

  hydrate: () => {
    console.log('[Store] hydrate');
    try {
      const stored = Taro.getStorageSync(STORAGE_KEY);
      if (stored && typeof stored === 'object' && stored.pigeons) {
        set(stored);
      }
    } catch (e) {
      console.error('[Store] hydrate error:', e);
    }
  },

  persist: () => {
    console.log('[Store] persist manual');
    try {
      const state = get();
      Taro.setStorageSync(STORAGE_KEY, {
        pigeons: state.pigeons,
        loftAreas: state.loftAreas,
        races: state.races,
        trainingRecords: state.trainingRecords,
        raceResults: state.raceResults,
        settlements: state.settlements
      });
    } catch (e) {
      console.error('[Store] persist manual error:', e);
    }
  }
}));
