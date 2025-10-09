# 📂 Project Structure Guide

A visual guide to understanding your Crypto Personality Quiz codebase.

## 🌳 Directory Tree

```
mini-base-app-personality/
│
├── 📱 app/                          # Next.js App Directory
│   ├── 🎯 page.tsx                 # Main quiz component (300+ lines)
│   ├── 🎨 page.module.css          # Quiz styling (450+ lines)
│   ├── 📄 layout.tsx               # Root layout
│   ├── 🔧 rootProvider.tsx         # OnchainKit setup
│   ├── 🌐 globals.css              # Global styles
│   │
│   ├── 🔐 api/
│   │   └── auth/
│   │       └── route.ts            # Authentication endpoint
│   │
│   └── ✅ success/
│       ├── page.tsx                # Success page
│       └── page.module.css         # Success page styles
│
├── 📜 contracts/                    # Smart Contracts
│   └── CryptoPersonalityQuiz.sol   # Main contract (130+ lines)
│
├── 🛠️ lib/                          # Utilities & Hooks
│   ├── contractConfig.ts           # Contract ABI & config
│   └── useQuizContract.ts          # React hooks for contract
│
├── 🖼️ nft-metadata/                 # NFT Assets
│   ├── bitcoin.json                # Bitcoin personality metadata
│   ├── ethereum.json               # Ethereum personality metadata
│   ├── solana.json                 # Solana personality metadata
│   ├── dogecoin.json               # Dogecoin personality metadata
│   └── README.md                   # NFT creation guide
│
├── 🎨 public/                       # Static Assets
│   ├── nft-bitcoin.svg             # Bitcoin NFT placeholder
│   ├── nft-ethereum.svg            # Ethereum NFT placeholder
│   ├── nft-solana.svg              # Solana NFT placeholder
│   ├── nft-dogecoin.svg            # Dogecoin NFT placeholder
│   ├── hero.png                    # App hero image
│   ├── icon.png                    # App icon
│   └── ...                         # Other assets
│
├── 🚀 scripts/                      # Deployment Scripts
│   └── deploy.js                   # Contract deployment script
│
├── 📚 Documentation
│   ├── README.md                   # Main documentation
│   ├── QUICKSTART.md               # 5-minute setup guide
│   ├── DEPLOYMENT_GUIDE.md         # Deployment instructions
│   ├── PROJECT_SUMMARY.md          # Complete project overview
│   ├── FEATURES.md                 # Feature checklist
│   └── STRUCTURE.md                # This file!
│
├── ⚙️ Configuration Files
│   ├── package.json                # Dependencies
│   ├── tsconfig.json               # TypeScript config
│   ├── next.config.ts              # Next.js config
│   ├── minikit.config.ts           # MiniKit config
│   ├── eslint.config.mjs           # ESLint config
│   ├── hardhat.config.js           # Hardhat config
│   ├── .gitignore                  # Git ignore rules
│   └── env.example                 # Environment template
│
└── 📦 Generated (not in repo)
    ├── node_modules/               # Dependencies
    ├── .next/                      # Next.js build
    ├── artifacts/                  # Hardhat artifacts
    └── cache/                      # Hardhat cache
```

## 🎯 Key File Purposes

### Frontend Core

#### `app/page.tsx` - Main Quiz Component
**Size**: ~300 lines
**Purpose**: Core quiz logic and UI
**Key Features**:
- State management for quiz flow
- Question rendering
- Score calculation
- Results display
- Wallet integration

**Main Functions**:
```typescript
- handleStartQuiz()      // Start the quiz
- handleAnswer()         // Process user answer
- handleMintNFT()        // Mint NFT (when enabled)
- handleRestart()        // Restart quiz
```

#### `app/page.module.css` - Styling
**Size**: ~450 lines
**Purpose**: All quiz styling
**Key Sections**:
- Container & animations
- Welcome screen styles
- Quiz screen styles
- Result screen styles
- Responsive design

### Smart Contract

