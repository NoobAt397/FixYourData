# Asian Battle Royale - Game Tracker

A comprehensive web application for tracking and managing the Asian Battle Royale simulation game. This app automates backend tracking, data management, and visualization while players use external tools like Age of Conflict for map simulation.

## ✨ Features Implemented (100% Complete!)

### 🎮 Core Gameplay Features
- **Profile System**: Create and manage multiple player profiles with game tracking
- **Game State Management**: Track all 50 Asian countries with gold, status, and territories
- **Turn Execution Wizard**: Step-by-step turn input with smart target filtering
- **Battle Resolution**: Automatic gold calculations for all 10 battle outcomes
- **Undo Functionality**: Revert the last turn with confirmation dialog
- **Alliance Management**: Create, manage, and dissolve alliances with member tracking
- **Peaceful Unification**: Merge two nations into one unified country
- **Real-time Dashboard**: Live statistics, power rankings, and survival tracker
- **Countries Table**: Sortable, filterable table with status indicators
- **Turn History**: Complete log of all actions with gold changes
- **LocalStorage Persistence**: Auto-save every turn

### 📊 Statistics & Analytics
- **Enhanced Statistics Panel**:
  - Total/Average/Max/Min gold tracking
  - Territory statistics
  - Most aggressive nation tracker
  - Original survivor count
  - Elimination rate per turn
  - Game pace metrics

- **Gold Flow Visualization**:
  - Top 5 gold gainers with progress bars
  - Top 5 gold losers with progress bars
  - Visual flow analysis across all turns

- **Recent Eliminations Tracker**:
  - Last 5 eliminations with timestamps
  - Eliminator and eliminated country details
  - Battle outcome information

- **Quick Actions Sidebar**:
  - Active/Eliminated/Total Gold stats
  - Integrated random selectors

### 🎲 Interactive Features
- **Integrated Wheel Spinners**:
  - Country wheel for random selection
  - Action wheel for random action selection
  - Animated spinning effects
  - Modal overlays

- **Save/Load System**:
  - Multiple game save slots
  - Timestamp tracking
  - Quick load interface
  - Delete unwanted saves

- **Export Functionality**:
  - Turn History → CSV
  - Countries Data → CSV
  - Game Summary → Text Report
  - Full Game State → JSON

### 🎨 UI/UX Enhancements
- **Modern Glass-morphism Design**:
  - Gradient backgrounds
  - Glowing borders with color-matching shadows
  - Rounded-2xl corners throughout
  - Smooth transitions and animations
  - Hover effects with scale transformations

- **Tab-Based Navigation**:
  - 🎯 Game Play Tab: Turn execution, history, alliances
  - 📊 Statistics Tab: Analytics, gold flow, enhanced stats
  - ⚙️ Management Tab: Save/Load, exports, mergers

- **Color-Coded Components**:
  - Blue/Purple: Turn execution & main actions
  - Orange: History & timeline
  - Green: Countries & nations
  - Cyan: Alliances
  - Yellow: Mergers & unifications
  - Red: Eliminations

### 🎮 Supported Actions (19 Total)

**Military Actions (7):**
- Direct Attack (Random/Weakest/Strongest/Neighbor)
- Nuclear Strike (auto-win, costs 30% gold)
- Guerrilla Insurgency
- Proxy War

**Economic Actions (5):**
- Economic Sanctions (-20% target gold)
- Steal Resources (-30% target gold)
- Economic Aid (give 40% gold)
- Sabotage Economy (-25% target gold)
- Trade Embargo (-15% target gold)

**Diplomatic Actions (4):**
- Form Military Alliance
- Break Alliance
- Peace Treaty
- Peaceful Unification (merge nations)

**Strategic Actions (3):**
- Military Buildup (+2 Strengthened)
- Fortify Borders (+1 Fortified)
- Espionage Mission (steal 10% gold)

### ⚔️ Battle Outcomes (10 Total)
1. **Decisive Victory** - Defender annexed
2. **Crushing Defeat** - Attacker annexed
3. **Pyrrhic Victory** - Attacker wins, loses 40% gold
4. **Heroic Defense** - Defender steals 50% gold
5. **Stalemate** - Both lose 25% gold
6. **White Peace** - No changes
7. **Partial Conquest** - Defender -50% territory, weakened
8. **Failed Invasion** - Attacker -50% gold
9. **Puppet State** - Alliance formed
10. **Resistance Victory** - Defender annexes attacker

## 🚀 Getting Started

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

### Preview Production Build
```bash
npm run preview
```

## 🎯 How to Play

### 1. Setup
- **Create Profile**: Enter your name to create a game profile
- **Start Game**: Click "Start New Game" and optionally customize starting gold

### 2. Execute Turns
- **Step 1**: Select acting country from active nations
- **Step 2**: Choose action (19 options across 4 categories)
- **Step 3**: Select target (auto-filtered by action type)
- **Step 4**: Choose battle outcome (for attacks)
- **Preview**: Review changes before executing
- **Execute**: Confirm to apply changes

