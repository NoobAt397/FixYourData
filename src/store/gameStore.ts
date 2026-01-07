import { create } from 'zustand';
import { GameState, Country, Alliance, TurnHistoryEntry, Profile, ActionType, BattleOutcome } from '../types';
import { INITIAL_COUNTRIES } from '../data/countries';
import { calculateGoldChanges, applyGoldChanges } from '../utils/goldCalculator';
import { resolveBattleEffects, annexCountry, mergeCountries, addModifier, getActiveCountries } from '../utils/battleResolver';

interface GameStore {
  // Current game state
  currentGame: GameState | null;
  profiles: Profile[];
  currentProfile: Profile | null;

  // Undo state - stores the previous game state for undo functionality
  previousGameState: GameState | null;

  // Profile actions
  createProfile: (name: string) => void;
  selectProfile: (profileId: string) => void;
  deleteProfile: (profileId: string) => void;
  listProfiles: () => Profile[];

  // Game actions
  startNewGame: (profileName: string, startingGold?: number) => void;
  loadGame: (gameId: string) => void;
  saveGame: () => void;

  // Turn actions
  executeTurn: (
    actorId: string,
    action: ActionType,
    targetId: string | null,
    outcome: BattleOutcome | null,
    customNotes?: string
  ) => void;
  undoLastTurn: () => boolean;

  // Alliance actions
  createAlliance: (name: string, memberIds: string[]) => void;
  dissolveAlliance: (allianceId: string) => void;
  addAllianceMember: (allianceId: string, countryId: string) => void;
  removeAllianceMember: (allianceId: string, countryId: string) => void;

  // Merger actions
  performMerger: (country1Id: string, country2Id: string, newName: string) => void;

  // Utility actions
  getCountry: (countryId: string) => Country | undefined;
  getActiveCountries: () => Country[];
  getAlliance: (allianceId: string) => Alliance | undefined;
}

// LocalStorage keys
const PROFILES_KEY = 'asian-battle-royale-profiles';
const GAMES_KEY = 'asian-battle-royale-games';
const CURRENT_PROFILE_KEY = 'asian-battle-royale-current-profile';

