import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chats, ChatsSchema } from './schema/chats.schema';
import { Notifications } from './schema/notification.schema';
import { NotificationsSchema } from './schema/notification.schema';
import { ChatsandnotificationsGateway } from './chatsandnotifications.gateway';
import { ChatsandnotificationsService } from './chatsandnotifications.service';
import { UsersModule } from 'src/users/users.module';
import { Users, UsersSchema } from 'src/users/schema/users.schema';



@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chats.name, schema: ChatsSchema },
      { name: Notifications.name, schema: NotificationsSchema },
    ]),
    // MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    // forwardRef(() => UsersModule),
    
  ],
  providers: [ChatsandnotificationsGateway, ChatsandnotificationsService],
  exports: [ChatsandnotificationsGateway, ChatsandnotificationsService],
})
export class ChatsandnotificationsModule {}

