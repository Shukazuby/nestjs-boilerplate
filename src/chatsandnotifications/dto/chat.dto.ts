import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

class contentDto {
  @ApiProperty({ description: 'content types', type: String })
  Username: string;

  @ApiProperty({ description: 'content types', type: String })
  profileImg: string;

  @ApiProperty({ description: 'content types', type: String })
  message: string;
}
class receiverDataDto {
  @ApiProperty({ description: 'content types', type: String })
  image: string;

  @ApiProperty({ description: 'content types', type: String })
  name: string;

  @ApiProperty({ description: 'content types', type: String })
  reciver_id: string;
}
export class CreateChatsDto {
  @ApiProperty({
    description: 'Sender ID (Tenant Or Agent)',
    type: String,
  })
  sender: string;

  @ApiProperty({
    description: 'Receiver ID (Tenant Or Agent)',
    type: String,
  })
  receiver: string;

  @ApiProperty()
  content: contentDto;

  @ApiProperty()
  receiverData: receiverDataDto;
}

export class GetChatsDto {
  @ApiProperty({
    description: 'Sender ID (Tenant Or Agent)',
    type: String,
  })
  userId: Types.ObjectId;

  @ApiProperty({
    description: 'Receiver ID (Tenant Or Agent)',
    type: String,
  })
  otherUserId: Types.ObjectId;

  @ApiProperty()
  skip: number;

  @ApiProperty()
  limit: number;
}

export class ChatsDto {
  @ApiProperty({ description: 'Chats ID', type: String })
  _id: Types.ObjectId;

  @ApiProperty({ description: 'Sender ID', type: String })
  sender: Types.ObjectId;

  @ApiProperty({ description: 'Receiver ID', type: String })
  receiver: Types.ObjectId;

  @ApiProperty()
  content: contentDto;


  @ApiProperty()
  receiverData: receiverDataDto;

  @ApiProperty({ description: 'Timestamp', type: Date })
  timestamp: Date;
}
