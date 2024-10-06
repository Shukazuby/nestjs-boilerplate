import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Employee {
  @ApiProperty()
  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop()
  email?: string;

  @Prop()
  password: string;
  
  @Prop()
  profile?: string;
  
  @Prop()
  gender?: string;
  
  @Prop()
  permissions?: string[];
  
  @Prop({ ref: 'Users' })
  added_by?: string;

  @Prop({ ref: 'Users' })
  userId: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export type EmployeeDocument = Employee & Document;
export const EmployeeSchema = SchemaFactory.createForClass(Employee);
