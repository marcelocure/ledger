import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

export class UpdateAccountDto {
  @ApiProperty({
    description: 'Account name',
    example: 'Updated Checking Account',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Account direction',
    enum: ['debit', 'credit'],
    example: 'debit',
    required: false,
  })
  @IsEnum(['debit', 'credit'])
  @IsOptional()
  direction?: 'debit' | 'credit';

  // Note: balance is intentionally excluded as it cannot be updated
}
