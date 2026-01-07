import { useState, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { ACTIONS } from '../data/actions';
import { BATTLE_OUTCOMES } from '../data/actions';
import { COUNTRY_NEIGHBORS } from '../data/countries';
import { ActionType, BattleOutcome } from '../types';
import { getWeakestCountries, getStrongestCountries } from '../utils/battleResolver';

type Phase = 'spin' | 'predict' | 'simulate' | 'record';

export default function TurnExecutor() {
  const { currentGame, executeTurn, getActiveCountries } = useGameStore();
  const [phase, setPhase] = useState<Phase>('spin');
  const [selectedActor, setSelectedActor] = useState('');
  const [selectedAction, setSelectedAction] = useState<ActionType | ''>('');
  const [selectedTarget, setSelectedTarget] = useState('');
  const [selectedOutcome, setSelectedOutcome] = useState<BattleOutcome | ''>('');
  const [prediction, setPrediction] = useState('');
  const [reality, setReality] = useState('');
  const [powerChanges, setPowerChanges] = useState<Record<string, number>>({});
  const [territoryChanges, setTerritoryChanges] = useState<Record<string, number>>({});

  const activeCountries = getActiveCountries();
  const selectedActionDef = ACTIONS.find(a => a.id === selectedAction);
  const actorCountry = currentGame?.countries.find(c => c.id === selectedActor);

  // Filter available targets based on action type
  const availableTargets = useMemo(() => {
    if (!selectedActionDef || !selectedActionDef.requiresTarget || !actorCountry) {
      return [];
    }

    const otherCountries = activeCountries.filter(c => c.id !== selectedActor);

    switch (selectedActionDef.targetType) {
      case 'weakest':
        return getWeakestCountries(currentGame?.countries || [], 3);
      case 'strongest':
        return getStrongestCountries(currentGame?.countries || [], 3);
      case 'neighbor':
        const neighbors = COUNTRY_NEIGHBORS[selectedActor] || [];
        return otherCountries.filter(c => neighbors.includes(c.id));
      case 'random':
      case 'any':
      default:
        return otherCountries;
    }
  }, [selectedActionDef, selectedActor, actorCountry, activeCountries, currentGame]);

  const canProceedToPredict = useMemo(() => {
    if (!selectedActor || !selectedAction) return false;
    if (selectedActionDef?.requiresTarget && !selectedTarget) return false;
    if (selectedActionDef?.requiresBattleOutcome && !selectedOutcome) return false;
    return true;
  }, [selectedActor, selectedAction, selectedTarget, selectedOutcome, selectedActionDef]);

  const handleExecute = () => {
    if (!prediction.trim() || !reality.trim()) return;

    executeTurn(
      selectedActor,
      selectedAction as ActionType,
      selectedTarget || null,
      selectedOutcome as BattleOutcome || null,
      prediction,
      reality,
      powerChanges,
      territoryChanges
    );

    // Reset form
    setPhase('spin');
    setSelectedActor('');
    setSelectedAction('');
    setSelectedTarget('');
    setSelectedOutcome('');
    setPrediction('');
    setReality('');
    setPowerChanges({});
    setTerritoryChanges({});
  };

  const affectedCountries = useMemo(() => {
    const countries: string[] = [];
    if (selectedActor) countries.push(selectedActor);
    if (selectedTarget) countries.push(selectedTarget);
    return countries;
  }, [selectedActor, selectedTarget]);

  if (!currentGame) return null;

  return (
    <div className="bg-gradient-to-br from-gray-800 via-blue-900/10 to-gray-900 rounded-2xl border-2 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.15)] p-6">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-3xl">🎯</span> Turn Execution Wizard
      </h2>

      {/* Phase Indicators */}
      <div className="flex gap-2 mb-6">
        {(['spin', 'predict', 'simulate', 'record'] as Phase[]).map((p, idx) => (
          <div
            key={p}
            className={`flex-1 px-3 py-2 rounded-lg text-center text-sm font-semibold transition-all ${
              phase === p
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : idx < (['spin', 'predict', 'simulate', 'record'] as Phase[]).indexOf(phase)
                ? 'bg-green-900/50 text-green-300 border border-green-500/30'
                : 'bg-gray-700 text-gray-400'
            }`}
          >
            {p === 'spin' && '🎰 Phase A: Spin Wheels'}
            {p === 'predict' && '🔮 Phase B: Predict'}
            {p === 'simulate' && '⏸️ Phase C: Simulate AoC'}
            {p === 'record' && '📝 Phase D: Record Reality'}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {/* Phase A: WHEEL SPIN */}
        {phase === 'spin' && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                🎰 Step 1: Select Acting Country (or use Country Wheel)
              </label>
              <select
                value={selectedActor}
                onChange={(e) => {
                  setSelectedActor(e.target.value);
                  setSelectedTarget('');
                  setSelectedOutcome('');
                }}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-xl border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
              >
                <option value="">-- Select Country --</option>
                {activeCountries
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name} (Power: {country.powerLevel}/10)
                    </option>
                  ))}
              </select>
            </div>

            {selectedActor && (
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  🎲 Step 2: Select Action (or use Action Wheel)
                </label>
                <select
                  value={selectedAction}
                  onChange={(e) => {
                    setSelectedAction(e.target.value as ActionType);
                    setSelectedTarget('');
                    setSelectedOutcome('');
                  }}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-xl border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                >
                  <option value="">-- Select Action --</option>
                  {ACTIONS.map((action) => (
                    <option key={action.id} value={action.id}>
                      {action.name} ({action.category})
                    </option>
                  ))}
                </select>
                {selectedActionDef && (
                  <p className="text-sm text-gray-400 mt-1">{selectedActionDef.description}</p>
                )}
              </div>
            )}

            {selectedAction && selectedActionDef?.requiresTarget && (
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  🎯 Step 3: Select Target Country
                </label>
                <select
                  value={selectedTarget}
                  onChange={(e) => {
                    setSelectedTarget(e.target.value);
                    setSelectedOutcome('');
                  }}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-xl border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                >
                  <option value="">-- Select Target --</option>
                  {availableTargets
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name} (Power: {country.powerLevel}/10)
                      </option>
                    ))}
                </select>
              </div>
            )}

            {selectedAction && selectedActionDef?.requiresBattleOutcome && selectedTarget && (
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  🎲 Step 4: Spin Outcome Wheel
                </label>
                <select
                  value={selectedOutcome}
                  onChange={(e) => setSelectedOutcome(e.target.value as BattleOutcome)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-xl border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                >
                  <option value="">-- Select Outcome --</option>
                  {BATTLE_OUTCOMES.map((outcome) => (
                    <option key={outcome.id} value={outcome.id}>
                      {outcome.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={() => setPhase('predict')}
              disabled={!canProceedToPredict}
              className={`w-full px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
                canProceedToPredict
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer shadow-lg hover:shadow-blue-500/50 hover:scale-105'
                  : 'bg-gray-600 cursor-not-allowed opacity-50'
              }`}
            >
              ➡️ Proceed to Prediction
            </button>
          </>
        )}

        {/* Phase B: PREDICTION */}
        {phase === 'predict' && (
          <>
            <div className="p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-500/30">
              <h3 className="text-sm font-semibold text-purple-300 mb-2">📌 Wheel Spin Results:</h3>
              <p className="text-white">
                <span className="text-blue-400">{actorCountry?.name}</span>
                {' will '}
                <span className="text-green-400">{selectedActionDef?.name}</span>
                {selectedTarget && (
                  <>
                    {' against '}
                    <span className="text-red-400">
                      {currentGame.countries.find(c => c.id === selectedTarget)?.name}
                    </span>
                  </>
                )}
                {selectedOutcome && (
                  <>
                    {' → Outcome: '}
                    <span className="text-yellow-400">
                      {BATTLE_OUTCOMES.find(o => o.id === selectedOutcome)?.name}
                    </span>
                  </>
                )}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                🔮 What do you PREDICT will happen?
              </label>
              <textarea
                value={prediction}
                onChange={(e) => setPrediction(e.target.value)}
                placeholder="e.g., 'Turkey might lose badly and get annexed by the Crescent Delta Union'"
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-xl border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 min-h-[80px]"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPhase('spin')}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-500 transition-all font-semibold"
              >
                ← Back
              </button>
              <button
                onClick={() => setPhase('simulate')}
                disabled={!prediction.trim()}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
                  prediction.trim()
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 cursor-pointer shadow-lg hover:shadow-orange-500/50 hover:scale-105'
                    : 'bg-gray-600 cursor-not-allowed opacity-50'
                }`}
              >
                ⏸️ NOW UNPAUSE AGE OF CONFLICT
              </button>
            </div>
          </>
        )}

        {/* Phase C: SIMULATE */}
        {phase === 'simulate' && (
          <>
            <div className="p-6 bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-xl border-2 border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.2)]">
              <h3 className="text-xl font-bold text-orange-300 mb-3 flex items-center gap-2">
                ⏸️ UNPAUSE AGE OF CONFLICT NOW
              </h3>
              <p className="text-white mb-3">
                Watch the simulation for 30 seconds to 5 minutes. Observe what ACTUALLY happens:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-1 mb-4">
                <li>Which territories change hands?</li>
                <li>Did anyone get annexed?</li>
                <li>How did power levels shift?</li>
                <li>What's the narrative outcome?</li>
              </ul>
              <p className="text-orange-400 font-semibold">
                ⏸️ PAUSE when ready, then click below to record reality.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPhase('predict')}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-500 transition-all font-semibold"
              >
                ← Back
              </button>
              <button
                onClick={() => setPhase('record')}
                className="flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 cursor-pointer shadow-lg hover:shadow-green-500/50 hover:scale-105"
              >
                ✅ I've Paused - Record Reality →
              </button>
            </div>
          </>
        )}

        {/* Phase D: RECORD REALITY */}
        {phase === 'record' && (
          <>
            <div className="p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-500/30 mb-4">
              <h3 className="text-sm font-semibold text-purple-300 mb-2">🔮 Your Prediction:</h3>
              <p className="text-gray-300 italic">"{prediction}"</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                📝 What ACTUALLY happened in Age of Conflict?
              </label>
              <textarea
                value={reality}
                onChange={(e) => setReality(e.target.value)}
                placeholder="e.g., 'Turkey was completely annexed by CDU. CDU gained significant territory.'"
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-xl border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                ⚡ Quick Updates (Manual Adjustments):
              </label>
              <div className="space-y-3">
                {affectedCountries.map(countryId => {
                  const country = currentGame.countries.find(c => c.id === countryId);
                  if (!country) return null;

                  return (
                    <div key={countryId} className="p-3 bg-gray-800/50 rounded-lg border border-gray-600">
                      <div className="text-white font-semibold mb-2">{country.name}</div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Power Level Change</label>
                          <input
                            type="number"
                            value={powerChanges[countryId] || 0}
                            onChange={(e) => setPowerChanges({ ...powerChanges, [countryId]: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 text-sm"
                            min={-10}
                            max={10}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Current: {country.powerLevel} → New: {Math.max(1, Math.min(10, country.powerLevel + (powerChanges[countryId] || 0)))}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Territory Change</label>
                          <input
                            type="number"
                            value={territoryChanges[countryId] || 0}
                            onChange={(e) => setTerritoryChanges({ ...territoryChanges, [countryId]: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 text-sm"
                            min={-100}
                            max={100}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Current: {country.territorySize} → New: {country.territorySize + (territoryChanges[countryId] || 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPhase('simulate')}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-500 transition-all font-semibold"
              >
                ← Back
              </button>
              <button
                onClick={handleExecute}
                disabled={!reality.trim()}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
                  reality.trim()
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 cursor-pointer shadow-lg hover:shadow-green-500/50 hover:scale-105'
                    : 'bg-gray-600 cursor-not-allowed opacity-50'
                }`}
              >
                ✅ Save Turn & Continue
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
