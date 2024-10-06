import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Credit {
  @Prop({default: 'AppName Credit'})
  name: string;

  @Prop({default: 0})
  credit: number;

  @Prop({default: 0})
  amount: number;

  @Prop({default: 0})
  previous_amount: number;

  @Prop({default: false})
  popular: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export type CreditDocument = Credit & Document;
export const CreditSchema = SchemaFactory.createForClass(Credit);
