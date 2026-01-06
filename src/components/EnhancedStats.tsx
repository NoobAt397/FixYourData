import { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';

export default function EnhancedStats() {
  const { currentGame } = useGameStore();

  const stats = useMemo(() => {
    if (!currentGame) return null;

    const activeCountries = currentGame.countries.filter(c => c.status === 'active');
    const annexed = currentGame.countries.filter(c => c.status === 'annexed');

    // Calculate various statistics
    const totalGold = activeCountries.reduce((sum, c) => sum + c.gold, 0);
    const avgGold = activeCountries.length > 0 ? Math.floor(totalGold / activeCountries.length) : 0;
    const maxGold = Math.max(...activeCountries.map(c => c.gold), 0);
    const minGold = activeCountries.length > 0 ? Math.min(...activeCountries.map(c => c.gold)) : 0;

    const totalTerritories = activeCountries.reduce((sum, c) => sum + c.territorySize, 0);
    const avgTerritory = activeCountries.length > 0 ? (totalTerritories / activeCountries.length).toFixed(1) : 0;

    // Find most aggressive nation (most attacks in history)
    const attackCounts: Record<string, number> = {};
    currentGame.turnHistory.forEach(entry => {
      if (entry.action.includes('attack') || entry.action.includes('strike')) {
        attackCounts[entry.actor] = (attackCounts[entry.actor] || 0) + 1;
      }
    });
    const mostAggressive = Object.entries(attackCounts)
      .sort((a, b) => b[1] - a[1])[0];

    // Find longest surviving original nation
    const originalActive = activeCountries.filter(c => c.isOriginal);

    // Calculate turn efficiency (actions per turn)
    const actionsPerTurn = currentGame.turn > 0 ? currentGame.turnHistory.length / currentGame.turn : 0;

    return {
      totalGold,
      avgGold,
      maxGold,
      minGold,
      totalTerritories,
      avgTerritory,
      mostAggressive: mostAggressive ? {
        name: currentGame.countries.find(c => c.id === mostAggressive[0])?.name,
        attacks: mostAggressive[1]
      } : null,
      originalSurvivors: originalActive.length,
      actionsPerTurn: actionsPerTurn.toFixed(2),
      eliminationRate: currentGame.turn > 0 ? (annexed.length / currentGame.turn).toFixed(2) : '0',
    };
  }, [currentGame]);

  if (!currentGame || !stats) return null;

  return (
    <div className="bg-gradient-to-br from-gray-800 via-blue-900/10 to-gray-900 rounded-2xl border-2 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.15)] p-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">📈</span> Advanced Statistics
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {/* Gold Statistics */}
        <div className="col-span-2 p-4 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-xl border border-yellow-500/20">
          <h3 className="text-yellow-400 font-semibold mb-2 text-sm">💰 Gold Economy</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-gray-400">Total Gold</div>
              <div className="text-yellow-400 font-bold text-lg">{stats.totalGold.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-400">Average Gold</div>
              <div className="text-yellow-400 font-bold text-lg">{stats.avgGold.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-400">Highest</div>
              <div className="text-green-400 font-semibold">{stats.maxGold.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-400">Lowest</div>
              <div className="text-red-400 font-semibold">{stats.minGold.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Territory Statistics */}
        <div className="p-4 bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-xl border border-green-500/20">
          <h3 className="text-green-400 font-semibold mb-2 text-sm">🗺️ Territory</h3>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">Total</span>
              <span className="text-white font-semibold">{stats.totalTerritories}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Average</span>
              <span className="text-white font-semibold">{stats.avgTerritory}</span>
            </div>
          </div>
        </div>

        {/* Survival Stats */}
        <div className="p-4 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-xl border border-blue-500/20">
          <h3 className="text-blue-400 font-semibold mb-2 text-sm">🛡️ Survival</h3>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">Original</span>
              <span className="text-white font-semibold">{stats.originalSurvivors}/50</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Elim. Rate</span>
              <span className="text-red-400 font-semibold">{stats.eliminationRate}/turn</span>
            </div>
          </div>
        </div>

        {/* Most Aggressive */}
        {stats.mostAggressive && (
          <div className="col-span-2 p-4 bg-gradient-to-r from-red-900/20 to-pink-900/20 rounded-xl border border-red-500/20">
            <h3 className="text-red-400 font-semibold mb-2 text-sm">⚔️ Most Aggressive Nation</h3>
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">{stats.mostAggressive.name}</span>
              <span className="text-red-400 text-lg font-bold">{stats.mostAggressive.attacks} attacks</span>
            </div>
          </div>
        )}

        {/* Game Pace */}
        <div className="col-span-2 p-4 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-xl border border-purple-500/20">
          <h3 className="text-purple-400 font-semibold mb-2 text-sm">⚡ Game Pace</h3>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Actions per Turn</span>
            <span className="text-purple-400 font-bold text-lg">{stats.actionsPerTurn}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
