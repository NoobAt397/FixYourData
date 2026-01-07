import { Country, ActionType, BattleOutcome } from '../types';

export interface GoldChange {
  countryId: string;
  amount: number;
  reason: string;
}

/**
 * DEPRECATED: This file is no longer used in the new power level system.
 * The app now uses manual tracking instead of automatic calculations.
 * These functions are stubbed out to maintain compatibility.
 */

export function calculateGoldChanges(
  _action: ActionType,
  _actor: Country,
  _target: Country | null,
  _outcome: BattleOutcome | null,
  _allCountries: Country[]
): GoldChange[] {
  // No longer used - manual tracking only
  return [];
}

export function applyGoldChanges(
  countries: Country[],
  _changes: GoldChange[]
): Country[] {
  // No longer used - manual tracking only
  return countries;
}
