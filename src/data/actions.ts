import { ActionDefinition, BattleOutcome } from '../types';

export const ACTIONS: ActionDefinition[] = [
  // Military Actions
  {
    id: 'attack-random',
    name: 'Direct Attack - Random Country',
    category: 'military',
    requiresTarget: true,
    requiresBattleOutcome: true,
    targetType: 'random',
    description: 'Attack a random country'
  },
  {
    id: 'attack-weakest',
    name: 'Direct Attack - Weakest Country',
    category: 'military',
    requiresTarget: true,
    requiresBattleOutcome: true,
    targetType: 'weakest',
    description: 'Attack one of the weakest countries'
  },
  {
    id: 'attack-strongest',
    name: 'Direct Attack - Strongest Country',
    category: 'military',
    requiresTarget: true,
    requiresBattleOutcome: true,
    targetType: 'strongest',
    description: 'Attack one of the strongest countries'
  },
  {
    id: 'attack-neighbor',
    name: 'Direct Attack - Neighbor',
    category: 'military',
    requiresTarget: true,
    requiresBattleOutcome: true,
    targetType: 'neighbor',
    description: 'Attack a neighboring country'
  },
  {
    id: 'nuclear-strike',
    name: 'Nuclear Strike',
    category: 'military',
    requiresTarget: true,
    requiresBattleOutcome: false,
    targetType: 'any',
    description: 'Auto-win attack, costs 30% of attacker gold'
  },
  {
    id: 'guerrilla-insurgency',
    name: 'Guerrilla Insurgency',
    category: 'military',
    requiresTarget: true,
    requiresBattleOutcome: true,
    targetType: 'any',
    description: 'Asymmetric warfare attack'
  },
  {
    id: 'proxy-war',
    name: 'Proxy War',
    category: 'military',
    requiresTarget: true,
    requiresBattleOutcome: true,
    targetType: 'any',
    description: 'Fight through proxies'
  },

  // Economic Actions
  {
    id: 'economic-sanctions',
    name: 'Economic Sanctions',
    category: 'economic',
    requiresTarget: true,
    requiresBattleOutcome: false,
    targetType: 'any',
    description: 'Target loses 20% of their gold'
  },
  {
    id: 'steal-resources',
    name: 'Steal Resources',
    category: 'economic',
    requiresTarget: true,
    requiresBattleOutcome: false,
    targetType: 'any',
    description: 'Steal 30% of target gold (can backfire)'
  },
  {
    id: 'economic-aid',
    name: 'Economic Aid',
    category: 'economic',
    requiresTarget: true,
    requiresBattleOutcome: false,
    targetType: 'any',
    description: 'Give 40% of your gold to target'
  },
  {
    id: 'sabotage-economy',
    name: 'Sabotage Economy',
    category: 'economic',
    requiresTarget: true,
    requiresBattleOutcome: false,
    targetType: 'any',
    description: 'Target loses 25% gold (can backfire)'
  },
  {
    id: 'trade-embargo',
    name: 'Trade Embargo',
    category: 'economic',
    requiresTarget: true,
    requiresBattleOutcome: false,
    targetType: 'any',
    description: 'Target loses 15% of their gold'
  },

  // Diplomatic Actions
  {
    id: 'peaceful-unification',
    name: 'Peaceful Unification',
    category: 'diplomatic',
    requiresTarget: true,
    requiresBattleOutcome: false,
    targetType: 'any',
    description: 'Merge with another country'
  },
  {
    id: 'form-alliance',
    name: 'Form Military Alliance',
    category: 'diplomatic',
    requiresTarget: true,
    requiresBattleOutcome: false,
    targetType: 'any',
    description: 'Create an alliance with another country'
  },
  {
    id: 'break-alliance',
    name: 'Break Alliance',
    category: 'diplomatic',
    requiresTarget: false,
    requiresBattleOutcome: false,
    description: 'Leave an existing alliance'
  },
  {
    id: 'peace-treaty',
    name: 'Peace Treaty',
    category: 'diplomatic',
    requiresTarget: true,
    requiresBattleOutcome: false,
    targetType: 'any',
    description: 'Sign a peace treaty'
  },

  // Strategic Actions
  {
    id: 'military-buildup',
    name: 'Military Buildup',
    category: 'strategic',
    requiresTarget: false,
    requiresBattleOutcome: false,
    description: 'Gain Strengthened +2 modifier'
  },
  {
    id: 'fortify-borders',
    name: 'Fortify Borders',
    category: 'strategic',
    requiresTarget: false,
    requiresBattleOutcome: false,
    description: 'Gain Fortified +1 defense modifier'
  },
  {
    id: 'espionage-mission',
    name: 'Espionage Mission',
    category: 'strategic',
    requiresTarget: true,
    requiresBattleOutcome: false,
    targetType: 'random',
    description: 'Steal 10% of random country gold'
  },
];

export interface BattleOutcomeDefinition {
  id: BattleOutcome;
  name: string;
  description: string;
}

export const BATTLE_OUTCOMES: BattleOutcomeDefinition[] = [
  {
    id: 'decisive-victory',
    name: 'Decisive Victory',
    description: 'Defender fully annexed by attacker'
  },
  {
    id: 'crushing-defeat',
    name: 'Crushing Defeat',
    description: 'Attacker fully annexed by defender'
  },
  {
    id: 'pyrrhic-victory',
    name: 'Pyrrhic Victory',
    description: 'Attacker wins but loses 40% gold'
  },
  {
    id: 'heroic-defense',
    name: 'Heroic Defense',
    description: 'Defender wins and steals 50% of attacker gold'
  },
  {
    id: 'stalemate',
    name: 'Stalemate',
    description: 'Both sides lose 25% gold'
  },
  {
    id: 'white-peace',
    name: 'White Peace',
    description: 'Nothing happens'
  },
  {
    id: 'partial-conquest',
    name: 'Partial Conquest',
    description: 'Defender loses 50% territory, marked weakened -2'
  },
  {
    id: 'failed-invasion',
    name: 'Failed Invasion',
    description: 'Attacker loses 50% gold'
  },
  {
    id: 'puppet-state',
    name: 'Puppet State',
    description: 'Defender becomes vassal (alliance formed)'
  },
  {
    id: 'resistance-victory',
    name: 'Resistance Victory',
    description: 'Defender annexes attacker'
  },
];
