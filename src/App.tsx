import { useState } from 'react';
import { useGameStore } from './store/gameStore';
import ProfileSelector from './components/ProfileSelector';
import Dashboard from './components/Dashboard';
import TurnExecutor from './components/TurnExecutor';
import CountriesTable from './components/CountriesTable';
import HistoryLog from './components/HistoryLog';
import AllianceManager from './components/AllianceManager';
import ExportPanel from './components/ExportPanel';
import MergerPanel from './components/MergerPanel';
import RecentEliminations from './components/RecentEliminations';
import EnhancedStats from './components/EnhancedStats';
import SaveLoadPanel from './components/SaveLoadPanel';
import QuickActions from './components/QuickActions';
import GoldFlowChart from './components/GoldFlowChart';

function App() {
  const { currentGame, currentProfile } = useGameStore();
  const [activeTab, setActiveTab] = useState<'game' | 'stats' | 'management'>('game');

  // If no profile selected or no game started
  if (!currentProfile || !currentGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
              Asian Battle Royale
            </h1>
            <p className="text-gray-400 text-lg">Game Tracker & Management System</p>
          </div>
          <ProfileSelector />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900 p-4">
      <div className="max-w-[2000px] mx-auto">
        {/* Animated Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 drop-shadow-[0_0_20px_rgba(168,85,247,0.3)] text-center">
            🎮 Asian Battle Royale
          </h1>
          <Dashboard />
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex bg-gray-800 rounded-2xl p-1 border-2 border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
            <button
              onClick={() => setActiveTab('game')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'game'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🎯 Game Play
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'stats'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📊 Statistics
            </button>
            <button
              onClick={() => setActiveTab('management')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'management'
                  ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg shadow-yellow-500/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ⚙️ Management
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'game' && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Left Sidebar - Quick Actions */}
              <div className="lg:col-span-1 space-y-6">
                <QuickActions />
                <RecentEliminations />
              </div>

              {/* Middle - Turn Executor & History */}
              <div className="lg:col-span-2 space-y-6">
                <TurnExecutor />
                <HistoryLog />
              </div>

              {/* Right - Alliance & Merger */}
              <div className="lg:col-span-1 space-y-6">
                <AllianceManager />
                <MergerPanel />
              </div>
            </div>

            {/* Countries Table */}
            <CountriesTable />
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <EnhancedStats />
              <GoldFlowChart />
            </div>
            <CountriesTable />
          </div>
        )}

        {activeTab === 'management' && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <SaveLoadPanel />
              <ExportPanel />
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <AllianceManager />
              <MergerPanel />
            </div>
            <CountriesTable />
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 bg-gradient-to-r from-gray-800 via-purple-900/20 to-gray-800 rounded-2xl p-4 border-2 border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)] text-center">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <span className="text-purple-400 font-semibold">Profile: {currentProfile.name}</span>
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