#### `contracts/CryptoPersonalityQuiz.sol`
**Size**: ~130 lines
**Purpose**: Onchain quiz results & NFT minting
**Key Functions**:
```solidity
- storeQuizResult()      // Save result onchain
- mintPersonalityNFT()   // Mint personality NFT
- getUserResults()       // Get all results
- getLatestResult()      // Get latest result
```

### Utilities

#### `lib/contractConfig.ts`
**Purpose**: Contract configuration
**Contains**:
- Contract address
- Contract ABI
- Personality enum mapping
- NFT metadata URIs

#### `lib/useQuizContract.ts`
**Purpose**: React hooks for contract interaction
**Hooks**:
```typescript
const {
  storeQuizResult,      // Store result
  mintPersonalityNFT,   // Mint NFT
  isPending,            // Transaction pending
  isConfirmed,          // Transaction confirmed
} = useQuizContract();
```

## 📊 File Statistics

### Code Files
- **TypeScript**: 5 files (~600 lines)
- **CSS**: 3 files (~500 lines)
- **Solidity**: 1 file (~130 lines)
- **JavaScript**: 2 files (~100 lines)
- **JSON**: 4 files (~200 lines)
- **SVG**: 4 files (~200 lines)

### Documentation
- **Markdown**: 6 files (~2,000 lines)
- **Total Documentation**: ~2,000 lines

### Total Project
- **All Files**: 25+ files
- **Total Lines**: ~3,700+ lines
- **Documentation Coverage**: ~54%

## 🔄 Data Flow

### Quiz Flow
```
1. User lands on Welcome Screen (page.tsx)
   └─> MiniKit auto-connects wallet
   └─> Display user info from context

2. User clicks "Start Quiz"
   └─> gameState = "quiz"
   └─> Load first question

3. User answers questions (1-5)
   └─> handleAnswer() called
   └─> Increment score for selected personality
   └─> Move to next question or results

4. Show Results
   └─> Calculate winning personality
   └─> Display result with breakdown
   └─> [Optional] Store result onchain

5. User mints NFT or retakes quiz
   └─> handleMintNFT() or handleRestart()
```

### Onchain Flow (When Enabled)
```
1. User completes quiz
   └─> Frontend calls storeQuizResult()
   └─> Contract stores result
   └─> Event emitted

2. User clicks "Mint NFT"
   └─> Frontend calls mintPersonalityNFT()
   └─> Contract mints ERC-721 NFT
   └─> Event emitted
   └─> NFT appears in wallet
```

## 🎨 Component Hierarchy

```
<RootProvider>                    # OnchainKit provider
  <SafeArea>                      # MiniKit safe area
    <Home>                        # Main component
      │
      ├─ {gameState === "welcome"}
      │   └─ <WelcomeScreen>
      │       ├─ Greeting
      │       ├─ Floating Icons
      │       ├─ Wallet Info
      │       └─ Start Button
      │
      ├─ {gameState === "quiz"}
      │   └─ <QuizScreen>
      │       ├─ Progress Bar
      │       ├─ Question Counter
      │       ├─ Question Text
      │       └─ Options (A/B/C/D)
      │
      └─ {gameState === "result"}
          └─ <ResultScreen>
              ├─ Personality Emoji
              ├─ Title & Description
              ├─ Score Breakdown
              └─ Action Buttons
```

## 🗂️ Configuration Files Explained

### `package.json`
**Purpose**: Project metadata and dependencies
**Key Dependencies**:
- Next.js 15.3.4
- React 19
- OnchainKit (latest)
- Wagmi 2.16.3
- Viem 2.31.6

### `tsconfig.json`
**Purpose**: TypeScript configuration
**Key Settings**:
- Strict mode enabled
- Path aliases configured
- React JSX transform

### `hardhat.config.js`
**Purpose**: Hardhat configuration for contract deployment
**Networks**:
- Base Sepolia (testnet)
- Base Mainnet
**Features**:
- Solidity 0.8.20
- Optimizer enabled
- Etherscan verification

### `minikit.config.ts`
**Purpose**: MiniKit manifest configuration
**Contains**:
- App name and description
- Hero image URL
- Button configuration
- Account association

