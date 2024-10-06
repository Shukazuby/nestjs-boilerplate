import {
  Injectable,
  HttpStatus,
  } from '@nestjs/common';
import { CreateChatsDto, GetChatsDto } from './dto/chat.dto';
import { Chats } from './schema/chats.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Notifications } from './schema/notification.schema';
import {checkForRequiredFields,} from 'src/utils/utils.function';
@Injectable()
export class ChatsandnotificationsService {
  constructor(
    @InjectModel(Chats.name) private readonly ChatModel: Model<Chats>,
    @InjectModel(Notifications.name)
    // @InjectModel(Users.name) private readonly usrModel: Model<Users>,
    private readonly notificationsModel: Model<Notifications>,
  ) {}

  // async sendChat(payload: CreateChatsDto): Promise<any> {
  //   try {
  //     checkForRequiredFields(['sender', 'receiver', 'content'], payload);
  //     console.log('sending');
  //     const { sender, receiver, content, receiverData } = payload;
  //     const senderObjectId = new mongoose.Types.ObjectId(sender);
  //     const receiverObjectId = new mongoose.Types.ObjectId(receiver);

  //     // Find the last chat where sender is the receiver and update isRead to true
  //     await this.ChatModel.updateOne(
  //       { sender: receiverObjectId, receiver: senderObjectId },
  //       { $set: { isRead: true } },
  //       { sort: { timestamp: -1 }, limit: 1 },
  //     );

  //     const Chat = await new this.ChatModel({
  //       sender: senderObjectId,
  //       receiver: receiverObjectId,
  //       content,
  //       receiverData,
  //     });
  //     const Msg = await Chat.save();

  //     return {
  //       success: true,
  //       code: HttpStatus.OK,
  //       Msg,
  //       Chat: 'Chat Added',
  //     };
  //   } catch (error) {
  //     // Log the error (you may want to log it to a file or a logging service)
  //     console.error('Error in sendChat:', error);

  //     // Return an error response to the frontend
  //     return {
  //       success: false,
  //       code: HttpStatus.INTERNAL_SERVER_ERROR,
  //       error: 'Internal Server Error',
  //       message: error,
  //     };
  //   }
  // }

  async sendChat(payload: CreateChatsDto): Promise<any> {
    try {
      checkForRequiredFields(['sender', 'receiver', 'content'], payload);

      const { sender, receiver, content, receiverData } = payload;
      const senderObjectId = new mongoose.Types.ObjectId(sender);
      const receiverObjectId = new mongoose.Types.ObjectId(receiver);

      // Find the last 5 unread chats and mark them as read
      const updateResult = await this.ChatModel.updateMany(
        { sender: receiverObjectId, receiver: senderObjectId, isRead: false },
        { $set: { isRead: true } },
        { sort: { timestamp: -1 }, limit: 5 },
      );

      // Create the new chat
      const newChat = new this.ChatModel({
        sender: senderObjectId,
        receiver: receiverObjectId,
        content,
        receiverData,
      });

    // const senderr = await this.usrModel.findById(senderObjectId).exec()
    // const receiverr = await this.usrModel.findById(receiverObjectId).exec()

    // if(receiverr?.notificication?.messages?.allowPushNotifications === true){
    //   const pushNoti =  await sendPushNotification(`${senderr?.firstName} ${senderr?.lastName} sent a message`, receiverr?.deviceId, 'Messages')
  
    //   console.log('Notificationnnnnnnn',pushNoti)
    //   }

      const savedChat = await newChat.save();

      return {
        success: true,
        code: HttpStatus.OK,
        message: 'Chat added successfully',
        chat: savedChat,
      };
    } catch (error) {
      console.error('Error in sendChat:', error);

      return {
        success: false,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Failed to send chat',
        message: error.message || 'Internal Server Error',
      };
    }
  }

  async deleteFirst200Chats(): Promise<any> {
    try {
      // Find the first 200 chat records sorted by timestamp (oldest first)
      const chatsToDelete = await this.ChatModel.find()
        .sort({ timestamp: 1 }) // Sorting by oldest first
        .limit(20) // Limit to 200 records
        .select('_id'); // Only selecting the _id field
  
      const chatIds = chatsToDelete.map(chat => chat._id);
  
      // Delete the chats
      const result = await this.ChatModel.deleteMany({ _id: { $in: chatIds } });
  
      return {
        success: true,
        deletedCount: result.deletedCount,
        message: 'First 200 chats deleted successfully',
      };
    } catch (error) {
      throw new Error(`Failed to delete chats: ${error.message}`);
    }
  }


