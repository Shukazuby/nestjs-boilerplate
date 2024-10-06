import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Transaction {
  @Prop({ ref: 'Users', required: true })
  customer: string;

  @Prop()
  trans_type: string;

  @Prop({ ref: 'Plan' })
  plan?: string;

  @Prop()
  plan_interval?: string;

  @Prop({ ref: 'Credit' })
  credit?: string;

  @Prop()
  status: string;

  @Prop()
  amount: number;

  @Prop()
  customer_code: string;

  @Prop()
  reference: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export type TransactionDocument = Transaction & Document;
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
