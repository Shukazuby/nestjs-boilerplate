import { forwardRef, Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { Transaction, TransactionSchema } from './schema/transaction.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from 'src/users/schema/users.schema';
import { UsersModule } from 'src/users/users.module';
import { PlanModule } from '../plan/plan.module';
import { CreditModule } from '../credit/credit.module';
import { Credit, CreditSchema } from '../credit/schema/credit.schema';
import { Plan, PlanSchema } from '../plan/schema/plan.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema}]),
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema }]),
    forwardRef(() => PlanModule),
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
    forwardRef(() => TransactionModule),
    MongooseModule.forFeature([{ name: Credit.name, schema: CreditSchema }]),
    forwardRef(() => CreditModule),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService]

})
export class TransactionModule {}
