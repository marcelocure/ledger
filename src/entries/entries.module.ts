import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntriesController } from './entries.controller';
import { EntriesService } from './entries.service';
import { Entry } from './entities/entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Entry])],
  controllers: [EntriesController],
  providers: [EntriesService],
  exports: [EntriesService],
})
export class EntriesModule {}
