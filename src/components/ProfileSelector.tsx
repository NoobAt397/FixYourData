import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export default function ProfileSelector() {
  const { profiles, currentProfile, createProfile, selectProfile, deleteProfile, startNewGame } = useGameStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [showStartGame, setShowStartGame] = useState(false);
  const [startingGold, setStartingGold] = useState(100);

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProfileName.trim()) {
      createProfile(newProfileName.trim());
      setNewProfileName('');
      setShowCreateForm(false);
      // Auto-show game setup after creating profile
      setTimeout(() => setShowStartGame(true), 100);
    }
  };

  const handleStartGame = () => {
    if (currentProfile) {
      console.log('🎮 Starting new game for profile:', currentProfile.name, 'with', startingGold, 'gold');
      startNewGame(currentProfile.name, startingGold);
      setShowStartGame(false);
      console.log('✅ Game start command sent!');
    } else {
      console.error('❌ No current profile!');
    }
  };

  if (currentProfile) {
    return (
      <div className="bg-gradient-to-br from-gray-800 via-purple-900/10 to-gray-900 rounded-2xl p-6 border-2 border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">👤 Profile: {currentProfile.name}</h2>
            <p className="text-gray-400 text-sm">Games Played: {currentProfile.gamesCount}</p>
          </div>
          <button
            onClick={() => selectProfile('')}
            className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all"
          >
            Switch Profile
          </button>
        </div>

        {!showStartGame ? (
          <button
            onClick={() => setShowStartGame(true)}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-green-500/50"
          >
            🎮 Start New Game
          </button>
        ) : (
          <div className="mt-4 p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-500/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>⚙️</span> Game Settings
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Starting Gold per Country</label>
              <input
                type="number"
                value={startingGold}
                onChange={(e) => setStartingGold(parseInt(e.target.value) || 100)}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border-2 border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 text-lg font-semibold"
                min={10}
                max={1000}
              />
              <p className="text-xs text-gray-500 mt-1">Default: 100 gold per nation</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleStartGame}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
              >
                ✨ Launch Game!
              </button>
              <button
                onClick={() => setShowStartGame(false)}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-500 transition-all font-semibold"
              >
                Cancel
              </button>
            </div>
            <p className="text-center text-gray-400 text-sm mt-3">
              Click "Launch Game" to begin playing!
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 via-purple-900/10 to-gray-900 rounded-2xl p-6 border-2 border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">👤 Select or Create Profile</h2>

      {profiles.length > 0 && (
        <div className="space-y-3 mb-6">
          <p className="text-sm text-gray-400 mb-2">Existing Profiles:</p>
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl hover:from-gray-600 hover:to-gray-700 cursor-pointer transition-all border border-gray-600 hover:border-purple-500/50"
              onClick={() => selectProfile(profile.id)}
            >
              <div>
                <div className="text-white font-semibold text-lg">{profile.name}</div>
                <div className="text-gray-400 text-sm">
                  🎮 Games: {profile.gamesCount} | 📅 Last: {new Date(profile.lastPlayed).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete profile "${profile.name}"?`)) {
                    deleteProfile(profile.id);
                  }
                }}
                className="px-3 py-2 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition-all"
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {!showCreateForm ? (
        <button
          onClick={() => setShowCreateForm(true)}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-lg hover:shadow-purple-500/50"
        >
          ✨ Create New Profile
        </button>
      ) : (
        <form onSubmit={handleCreateProfile} className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-500/30">
            <label className="block text-sm font-semibold text-gray-300 mb-2">Enter Your Name:</label>
            <input
              type="text"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              placeholder="e.g., Player1"
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border-2 border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 text-lg"
              autoFocus
              required
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!newProfileName.trim()}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                newProfileName.trim()
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-green-500/50 hover:scale-105'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              ✅ Create & Continue
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCreateForm(false);
                setNewProfileName('');
              }}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-500 transition-all font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
