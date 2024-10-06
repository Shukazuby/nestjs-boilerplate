import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { AppRole, DefaultPassportLink } from '../../utils/utils.constant';

@Schema()
export class Admin {
  @ApiProperty()
  @Prop({ ref: 'Users', required: true })
  userId: string

  @Prop({default: Date.now}) 
  createdAt: Date;

  @Prop({default: Date.now}) 
  updatedAt: Date;

}

export type AdminDocument = Admin & Document;
export const AdminSchema = SchemaFactory.createForClass(Admin);