### 3. Manage Game
- **View Stats**: Check dashboard, power rankings, gold flow
- **Create Alliances**: Form military pacts between nations
- **Merge Nations**: Peacefully unify countries
- **Undo Mistakes**: Revert last turn if needed
- **Save Progress**: Multiple save slots available
- **Export Data**: CSV, JSON, or summary reports

### 4. Track Progress
- Monitor active/eliminated nations
- View recent eliminations
- Check gold flow analysis
- Analyze advanced statistics

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: TailwindCSS (with custom gradients & shadows)
- **State Management**: Zustand
- **Build Tool**: Vite
- **Storage**: LocalStorage
- **Type Safety**: Full TypeScript coverage

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AllianceManager.tsx      # Alliance CRUD
│   ├── CountriesTable.tsx       # Sortable nations table
│   ├── Dashboard.tsx            # Main stats dashboard
│   ├── EnhancedStats.tsx        # Advanced analytics
│   ├── ExportPanel.tsx          # Data export tools
│   ├── GoldFlowChart.tsx        # Gold visualization
│   ├── HistoryLog.tsx           # Turn history + undo
│   ├── MergerPanel.tsx          # Nation unification
│   ├── ProfileSelector.tsx      # Profile management
│   ├── QuickActions.tsx         # Quick stats sidebar
│   ├── RecentEliminations.tsx   # Elimination tracker
│   ├── SaveLoadPanel.tsx        # Save/load system
│   ├── TurnExecutor.tsx         # Turn input wizard
│   └── WheelSpinner.tsx         # Random selectors
├── data/               # Game data
│   ├── actions.ts               # Action definitions
│   └── countries.ts             # 50 countries + neighbors
├── store/              # State management
│   └── gameStore.ts             # Zustand store
├── types/              # TypeScript types
│   └── index.ts                 # All type definitions
├── utils/              # Utility functions
│   ├── battleResolver.ts        # Battle logic
│   ├── goldCalculator.ts        # Gold calculations
│   └── exportData.ts            # Export utilities
├── App.tsx             # Main app with tabs
├── main.tsx            # Entry point
└── index.css           # Global styles + animations
```

## 🎨 UI Design Philosophy

- **Gradients**: Subtle color transitions for depth
- **Glows**: Shadow effects matching border colors
- **Curves**: Rounded-2xl corners for modern feel
- **Animations**: Smooth transitions on all interactions
- **Color Coding**: Each component type has unique colors
- **Responsive**: Works on desktop, tablet, and mobile

## 📊 What Gets Tracked

### Per Country:
- Gold amount
- Status (Active/Annexed/Merged)
- Territory size
- Alliance memberships
- Status modifiers
- Original vs merged entity

### Per Turn:
- Acting country
- Action performed
- Target country
- Battle outcome
- Gold changes
- Timestamp
- Custom notes

### Game-Wide:
- Total turns/years
- Active nations count
- Eliminated nations
- Total gold in play
- Alliance formations
- Elimination rate
- Game pace

## 🎯 Key Features

### Smart Target Filtering
- **Attack Weakest**: Auto-shows 3 weakest countries
- **Attack Strongest**: Auto-shows 3 strongest countries
- **Attack Neighbor**: Only shows bordering nations
- **Random/Any**: Shows all active countries

### Auto-Calculations
- Gold transfers for all actions
- Territory annexations
- Alliance formations
- Status modifier applications
- Battle outcome effects

### Data Exports
- **Turn History CSV**: Full action log
- **Countries CSV**: Current nation stats
- **Summary Report**: Text overview
- **JSON State**: Complete game backup

## 🏆 Game Highlights

- **50 Asian Countries**: All with neighbor detection
- **19 Actions**: Across 4 categories
- **10 Battle Outcomes**: Diverse results
- **Unlimited Turns**: Play as long as you want
- **Multiple Profiles**: Track different games
- **Save Slots**: Keep multiple game states
- **Undo Support**: Fix mistakes instantly

## 📝 Game Rules

- All 50 Asian countries start with equal gold (customizable)
- Countries can attack, form alliances, perform economic actions, etc.
- Battle outcomes determine gold transfers and annexations
- Annexed countries are eliminated from the game
- Alliances can combine forces for defense
- Status modifiers (Weakened, Strengthened, Fortified) affect battles
- Merged nations combine gold and territory
- Game continues until one country/alliance dominates

## 🔮 Future Enhancements

While the app is feature-complete, potential additions could include:
- Cloud save synchronization
- Multiplayer mode (multiple players input turns)
- AI opponent mode
- Achievement system
- Game replay/timeline viewer
- Battle probability calculator
- Map integration
- Tournament brackets

## 📜 License

MIT License - Feel free to use and modify!

## 💎 Credits

Created for the Asian Battle Royale game simulation project.

Built with React, TypeScript, TailwindCSS, and Zustand.

---

**Status**: ✅ Production Ready | 🎮 100% Playable | 📊 Fully Featured
