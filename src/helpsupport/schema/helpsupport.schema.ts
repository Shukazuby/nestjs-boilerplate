import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class helpsupport {
  @ApiProperty()
  @Prop()
  question: string

  @Prop()
  answer: string

  @Prop({ ref: 'Users', required: true })
  createdBy: string

  @Prop({default: Date.now}) 
  createdAt: Date;

  @Prop({default: Date.now}) 
  updatedAt: Date;

}

export type helpsupportDocument = helpsupport & Document;
export const helpsupportSchema = SchemaFactory.createForClass(helpsupport);

