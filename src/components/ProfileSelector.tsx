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
    }
  };

  const handleStartGame = () => {
    if (currentProfile) {
      startNewGame(currentProfile.name, startingGold);
      setShowStartGame(false);
    }
  };

  if (currentProfile && !showStartGame) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Profile: {currentProfile.name}</h2>
            <p className="text-gray-400 text-sm">Games Played: {currentProfile.gamesCount}</p>
          </div>
          <button
            onClick={() => selectProfile('')}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Switch Profile
          </button>
        </div>
        <button
          onClick={() => setShowStartGame(true)}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
        >
          Start New Game
        </button>

        {showStartGame && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Game Settings</h3>
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">Starting Gold per Country</label>
              <input
                type="number"
                value={startingGold}
                onChange={(e) => setStartingGold(parseInt(e.target.value) || 100)}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                min={10}
                max={1000}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleStartGame}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowStartGame(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4">Select Profile</h2>

      {profiles.length > 0 && (
        <div className="space-y-2 mb-4">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="flex items-center justify-between p-3 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer"
              onClick={() => selectProfile(profile.id)}
            >
              <div>
                <div className="text-white font-semibold">{profile.name}</div>
                <div className="text-gray-400 text-sm">
                  Games: {profile.gamesCount} | Last played: {new Date(profile.lastPlayed).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete profile "${profile.name}"?`)) {
                    deleteProfile(profile.id);
                  }
                }}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {!showCreateForm ? (
        <button
          onClick={() => setShowCreateForm(true)}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Create New Profile
        </button>
      ) : (
        <form onSubmit={handleCreateProfile} className="space-y-3">
          <input
            type="text"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            placeholder="Enter profile name..."
            className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCreateForm(false);
                setNewProfileName('');
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
