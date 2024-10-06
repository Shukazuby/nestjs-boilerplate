import { forwardRef, Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscription, SubscriptionSchema } from './schema/subscription.schema';
import { Users, UsersSchema } from 'src/users/schema/users.schema';
import { UsersModule } from 'src/users/users.module';
import { Plan, PlanSchema } from '../plan/schema/plan.schema';
import { PlanModule } from '../plan/plan.module';
import { Transaction, TransactionSchema } from '../transaction/schema/transaction.schema';
import { TransactionModule } from '../transaction/transaction.module';
import { Credit, CreditSchema } from '../credit/schema/credit.schema';
import { CreditModule } from '../credit/credit.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Subscription.name, schema: SubscriptionSchema}]),
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema }]),
    forwardRef(() => PlanModule),
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
    forwardRef(() => TransactionModule),
    MongooseModule.forFeature([{ name: Credit.name, schema: CreditSchema }]),
    forwardRef(() => CreditModule),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService]

})
export class SubscriptionModule {}
