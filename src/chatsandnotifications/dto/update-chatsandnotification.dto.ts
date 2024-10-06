import { PartialType } from '@nestjs/mapped-types';
import { CreateChatsandnotificationDto } from './chatsandnotification.dto';

export class UpdateChatsandnotificationDto extends PartialType(CreateChatsandnotificationDto) {
  id: number;
}
