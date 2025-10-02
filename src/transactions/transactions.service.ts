import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { Entry } from '../entries/entities/entry.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateEntryDto } from '../entries/dto/create-entry.dto';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(Entry)
    private entriesRepository: Repository<Entry>,
    private accountsService: AccountsService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const { entries, ...transactionData } = createTransactionDto;
    
    this.validateCreditsAndDebitsValues(entries);
    
    const transaction = this.transactionsRepository.create(transactionData);
    const savedTransaction = await this.transactionsRepository.save(transaction);
    
    const entryEntities = entries.map(entryData => 
      this.entriesRepository.create({
        ...entryData,
        transactionId: savedTransaction.id,
      })
    );

    // TODO: use database transactions/rollback in case of failure and row locking
    // TODO: in case the debit exceeds the balance, the transaction should be rejected
    for (const entry of entryEntities) {
      const account = await this.accountsService.findOne(entry.accountId);
      
      let newBalance: number;
      if (account.direction === 'debit') {
        newBalance = entry.direction === 'debit' 
          ? account.balance + entry.value 
          : account.balance - entry.value;
      } else {
        newBalance = entry.direction === 'credit' 
          ? account.balance + entry.value 
          : account.balance - entry.value;
      }
      
      await this.accountsService.update(entry.accountId, newBalance);
    }
    
    //just save the entries after the accounts balances are updated
    savedTransaction.entries = await this.entriesRepository.save(entryEntities);
    
    return savedTransaction;
  }

  private validateCreditsAndDebitsValues(entries: CreateEntryDto[]) {
    const debitSum = entries
      .filter(entry => entry.direction === 'debit')
      .reduce((sum, entry) => sum + entry.value, 0);

    const creditSum = entries
      .filter(entry => entry.direction === 'credit')
      .reduce((sum, entry) => sum + entry.value, 0);

    if (Math.abs(debitSum - creditSum) > 0.01) { // Allow for small floating point differences
      throw new BadRequestException(
        `Transaction is not balanced. Debit total: ${debitSum.toFixed(2)}, Credit total: ${creditSum.toFixed(2)}. In double-entry bookkeeping, debits must equal credits.`
      );
    }
  }

  async findAll(): Promise<Transaction[]> {

    const queryBuilder = this.transactionsRepository.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.entries', 'entries');

    const transactions = await queryBuilder
      .orderBy('transaction.createdAt', 'DESC')
      .getMany();
    return transactions;
  }

  async findOne(id: number): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id },
      relations: ['entries'],
    });
    
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    
    return transaction;
  }
}
