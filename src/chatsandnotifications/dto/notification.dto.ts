// notifications.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';

export class ContentDto {
  // @ApiProperty()
  // NotificationTitle: string;

  // @ApiProperty()
  // Username: string;

  @ApiProperty()
  ImageUrl: string;

  @ApiProperty()
  message: string;
}

export class CreateNotificationDto {
  @ApiProperty()
  content: ContentDto;

  @ApiProperty()
  userid: any;
}

export class UpdateNotificationDto {
  @ApiProperty()
  isRead: boolean;
}
