# Asian Battle Royale - Game Tracker

A comprehensive web application for tracking and managing the Asian Battle Royale simulation game. This app automates backend tracking, data management, and visualization while players use external tools like Age of Conflict for map simulation and wheel spinners for action selection.

## Features Implemented (Phase 1 - ~50%)

### ✅ Core Features
- **Profile System**: Create and manage multiple player profiles
- **Game State Management**: Track all 50 Asian countries with gold and status
- **Turn Execution Wizard**: Step-by-step turn input system
- **Battle Resolution**: Automatic gold calculations for all battle outcomes
- **Undo Functionality**: Undo the last turn if needed
- **Alliance Management**: Create, manage, and dissolve alliances
- **Real-time Dashboard**: Live statistics and power rankings
- **Countries Table**: Sortable, filterable table with all nation data
- **Turn History**: Complete log of all game actions
- **LocalStorage Persistence**: Auto-save every turn

### 🎮 Supported Actions
**Military Actions:**
- Direct Attack (Random, Weakest, Strongest, Neighbor)
- Nuclear Strike
- Guerrilla Insurgency
- Proxy War

**Economic Actions:**
- Economic Sanctions
- Steal Resources
- Economic Aid
- Sabotage Economy
- Trade Embargo

**Diplomatic Actions:**
- Form Military Alliance
- Break Alliance
- Peace Treaty
- Peaceful Unification (coming soon)

**Strategic Actions:**
- Military Buildup
- Fortify Borders
- Espionage Mission

### 📊 Battle Outcomes
- Decisive Victory
- Crushing Defeat
- Pyrrhic Victory
- Heroic Defense
- Stalemate
- White Peace
- Partial Conquest
- Failed Invasion
- Puppet State
- Resistance Victory

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## How to Play

1. **Create a Profile**: Start by creating a player profile
2. **Start New Game**: Configure starting gold (default: 100 per country)
3. **Execute Turns**:
   - Select acting country
   - Choose action
   - Select target (if required)
   - Choose battle outcome (if attacking)
   - Execute turn
4. **Track Progress**: View dashboard, power rankings, and history
5. **Manage Alliances**: Create alliances between countries
6. **Undo Mistakes**: Use the undo button to revert the last turn

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Build Tool**: Vite
- **Storage**: LocalStorage

## Project Structure

```
src/
├── components/          # React components
│   ├── AllianceManager.tsx
│   ├── CountriesTable.tsx
│   ├── Dashboard.tsx
│   ├── HistoryLog.tsx
│   ├── ProfileSelector.tsx
│   └── TurnExecutor.tsx
├── data/               # Game data
│   ├── actions.ts
│   └── countries.ts
├── store/              # State management
│   └── gameStore.ts
├── types/              # TypeScript types
│   └── index.ts
├── utils/              # Utility functions
│   ├── battleResolver.ts
│   └── goldCalculator.ts
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Coming Soon (Phase 2 - Next 50%)

- 🎨 Gold flow visualization charts
- 📈 Enhanced statistics and analytics
- 🎯 Neighbor detection improvements
- 🔄 Peaceful unification/merger system
- 📤 Export to Excel/CSV
- 🎲 Integrated wheel spinners
- 🎭 Multiple save game slots
- 🔄 Game replay mode
- 🏆 Achievement system
- ☁️ Cloud save functionality

## Game Rules

- All 50 Asian countries start with equal gold (customizable)
- Countries can attack, form alliances, perform economic actions, etc.
- Battle outcomes determine gold transfers and annexations
- Annexed countries are eliminated from the game
- Alliances can combine forces for defense
- Status modifiers (Weakened, Strengthened, Fortified) affect battles
- Game continues until one country/alliance dominates

## License

MIT License - Feel free to use and modify!

## Credits

Created for the Asian Battle Royale game simulation project.
