import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApplicationModule } from './application/application.module';
import { PrismaModule } from './prisma/prisma.module';
import { QueueModule } from './queue/queue.module';
import { SearchModule } from './search/search.module';
import { CandidateModule } from './candidate/candidate.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ApplicationModule,
    QueueModule,
    SearchModule,
    CandidateModule,
    AuthModule,
    AdminModule
  ],
})
export class AppModule {}
