import { useGameStore } from '../store/gameStore';
import { useMemo } from 'react';

export default function Dashboard() {
  const { currentGame, getActiveCountries } = useGameStore();

  const stats = useMemo(() => {
    if (!currentGame) return null;

    const activeCountries = getActiveCountries();
    const annexed = currentGame.countries.filter(c => c.status === 'annexed');
    const merged = currentGame.countries.filter(c => c.status === 'merged');
    const avgPowerLevel = activeCountries.length > 0
      ? activeCountries.reduce((sum, c) => sum + c.powerLevel, 0) / activeCountries.length
      : 0;

    const sortedByPower = [...activeCountries].sort((a, b) => b.powerLevel - a.powerLevel);
    const sortedByTerritory = [...activeCountries].sort((a, b) => b.territorySize - a.territorySize);

    return {
      turn: currentGame.turn,
      year: currentGame.year,
      activeCount: activeCountries.length,
      annexedCount: annexed.length,
      mergedCount: merged.length,
      avgPowerLevel,
      topByPower: sortedByPower.slice(0, 5),
      topByTerritory: sortedByTerritory.slice(0, 5),
      activeAlliances: currentGame.alliances.filter(a => a.status === 'active'),
    };
  }, [currentGame, getActiveCountries]);

  if (!currentGame || !stats) return null;

  return (
    <div className="space-y-4">
      {/* Main Stats Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6 border border-blue-700">
        <h1 className="text-3xl font-bold text-white mb-4">Asian Battle Royale - Game Tracker</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black bg-opacity-30 rounded p-3">
            <div className="text-gray-300 text-sm">Turn</div>
            <div className="text-white text-2xl font-bold">{stats.turn}</div>
          </div>
          <div className="bg-black bg-opacity-30 rounded p-3">
            <div className="text-gray-300 text-sm">Year</div>
            <div className="text-white text-2xl font-bold">{stats.year}</div>
          </div>
          <div className="bg-black bg-opacity-30 rounded p-3">
            <div className="text-gray-300 text-sm">Active Nations</div>
            <div className="text-green-400 text-2xl font-bold">{stats.activeCount}</div>
          </div>
          <div className="bg-black bg-opacity-30 rounded p-3">
            <div className="text-gray-300 text-sm">Eliminated</div>
            <div className="text-red-400 text-2xl font-bold">{stats.annexedCount}</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-black bg-opacity-30 rounded p-3">
            <div className="text-gray-300 text-sm">Average Power Level</div>
            <div className="text-yellow-400 text-xl font-bold">{stats.avgPowerLevel.toFixed(1)} / 10</div>
          </div>
          <div className="bg-black bg-opacity-30 rounded p-3">
            <div className="text-gray-300 text-sm">Active Alliances</div>
            <div className="text-blue-400 text-xl font-bold">{stats.activeAlliances.length}</div>
          </div>
        </div>
      </div>

      {/* Power Rankings */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Top 5 by Power Level */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>⚡</span> Top 5 by Power Level
          </h3>
          <div className="space-y-2">
            {stats.topByPower.map((country, index) => (
              <div
                key={country.id}
                className="flex items-center justify-between p-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                  </span>
                  <span className="text-white font-semibold">{country.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${
                    country.powerLevel >= 8 ? 'text-green-400' :
                    country.powerLevel >= 5 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {country.powerLevel}/10
                  </span>
                  <div className="w-16 bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-full rounded-full ${
                        country.powerLevel >= 8 ? 'bg-green-400' :
                        country.powerLevel >= 5 ? 'bg-yellow-400' :
                        'bg-red-400'
                      }`}
                      style={{ width: `${country.powerLevel * 10}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 by Territory */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>🗺️</span> Top 5 by Territory
          </h3>
          <div className="space-y-2">
            {stats.topByTerritory.map((country, index) => (
              <div
                key={country.id}
                className="flex items-center justify-between p-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                  </span>
                  <span className="text-white font-semibold">{country.name}</span>
                </div>
                <span className="text-green-400 font-bold">{country.territorySize}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Alliances */}
      {stats.activeAlliances.length > 0 && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>🤝</span> Active Alliances
          </h3>
          <div className="space-y-2">
            {stats.activeAlliances.map((alliance) => {
              const members = alliance.members
                .map(mId => currentGame.countries.find(c => c.id === mId))
                .filter(Boolean);
              const avgPower = members.length > 0
                ? members.reduce((sum, m) => sum + (m?.powerLevel || 0), 0) / members.length
                : 0;

              return (
                <div
                  key={alliance.id}
                  className="p-3 bg-gray-700 rounded"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-400 font-semibold">{alliance.name}</span>
                    <span className="text-yellow-400 text-sm">Avg Power: {avgPower.toFixed(1)}/10</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    Members: {members.map(m => m?.name).join(', ')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Formed: Turn {alliance.formedTurn} (Year {alliance.formedYear})
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Game Progress Bar */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">Survival Rate</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-full flex items-center justify-center text-white text-xs font-bold"
              style={{ width: `${(stats.activeCount / 50) * 100}%` }}
            >
              {stats.activeCount} Active
            </div>
          </div>
          <div className="text-gray-400 text-sm">
            {((stats.activeCount / 50) * 100).toFixed(1)}%
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {stats.annexedCount} annexed • {stats.mergedCount} merged
        </div>
      </div>
    </div>
  );
}
