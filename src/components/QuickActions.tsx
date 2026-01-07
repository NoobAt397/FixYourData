import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import WheelSpinner from './WheelSpinner';

export default function QuickActions() {
  const { currentGame } = useGameStore();
  const [showCountrySpinner, setShowCountrySpinner] = useState(false);
  const [showActionSpinner, setShowActionSpinner] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  if (!currentGame) return null;

  const handleCountrySelect = (countryId: string) => {
    setSelectedCountry(countryId);
    setTimeout(() => setShowCountrySpinner(false), 500);
  };

  const handleActionSelect = (actionId: string) => {
    setSelectedAction(actionId);
    setTimeout(() => setShowActionSpinner(false), 500);
  };

  const activeNations = currentGame.countries.filter(c => c.status === 'active').length;
  const eliminatedNations = currentGame.countries.filter(c => c.status === 'annexed').length;
  const totalGold = currentGame.countries
    .filter(c => c.status === 'active')
    .reduce((sum, c) => sum + c.gold, 0);

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="bg-gradient-to-br from-gray-800 via-purple-900/10 to-gray-900 rounded-2xl border-2 border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)] p-4">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <span className="text-xl">⚡</span> Quick Stats
        </h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-green-900/20 rounded-xl border border-green-500/20">
            <span className="text-gray-300 text-sm">🟢 Active</span>
            <span className="text-green-400 font-bold text-lg">{activeNations}</span>
          </div>

          <div className="flex items-center justify-between p-2 bg-red-900/20 rounded-xl border border-red-500/20">
            <span className="text-gray-300 text-sm">🔴 Eliminated</span>
            <span className="text-red-400 font-bold text-lg">{eliminatedNations}</span>
          </div>

          <div className="flex items-center justify-between p-2 bg-yellow-900/20 rounded-xl border border-yellow-500/20">
            <span className="text-gray-300 text-sm">💰 Total Gold</span>
            <span className="text-yellow-400 font-bold text-lg">{totalGold.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Wheel Spinners Toggle */}
      <div className="bg-gradient-to-br from-gray-800 via-blue-900/10 to-gray-900 rounded-2xl border-2 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.15)] p-4">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <span className="text-xl">🎰</span> Random Selectors
        </h3>

        <div className="space-y-2">
          <button
            onClick={() => setShowCountrySpinner(!showCountrySpinner)}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/50 hover:scale-105"
          >
            {showCountrySpinner ? '✕ Close' : '🎯 Country Wheel'}
          </button>

          <button
            onClick={() => setShowActionSpinner(!showActionSpinner)}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/50 hover:scale-105"
          >
            {showActionSpinner ? '✕ Close' : '🎲 Action Wheel'}
          </button>
        </div>

        {/* Selected Items Display */}
        {(selectedCountry || selectedAction) && (
          <div className="mt-3 p-3 bg-gray-900/50 rounded-xl border border-gray-700">
            <div className="text-xs text-gray-400 mb-1">Last Selected:</div>
            {selectedCountry && (
              <div className="text-sm text-purple-400">
                Country: {currentGame.countries.find(c => c.id === selectedCountry)?.name}
              </div>
            )}
            {selectedAction && (
              <div className="text-sm text-blue-400">
                Action: {selectedAction}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Spinner Modals */}
      {showCountrySpinner && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowCountrySpinner(false)}>
          <div className="max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <WheelSpinner type="country" onSelect={handleCountrySelect} />
          </div>
        </div>
      )}

      {showActionSpinner && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowActionSpinner(false)}>
          <div className="max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <WheelSpinner type="action" onSelect={handleActionSelect} />
          </div>
        </div>
      )}
    </div>
  );
}
