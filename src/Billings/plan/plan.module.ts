import { forwardRef, Module } from '@nestjs/common';
import {PlanService  } from './plan.service';
import { PlanController } from './plan.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Plan, PlanSchema } from 'src/Billings/plan/schema/plan.schema';
import { SubscriptionModule } from '../subscription/subscription.module';
import { Subscription } from 'rxjs';
import { SubscriptionSchema } from '../subscription/schema/subscription.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema}]),
    MongooseModule.forFeature([{ name: Subscription.name, schema: SubscriptionSchema }]),
    forwardRef(() => SubscriptionModule),

  ],
  controllers: [PlanController],
  providers: [PlanService],
  exports: [PlanService]
})
export class PlanModule {}
