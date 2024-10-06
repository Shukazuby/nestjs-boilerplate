import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import * as dotenv from 'dotenv';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TokensModule } from './tokens/tokens.module';
import { HelpsupportModule } from './helpsupport/helpsupport.module';
import { PlanModule } from './Billings/plan/plan.module';
import { SubscriptionModule } from './Billings/subscription/subscription.module';
import { CreditModule } from './Billings/credit/credit.module';
import { TransactionModule } from './Billings/transaction/transaction.module';
import { AdminModule } from './admin/admin.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ChatsandnotificationsModule } from './chatsandnotifications/chatsandnotifications.module';


@Module({
  imports: [
    MulterModule.register({ dest: './uploads' }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({ ttl: 60, limit: 40 }),
    MongooseModule.forRoot(String(process.env.MONGODB_URL)),
    EventEmitterModule.forRoot(),
    UsersModule,
    AuthModule,
    TokensModule,
    HelpsupportModule,
    PlanModule,
    SubscriptionModule,
    CreditModule,
    TransactionModule,
    AdminModule,
    ChatsandnotificationsModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
