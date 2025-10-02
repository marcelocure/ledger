import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EntriesService } from './entries.service';

@ApiTags('Entries')
@Controller('entries')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

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
