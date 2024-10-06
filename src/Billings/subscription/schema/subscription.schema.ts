import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Subscription {
  @Prop({ ref: 'Users', required: true })
  customer: string;

  @Prop()
  customer_email: string;

  @Prop()
  sub_id: string;

  @Prop({ ref: 'Plan', required: true })
  plan: string;

  @Prop()
  status: string;

  @Prop()
  start_date: Date;

  @Prop()
  end_date: Date;

  @Prop()
  access_code: string;

  @Prop()
  reference: string;

  @Prop()
  plan_interval: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export type SubscriptionDocument = Subscription & Document;
export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