## 📝 State Management

### React State (useState)
```typescript
const [gameState, setGameState]           // "welcome" | "quiz" | "result"
const [currentQuestion, setCurrentQuestion] // 0-4 (question index)
const [scores, setScores]                 // { Bitcoin, Ethereum, Solana, Dogecoin }
const [result, setResult]                 // Winning personality
const [selectedAnswer, setSelectedAnswer] // Currently selected answer index
const [isMintingNFT, setIsMintingNFT]    // NFT minting in progress
```

### MiniKit Context
```typescript
const { isFrameReady, setFrameReady, context } = useMiniKit();
// context.user.displayName - User's Farcaster name
// context.user.fid - Farcaster ID
```

### Wagmi Hooks
```typescript
const { address } = useAccount();  // Connected wallet address
```

## 🎯 Entry Points

### Development
```bash
npm run dev
# Entry: app/page.tsx
# URL: http://localhost:3000
```

### Production Build
```bash
npm run build
# Generates: .next/
# Entry: app/page.tsx (server-rendered)
```

### Contract Deployment
```bash
npx hardhat run scripts/deploy.js --network baseSepolia
# Entry: scripts/deploy.js
# Deploys: contracts/CryptoPersonalityQuiz.sol
```

## 🧩 Dependencies Graph

```
app/page.tsx
├── react (useState, useEffect)
├── @coinbase/onchainkit/minikit (useMiniKit)
├── wagmi (useAccount)
├── ./page.module.css (styles)
└── [when enabled] ../lib/useQuizContract

lib/useQuizContract.ts
├── wagmi (useAccount, useWriteContract, etc.)
└── ./contractConfig (CONTRACT_ADDRESS, ABI)

contracts/CryptoPersonalityQuiz.sol
├── @openzeppelin/contracts/token/ERC721/ERC721.sol
├── @openzeppelin/contracts/access/Ownable.sol
└── @openzeppelin/contracts/utils/Counters.sol
```

## 🎨 Styling Architecture

### CSS Modules Pattern
```
Component                      CSS Module
─────────────────────────────────────────
app/page.tsx         ──────>  app/page.module.css
app/success/page.tsx ──────>  app/success/page.module.css
```

### Global Styles
```
app/globals.css
├── Root variables
├── Reset styles
└── Base typography
```

### Style Organization
```css
/* page.module.css structure */
1. Container & Base
2. Animations (@keyframes)
3. Welcome Screen
4. Quiz Screen
5. Result Screen
6. Responsive (@media queries)
```

## 📦 Build Output

### Production Build Creates:
```
.next/
├── static/              # Static assets
├── server/              # Server components
├── cache/               # Build cache
└── standalone/          # Standalone server (if enabled)
```

### Build Statistics
```
Route                    Size        First Load JS
────────────────────────────────────────────────────
/ (main page)           3.92 kB     213 kB
/api/auth               136 B       102 kB
/success                1.42 kB     211 kB
```

## 🔍 Finding Things Quickly

### Need to change...

**Quiz questions?**
→ `app/page.tsx` (line ~13-80, `questions` array)

**Colors/styling?**
→ `app/page.module.css` (entire file)

**Personality descriptions?**
→ `app/page.tsx` (line ~82-97, `personalityResults`)

**Contract address?**
→ `lib/contractConfig.ts` (line 3)

**NFT metadata?**
→ `nft-metadata/*.json` files

**Environment variables?**
→ `env.example` → copy to `.env.local`

**Deployment settings?**
→ `hardhat.config.js` for contract
→ `vercel.json` for app (create if needed)

## 🚀 Quick Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint

# Contract (requires Hardhat)
npx hardhat compile                                    # Compile contract
npx hardhat run scripts/deploy.js --network baseSepolia # Deploy
npx hardhat verify --network baseSepolia <address>    # Verify

# Utilities
npm install              # Install dependencies
npm update               # Update dependencies
rm -rf .next node_modules && npm install              # Clean install
```

---

Now you know exactly where everything is! Happy coding! 🎉

