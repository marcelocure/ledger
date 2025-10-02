import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({
    description: 'Account name',
    example: 'Main Checking Account',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Account direction',
    enum: ['debit', 'credit'],
    example: 'debit',
  })
  @IsEnum(['debit', 'credit'])
  @IsNotEmpty()
  direction: 'debit' | 'credit';

  @ApiProperty({
    description: 'Initial account balance',
    example: 1000.50,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  balance?: number;
}
