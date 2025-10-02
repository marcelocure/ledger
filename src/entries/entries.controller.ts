import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EntriesService } from './entries.service';
import { CreateEntryDto } from './dto/create-entry.dto';

@ApiTags('Entries')
@Controller('entries')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new entry' })
  @ApiResponse({ status: 201, description: 'Entry successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createEntryDto: CreateEntryDto) {
    return this.entriesService.create(createEntryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all entries' })
  @ApiResponse({ status: 200, description: 'List of entries' })
  findAll() {
    return this.entriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get entry by ID' })
  @ApiResponse({ status: 200, description: 'Entry found' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  findOne(@Param('id') id: string) {
    return this.entriesService.findOne(+id);
  }
}
