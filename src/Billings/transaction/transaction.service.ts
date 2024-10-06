import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from 'src/users/schema/users.schema';
import { Plan } from '../plan/schema/plan.schema';
import { Transaction } from '../transaction/schema/transaction.schema';
import { Credit } from '../credit/schema/credit.schema';
import { BaseResponseTypeDTO } from 'src/utils';
import { subMonths, subYears, subDays, startOfYear, endOfYear } from 'date-fns';
import { UsersService } from 'src/users/users.service';

export enum REVENUEFILTER {
  SEVENDAYS = 'last7days',
  FOURTEENDAYS = 'last14days',
  THIRTYDAYS = 'last30days',
  THREEMONTHS = 'last3months',
  TWELVEMONTHS = 'last12months',
  TWENTYTHREE = '2023',
  TWENTYFOUR = '2024',
}

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(Transaction.name);

  constructor(
    @InjectModel(Transaction.name)
    private readonly subModel: Model<Transaction>,
    private readonly userSrv: UsersService,
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
    @InjectModel(Plan.name) private readonly planModel: Model<Plan>,
    @InjectModel(Credit.name) private readonly creditModel: Model<Credit>,
    @InjectModel(Transaction.name)
    private readonly tranModel: Model<Transaction>,
  ) {}

  // async getCreditRevenue(): Promise<BaseResponseTypeDTO> {
  //   try {
  //     const credits = await this.tranModel.find({
  //       status: 'Completed',
  //       trans_type: 'Credit',
  //     }).exec();
      
  //     if (!credits || credits.length === 0) {
  //       []
  //     }
  
  //     const totalRevenue = credits.reduce((sum, credit) => sum + credit.amount, 0);
  
  //     return {
  //       data: { totalRevenue },
  //       success: true,
  //       code: HttpStatus.OK,
  //       message: 'Credit revenue calculated',
  //     };
  //   } catch (ex) {
  //     this.logger.error(ex.message || ex.response?.data);
  //     throw new HttpException(
  //       ex.response?.data.message || 'Internal Server Error',
  //       ex.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
  
  async getCreditRevenue(filter: REVENUEFILTER): Promise<BaseResponseTypeDTO> {
    try {
      let startDate: Date;
      let endDate = new Date();
  
      // Determine the date range based on the filter
      switch (filter) {
        case 'last7days':
          startDate = subDays(endDate, 7);
          break;
        case 'last14days':
          startDate = subDays(endDate, 14);
          break;
        case 'last30days':
          startDate = subDays(endDate, 30);
          break;
        case 'last3months':
          startDate = subMonths(endDate, 3);
          break;
        case 'last12months':
          startDate = subMonths(endDate, 12);
          break;
        case '2023':
          startDate = new Date('2023-01-01T00:00:00.000Z'); 
          endDate = new Date('2023-12-31T23:59:59.999Z'); 
          break;
        case '2024':
          startDate = new Date('2023-01-01T00:00:00.000Z'); 
          endDate = new Date('2024-12-31T23:59:59.999Z'); 
          break;  
        default:
          throw new HttpException('Invalid filter', HttpStatus.BAD_REQUEST);
      }
  
      // Fetch subscriptions within the calculated date range
      const subs = await this.tranModel.find({
        status: 'Completed',
        trans_type: 'Credit',
        createdAt: { $gte: startDate, $lte: endDate },
      }).exec();
  
      if (!subs || subs.length === 0) {
        return {
          data: { totalRevenue: 0 },
          success: true,
          code: HttpStatus.OK,
          message: 'No credit revenue found',
        };
      }
  
      // Calculate total revenue
      const totalRevenue = subs.reduce((sum, sub) => sum + sub.amount, 0);
  
      return {
        data: { totalRevenue },
        success: true,
        code: HttpStatus.OK,
        message: 'Credit revenue calculated',
      };
    } catch (ex) {
      this.logger.error(ex.message || ex.response?.data);
      throw new HttpException(
        ex.response?.data.message || 'Internal Server Error',
        ex.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
      
  // async getSubscriptionRevenue(): Promise<BaseResponseTypeDTO> {
  //   try {
  //     const subs = await this.tranModel.find({
  //       status: 'Completed',
  //       trans_type: 'Subscription',
  //     }).exec();
      
  //     if (!subs || subs.length === 0) {
  //       []
  //     }
  
  //     const totalRevenue = subs.reduce((sum, sub) => sum + sub.amount, 0);
  
  //     return {
  //       data: { totalRevenue },
  //       success: true,
  //       code: HttpStatus.OK,
  //       message: 'Subscription revenue calculated',
  //     };
  //   } catch (ex) {
  //     this.logger.error(ex.message || ex.response?.data);
  //     throw new HttpException(
  //       ex.response?.data.message || 'Internal Server Error',
  //       ex.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

async getSubscriptionRevenue(filter: REVENUEFILTER): Promise<BaseResponseTypeDTO> {
  try {
    let startDate: Date;
    let endDate = new Date();

    // Determine the date range based on the filter
    switch (filter) {
      case 'last7days':
        startDate = subDays(endDate, 7);
        break;
      case 'last14days':
        startDate = subDays(endDate, 14);
        break;
      case 'last30days':
        startDate = subDays(endDate, 30);
        break;
      case 'last3months':
        startDate = subMonths(endDate, 3);
        break;
      case 'last12months':
        startDate = subMonths(endDate, 12);
        break;
      case '2023':
        startDate = new Date('2023-01-01T00:00:00.000Z'); 
        endDate = new Date('2023-12-31T23:59:59.999Z'); 
        break;
      case '2024':
        startDate = new Date('2023-01-01T00:00:00.000Z'); 
        endDate = new Date('2024-12-31T23:59:59.999Z'); 
        break;
      // case 'lastYear':
      //   // startDate = startOfYear(subYears(endDate, 1));
      //   startDate = startOfYear(subYears(endDate, 1));
      //   endDate = endOfYear(subYears(endDate, 1)); 
      //   break;
      // case 'thisYear':
      //   startDate = startOfYear(endDate);
      //   break;

      default:
        throw new HttpException('Invalid filter', HttpStatus.BAD_REQUEST);
    }

    // Fetch subscriptions within the calculated date range
    const subs = await this.tranModel.find({
      status: 'Completed',
      trans_type: 'Subscription',
      createdAt: { $gte: startDate, $lte: endDate },
    }).exec();

    if (!subs || subs.length === 0) {
      return {
        data: { totalRevenue: 0 },
        success: true,
        code: HttpStatus.OK,
        message: 'No subscription revenue found',
      };
    }

    // Calculate total revenue
    const totalRevenue = subs.reduce((sum, sub) => sum + sub.amount, 0);

    return {
      data: { totalRevenue },
      success: true,
      code: HttpStatus.OK,
      message: 'Subscription revenue calculated',
    };
  } catch (ex) {
    this.logger.error(ex.message || ex.response?.data);
    throw new HttpException(
      ex.response?.data.message || 'Internal Server Error',
      ex.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
    
  // async getRevenue(): Promise<BaseResponseTypeDTO> {
  //   try {
  //     const revenue = await this.tranModel.find({
  //       status: 'Completed',
  //     }).exec();
      
  //     if (!revenue || revenue.length === 0) {
  //       []
  //     }
  
  //     const totalRevenue = revenue.reduce((sum, rev) => sum + rev.amount, 0);
  
  //     return {
  //       data: { totalRevenue },
  //       success: true,
  //       code: HttpStatus.OK,
  //       message: 'Total revenue calculated',
  //     };
  //   } catch (ex) {
  //     this.logger.error(ex.message || ex.response?.data);
  //     throw new HttpException(
  //       ex.response?.data.message || 'Internal Server Error',
  //       ex.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
    
  async getRevenue(filter:REVENUEFILTER): Promise<BaseResponseTypeDTO> {
    try {

      let startDate: Date;
      let endDate = new Date();
  
      // Determine the date range based on the filter
      switch (filter) {
        case 'last7days':
          startDate = subDays(endDate, 7);
          break;
        case 'last14days':
          startDate = subDays(endDate, 14);
          break;
        case 'last30days':
          startDate = subDays(endDate, 30);
          break;
        case 'last3months':
          startDate = subMonths(endDate, 3);
          break;
        case 'last12months':
          startDate = subMonths(endDate, 12);
          break;
        case '2023':
          startDate = new Date('2023-01-01T00:00:00.000Z'); 
          endDate = new Date('2023-12-31T23:59:59.999Z'); 
          break;
        case '2024':
          startDate = new Date('2023-01-01T00:00:00.000Z'); 
          endDate = new Date('2024-12-31T23:59:59.999Z'); 
          break;
        default:
          throw new HttpException('Invalid filter', HttpStatus.BAD_REQUEST);
      }

      const revenue = await this.tranModel.find({
        status: 'Completed',
        createdAt: { $gte: startDate, $lte: endDate },
      }).exec();
      
      if (!revenue || revenue.length === 0) {
        []
      }
  
      const totalRevenue = revenue.reduce((sum, rev) => sum + rev.amount, 0);
  
      return {
        data: { totalRevenue },
        success: true,
        code: HttpStatus.OK,
        message: 'Total revenue calculated',
      };
    } catch (ex) {
      this.logger.error(ex.message || ex.response?.data);
      throw new HttpException(
        ex.response?.data.message || 'Internal Server Error',
        ex.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllTrans(): Promise<BaseResponseTypeDTO> {
    try {
      const trans = await this.tranModel.find().exec();
      if (!trans || trans.length === 0) {
        []
      }
      return {
        data: trans,
        success: true,
        code: HttpStatus.OK,
        message: 'Total payment and subscriptions',
      };
    } catch (ex) {
      this.logger.error(ex.message || ex.response?.data);
      throw new HttpException(
        ex.response?.data.message || 'Internal Server Error',
        ex.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}