// Helper functions for localStorage
function loadProfiles(): Profile[] {
  const stored = localStorage.getItem(PROFILES_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveProfiles(profiles: Profile[]) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

function loadGame(gameId: string): GameState | null {
  const stored = localStorage.getItem(`${GAMES_KEY}-${gameId}`);
  return stored ? JSON.parse(stored) : null;
}

function saveGameToStorage(game: GameState) {
  localStorage.setItem(`${GAMES_KEY}-${game.gameId}`, JSON.stringify(game));
}

function loadCurrentProfile(): Profile | null {
  const stored = localStorage.getItem(CURRENT_PROFILE_KEY);
  return stored ? JSON.parse(stored) : null;
}

function saveCurrentProfile(profile: Profile | null) {
  if (profile) {
    localStorage.setItem(CURRENT_PROFILE_KEY, JSON.stringify(profile));
  } else {
    localStorage.removeItem(CURRENT_PROFILE_KEY);
  }
}

export const useGameStore = create<GameStore>((set, get) => ({
  currentGame: null,
  profiles: loadProfiles(),
  currentProfile: loadCurrentProfile(),
  previousGameState: null,

  // Profile management
  createProfile: (name: string) => {
    const newProfile: Profile = {
      id: `profile-${Date.now()}`,
      name,
      createdAt: Date.now(),
      lastPlayed: Date.now(),
      gamesCount: 0
    };

    const updatedProfiles = [...get().profiles, newProfile];
    set({ profiles: updatedProfiles, currentProfile: newProfile });
    saveProfiles(updatedProfiles);
    saveCurrentProfile(newProfile);
  },

  selectProfile: (profileId: string) => {
    const profile = get().profiles.find(p => p.id === profileId);
    if (profile) {
      const updatedProfile = { ...profile, lastPlayed: Date.now() };
      const updatedProfiles = get().profiles.map(p =>
        p.id === profileId ? updatedProfile : p
      );
      set({ currentProfile: updatedProfile, profiles: updatedProfiles });
      saveProfiles(updatedProfiles);
      saveCurrentProfile(updatedProfile);
    }
  },

  deleteProfile: (profileId: string) => {
    const updatedProfiles = get().profiles.filter(p => p.id !== profileId);
    set({ profiles: updatedProfiles });
    saveProfiles(updatedProfiles);

    if (get().currentProfile?.id === profileId) {
      set({ currentProfile: null, currentGame: null });
      saveCurrentProfile(null);
    }
  },

  listProfiles: () => {
    return get().profiles;
  },

  // Game management
  startNewGame: (_profileName: string, startingGold = 100) => {
    console.log('🚀 startNewGame called with:', { _profileName, startingGold });
    const profile = get().currentProfile;
    if (!profile) {
      console.error('❌ No profile selected');
      return;
    }
    console.log('✅ Profile found:', profile.name);

    const gameId = `game-${Date.now()}`;
    const countries: Country[] = INITIAL_COUNTRIES.map(c => ({
      ...c,
      gold: startingGold,
      status: 'active' as const,
      alliances: [],
      modifiers: []
    }));
    console.log('✅ Created', countries.length, 'countries');

    const newGame: GameState = {
      gameId,
      profileName: profile.name,
      turn: 0,
      year: 2025,
      countries,
      alliances: [],
      turnHistory: [],
      createdAt: Date.now(),
      lastModified: Date.now()
    };
    console.log('✅ Created new game state:', gameId);

    set({ currentGame: newGame, previousGameState: null });
    saveGameToStorage(newGame);
    console.log('✅ Game saved to localStorage');

    // Update profile games count
    const updatedProfile = { ...profile, gamesCount: profile.gamesCount + 1, lastPlayed: Date.now() };
    const updatedProfiles = get().profiles.map(p =>
      p.id === profile.id ? updatedProfile : p
    );
    set({ currentProfile: updatedProfile, profiles: updatedProfiles });
    saveProfiles(updatedProfiles);
    saveCurrentProfile(updatedProfile);
    console.log('✅ Profile updated. Games count:', updatedProfile.gamesCount);
    console.log('🎮 NEW GAME READY! Should show dashboard now.');
  },

  loadGame: (gameId: string) => {
    const game = loadGame(gameId);
    if (game) {
      set({ currentGame: game, previousGameState: null });
    }
  },

  saveGame: () => {
    const game = get().currentGame;
    if (game) {
      const updatedGame = { ...game, lastModified: Date.now() };
      set({ currentGame: updatedGame });
      saveGameToStorage(updatedGame);
    }
  },

  // Turn execution
  executeTurn: (
    actorId: string,
    action: ActionType,
    targetId: string | null,
    outcome: BattleOutcome | null,
    customNotes?: string
  ) => {
    const game = get().currentGame;
    if (!game) return;

    // Save current state for undo
    set({ previousGameState: { ...game } });

    const actor = game.countries.find(c => c.id === actorId);
    const target = targetId ? game.countries.find(c => c.id === targetId) || null : null;

    if (!actor) return;

    // Calculate gold changes
    const goldChanges = calculateGoldChanges(action, actor, target, outcome, game.countries);
    let updatedCountries = applyGoldChanges(game.countries, goldChanges);

    // Handle battle effects (annexation, modifiers, etc.)
    if (target && outcome) {
      const battleResult = resolveBattleEffects(actorId, targetId!, outcome);

      if (battleResult.annexedCountry && battleResult.annexedBy) {
        updatedCountries = annexCountry(
          updatedCountries,
          battleResult.annexedCountry,
          battleResult.annexedBy
        );
      }

      battleResult.modifiersAdded.forEach(({ countryId, modifier }) => {
        updatedCountries = addModifier(updatedCountries, countryId, modifier);
      });

      // Handle puppet state alliance
      if (battleResult.allianceFormed) {
        const allianceId = `alliance-${Date.now()}`;
        const newAlliance: Alliance = {
          id: allianceId,
          name: `${actor.name}-${target.name} Alliance`,
          members: [actorId, targetId!],
          formedTurn: game.turn + 1,
          formedYear: game.year + 1,
          status: 'active'
        };
        game.alliances.push(newAlliance);
      }
    }

    // Handle special actions
    if (action === 'form-alliance' && targetId) {
      const allianceId = `alliance-${Date.now()}`;
      const newAlliance: Alliance = {
        id: allianceId,
        name: `${actor.name}-${target?.name} Alliance`,
        members: [actorId, targetId],
        formedTurn: game.turn + 1,
        formedYear: game.year + 1,
        status: 'active'
      };
      game.alliances.push(newAlliance);

      // Add alliance to countries
      updatedCountries = updatedCountries.map(c => {
        if (c.id === actorId || c.id === targetId) {
          return { ...c, alliances: [...c.alliances, allianceId] };
        }
        return c;
      });
    }

    if (action === 'military-buildup') {
      updatedCountries = addModifier(updatedCountries, actorId, 'strengthened-2');
    }

    if (action === 'fortify-borders') {
      updatedCountries = addModifier(updatedCountries, actorId, 'fortified');
    }

    // Create turn history entry
    const goldChangesMap: Record<string, number> = {};
    goldChanges.forEach(change => {
      goldChangesMap[change.countryId] = (goldChangesMap[change.countryId] || 0) + change.amount;
    });

    const turnEntry: TurnHistoryEntry = {
      turn: game.turn + 1,
      year: game.year + 1,
      actor: actorId,
      action,
      target: targetId || undefined,
      outcome: outcome || undefined,
      goldChanges: goldChangesMap,
      notes: customNotes || `${actor.name} executed ${action}${target ? ` against ${target.name}` : ''}`,
      timestamp: Date.now()
    };

    const updatedGame: GameState = {
      ...game,
      turn: game.turn + 1,
      year: game.year + 1,
      countries: updatedCountries,
      turnHistory: [...game.turnHistory, turnEntry],
      lastModified: Date.now()
    };

    set({ currentGame: updatedGame });
    saveGameToStorage(updatedGame);
  },

  undoLastTurn: () => {
    const previousState = get().previousGameState;
    if (previousState) {
      set({ currentGame: previousState, previousGameState: null });
      saveGameToStorage(previousState);
      return true;
    }
    return false;
  },

  // Alliance management
  createAlliance: (name: string, memberIds: string[]) => {
    const game = get().currentGame;
    if (!game) return;

    const allianceId = `alliance-${Date.now()}`;
    const newAlliance: Alliance = {
      id: allianceId,
      name,
      members: memberIds,
      formedTurn: game.turn,
      formedYear: game.year,
      status: 'active'
    };

    const updatedCountries = game.countries.map(c => {
      if (memberIds.includes(c.id)) {
        return { ...c, alliances: [...c.alliances, allianceId] };
      }
      return c;
    });

    const updatedGame = {
      ...game,
      alliances: [...game.alliances, newAlliance],
      countries: updatedCountries,
      lastModified: Date.now()
    };

    set({ currentGame: updatedGame });
    saveGameToStorage(updatedGame);
  },

  dissolveAlliance: (allianceId: string) => {
    const game = get().currentGame;
    if (!game) return;

    const updatedAlliances = game.alliances.map(a =>
      a.id === allianceId ? { ...a, status: 'dissolved' as const } : a
    );

    const updatedCountries = game.countries.map(c => ({
      ...c,
      alliances: c.alliances.filter(aId => aId !== allianceId)
    }));

    const updatedGame = {
      ...game,
      alliances: updatedAlliances,
      countries: updatedCountries,
      lastModified: Date.now()
    };

    set({ currentGame: updatedGame });
    saveGameToStorage(updatedGame);
  },

  addAllianceMember: (allianceId: string, countryId: string) => {
    const game = get().currentGame;
    if (!game) return;

    const updatedAlliances = game.alliances.map(a =>
      a.id === allianceId ? { ...a, members: [...a.members, countryId] } : a
    );

    const updatedCountries = game.countries.map(c =>
      c.id === countryId ? { ...c, alliances: [...c.alliances, allianceId] } : c
    );

    const updatedGame = {
      ...game,
      alliances: updatedAlliances,
      countries: updatedCountries,
      lastModified: Date.now()
    };

    set({ currentGame: updatedGame });
    saveGameToStorage(updatedGame);
  },

  removeAllianceMember: (allianceId: string, countryId: string) => {
    const game = get().currentGame;
    if (!game) return;

    const updatedAlliances = game.alliances.map(a =>
      a.id === allianceId ? { ...a, members: a.members.filter(m => m !== countryId) } : a
    );

    const updatedCountries = game.countries.map(c =>
      c.id === countryId ? { ...c, alliances: c.alliances.filter(aId => aId !== allianceId) } : c
    );

    const updatedGame = {
      ...game,
      alliances: updatedAlliances,
      countries: updatedCountries,
      lastModified: Date.now()
    };

    set({ currentGame: updatedGame });
    saveGameToStorage(updatedGame);
  },

  // Merger
  performMerger: (country1Id: string, country2Id: string, newName: string) => {
    const game = get().currentGame;
    if (!game) return;

    const { countries: updatedCountries } = mergeCountries(
      game.countries,
      country1Id,
      country2Id,
      newName
    );

    const turnEntry: TurnHistoryEntry = {
      turn: game.turn + 1,
      year: game.year + 1,
      actor: country1Id,
      action: 'peaceful-unification',
      target: country2Id,
      goldChanges: {},
      notes: `${newName} formed from merger`,
      timestamp: Date.now()
    };

    const updatedGame: GameState = {
      ...game,
      turn: game.turn + 1,
      year: game.year + 1,
      countries: updatedCountries,
      turnHistory: [...game.turnHistory, turnEntry],
      lastModified: Date.now()
    };

    set({ currentGame: updatedGame });
    saveGameToStorage(updatedGame);
  },

  // Utility functions
  getCountry: (countryId: string) => {
    const game = get().currentGame;
    return game?.countries.find(c => c.id === countryId);
  },

  getActiveCountries: () => {
    const game = get().currentGame;
    return game ? getActiveCountries(game.countries) : [];
  },

  getAlliance: (allianceId: string) => {
    const game = get().currentGame;
    return game?.alliances.find(a => a.id === allianceId);
  }
}));
