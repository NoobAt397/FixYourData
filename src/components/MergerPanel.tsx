import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export default function MergerPanel() {
  const { currentGame, performMerger, getActiveCountries } = useGameStore();
  const [showMergerForm, setShowMergerForm] = useState(false);
  const [country1Id, setCountry1Id] = useState('');
  const [country2Id, setCountry2Id] = useState('');
  const [newName, setNewName] = useState('');

  const activeCountries = getActiveCountries();

  const handleMerge = (e: React.FormEvent) => {
    e.preventDefault();
    if (country1Id && country2Id && newName.trim()) {
      performMerger(country1Id, country2Id, newName.trim());
      setCountry1Id('');
      setCountry2Id('');
      setNewName('');
      setShowMergerForm(false);
    }
  };

  const country1 = currentGame?.countries.find(c => c.id === country1Id);
  const country2 = currentGame?.countries.find(c => c.id === country2Id);
  const avgPowerLevel = country1 && country2
    ? Math.round(((country1.powerLevel || 0) + (country2.powerLevel || 0)) / 2)
    : 0;
  const combinedTerritory = (country1?.territorySize || 0) + (country2?.territorySize || 0);

  if (!currentGame) return null;

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-800 to-purple-900 rounded-2xl border-2 border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.15)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">🤝</span> Peaceful Unification
        </h2>
        {!showMergerForm && (
          <button
            onClick={() => setShowMergerForm(true)}
            className="px-3 py-1 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105"
          >
            + Merge Nations
          </button>
        )}
      </div>

      {showMergerForm ? (
        <form onSubmit={handleMerge} className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-xl border border-yellow-500/30">
            <p className="text-yellow-400 text-sm mb-2 font-semibold">
              ⚠️ Peaceful Unification merges two nations into one!
            </p>
            <p className="text-gray-300 text-xs">
              Both countries will be removed and replaced with a new unified nation. Gold and territories will be combined.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              First Country
            </label>
            <select
              value={country1Id}
              onChange={(e) => setCountry1Id(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-xl border border-gray-600 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50"
              required
            >
              <option value="">-- Select Country --</option>
              {activeCountries
                .filter(c => c.id !== country2Id)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name} (Power: {country.powerLevel}/10, Territory: {country.territorySize})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Second Country
            </label>
            <select
              value={country2Id}
              onChange={(e) => setCountry2Id(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-xl border border-gray-600 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50"
              required
            >
              <option value="">-- Select Country --</option>
              {activeCountries
                .filter(c => c.id !== country1Id)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name} (Power: {country.powerLevel}/10, Territory: {country.territorySize})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              New Nation Name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g., Greater Asian Union"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-xl border border-gray-600 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50"
              required
            />
          </div>

          {country1Id && country2Id && newName && (
            <div className="p-4 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-xl border border-green-500/30">
              <h3 className="text-green-400 font-semibold mb-2">Preview:</h3>
              <div className="text-sm space-y-1">
                <p className="text-white">
                  <span className="text-blue-400">{country1?.name}</span>
                  {' + '}
                  <span className="text-blue-400">{country2?.name}</span>
                  {' = '}
                  <span className="text-yellow-400 font-bold">{newName}</span>
                </p>
                <p className="text-gray-300">
                  Avg Power Level: <span className="text-yellow-400 font-semibold">{avgPowerLevel}/10</span>
                </p>
                <p className="text-gray-300">
                  Combined Territory: <span className="text-green-400 font-semibold">{combinedTerritory}</span>
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!country1Id || !country2Id || !newName.trim()}
              className={`flex-1 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                country1Id && country2Id && newName.trim()
                  ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-green-500/50 hover:scale-105'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              ✨ Execute Unification
            </button>
            <button
              type="button"
              onClick={() => {
                setShowMergerForm(false);
                setCountry1Id('');
                setCountry2Id('');
                setNewName('');
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-xl font-semibold transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center text-gray-400 py-8">
          <p className="text-sm">
            Merge two nations peacefully into a unified country
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Click "Merge Nations" to begin
          </p>
        </div>
      )}
    </div>
  );
}
