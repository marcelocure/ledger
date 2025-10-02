import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('entries')
export class Entry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accountId: number;

  @Column({ type: 'text' })
  direction: 'debit' | 'credit';

  @Column({ type: 'real' })
  value: number;

  @Column({ nullable: true })
  transactionId: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relationships
  @ManyToOne('Transaction', 'entries')
  @JoinColumn({ name: 'transactionId' })
  transaction: any;

  @ManyToOne('Account')
  @JoinColumn({ name: 'accountId' })
  account: any;
}
