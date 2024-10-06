import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';
import {
  BaseResponseTypeDTO,
} from 'src/utils';
import { Plan } from 'src/Billings/plan/schema/plan.schema';
import { PlanDto, SubDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import axios from 'axios';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class PlanService {
  private readonly logger = new Logger(Plan.name);
  constructor(
    private readonly subSrv: SubscriptionService,
    @InjectModel(Plan.name)
    private readonly planModel: Model<Plan>,
  ) {}

  async createPlan(dto: PlanDto): Promise<BaseResponseTypeDTO> {
    try {
      const paystackApiUrl = 'https://api.paystack.co/plan';
       const secretKey = process.env.PAYSTACK_SECRET; 

      // Prepare the payload for Paystack
      const paystackPayload = {
        name: dto?.name,
        interval: dto?.interval, 
        amount: dto?.amount * 100, 
      };

      const paystackResponse = await axios.post(paystackApiUrl, paystackPayload, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
      });

      const paystackData = paystackResponse.data;

      const plan = new this.planModel({
        name: paystackData.data.name,
        interval: paystackData.data.interval,
        amount: paystackData.data.amount / 100, 
        plan_code: paystackData.data.plan_code, 
      });
      const data = await plan.save();

      return {
        data: data,
        success: true,
        code: HttpStatus.OK,
        message: 'Plan Created Successfully',
      };
    } catch (ex) {
      this.logger.error('Error creating Paystack plan:', ex.message);
      throw ex;
    }
  }

  async getPlans(): Promise<BaseResponseTypeDTO> {
    try {
      const data = await this.planModel.find().exec();

      if (!data) {
        throw new NotFoundException('Plans not found.');
      }
      return {
        data: data,
        success: true,
        code: HttpStatus.OK,
        message: 'All Plan Fetched',
      };
    } catch (ex) {
      this.logger.error('', ex.message);
      throw ex;
    }
  }

  async getAPlan(planId: string): Promise<BaseResponseTypeDTO> {
    try {
      const data = await this.planModel.findById(planId).exec();
      if (!data) {
        throw new NotFoundException('Plan not found.');
      }

      return {
        data: data,
        success: true,
        code: HttpStatus.OK,
        message: 'A plan Fetched',
      };
    } catch (ex) {
      this.logger.error('', ex.message);
      throw ex;
    }
  }

  async deletePlan(planId: string): Promise<BaseResponseTypeDTO> {
    try {
      const data = await this.planModel.findById(planId).exec();
      if (!data) {
        throw new NotFoundException('Plan not found.');
      }

     await this.planModel.findByIdAndDelete(data?._id);

      return {
        success: true,
        code: HttpStatus.OK,
        message: 'A plan Deleted',
      };
    } catch (ex) {
      this.logger.error('', ex.message);
      throw ex;
    }
  }

}
