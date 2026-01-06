import { useState, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { Country } from '../types';

type SortField = 'name' | 'gold' | 'territorySize' | 'status';
type SortOrder = 'asc' | 'desc';

export default function CountriesTable() {
  const { currentGame } = useGameStore();
  const [sortField, setSortField] = useState<SortField>('gold');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'annexed' | 'merged'>('all');

  const sortedAndFilteredCountries = useMemo(() => {
    if (!currentGame) return [];

    let filtered = [...currentGame.countries];

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'gold':
          comparison = a.gold - b.gold;
          break;
        case 'territorySize':
          comparison = a.territorySize - b.territorySize;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [currentGame, sortField, sortOrder, filterStatus]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getStatusColor = (status: Country['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'annexed':
        return 'text-red-400';
      case 'merged':
        return 'text-yellow-400';
    }
  };

  const getStatusIcon = (status: Country['status']) => {
    switch (status) {
      case 'active':
        return '🟢';
      case 'annexed':
        return '🔴';
      case 'merged':
        return '🟡';
    }
  };

  const getModifierText = (modifiers: Country['modifiers']) => {
    if (modifiers.length === 0) return '-';
    return modifiers.map(m => {
      switch (m) {
        case 'weakened-1':
          return '-1 Weak';
        case 'weakened-2':
          return '-2 Weak';
        case 'strengthened-1':
          return '+1 Strong';
        case 'strengthened-2':
          return '+2 Strong';
        case 'fortified':
          return '+1 Fort';
      }
    }).join(', ');
  };

  const getModifierColor = (modifiers: Country['modifiers']) => {
    if (modifiers.length === 0) return 'text-gray-400';
    if (modifiers.some(m => m.includes('weakened'))) return 'text-red-400';
    if (modifiers.some(m => m.includes('strengthened') || m === 'fortified')) return 'text-green-400';
    return 'text-gray-400';
  };

  if (!currentGame) return null;

  return (
    <div className="bg-gradient-to-br from-gray-800 via-green-900/10 to-gray-900 rounded-2xl border-2 border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.15)] overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">🗺️</span> Nations Table
        </h2>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-1 bg-gray-700 text-white rounded-xl border border-gray-600 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/50"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="annexed">Annexed Only</option>
            <option value="merged">Merged Only</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                onClick={() => handleSort('name')}
              >
                Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                onClick={() => handleSort('gold')}
              >
                Gold {sortField === 'gold' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                onClick={() => handleSort('status')}
              >
                Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                onClick={() => handleSort('territorySize')}
              >
                Territory {sortField === 'territorySize' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Alliances
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Modifiers
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sortedAndFilteredCountries.map((country) => (
              <tr key={country.id} className="hover:bg-gray-750">
                <td className="px-4 py-3 text-white font-medium">{country.name}</td>
                <td className="px-4 py-3 text-yellow-400 font-semibold">{country.gold}</td>
                <td className={`px-4 py-3 font-medium ${getStatusColor(country.status)}`}>
                  {getStatusIcon(country.status)} {country.status.charAt(0).toUpperCase() + country.status.slice(1)}
                </td>
                <td className="px-4 py-3 text-gray-300">{country.territorySize}</td>
                <td className="px-4 py-3 text-blue-400 text-sm">
                  {country.alliances.length > 0 ? (
                    <div className="space-y-1">
                      {country.alliances.map(allianceId => {
                        const alliance = currentGame.alliances.find(a => a.id === allianceId);
                        return alliance ? (
                          <div key={allianceId} className="text-xs">
                            {alliance.name}
                          </div>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
                <td className={`px-4 py-3 text-sm ${getModifierColor(country.modifiers)}`}>
                  {getModifierText(country.modifiers)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-gray-750 border-t border-gray-700">
        <p className="text-sm text-gray-400">
          Showing {sortedAndFilteredCountries.length} of {currentGame.countries.length} nations
        </p>
      </div>
    </div>
  );
}
