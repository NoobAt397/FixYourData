import { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';

export default function GoldFlowChart() {
  const { currentGame } = useGameStore();

  const flowData = useMemo(() => {
    if (!currentGame) return { topGainers: [], topLosers: [] };

    // Calculate total gold changes per country
    const goldChanges: Record<string, number> = {};

    currentGame.turnHistory.forEach(entry => {
      Object.entries(entry.goldChanges).forEach(([countryId, amount]) => {
        goldChanges[countryId] = (goldChanges[countryId] || 0) + amount;
      });
    });

    const entries = Object.entries(goldChanges).map(([id, change]) => ({
      country: currentGame.countries.find(c => c.id === id),
      change
    })).filter(e => e.country);

    const topGainers = entries
      .filter(e => e.change > 0)
      .sort((a, b) => b.change - a.change)
      .slice(0, 5);

    const topLosers = entries
      .filter(e => e.change < 0)
      .sort((a, b) => a.change - b.change)
      .slice(0, 5);

    return { topGainers, topLosers };
  }, [currentGame]);

  if (!currentGame) return null;

  const maxGain = Math.max(...flowData.topGainers.map(g => g.change), 1);
  const maxLoss = Math.abs(Math.min(...flowData.topLosers.map(l => l.change), -1));

  return (
    <div className="bg-gradient-to-br from-gray-800 via-emerald-900/10 to-gray-900 rounded-2xl border-2 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)] p-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">💸</span> Gold Flow Analysis
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Top Gainers */}
        <div className="space-y-3">
          <h3 className="text-green-400 font-semibold flex items-center gap-2">
            <span>📈</span> Top Gainers
          </h3>

          {flowData.topGainers.length === 0 ? (
            <div className="text-center text-gray-500 py-4 text-sm">
              No data yet
            </div>
          ) : (
            <div className="space-y-2">
              {flowData.topGainers.map((entry, index) => {
                const percentage = (entry.change / maxGain) * 100;
                return (
                  <div key={entry.country?.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white font-medium flex items-center gap-2">
                        <span className="text-gray-500">{index + 1}.</span>
                        {entry.country?.name}
                      </span>
                      <span className="text-green-400 font-bold">+{entry.change}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Losers */}
        <div className="space-y-3">
          <h3 className="text-red-400 font-semibold flex items-center gap-2">
            <span>📉</span> Top Losers
          </h3>

          {flowData.topLosers.length === 0 ? (
            <div className="text-center text-gray-500 py-4 text-sm">
              No data yet
            </div>
          ) : (
            <div className="space-y-2">
              {flowData.topLosers.map((entry, index) => {
                const percentage = (Math.abs(entry.change) / maxLoss) * 100;
                return (
                  <div key={entry.country?.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white font-medium flex items-center gap-2">
                        <span className="text-gray-500">{index + 1}.</span>
                        {entry.country?.name}
                      </span>
                      <span className="text-red-400 font-bold">{entry.change}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500 text-center">
        Total gold changes tracked across {currentGame.turnHistory.length} turns
      </div>
    </div>
  );
}
