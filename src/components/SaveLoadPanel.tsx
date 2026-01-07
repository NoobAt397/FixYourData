import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { GameState } from '../types';

interface SavedGame {
  gameId: string;
  profileName: string;
  turn: number;
  year: number;
  savedAt: number;
  activeNations: number;
}

export default function SaveLoadPanel() {
  const { currentGame, loadGame, saveGame } = useGameStore();
  const [savedGames, setSavedGames] = useState<SavedGame[]>([]);
  const [showLoad, setShowLoad] = useState(false);

  useEffect(() => {
    loadSavedGames();
  }, []);

  const loadSavedGames = () => {
    const games: SavedGame[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('asian-battle-royale-games-')) {
        try {
          const gameData: GameState = JSON.parse(localStorage.getItem(key) || '');
          games.push({
            gameId: gameData.gameId,
            profileName: gameData.profileName,
            turn: gameData.turn,
            year: gameData.year,
            savedAt: gameData.lastModified,
            activeNations: gameData.countries.filter(c => c.status === 'active').length
          });
        } catch (e) {
          console.error('Error loading game:', e);
        }
      }
    }
    setSavedGames(games.sort((a, b) => b.savedAt - a.savedAt));
  };

  const handleSaveGame = () => {
    saveGame();
    loadSavedGames();
    alert('Game saved successfully!');
  };

  const handleLoadGame = (gameId: string) => {
    if (currentGame && currentGame.gameId !== gameId) {
      if (confirm('Loading a different game will replace your current session. Continue?')) {
        loadGame(gameId);
        setShowLoad(false);
      }
    } else {
      loadGame(gameId);
      setShowLoad(false);
    }
  };

  const handleDeleteGame = (gameId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this saved game? This cannot be undone.')) {
      localStorage.removeItem(`asian-battle-royale-games-${gameId}`);
      loadSavedGames();
    }
  };

  if (!currentGame) return null;

  return (
    <div className="bg-gradient-to-br from-gray-800 via-indigo-900/10 to-gray-900 rounded-2xl border-2 border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.15)] p-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">💾</span> Save / Load Game
      </h2>

      <div className="space-y-3">
        {/* Current Game Info */}
        <div className="p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-500/30">
          <h3 className="text-blue-400 font-semibold mb-2 text-sm">Current Game</h3>
          <div className="text-xs space-y-1 text-gray-300">
            <div>Turn: <span className="text-white font-semibold">{currentGame.turn}</span></div>
            <div>Year: <span className="text-white font-semibold">{currentGame.year}</span></div>
            <div>Last saved: <span className="text-white font-semibold">
              {new Date(currentGame.lastModified).toLocaleString()}
            </span></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleSaveGame}
            className="px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/50 hover:scale-105"
          >
            💾 Save Game
          </button>

          <button
            onClick={() => setShowLoad(!showLoad)}
            className="px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/50 hover:scale-105"
          >
            📂 Load Game
          </button>
        </div>

        {/* Load Game Panel */}
        {showLoad && (
          <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700 max-h-96 overflow-y-auto">
            <h3 className="text-white font-semibold mb-3 text-sm">Saved Games ({savedGames.length})</h3>

            {savedGames.length === 0 ? (
              <div className="text-center text-gray-500 py-8 text-sm">
                No saved games found
              </div>
            ) : (
              <div className="space-y-2">
                {savedGames.map(game => (
                  <div
                    key={game.gameId}
                    onClick={() => handleLoadGame(game.gameId)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all duration-300 ${
                      currentGame.gameId === game.gameId
                        ? 'bg-blue-900/30 border-blue-500/50'
                        : 'bg-gray-800/50 border-gray-700 hover:border-blue-500/50 hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold text-sm">{game.profileName}</span>
                      <button
                        onClick={(e) => handleDeleteGame(game.gameId, e)}
                        className="px-2 py-1 bg-red-600/50 hover:bg-red-600 text-white rounded text-xs transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="text-xs space-y-0.5 text-gray-400">
                      <div>Turn {game.turn} • Year {game.year}</div>
                      <div>{game.activeNations} nations active</div>
                      <div className="text-gray-500">
                        Saved: {new Date(game.savedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
