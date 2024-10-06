import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { AppRole, DefaultPassportLink } from '../../utils/utils.constant';

@Schema()
export class Auth {
  @ApiProperty()
  @Prop()
  phoneNumber: string;

  @Prop()
  password: string;

  @Prop() 
  email: string;

  @ApiProperty()
  @Prop({ default: AppRole.USER })
  role: AppRole;

  @Prop({default: Date.now}) 
  createdAt: Date;

  @Prop({default: Date.now}) 
  updatedAt: Date;

}

export type AuthDocument = Auth & Document;
export const AuthSchema = SchemaFactory.createForClass(Auth);
