import { useGameStore } from '../store/gameStore';
import { exportToCSV, exportCountriesToCSV, exportGameSummary, downloadCSV } from '../utils/exportData';

export default function ExportPanel() {
  const { currentGame } = useGameStore();

  if (!currentGame) return null;

  const handleExportTurnHistory = () => {
    const csv = exportToCSV(currentGame);
    downloadCSV(csv, `game-${currentGame.gameId}-history.csv`);
  };

  const handleExportCountries = () => {
    const csv = exportCountriesToCSV(currentGame);
    downloadCSV(csv, `game-${currentGame.gameId}-countries.csv`);
  };

  const handleExportSummary = () => {
    const summary = exportGameSummary(currentGame);
    downloadCSV(summary, `game-${currentGame.gameId}-summary.txt`);
  };

  const handleExportGameState = () => {
    const json = JSON.stringify(currentGame, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `game-${currentGame.gameId}-state.json`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 rounded-2xl border-2 border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)] p-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">📊</span> Export Data
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleExportTurnHistory}
          className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/50 hover:scale-105"
        >
          📜 Turn History
        </button>

        <button
          onClick={handleExportCountries}
          className="px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/50 hover:scale-105"
        >
          🗺️ Countries Data
        </button>

        <button
          onClick={handleExportSummary}
          className="px-4 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 hover:scale-105"
        >
          📝 Summary Report
        </button>

        <button
          onClick={handleExportGameState}
          className="px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/50 hover:scale-105"
        >
          💾 Full Game State
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-400 bg-gray-900/50 rounded-xl p-3 border border-gray-700">
        <p className="font-semibold text-gray-300 mb-1">Export Formats:</p>
        <ul className="space-y-1 text-xs">
          <li>• Turn History: CSV with all actions and gold changes</li>
          <li>• Countries Data: CSV with current nation statistics</li>
          <li>• Summary Report: Text file with game overview</li>
          <li>• Full Game State: JSON for backup/sharing</li>
        </ul>
      </div>
    </div>
  );
}
