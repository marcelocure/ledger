import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { TransactionsService } from '../src/transactions/transactions.service';
import { Transaction } from '../src/transactions/entities/transaction.entity';
import { Entry } from '../src/entries/entities/entry.entity';
import { CreateTransactionDto } from '../src/transactions/dto/create-transaction.dto';
import { CreateEntryDto } from '../src/entries/dto/create-entry.dto';
import { AccountsService } from '../src/accounts/accounts.service';
import { Account } from '../src/accounts/entities/account.entity';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionsRepository: Repository<Transaction>;
  let entriesRepository: Repository<Entry>;
  let accountsService: AccountsService;

  const mockAccount: Account = {
    id: 1,
    name: 'Cash Account',
    direction: 'debit',
    balance: 1000.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreditAccount: Account = {
    id: 2,
    name: 'Revenue Account',
    direction: 'credit',
    balance: 0.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTransaction: Transaction = {
    id: 1,
    description: 'Test Transaction',
    date: '2024-01-15',
    createdAt: new Date(),
    updatedAt: new Date(),
    entries: [],
  };

  const mockEntry: Entry = {
    id: 1,
    accountId: 1,
    direction: 'debit',
    value: 100.00,
    transactionId: 1,
    createdAt: new Date(),
    transaction: mockTransaction,
    account: mockAccount,
  };

  const mockCreateTransactionDto: CreateTransactionDto = {
    description: 'Test Transaction',
    date: '2024-01-15',
    entries: [
      {
        accountId: 1,
        direction: 'debit',
        value: 100.00,
      },
      {
        accountId: 2,
        direction: 'credit',
        value: 100.00,
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn(),
            })),
          },
        },
        {
          provide: getRepositoryToken(Entry),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: AccountsService,
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionsRepository = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
    entriesRepository = module.get<Repository<Entry>>(getRepositoryToken(Entry));
    accountsService = module.get<AccountsService>(AccountsService);
  });

  describe('create', () => {
    it('should create a transaction with balanced entries', async () => {
      const savedTransaction = { ...mockTransaction, id: 1 };
      const mockEntries = [
        { ...mockEntry, id: 1, accountId: 1, direction: 'debit', value: 100.00 },
        { ...mockEntry, id: 2, accountId: 2, direction: 'credit', value: 100.00 },
      ];

      jest.spyOn(transactionsRepository, 'create').mockReturnValue(mockTransaction as any);
      jest.spyOn(transactionsRepository, 'save').mockResolvedValue(savedTransaction as any);
      jest.spyOn(entriesRepository, 'create').mockReturnValue(mockEntries[0] as any);
      jest.spyOn(entriesRepository, 'create').mockReturnValueOnce(mockEntries[0] as any);
      jest.spyOn(entriesRepository, 'create').mockReturnValueOnce(mockEntries[1] as any);
      jest.spyOn(entriesRepository, 'save').mockResolvedValue(mockEntries as any);
      jest.spyOn(accountsService, 'findOne')
        .mockResolvedValueOnce(mockAccount)
        .mockResolvedValueOnce(mockCreditAccount);
      jest.spyOn(accountsService, 'update').mockResolvedValue(mockAccount);

      const result = await service.create(mockCreateTransactionDto);

      expect(transactionsRepository.create).toHaveBeenCalledWith({
        description: 'Test Transaction',
        date: '2024-01-15',
      });
      expect(transactionsRepository.save).toHaveBeenCalledWith(mockTransaction);
      expect(entriesRepository.create).toHaveBeenCalledTimes(2);
      expect(accountsService.findOne).toHaveBeenCalledTimes(2);
      expect(accountsService.update).toHaveBeenCalledTimes(2);
      expect(entriesRepository.save).toHaveBeenCalledWith(mockEntries);
      expect(result).toEqual(savedTransaction);
    });

    it('should throw BadRequestException when debits and credits are not balanced', async () => {
      const unbalancedDto: CreateTransactionDto = {
        description: 'Unbalanced Transaction',
        date: '2024-01-15',
        entries: [
          {
            accountId: 1,
            direction: 'debit',
            value: 100.00,
          },
          {
            accountId: 2,
            direction: 'credit',
            value: 50.00, // Unbalanced
          },
        ],
      };

      await expect(service.create(unbalancedDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(unbalancedDto)).rejects.toThrow(
        'Transaction is not balanced. Debit total: 100.00, Credit total: 50.00. In double-entry bookkeeping, debits must equal credits.'
      );
    });

    it('should allow small floating point differences in balance validation', async () => {
      const floatingPointDto: CreateTransactionDto = {
        description: 'Floating Point Transaction',
        date: '2024-01-15',
        entries: [
          {
            accountId: 1,
            direction: 'debit',
            value: 100.001,
          },
          {
            accountId: 2,
            direction: 'credit',
            value: 100.00,
          },
        ],
      };

      const savedTransaction = { ...mockTransaction, id: 1 };
      const mockEntries = [
        { ...mockEntry, id: 1, accountId: 1, direction: 'debit', value: 100.001 },
        { ...mockEntry, id: 2, accountId: 2, direction: 'credit', value: 100.00 },
      ];

      jest.spyOn(transactionsRepository, 'create').mockReturnValue(mockTransaction as any);
      jest.spyOn(transactionsRepository, 'save').mockResolvedValue(savedTransaction as any);
      jest.spyOn(entriesRepository, 'create').mockReturnValue(mockEntries[0] as any);
      jest.spyOn(entriesRepository, 'create').mockReturnValueOnce(mockEntries[0] as any);
      jest.spyOn(entriesRepository, 'create').mockReturnValueOnce(mockEntries[1] as any);
      jest.spyOn(entriesRepository, 'save').mockResolvedValue(mockEntries as any);
      jest.spyOn(accountsService, 'findOne')
        .mockResolvedValueOnce(mockAccount)
        .mockResolvedValueOnce(mockCreditAccount);
      jest.spyOn(accountsService, 'update').mockResolvedValue(mockAccount);

      const result = await service.create(floatingPointDto);

      expect(result).toEqual(savedTransaction);
    });

    it('should update account balances correctly for debit accounts', async () => {
      const savedTransaction = { ...mockTransaction, id: 1 };
      const mockEntries = [
        { ...mockEntry, id: 1, accountId: 1, direction: 'debit', value: 100.00 },
        { ...mockEntry, id: 2, accountId: 2, direction: 'credit', value: 100.00 },
      ];

      jest.spyOn(transactionsRepository, 'create').mockReturnValue(mockTransaction as any);
      jest.spyOn(transactionsRepository, 'save').mockResolvedValue(savedTransaction as any);
      jest.spyOn(entriesRepository, 'create').mockReturnValue(mockEntries[0] as any);
      jest.spyOn(entriesRepository, 'create').mockReturnValueOnce(mockEntries[0] as any);
      jest.spyOn(entriesRepository, 'create').mockReturnValueOnce(mockEntries[1] as any);
      jest.spyOn(entriesRepository, 'save').mockResolvedValue(mockEntries as any);
      jest.spyOn(accountsService, 'findOne')
        .mockResolvedValueOnce(mockAccount)
        .mockResolvedValueOnce(mockCreditAccount);
      jest.spyOn(accountsService, 'update').mockResolvedValue(mockAccount);

      await service.create({
        description: 'Balance Test',
        date: '2024-01-15',
        entries: [
          { accountId: 1, direction: 'debit', value: 100.00 },
          { accountId: 2, direction: 'credit', value: 100.00 },
        ],
      });

      // For debit account: debit increases balance
      expect(accountsService.update).toHaveBeenCalledWith(1, 1100.00); // 1000 + 100
      // For credit account: credit increases balance
      expect(accountsService.update).toHaveBeenCalledWith(2, 100.00); // 0 + 100
    });

    it('should update account balances correctly for credit accounts', async () => {
      const savedTransaction = { ...mockTransaction, id: 1 };
      const mockEntries = [
        { ...mockEntry, id: 1, accountId: 2, direction: 'credit', value: 100.00 },
        { ...mockEntry, id: 2, accountId: 1, direction: 'debit', value: 100.00 },
      ];

      jest.spyOn(transactionsRepository, 'create').mockReturnValue(mockTransaction as any);
      jest.spyOn(transactionsRepository, 'save').mockResolvedValue(savedTransaction as any);
      jest.spyOn(entriesRepository, 'create').mockReturnValue(mockEntries[0] as any);
      jest.spyOn(entriesRepository, 'create').mockReturnValueOnce(mockEntries[0] as any);
      jest.spyOn(entriesRepository, 'create').mockReturnValueOnce(mockEntries[1] as any);
      jest.spyOn(entriesRepository, 'save').mockResolvedValue(mockEntries as any);
      jest.spyOn(accountsService, 'findOne')
        .mockResolvedValueOnce(mockCreditAccount)
        .mockResolvedValueOnce(mockAccount);
      jest.spyOn(accountsService, 'update').mockResolvedValue(mockCreditAccount);

      await service.create({
        description: 'Credit Balance Test',
        date: '2024-01-15',
        entries: [
          { accountId: 2, direction: 'credit', value: 100.00 },
          { accountId: 1, direction: 'debit', value: 100.00 },
        ],
      });

      // For credit account: credit increases balance
      expect(accountsService.update).toHaveBeenCalledWith(2, 100.00); // 0 + 100
      // For debit account: debit increases balance
      expect(accountsService.update).toHaveBeenCalledWith(1, 1100.00); // 1000 + 100
    });
  });

  describe('validateCreditsAndDebitsValues', () => {
    it('should not throw when debits equal credits', () => {
      const balancedEntries: CreateEntryDto[] = [
        { accountId: 1, direction: 'debit', value: 100.00 },
        { accountId: 2, direction: 'credit', value: 100.00 },
      ];

      expect(() => service['validateCreditsAndDebitsValues'](balancedEntries)).not.toThrow();
    });

    it('should throw BadRequestException when debits do not equal credits', () => {
      const unbalancedEntries: CreateEntryDto[] = [
        { accountId: 1, direction: 'debit', value: 100.00 },
        { accountId: 2, direction: 'credit', value: 50.00 },
      ];

      expect(() => service['validateCreditsAndDebitsValues'](unbalancedEntries)).toThrow(BadRequestException);
    });

    it('should handle multiple debit and credit entries', () => {
      const multipleEntries: CreateEntryDto[] = [
        { accountId: 1, direction: 'debit', value: 50.00 },
        { accountId: 2, direction: 'debit', value: 25.00 },
        { accountId: 3, direction: 'credit', value: 75.00 },
      ];

      expect(() => service['validateCreditsAndDebitsValues'](multipleEntries)).not.toThrow();
    });

    it('should handle zero values', () => {
      const zeroEntries: CreateEntryDto[] = [
        { accountId: 1, direction: 'debit', value: 0.00 },
        { accountId: 2, direction: 'credit', value: 0.00 },
      ];

      expect(() => service['validateCreditsAndDebitsValues'](zeroEntries)).not.toThrow();
    });
  });
});
