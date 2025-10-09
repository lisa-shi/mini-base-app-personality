# 🏆 Global Personality Rankings Leaderboard

## Overview

The leaderboard feature tracks and displays how many people got each crypto personality type, creating a global ranking system that adds social engagement to your quiz app.

## How It Works

### Smart Contract Updates

The smart contract now includes:

1. **Personality Counters** - Automatically increments when someone completes the quiz
2. **Total Quiz Completions** - Tracks the overall number of quiz takers
3. **Leaderboard Functions**:
   - `getLeaderboardData()` - Returns counts for all personality types plus total
   - `getAllPersonalityCounts()` - Returns an array of counts
   - `personalityCount` - Public mapping to query individual counts

### Frontend Implementation

1. **`useLeaderboard` Hook** (`lib/useLeaderboard.ts`)
   - Fetches data from the smart contract
   - Calculates percentages automatically
   - Updates in real-time

2. **Leaderboard UI Component**
   - Shows all 4 personality types with avatars
   - Displays count and percentage for each
   - Highlights the user's personality with a "YOU" badge
   - Animated progress bars with gradient colors
   - Fully responsive design

## Features

✨ **Real-time Rankings** - Updates automatically from blockchain  
🎯 **Personal Highlight** - Shows which personality type is yours  
📊 **Visual Progress Bars** - Color-coded by personality gradient  
📱 **Mobile Responsive** - Looks great on all screen sizes  
🎨 **Beautiful Design** - Matches your app's aesthetic  

## What Users See

On the results page, users will now see:

```
🏆 Global Personality Rankings
X people have taken the quiz

[Bitcoin]    ████████████░░░░░░░░  60%  (150 people)
[Ethereum]   ██████░░░░░░░░░░░░░░  25%  (62 people)
[Solana]     ████░░░░░░░░░░░░░░░░  10%  (25 people)
[Dogecoin]   ██░░░░░░░░░░░░░░░░░░   5%  (13 people)
```

The user's personality will be highlighted with a special border and "YOU" badge.

## Next Steps

### When You Redeploy the Smart Contract

1. **Compile the updated contract**:
   ```bash
   cd /Users/kaitlynwang/mini-base-app-personality
   npx hardhat compile
   ```

2. **Deploy to Base Sepolia**:
   ```bash
   npx hardhat run scripts/deploy.js --network baseSepolia
   ```

3. **Update the contract address**:
   - Copy the new contract address
   - Update `CONTRACT_ADDRESS` in `lib/contractConfig.ts`

4. **Push to production**:
   ```bash
   git add lib/contractConfig.ts
   git commit -m "Update contract address with leaderboard features"
   git push origin main
   ```

### Testing Locally

The leaderboard will automatically appear when:
- The contract is deployed
- At least one person has completed the quiz
- The `totalQuizCompletions` is greater than 0

If no data is available, the leaderboard simply won't display (graceful degradation).

## Gas Efficiency

The implementation is gas-efficient because:
- Counters are updated in the same transaction as quiz completion
- Reading data uses `view` functions (no gas cost for users)
- No loops or expensive operations

## Future Enhancements

Potential additions:
- 🏅 Top 10 users with most quiz completions
- 📈 Historical trends over time
- 🎯 Personality type of the month
- 🌍 Rankings by region/country
- 🏆 Achievement badges for rare personalities

## Technical Details

### Contract Changes

```solidity
// New storage variables
mapping(Personality => uint256) public personalityCount;
uint256 public totalQuizCompletions;

// Updated storeQuizResult function
personalityCount[personality]++;
totalQuizCompletions++;

// New view function
function getLeaderboardData() external view returns (
    uint256 bitcoinCount,
    uint256 ethereumCount,
    uint256 solanaCount,
    uint256 dogecoinCount,
    uint256 total
)
```

### Frontend Hook

```typescript
const { leaderboardData, isLoading, refetch } = useLeaderboard();

// Returns:
{
  Bitcoin: { count: 150, percentage: 60 },
  Ethereum: { count: 62, percentage: 25 },
  Solana: { count: 25, percentage: 10 },
  Dogecoin: { count: 13, percentage: 5 },
  total: 250
}
```

## Questions?

Check the code in:
- `contracts/CryptoPersonalityQuiz.sol` - Smart contract
- `lib/useLeaderboard.ts` - React hook
- `lib/contractConfig.ts` - ABI and config
- `app/page.tsx` - UI implementation
- `app/page.module.css` - Styles

The feature is fully implemented and ready to use once you redeploy the contract! 🚀

