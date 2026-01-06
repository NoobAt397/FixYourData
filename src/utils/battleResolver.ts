import { Country, BattleOutcome, StatusModifier } from '../types';

export interface BattleResult {
  annexedCountry: string | null;
  annexedBy: string | null;
  modifiersAdded: Array<{ countryId: string; modifier: StatusModifier }>;
  modifiersRemoved: Array<{ countryId: string; modifier: StatusModifier }>;
  allianceFormed: { attacker: string; defender: string } | null;
}

export function resolveBattleEffects(
  attackerId: string,
  defenderId: string,
  outcome: BattleOutcome
): BattleResult {
  const result: BattleResult = {
    annexedCountry: null,
    annexedBy: null,
    modifiersAdded: [],
    modifiersRemoved: [],
    allianceFormed: null
  };

  switch (outcome) {
    case 'decisive-victory':
      result.annexedCountry = defenderId;
      result.annexedBy = attackerId;
      break;

    case 'crushing-defeat':
    case 'resistance-victory':
      result.annexedCountry = attackerId;
      result.annexedBy = defenderId;
      break;

    case 'pyrrhic-victory':
      result.annexedCountry = defenderId;
      result.annexedBy = attackerId;
      break;

    case 'partial-conquest':
      result.modifiersAdded.push({
        countryId: defenderId,
        modifier: 'weakened-2'
      });
      break;

    case 'puppet-state':
      result.allianceFormed = {
        attacker: attackerId,
        defender: defenderId
      };
      break;
  }

  return result;
}

export function annexCountry(
  countries: Country[],
  annexedId: string,
  annexedById: string
): Country[] {
  const updatedCountries = countries.map(country => {
    if (country.id === annexedId) {
      return { ...country, status: 'annexed' as const };
    }
    if (country.id === annexedById) {
      // Add territory size
      const annexedCountry = countries.find(c => c.id === annexedId);
      if (annexedCountry) {
        return {
          ...country,
          territorySize: country.territorySize + annexedCountry.territorySize
        };
      }
    }
    return country;
  });

  return updatedCountries;
}

export function mergeCountries(
  countries: Country[],
  country1Id: string,
  country2Id: string,
  newName: string
): { countries: Country[]; newCountryId: string } {
  const country1 = countries.find(c => c.id === country1Id);
  const country2 = countries.find(c => c.id === country2Id);

  if (!country1 || !country2) {
    return { countries, newCountryId: '' };
  }

  const newCountryId = `${country1Id}-${country2Id}-union`;
  const combinedGold = country1.gold + country2.gold;
  const combinedTerritory = country1.territorySize + country2.territorySize;
  const combinedAlliances = [...new Set([...country1.alliances, ...country2.alliances])];

  const newCountry: Country = {
    id: newCountryId,
    name: newName,
    gold: combinedGold,
    status: 'active',
    territorySize: combinedTerritory,
    alliances: combinedAlliances,
    modifiers: [],
    isOriginal: false,
    components: [country1Id, country2Id]
  };

  const updatedCountries = countries
    .map(c => {
      if (c.id === country1Id || c.id === country2Id) {
        return { ...c, status: 'merged' as const };
      }
      return c;
    })
    .concat(newCountry);

  return { countries: updatedCountries, newCountryId };
}

export function addModifier(
  countries: Country[],
  countryId: string,
  modifier: StatusModifier
): Country[] {
  return countries.map(country => {
    if (country.id === countryId && !country.modifiers.includes(modifier)) {
      return {
        ...country,
        modifiers: [...country.modifiers, modifier]
      };
    }
    return country;
  });
}

export function removeModifier(
  countries: Country[],
  countryId: string,
  modifier: StatusModifier
): Country[] {
  return countries.map(country => {
    if (country.id === countryId) {
      return {
        ...country,
        modifiers: country.modifiers.filter(m => m !== modifier)
      };
    }
    return country;
  });
}

export function getActiveCountries(countries: Country[]): Country[] {
  return countries.filter(c => c.status === 'active');
}

export function getCountryByName(countries: Country[], name: string): Country | undefined {
  return countries.find(c => c.name.toLowerCase() === name.toLowerCase());
}

export function getCountryById(countries: Country[], id: string): Country | undefined {
  return countries.find(c => c.id === id);
}

export function sortByGold(countries: Country[], descending = true): Country[] {
  return [...countries].sort((a, b) =>
    descending ? b.gold - a.gold : a.gold - b.gold
  );
}

export function getWeakestCountries(countries: Country[], count = 3): Country[] {
  return sortByGold(getActiveCountries(countries), false).slice(0, count);
}

export function getStrongestCountries(countries: Country[], count = 3): Country[] {
  return sortByGold(getActiveCountries(countries), true).slice(0, count);
}
