import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';
import { Entry } from '../entries/entities/entry.entity';
import { Account } from '../accounts/entities/account.entity';
import { AccountsService } from '../accounts/accounts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Entry, Account])],
  controllers: [TransactionsController],
  providers: [TransactionsService, AccountsService],
})
export class TransactionsModule {}
