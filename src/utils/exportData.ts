import { GameState } from '../types';

export function exportToCSV(game: GameState): string {
  const headers = ['Turn', 'Year', 'Actor', 'Action', 'Target', 'Outcome', 'Prediction', 'Reality', 'Power Changes', 'Notes'];

  const rows = game.turnHistory.map(entry => [
    entry.turn,
    entry.year,
    game.countries.find(c => c.id === entry.actor)?.name || entry.actor,
    entry.action,
    entry.target ? game.countries.find(c => c.id === entry.target)?.name || entry.target : '-',
    entry.outcome || '-',
    entry.prediction || '-',
    entry.reality || '-',
    entry.powerChanges ? Object.entries(entry.powerChanges)
      .map(([id, amount]) => {
        const country = game.countries.find(c => c.id === id);
        return `${country?.name || id}: ${(amount as number) >= 0 ? '+' : ''}${amount}`;
      })
      .join('; ') : '-',
    entry.notes
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}

export function exportCountriesToCSV(game: GameState): string {
  const headers = ['Name', 'Power Level', 'Status', 'Territory Size', 'Alliances', 'Modifiers', 'Is Original'];

  const rows = game.countries.map(country => [
    country.name,
    `${country.powerLevel}/10`,
    country.status,
    country.territorySize,
    country.alliances.map(aId => {
      const alliance = game.alliances.find(a => a.id === aId);
      return alliance?.name || aId;
    }).join('; ') || '-',
    country.modifiers.join(', ') || '-',
    country.isOriginal ? 'Yes' : 'No'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportGameSummary(game: GameState): string {
  const activeCountries = game.countries.filter(c => c.status === 'active');
  const annexed = game.countries.filter(c => c.status === 'annexed');
  const merged = game.countries.filter(c => c.status === 'merged');

  const topByPower = [...activeCountries].sort((a, b) => b.powerLevel - a.powerLevel).slice(0, 10);
  const topByTerritory = [...activeCountries].sort((a, b) => b.territorySize - a.territorySize).slice(0, 10);

  const avgPowerLevel = activeCountries.length > 0
    ? activeCountries.reduce((sum, c) => sum + c.powerLevel, 0) / activeCountries.length
    : 0;

  let summary = `ASIAN BATTLE ROYALE - GAME SUMMARY\n`;
  summary += `${'='.repeat(50)}\n\n`;
  summary += `Game ID: ${game.gameId}\n`;
  summary += `Profile: ${game.profileName}\n`;
  summary += `Current Turn: ${game.turn}\n`;
  summary += `Current Year: ${game.year}\n`;
  summary += `Created: ${new Date(game.createdAt).toLocaleString()}\n`;
  summary += `Last Modified: ${new Date(game.lastModified).toLocaleString()}\n\n`;

  summary += `STATISTICS\n`;
  summary += `${'-'.repeat(50)}\n`;
  summary += `Active Nations: ${activeCountries.length}\n`;
  summary += `Annexed Nations: ${annexed.length}\n`;
  summary += `Merged Nations: ${merged.length}\n`;
  summary += `Average Power Level: ${avgPowerLevel.toFixed(1)}/10\n`;
  summary += `Active Alliances: ${game.alliances.filter(a => a.status === 'active').length}\n\n`;

  summary += `TOP 10 BY POWER LEVEL\n`;
  summary += `${'-'.repeat(50)}\n`;
  topByPower.forEach((country, index) => {
    summary += `${index + 1}. ${country.name}: ${country.powerLevel}/10\n`;
  });
  summary += `\n`;

  summary += `TOP 10 BY TERRITORY\n`;
  summary += `${'-'.repeat(50)}\n`;
  topByTerritory.forEach((country, index) => {
    summary += `${index + 1}. ${country.name}: ${country.territorySize} territories\n`;
  });
  summary += `\n`;

  summary += `ACTIVE ALLIANCES\n`;
  summary += `${'-'.repeat(50)}\n`;
  game.alliances.filter(a => a.status === 'active').forEach(alliance => {
    const members = alliance.members
      .map(mId => game.countries.find(c => c.id === mId)?.name)
      .filter(Boolean);
    summary += `${alliance.name}: ${members.join(', ')}\n`;
  });

  return summary;
}
