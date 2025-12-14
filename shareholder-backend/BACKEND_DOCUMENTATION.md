
This backend powers the Shareholder Portal, handling shareholder management, share allocation, voting, and proposal execution. All calculations are fully data-driven and based on real database records to ensure accuracy and consistency.

## Features

* Shareholder management with ownership tracking
* Share dilution and share transfer support
* Weighted voting based on ownership percentage
* Proposal system for ownership-related actions
* Historical share price tracking and portfolio value calculation
* Fully transactional operations to prevent data inconsistency

## Core Principles

* No hardcoded values — everything is calculated from stored data
* Ownership percentages always sum to 100%
* Vote weight is based on ownership at the time of voting
* Share value is calculated from actual purchase history
* All share operations run inside database transactions

## How It Works (High Level)

1. A proposal is created (new shareholder, dilution, or share transfer)
2. Shareholders vote with weight based on their ownership
3. If the required threshold is met, the proposal is executed automatically
4. Shares, ownership, and history records are updated atomically

## Tech Stack

* Node.js
* Express
* Prisma
* PostgreSQL

## Notes

* Non-voters still count toward total ownership when determining approval
* Ownership and share values are always recalculated after changes
* The system keeps a full audit trail of share purchases and transfers