  // MailJetsendMail

  async getConversation(payload: GetChatsDto): Promise<Chats[]> {
    checkForRequiredFields(['userId', 'otherUserId'], payload);
    console.log(payload.otherUserId, payload.userId);
    const { userId, otherUserId, skip, limit } = payload;
    const objectI1d = new mongoose.Types.ObjectId(userId);
    const objectId2 = new mongoose.Types.ObjectId(otherUserId);

    return await this.ChatModel.find({
      $or: [
        { sender: objectI1d, receiver: objectId2 },
        { sender: objectId2, receiver: objectI1d },
      ],
    })
      .sort({ timestamp: 1 })
      .skip(payload.skip)
      .limit(payload.limit)
      .exec();
  }

  ////////get list of people you have chat with
  async FetachCurrentChatsForReceiverFromSenders(
    senderId: string,
    limit: number,
    skip: number,
  ) {
    const objectI1d = new mongoose.Types.ObjectId(senderId);
    try {
      // Aggregate to get the last chat for each sender
      const lastChats = await this.ChatModel.aggregate([
        {
          //$match: { receiver: objectI1d , isRead:false},
          $match: { receiver: objectI1d },
        },
        {
          $sort: { timestamp: -1 }, // Sort in descending order based on timestamp
        },
        {
          $group: {
            _id: '$sender',
            lastChat: { $first: '$$ROOT' }, // Get the first document in each group (last chat for each sender)
          },
        },
        {
          $replaceRoot: { newRoot: '$lastChat' }, // Replace the root with the last chat documents
        },
      ]).exec();

      return lastChats;
    } catch (error) {
      // Handle errors, e.g., log or throw an exception
      console.error('Error getting last chats for receiver:', error);
      return null;
    }
  }

  async getLastConversations(userId: string): Promise<any[]> {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const pipeline: mongoose.PipelineStage[] = [
      {
        $match: {
          $or: [{ sender: userObjectId }, { receiver: userObjectId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$sender', userObjectId] },
              then: '$receiver',
              else: '$sender',
            },
          },
          lastMessage: { $first: '$$ROOT' },
        },
      },
      {
        $project: {
          _id: 0,
          otherUserId: '$_id',
          content: '$lastMessage.content',
          receiverData: '$lastMessage.receiverData',
          lastMessageTimestamp: '$lastMessage.timestamp',
          isRead: '$lastMessage.isRead',
        },
      },
    ];

    const result = await this.ChatModel.aggregate(pipeline).exec();
    return result;
  }


  async getUniqueSendersWithLastMessage(receiverId: string): Promise<any[]> {
    const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

    const pipeline: mongoose.PipelineStage[] = [
      {
        $match: { receiver: receiverObjectId },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: '$sender',
          lastMessage: { $first: '$$ROOT' },
        },
      },
      {
        $lookup: {
          from: 'tenants', // Adjust if the collection name is different
          localField: 'lastMessage.sender',
          foreignField: '_id',
          as: 'senderDetails',
        },
      },
      {
        $unwind: '$senderDetails',
      },
      {
        $project: {
          _id: 0,
          senderId: '$_id',
          senderUsername: '$senderDetails.Username',
          senderProfileImg: '$senderDetails.profileImg',
          lastMessage: '$lastMessage.content.message',
          lastMessageTimestamp: '$lastMessage.timestamp',
          isRead: '$lastMessage.isRead',
        },
      },
    ];

    const result = await this.ChatModel.aggregate(pipeline).exec();
    return result;
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////

  async fetchChatsBySender(senderId: string): Promise<any> {
    const objectI1d = new mongoose.Types.ObjectId(senderId);
    const chats = await this.ChatModel.aggregate([
      {
        $match: {
          sender: objectI1d,
        },
      },
      {
        $group: {
          _id: '$receiver',
          messages: {
            $push: {
              content: '$content',
              receiverData: '$receiverData',
              timestamp: '$timestamp',
              isRead: '$isRead',
            },
          },
        },
      },
      // {
      //   $lookup: {
      //     from: 'employers',
      //     localField: '_id',
      //     foreignField: '_id',
      //     as: 'receiverInfo',
      //   },
      // },
      // {
      //   $unwind: '$receiverInfo',
      // },
      {
        $project: {
          _id: 0, // Exclude _id field
          receiverId: '$_id',
          // receiverInfo: 1,
          messages: 1,
        },
      },
    ]);

    return chats;
  }



} 