import { useGameStore } from './store/gameStore';
import ProfileSelector from './components/ProfileSelector';
import Dashboard from './components/Dashboard';
import TurnExecutor from './components/TurnExecutor';
import CountriesTable from './components/CountriesTable';
import HistoryLog from './components/HistoryLog';
import AllianceManager from './components/AllianceManager';

function App() {
  const { currentGame, currentProfile } = useGameStore();

  // If no profile selected or no game started
  if (!currentProfile || !currentGame) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Asian Battle Royale</h1>
            <p className="text-gray-400">Game Tracker & Management System</p>
          </div>
          <ProfileSelector />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Dashboard />
        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Turn Executor */}
          <div className="lg:col-span-1">
            <TurnExecutor />
          </div>

          {/* Middle Column - History Log */}
          <div className="lg:col-span-1">
            <HistoryLog />
          </div>

          {/* Right Column - Alliance Manager */}
          <div className="lg:col-span-1">
            <AllianceManager />
          </div>
        </div>

        {/* Bottom - Countries Table */}
        <div className="mb-6">
          <CountriesTable />
        </div>

        {/* Footer */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <span>Profile: {currentProfile.name}</span>
            <span>•</span>
            <span>Game ID: {currentGame.gameId.slice(-8)}</span>
            <span>•</span>
            <span>Last Modified: {new Date(currentGame.lastModified).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
