import { useGameStore } from '../store/gameStore';
import { ACTIONS } from '../data/actions';
import { BATTLE_OUTCOMES } from '../data/actions';

export default function HistoryLog() {
  const { currentGame, undoLastTurn, previousGameState } = useGameStore();

  const handleUndo = () => {
    if (confirm('Are you sure you want to undo the last turn? This cannot be reversed.')) {
      const success = undoLastTurn();
      if (!success) {
        alert('Cannot undo: no previous state available');
      }
    }
  };

  if (!currentGame) return null;

  const recentHistory = [...currentGame.turnHistory].reverse().slice(0, 10);

  return (
    <div className="bg-gradient-to-br from-gray-800 via-orange-900/10 to-gray-900 rounded-2xl border-2 border-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.15)]">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">📜</span> Turn History
        </h2>
        <button
          onClick={handleUndo}
          disabled={!previousGameState}
          className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
            previousGameState
              ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white cursor-pointer shadow-lg hover:shadow-red-500/50 hover:scale-105'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
          }`}
        >
          ↶ Undo Last Turn
        </button>
      </div>

      <div className="divide-y divide-gray-700 max-h-96 overflow-y-auto">
        {recentHistory.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No turns recorded yet
          </div>
        ) : (
          recentHistory.map((entry, index) => {
            const actor = currentGame.countries.find(c => c.id === entry.actor);
            const target = entry.target ? currentGame.countries.find(c => c.id === entry.target) : null;
            const action = ACTIONS.find(a => a.id === entry.action);
            const outcome = entry.outcome ? BATTLE_OUTCOMES.find(o => o.id === entry.outcome) : null;

            return (
              <div key={`${entry.turn}-${entry.timestamp}`} className="p-4 hover:bg-gray-750">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-mono text-sm">Turn {entry.turn}</span>
                    <span className="text-gray-500 text-xs">
                      Year {entry.year}
                    </span>
                    {index === 0 && (
                      <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded">
                        Latest
                      </span>
                    )}
                  </div>
                  <span className="text-gray-500 text-xs">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <div className="text-white mb-2">
                  <span className="text-blue-400 font-semibold">{actor?.name || 'Unknown'}</span>
                  {' → '}
                  <span className="text-gray-300">{action?.name || entry.action}</span>
                  {target && (
                    <>
                      {' → '}
                      <span className="text-red-400 font-semibold">{target.name}</span>
                    </>
                  )}
                </div>

                {outcome && (
                  <div className="text-sm mb-2">
                    <span className="text-yellow-400">⚔️ {outcome.name}</span>
                  </div>
                )}

                {Object.keys(entry.goldChanges).length > 0 && (
                  <div className="text-sm text-gray-400">
                    Gold Changes:
                    {Object.entries(entry.goldChanges).map(([countryId, amount]) => {
                      const country = currentGame.countries.find(c => c.id === countryId);
                      return (
                        <span key={countryId} className="ml-2">
                          {country?.name || countryId}:
                          <span className={amount >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {amount >= 0 ? '+' : ''}{amount}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                )}

                {entry.notes && (
                  <div className="text-sm text-gray-500 mt-2 italic">
                    {entry.notes}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {currentGame.turnHistory.length > 10 && (
        <div className="p-3 bg-gray-750 border-t border-gray-700 text-center">
          <button className="text-sm text-blue-400 hover:text-blue-300">
            View All {currentGame.turnHistory.length} Turns
          </button>
        </div>
      )}
    </div>
  );
}
