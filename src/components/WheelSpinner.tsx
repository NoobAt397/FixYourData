import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ACTIONS } from '../data/actions';

interface WheelSpinnerProps {
  type: 'country' | 'action';
  onSelect: (id: string) => void;
}

export default function WheelSpinner({ type, onSelect }: WheelSpinnerProps) {
  const { getActiveCountries } = useGameStore();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const items = type === 'country'
    ? getActiveCountries().map(c => ({ id: c.id, name: c.name }))
    : ACTIONS.map(a => ({ id: a.id, name: a.name }));

  const handleSpin = () => {
    if (items.length === 0) return;

    setSpinning(true);
    setResult(null);

    // Simulate spinning with random intermediate results
    let iterations = 0;
    const maxIterations = 20 + Math.floor(Math.random() * 10);

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * items.length);
      setResult(items[randomIndex].name);
      iterations++;

      if (iterations >= maxIterations) {
        clearInterval(interval);
        setSpinning(false);
        const finalIndex = Math.floor(Math.random() * items.length);
        const finalItem = items[finalIndex];
        setResult(finalItem.name);
        onSelect(finalItem.id);
      }
    }, 100);
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl border-2 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)] p-6">
      <h3 className="text-lg font-bold text-white mb-4 text-center">
        {type === 'country' ? '🎯 Country Spinner' : '🎲 Action Spinner'}
      </h3>

      <div className="relative">
        {/* Wheel Display */}
        <div className={`h-32 flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4 transition-all duration-300 ${
          spinning ? 'animate-pulse shadow-[0_0_40px_rgba(168,85,247,0.6)]' : 'shadow-lg'
        }`}>
          <div className="text-center">
            {result ? (
              <div className={`text-white font-bold transition-all duration-300 ${
                spinning ? 'text-lg' : 'text-xl'
              }`}>
                {result}
              </div>
            ) : (
              <div className="text-white/50 text-sm">
                Click spin to select
              </div>
            )}
          </div>
        </div>

        {/* Spin Button */}
        <button
          onClick={handleSpin}
          disabled={spinning || items.length === 0}
          className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-300 ${
            spinning
              ? 'bg-gray-600 cursor-not-allowed'
              : items.length === 0
              ? 'bg-gray-700 cursor-not-allowed text-gray-400'
              : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-green-500/50 hover:scale-105'
          }`}
        >
          {spinning ? '🔄 Spinning...' : items.length === 0 ? 'No items available' : '🎰 SPIN!'}
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-400 text-center">
        {items.length} {type === 'country' ? 'countries' : 'actions'} available
      </div>
    </div>
  );
}
