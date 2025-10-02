# Ledger Management API

Adouble-entry bookkeeping API which provides endpoints for managing accounts, transactions, and entries with automatic balance tracking and validation.

## Features

- **Account Management**: Create and manage accounts with debit/credit directions.
- **Transaction Management**: Create transactions with multiple debit and credit entries
- **Entry Management**: Individual debit and credit entries linked to accounts, created within transactions
- **Double-Entry Validation**: Ensures debits equal credits for each transaction
- **Automatic Balance Tracking**: Account balances are automatically updated when transactions are created
- **Immutable Entries**: Once created, entries cannot be modified
- **SQLite Database**: Lightweight, file-based database for easy setup
- **Swagger Documentation**: Interactive API documentation at `/api/docs`

## Prerequisites

- Node.js v18.19.0

## Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:marcelocure/ledger.git
   cd ledger
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Edit `.env` file with your preferred settings:
   ```env
   NODE_ENV=development
   PORT=3000
   DB_PATH=database.sqlite
   ```

## Running the Application

1. **Development Mode**
   ```bash
   npm run start:dev
   ```

2. **Production Build**
   ```bash
   npm run build
   npm run start:prod
   ```

3. **Access the Application**
   - API: http://localhost:3000
   - Swagger Documentation: http://localhost:3000/api/docs
   - Health Check: http://localhost:3000/health

## API Endpoints

### Accounts
- `GET /accounts` - Get all accounts
- `GET /accounts/:id` - Get account by ID
- `POST /accounts` - Create new account

### Transactions
- `GET /transactions` - Get all transactions
- `GET /transactions/:id` - Get transaction by ID
- `POST /transactions` - Create new transaction

### Entries
- `GET /entries` - Get all entries
- `GET /entries/:id` - Get entry by ID

## Key Features Explained

### Double-Entry Bookkeeping
Every transaction must have balanced debits and credits. The system validates that the sum of all debit entries equals the sum of all credit entries.

### Automatic Balance Updates
When a transaction is created, the system automatically updates the account balances based on:
- **Debit Accounts**: Debit entries increase balance, credit entries decrease balance
- **Credit Accounts**: Credit entries increase balance, debit entries decrease balance

### Immutable Entries
Once created, entries cannot be modified to maintain data integrity and audit trails.

## Development

### Available Scripts
- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:prod` - Start in production mode
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Database
The application uses SQLite with TypeORM. The database file (`database.sqlite`) is created automatically on first run. In development mode, the database schema is synchronized automatically.

I was choosen to use sqlite because it's easier for this purpose and there's basically no setup at all

A production ready application should never use sqlite

### TODOS and notes
* use database transactions/rollback in case of failure when saving a transaction
* row locking when updating balance to deal with concurrency
* in case the debit exceeds the balance, the transaction should be rejected
* implement more tests, but the main logic is covered
* implement authentication/authorization
* dockerize
* Transaction has a updatedAt because we may have transaction status somehow in the future and probably other kind of updates
