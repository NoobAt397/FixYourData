export type CountryStatus = 'active' | 'annexed' | 'merged';
export type StatusModifier = 'weakened-1' | 'weakened-2' | 'strengthened-1' | 'strengthened-2' | 'fortified';

export interface Country {
  id: string;
  name: string;
  gold: number;
  status: CountryStatus;
  territorySize: number;
  alliances: string[];
  modifiers: StatusModifier[];
  isOriginal: boolean;
  components?: string[]; // For merged entities
}

export interface Alliance {
  id: string;
  name: string;
  members: string[];
  formedTurn: number;
  formedYear: number;
  status: 'active' | 'dissolved';
}

export type ActionType =
  | 'attack-random'
  | 'attack-weakest'
  | 'attack-strongest'
  | 'attack-neighbor'
  | 'nuclear-strike'
  | 'guerrilla-insurgency'
  | 'proxy-war'
  | 'economic-sanctions'
  | 'steal-resources'
  | 'economic-aid'
  | 'sabotage-economy'
  | 'trade-embargo'
  | 'peaceful-unification'
  | 'form-alliance'
  | 'break-alliance'
  | 'peace-treaty'
  | 'military-buildup'
  | 'fortify-borders'
  | 'espionage-mission';

export type BattleOutcome =
  | 'decisive-victory'
  | 'crushing-defeat'
  | 'pyrrhic-victory'
  | 'heroic-defense'
  | 'stalemate'
  | 'white-peace'
  | 'partial-conquest'
  | 'failed-invasion'
  | 'puppet-state'
  | 'resistance-victory';

export interface TurnHistoryEntry {
  turn: number;
  year: number;
  actor: string;
  action: ActionType;
  target?: string;
  outcome?: BattleOutcome;
  goldChanges: Record<string, number>;
  notes: string;
  timestamp: number;
}

export interface GameState {
  gameId: string;
  profileName: string;
  turn: number;
  year: number;
  countries: Country[];
  alliances: Alliance[];
  turnHistory: TurnHistoryEntry[];
  createdAt: number;
  lastModified: number;
}

export interface Profile {
  id: string;
  name: string;
  createdAt: number;
  lastPlayed: number;
  gamesCount: number;
}

export interface ActionDefinition {
  id: ActionType;
  name: string;
  category: 'military' | 'economic' | 'diplomatic' | 'strategic';
  requiresTarget: boolean;
  requiresBattleOutcome: boolean;
  targetType?: 'random' | 'weakest' | 'strongest' | 'neighbor' | 'any';
  description: string;
}
