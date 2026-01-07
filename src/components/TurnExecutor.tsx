import { useState, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { ACTIONS } from '../data/actions';
import { BATTLE_OUTCOMES } from '../data/actions';
import { COUNTRY_NEIGHBORS } from '../data/countries';
import { ActionType, BattleOutcome } from '../types';
import { getWeakestCountries, getStrongestCountries } from '../utils/battleResolver';

export default function TurnExecutor() {
  const { currentGame, executeTurn, getActiveCountries } = useGameStore();
  const [selectedActor, setSelectedActor] = useState('');
  const [selectedAction, setSelectedAction] = useState<ActionType | ''>('');
  const [selectedTarget, setSelectedTarget] = useState('');
  const [selectedOutcome, setSelectedOutcome] = useState<BattleOutcome | ''>('');

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

  const canExecute = useMemo(() => {
    if (!selectedActor || !selectedAction) return false;
    if (selectedActionDef?.requiresTarget && !selectedTarget) return false;
    if (selectedActionDef?.requiresBattleOutcome && !selectedOutcome) return false;
    return true;
  }, [selectedActor, selectedAction, selectedTarget, selectedOutcome, selectedActionDef]);

  const handleExecute = () => {
    if (!canExecute) return;

    executeTurn(
      selectedActor,
      selectedAction as ActionType,
      selectedTarget || null,
      selectedOutcome as BattleOutcome || null
    );

    // Reset form
    setSelectedActor('');
    setSelectedAction('');
    setSelectedTarget('');
    setSelectedOutcome('');
  };

  if (!currentGame) return null;

  return (
    <div className="bg-gradient-to-br from-gray-800 via-blue-900/10 to-gray-900 rounded-2xl border-2 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.15)] p-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="text-3xl">🎯</span> Execute Turn
      </h2>

      <div className="space-y-4">
        {/* Step 1: Select Actor */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Step 1: Acting Country
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
                  {country.name} (Gold: {country.gold})
                </option>
              ))}
          </select>
        </div>

        {/* Step 2: Select Action */}
        {selectedActor && (
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Step 2: Action
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

        {/* Step 3: Select Target (if required) */}
        {selectedAction && selectedActionDef?.requiresTarget && (
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Step 3: Target Country
              {selectedActionDef.targetType && (
                <span className="text-gray-500 text-xs ml-2">
                  ({selectedActionDef.targetType})
                </span>
              )}
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
                    {country.name} (Gold: {country.gold})
                  </option>
                ))}
            </select>
            {availableTargets.length === 0 && (
              <p className="text-sm text-yellow-500 mt-1">No valid targets available for this action</p>
            )}
          </div>
        )}

        {/* Step 4: Select Battle Outcome (if required) */}
        {selectedAction && selectedActionDef?.requiresBattleOutcome && selectedTarget && (
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Step 4: Battle Outcome
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
            {selectedOutcome && (
              <p className="text-sm text-gray-400 mt-1">
                {BATTLE_OUTCOMES.find(o => o.id === selectedOutcome)?.description}
              </p>
            )}
          </div>
        )}

        {/* Execute Button */}
        <button
          onClick={handleExecute}
          disabled={!canExecute}
          className={`w-full px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
            canExecute
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer shadow-lg hover:shadow-blue-500/50 hover:scale-105'
              : 'bg-gray-600 cursor-not-allowed opacity-50'
          }`}
        >
          ⚡ Execute Turn
        </button>

        {/* Preview */}
        {canExecute && (
          <div className="p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
            <h3 className="text-sm font-semibold text-purple-300 mb-2">✨ Preview:</h3>
            <p className="text-white">
              <span className="text-blue-400">{actorCountry?.name}</span>
              {' will execute '}
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
                  {' with outcome: '}
                  <span className="text-yellow-400">
                    {BATTLE_OUTCOMES.find(o => o.id === selectedOutcome)?.name}
                  </span>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
