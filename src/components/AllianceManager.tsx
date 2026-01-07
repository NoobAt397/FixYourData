import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export default function AllianceManager() {
  const { currentGame, createAlliance, dissolveAlliance, getActiveCountries } = useGameStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [allianceName, setAllianceName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const activeCountries = getActiveCountries();

  const handleCreateAlliance = (e: React.FormEvent) => {
    e.preventDefault();
    if (allianceName.trim() && selectedMembers.length >= 2) {
      createAlliance(allianceName.trim(), selectedMembers);
      setAllianceName('');
      setSelectedMembers([]);
      setShowCreateForm(false);
    }
  };

  const toggleMember = (countryId: string) => {
    setSelectedMembers(prev =>
      prev.includes(countryId)
        ? prev.filter(id => id !== countryId)
        : [...prev, countryId]
    );
  };

  if (!currentGame) return null;

  const activeAlliances = currentGame.alliances.filter(a => a.status === 'active');

  return (
    <div className="bg-gradient-to-br from-gray-800 via-cyan-900/10 to-gray-900 rounded-2xl border-2 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">🤝</span> Alliance Manager
        </h2>
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-3 py-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
          >
            + Create Alliance
          </button>
        )}
      </div>

      {/* Create Alliance Form */}
      {showCreateForm && (
        <form onSubmit={handleCreateAlliance} className="mb-4 p-4 bg-gray-700 rounded-lg">
          <h3 className="text-white font-semibold mb-3">Create New Alliance</h3>

          <div className="mb-3">
            <label className="block text-sm text-gray-300 mb-1">Alliance Name</label>
            <input
              type="text"
              value={allianceName}
              onChange={(e) => setAllianceName(e.target.value)}
              placeholder="e.g., Eastern Coalition"
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm text-gray-300 mb-2">
              Select Members (minimum 2)
            </label>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {activeCountries.map(country => (
                <label
                  key={country.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-600 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(country.id)}
                    onChange={() => toggleMember(country.id)}
                    className="w-4 h-4"
                  />
                  <span className="text-white">{country.name}</span>
                  <span className="text-gray-400 text-sm">(Power: {country.powerLevel}/10)</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!allianceName.trim() || selectedMembers.length < 2}
              className={`flex-1 px-4 py-2 rounded font-semibold ${
                allianceName.trim() && selectedMembers.length >= 2
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Create Alliance
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCreateForm(false);
                setAllianceName('');
                setSelectedMembers([]);
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Active Alliances List */}
      <div className="space-y-3">
        {activeAlliances.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No active alliances
          </div>
        ) : (
          activeAlliances.map(alliance => {
            const members = alliance.members
              .map(mId => currentGame.countries.find(c => c.id === mId))
              .filter(Boolean);
            const avgPower = members.length > 0
              ? members.reduce((sum, m) => sum + (m?.powerLevel || 0), 0) / members.length
              : 0;
            const totalTerritory = members.reduce((sum, m) => sum + (m?.territorySize || 0), 0);

            return (
              <div key={alliance.id} className="p-3 bg-gray-700 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-blue-400 font-semibold">{alliance.name}</h3>
                  <button
                    onClick={() => {
                      if (confirm(`Dissolve alliance "${alliance.name}"?`)) {
                        dissolveAlliance(alliance.id);
                      }
                    }}
                    className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                  >
                    Dissolve
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
                  <div className="text-gray-300">
                    Members: <span className="text-white font-semibold">{members.length}</span>
                  </div>
                  <div className="text-gray-300">
                    Avg Power: <span className="text-yellow-400 font-semibold">{avgPower.toFixed(1)}/10</span>
                  </div>
                  <div className="text-gray-300">
                    Territory: <span className="text-green-400 font-semibold">{totalTerritory}</span>
                  </div>
                  <div className="text-gray-300 text-xs">
                    Since: Turn {alliance.formedTurn}
                  </div>
                </div>

                <div className="text-sm text-gray-400">
                  {members.map(m => m?.name).join(', ')}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
