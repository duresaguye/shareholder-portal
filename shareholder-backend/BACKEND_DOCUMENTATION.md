

## Core Principles
- Ownership always sums to 100% (recalculated after every change)
- Vote weight = ownership % at time of voting (stored with the vote)
- Share value = weighted avg price from actual purchases (ShareholderShare)
- All share operations run in DB transactions

## Key Calculations (with examples)

### 1) New shareholder (dilution)
Formula: `newOwnership = currentShares / (currentTotal + newShares) * 100`
Example: Current totals 100k shares; add 10k shares
- Before: A 40k (40%), B 35k (35%), C 25k (25%)
- After: A 40k → 36.36%, B 35k → 31.82%, C 25k → 22.73%, New 10k → 9.09%
- Creates Shareholder + ShareholderShare (tracks amount, price, class, date)

### 2) Share transfer (no new shares)
Formula: `newOwnership = newShares / totalShares * 100` (total unchanged)
Example: Total 100k shares; transfer 5k from A to C
- Before: A 40k (40%), B 35k (35%), C 25k (25%)
- After: A 35k (35%), B 35k (35%), C 30k (30%)
- Updates both holders and adds ShareholderShare for the recipient with price

### 3) Voting (weighted)
Weights: voteWeight = ownership% at vote time
Approval check: `yesPercentage = (yesWeight / totalOwnership) * 100`
Example: Threshold 75%, total ownership 100%
- Votes: A 40% YES, B 35% YES, C 25% NO
- yesWeight = 75 → yesPercentage = 75% ⇒ approved
- Non-voters count as 0 weight toward the numerator but totalOwnership remains 100

### 4) Share value (per shareholder)
Formula: `shareValue = Σ(price * amount) / Σ(amount)` from ShareholderShare
Example purchases: 10k @ $100, 5k @ $120, 3k @ $110 → shareValue ≈ $107.22
Portfolio value: `totalShares * shareValue`

## Flow (high level)
1) Proposal created (new shareholder or transfer)  
2) Shareholders vote (weighted by ownership)  
3) If threshold met, proposal executes in a transaction  
4) Shares/ownership recalculated and ShareholderShare records written  
5) Share value and portfolio values derive from recorded purchases  

## Tech Stack
- Node.js, Express, Prisma, PostgreSQL
