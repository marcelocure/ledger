import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entry } from './entities/entry.entity';

@Injectable()
export class EntriesService {
  constructor(
    @InjectRepository(Entry)
    private entriesRepository: Repository<Entry>,
  ) {}

  async findAll(): Promise<Entry[]> {
    return this.entriesRepository.find({});
  }

  async findOne(id: number): Promise<Entry> {
    const entry = await this.entriesRepository.findOne({
      where: { id },
      relations: ['account', 'transaction'],
    });
    
    if (!entry) {
      throw new NotFoundException(`Entry with ID ${id} not found`);
    }
    
    return entry;
  }
}
