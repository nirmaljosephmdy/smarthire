import { Module } from '@nestjs/common';
import { ResumeProcessor } from './resume.processor';

@Module({
  providers: [ResumeProcessor],
  exports: [ResumeProcessor]
})
export class QueueModule {}
