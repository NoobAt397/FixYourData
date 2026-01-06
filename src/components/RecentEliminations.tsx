import { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';

export default function RecentEliminations() {
  const { currentGame } = useGameStore();

  const recentEliminations = useMemo(() => {
    if (!currentGame) return [];

    // Find annexation events in turn history
    const eliminations = currentGame.turnHistory
      .filter(entry =>
        entry.outcome && [
          'decisive-victory',
          'crushing-defeat',
          'resistance-victory',
          'pyrrhic-victory'
        ].includes(entry.outcome)
      )
      .map(entry => {
        const actor = currentGame.countries.find(c => c.id === entry.actor);
        const target = entry.target ? currentGame.countries.find(c => c.id === entry.target) : null;

        let eliminated: string | null = null;
        let eliminatedBy: string | null = null;

        if (entry.outcome === 'decisive-victory' || entry.outcome === 'pyrrhic-victory') {
          eliminated = target?.name || 'Unknown';
          eliminatedBy = actor?.name || 'Unknown';
        } else if (entry.outcome === 'crushing-defeat' || entry.outcome === 'resistance-victory') {
          eliminated = actor?.name || 'Unknown';
          eliminatedBy = target?.name || 'Unknown';
        }

        return {
          turn: entry.turn,
          year: entry.year,
          eliminated,
          eliminatedBy,
          outcome: entry.outcome,
          timestamp: entry.timestamp
        };
      })
      .filter(e => e.eliminated !== null)
      .reverse()
      .slice(0, 5);

    return eliminations;
  }, [currentGame]);

  if (!currentGame) return null;

  return (
    <div className="bg-gradient-to-br from-gray-800 via-red-900/10 to-gray-900 rounded-2xl border-2 border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.15)] p-4">
      <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span className="text-xl">💀</span> Recent Eliminations
      </h3>

      {recentEliminations.length === 0 ? (
        <div className="text-center text-gray-500 py-6 text-sm">
          No eliminations yet
        </div>
      ) : (
        <div className="space-y-2">
          {recentEliminations.map((elim, index) => (
            <div
              key={`${elim.turn}-${index}`}
              className="p-3 bg-gradient-to-r from-red-900/20 to-gray-800/50 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Turn {elim.turn}</span>
                <span className="text-xs text-gray-500">Year {elim.year}</span>
              </div>
              <div className="text-sm">
                <span className="text-red-400 font-semibold">{elim.eliminated}</span>
                <span className="text-gray-500"> eliminated by </span>
                <span className="text-green-400 font-semibold">{elim.eliminatedBy}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {elim.outcome?.replace('-', ' ')}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-500 text-center">
        {currentGame.countries.filter(c => c.status === 'annexed').length} nations eliminated total
      </div>
    </div>
  );
}
