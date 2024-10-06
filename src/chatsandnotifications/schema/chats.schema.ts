import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Chats {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  sender: mongoose.Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  receiver: mongoose.Types.ObjectId;

  @Prop({
    type: {
      Username: String,
      profileImg: String,
      message: String,
    },
  })
  content: {
    Username: string,
    profileImg: string,
    message: string,
  };

  
  @Prop({
    type: {
      image: String,
      name: String,
      reciver_id: String,
    },
  })
  receiverData: {
    image: string,
    name: string,
    reciver_id: string,
  };


  @Prop({ default: Date.now })
  timestamp: Date;

  
  @Prop({ default: false })
  isRead: boolean;
}

export type ChatsDocument = Chats & Document;
export const ChatsSchema = SchemaFactory.createForClass(Chats);
