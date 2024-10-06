import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Plan {
  @Prop()
  name: string;

 @Prop()
  amount: number;

 @Prop()
 interval: string;

 @Prop()
 plan_code: string

  @Prop({default: Date.now}) 
  createdAt: Date;

  @Prop({default: Date.now}) 
  updatedAt: Date;

}

export type PlanDocument = Plan & Document;
export const PlanSchema = SchemaFactory.createForClass(Plan);
