import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsEnum, Min } from 'class-validator';

export class CreateEntryDto {
  @ApiProperty({
    description: 'Account ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  accountId: number;

  @ApiProperty({
    description: 'Entry direction',
    enum: ['debit', 'credit'],
    example: 'debit',
  })
  @IsEnum(['debit', 'credit'])
  @IsNotEmpty()
  direction: 'debit' | 'credit';

  @ApiProperty({
    description: 'Entry value',
    example: 100.50,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  value: number;
}
