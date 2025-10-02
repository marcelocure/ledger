import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEntryDto } from '../../entries/dto/create-entry.dto';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Transaction description',
    example: 'Transfer from checking to savings',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Transaction date',
    example: '2024-01-15',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'Transaction entries',
    type: [CreateEntryDto],
    example: [
      { accountId: 1, direction: 'credit', value: 100.50 },
      { accountId: 2, direction: 'debit', value: 100.50 }
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEntryDto)
  entries: CreateEntryDto[];
}
