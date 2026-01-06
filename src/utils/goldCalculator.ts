import { Country, ActionType, BattleOutcome } from '../types';

export interface GoldChange {
  countryId: string;
  amount: number;
  reason: string;
}

export function calculateGoldChanges(
  action: ActionType,
  actor: Country,
  target: Country | null,
  outcome: BattleOutcome | null,
  _allCountries: Country[]
): GoldChange[] {
  const changes: GoldChange[] = [];

  switch (action) {
    case 'nuclear-strike':
      if (target) {
        changes.push({
          countryId: actor.id,
          amount: -Math.floor(actor.gold * 0.3),
          reason: 'Nuclear strike cost'
        });
        changes.push({
          countryId: target.id,
          amount: -target.gold,
          reason: 'Nuclear strike victim'
        });
        changes.push({
          countryId: actor.id,
          amount: target.gold,
          reason: 'Annexed target'
        });
      }
      break;

    case 'economic-sanctions':
      if (target) {
        changes.push({
          countryId: target.id,
          amount: -Math.floor(target.gold * 0.2),
          reason: 'Economic sanctions'
        });
      }
      break;

    case 'steal-resources':
      if (target) {
        const stolen = Math.floor(target.gold * 0.3);
        changes.push({
          countryId: target.id,
          amount: -stolen,
          reason: 'Resources stolen'
        });
        changes.push({
          countryId: actor.id,
          amount: stolen,
          reason: 'Stole resources'
        });
      }
      break;

    case 'economic-aid':
      if (target) {
        const aid = Math.floor(actor.gold * 0.4);
        changes.push({
          countryId: actor.id,
          amount: -aid,
          reason: 'Economic aid given'
        });
        changes.push({
          countryId: target.id,
          amount: aid,
          reason: 'Economic aid received'
        });
      }
      break;

    case 'sabotage-economy':
      if (target) {
        changes.push({
          countryId: target.id,
          amount: -Math.floor(target.gold * 0.25),
          reason: 'Economy sabotaged'
        });
      }
      break;

    case 'trade-embargo':
      if (target) {
        changes.push({
          countryId: target.id,
          amount: -Math.floor(target.gold * 0.15),
          reason: 'Trade embargo'
        });
      }
      break;

    case 'espionage-mission':
      if (target) {
        const stolen = Math.floor(target.gold * 0.1);
        changes.push({
          countryId: target.id,
          amount: -stolen,
          reason: 'Espionage victim'
        });
        changes.push({
          countryId: actor.id,
          amount: stolen,
          reason: 'Espionage success'
        });
      }
      break;

    case 'peaceful-unification':
      // Handled separately in the game state
      break;

    // Battle actions
    case 'attack-random':
    case 'attack-weakest':
    case 'attack-strongest':
    case 'attack-neighbor':
    case 'guerrilla-insurgency':
    case 'proxy-war':
      if (target && outcome) {
        changes.push(...resolveBattle(actor, target, outcome));
      }
      break;
  }

  return changes;
}

function resolveBattle(
  attacker: Country,
  defender: Country,
  outcome: BattleOutcome
): GoldChange[] {
  const changes: GoldChange[] = [];

  switch (outcome) {
    case 'decisive-victory':
      // Defender annexed
      changes.push({
        countryId: defender.id,
        amount: -defender.gold,
        reason: 'Defeated and annexed'
      });
      changes.push({
        countryId: attacker.id,
        amount: defender.gold,
        reason: 'Annexed defender'
      });
      break;

    case 'crushing-defeat':
      // Attacker annexed
      changes.push({
        countryId: attacker.id,
        amount: -attacker.gold,
        reason: 'Defeated and annexed'
      });
      changes.push({
        countryId: defender.id,
        amount: attacker.gold,
        reason: 'Annexed attacker'
      });
      break;

    case 'pyrrhic-victory':
      // Attacker wins but loses 40% gold, defender annexed
      changes.push({
        countryId: attacker.id,
        amount: -Math.floor(attacker.gold * 0.4),
        reason: 'Pyrrhic victory cost'
      });
      changes.push({
        countryId: defender.id,
        amount: -defender.gold,
        reason: 'Defeated'
      });
      changes.push({
        countryId: attacker.id,
        amount: defender.gold,
        reason: 'Annexed defender'
      });
      break;

    case 'heroic-defense':
      // Defender wins and steals 50% of attacker gold
      const stolen = Math.floor(attacker.gold * 0.5);
      changes.push({
        countryId: attacker.id,
        amount: -stolen,
        reason: 'Heroic defense defeat'
      });
      changes.push({
        countryId: defender.id,
        amount: stolen,
        reason: 'Heroic defense victory'
      });
      break;

    case 'stalemate':
      // Both lose 25% gold
      changes.push({
        countryId: attacker.id,
        amount: -Math.floor(attacker.gold * 0.25),
        reason: 'Stalemate'
      });
      changes.push({
        countryId: defender.id,
        amount: -Math.floor(defender.gold * 0.25),
        reason: 'Stalemate'
      });
      break;

    case 'white-peace':
      // Nothing happens
      break;

    case 'partial-conquest':
      // Defender loses 50% territory, marked weakened -2
      // Gold calculation happens in battle resolver
      const conquered = Math.floor(defender.gold * 0.5);
      changes.push({
        countryId: defender.id,
        amount: -conquered,
        reason: 'Partial conquest'
      });
      changes.push({
        countryId: attacker.id,
        amount: conquered,
        reason: 'Partial conquest'
      });
      break;

    case 'failed-invasion':
      // Attacker loses 50% gold
      changes.push({
        countryId: attacker.id,
        amount: -Math.floor(attacker.gold * 0.5),
        reason: 'Failed invasion'
      });
      break;

    case 'puppet-state':
      // Alliance formed (handled separately)
      // Small tribute from defender to attacker
      const tribute = Math.floor(defender.gold * 0.2);
      changes.push({
        countryId: defender.id,
        amount: -tribute,
        reason: 'Puppet state tribute'
      });
      changes.push({
        countryId: attacker.id,
        amount: tribute,
        reason: 'Puppet state tribute'
      });
      break;

    case 'resistance-victory':
      // Defender annexes attacker
      changes.push({
        countryId: attacker.id,
        amount: -attacker.gold,
        reason: 'Defeated by resistance'
      });
      changes.push({
        countryId: defender.id,
        amount: attacker.gold,
        reason: 'Resistance victory'
      });
      break;
  }

  return changes;
}

export function applyGoldChanges(countries: Country[], changes: GoldChange[]): Country[] {
  const updatedCountries = [...countries];

  changes.forEach(change => {
    const countryIndex = updatedCountries.findIndex(c => c.id === change.countryId);
    if (countryIndex !== -1) {
      updatedCountries[countryIndex] = {
        ...updatedCountries[countryIndex],
        gold: Math.max(0, updatedCountries[countryIndex].gold + change.amount)
      };
    }
  });

  return updatedCountries;
}
