import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entry } from './entities/entry.entity';
import { CreateEntryDto } from './dto/create-entry.dto';

@Injectable()
export class EntriesService {
  constructor(
    @InjectRepository(Entry)
    private entriesRepository: Repository<Entry>,
  ) {}

  async create(createEntryDto: CreateEntryDto): Promise<Entry> {
    const entry = this.entriesRepository.create(createEntryDto);
    return this.entriesRepository.save(entry);
  }

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
