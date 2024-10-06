import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Notifications {
  @Prop()
  userid: string;


  @Prop({
    type: {
      // NotificationTitle: String,
      // Username: String,
      ImageUrl: String,
      message: String,
    },
  })
  content: {
    // NotificationTitle: string;
    // Username: string;
    CvUrl: string;
    message: string;
  };

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ default: false })
  isRead: boolean;
}

export type NotificationsDocument = Notifications & Document;
export const NotificationsSchema = SchemaFactory.createForClass(Notifications);
