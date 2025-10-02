# Ledger Management API

A comprehensive double-entry bookkeeping system built with NestJS. This API provides endpoints for managing accounts, transactions, and entries with automatic balance tracking and validation.

## Features

- **Account Management**: Create and manage accounts with debit/credit directions
- **Transaction Management**: Create transactions with multiple debit and credit entries
- **Entry Management**: Individual debit and credit entries linked to accounts
- **Double-Entry Validation**: Ensures debits equal credits for each transaction
- **Automatic Balance Tracking**: Account balances are automatically updated when transactions are created
- **Immutable Entries**: Once created, entries cannot be modified
- **SQLite Database**: Lightweight, file-based database for easy setup
- **Swagger Documentation**: Interactive API documentation at `/api/docs`

## Prerequisites

- Node.js v18.19.0 (use `nvm use 18.19.0` to activate)
- npm (comes with Node.js)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
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

## Data Models

### Account
```typescript
{
  id: number;
  name: string;
  direction: 'debit' | 'credit';
  balance: number; // Read-only, automatically calculated
  createdAt: Date;
  updatedAt: Date;
}
```

### Transaction
```typescript
{
  id: number;
  description: string;
  date: Date;
  entries: Entry[]; // Array of debit and credit entries
  createdAt: Date;
  updatedAt: Date;
}
```

### Entry
```typescript
{
  id: number;
  accountId: number;
  direction: 'debit' | 'credit';
  value: number;
  transactionId: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Example Usage

### Creating an Account
```bash
curl -X POST http://localhost:3000/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cash Account",
    "direction": "debit",
    "balance": 1000.00
  }'
```

### Creating a Transaction
```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Purchase inventory",
    "date": "2024-01-15",
    "entries": [
      {
        "accountId": 1,
        "direction": "debit",
        "value": 500.00
      },
      {
        "accountId": 2,
        "direction": "credit",
        "value": 500.00
      }
    ]
  }'
```

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

This project is licensed under the MIT License.