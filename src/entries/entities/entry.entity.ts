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

  // Relationships
  @ManyToOne('Transaction', 'entries')
  @JoinColumn({ name: 'transactionId' })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transaction: any; // Using 'any' to avoid circular dependency

  @ManyToOne('Account')
  @JoinColumn({ name: 'accountId' })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  account: any; // Using 'any' to avoid circular dependency
}
