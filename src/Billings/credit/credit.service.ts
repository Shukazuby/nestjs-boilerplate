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
import { CreditDto, UseCreditDto } from './dto/create-credit.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';
import axios from 'axios';
import { Credit } from 'src/Billings/credit/schema/credit.schema';
import { Users } from 'src/users/schema/users.schema';
import { Transaction } from '../transaction/schema/transaction.schema';

@Injectable()
export class CreditService {
  private readonly logger = new Logger(Credit.name);
  constructor(
    @InjectModel(Credit.name)
    private readonly creditModel: Model<Credit>,
    @InjectModel(Users.name)
    private readonly userModel: Model<Users>,
    @InjectModel(Transaction.name) private readonly tranModel: Model<Transaction>,

  ) {}

async createCredit(dto: CreditDto): Promise<BaseResponseTypeDTO> {
  try {
    const credit = await new this.creditModel({
      name: dto?.name,
      credit: dto?.credit,
      amount: dto?.amount
    })
    const data = await credit.save();

    return {
      data: data,
      success: true,
      code: HttpStatus.CREATED,
      message: 'Credit Created Successfully',
    };
  } catch (ex) {
    this.logger.error(':', ex.message);
    throw ex;
  }
}

async buyCredit(userId: string, creditId: string): Promise<BaseResponseTypeDTO> {
  try {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const credit = await this.creditModel.findById(creditId).exec();
    if (!credit) {
      throw new NotFoundException('Credit not found.');
    }

    const paystackApiUrl = 'https://api.paystack.co/transaction/initialize';
    const secretKey = process.env.PAYSTACK_SECRET;

    const paystackPayload = {
      email: user.email, 
      amount: credit.amount * 100, 
      currency: 'NGN',
      reference: `REF-${Date.now()}`, 
      callback_url: '', 
      metadata: {
        custom_fields: [
          {
            display_name: 'AppName Credit' ,
            variable_name: 'AppName Credit',
            value: credit?.name ?? 'AppName Credit',
          },
        ],
      },
    };

    const paystackResponse = await axios.post(paystackApiUrl, paystackPayload, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    const paystackData = paystackResponse.data;

    if (!paystackData.status) {
      throw new HttpException(paystackData.message, HttpStatus.BAD_REQUEST);
    }

    const transaction = new this.tranModel({
      credit: credit._id,
      customer: user?._id, 
      status: 'Pending',
      trans_type: 'Credit',
      reference: paystackData.data.reference,
    });

    const tran = await transaction.save();

    return {
      data: {
        payment_url: paystackData.data.authorization_url,
        accessCode: paystackData.data.access_code,
        reference: paystackData.data.reference,
      },
      success: true,
      code: HttpStatus.OK,
      message: 'Payment successful',
    };
  } catch (ex) {
    this.logger.error(':', ex.response?.data || ex.message);
    throw new HttpException(
      ex.response?.data.message || 'An error occurred while making the payment.',
      ex.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

async getCredits(): Promise<BaseResponseTypeDTO> {
  try {

    const credit = await this.creditModel.find().exec();
    if (!credit) {
      throw new NotFoundException('Credits not found.');
    }

    return {
      data: credit,
      success: true,
      code: HttpStatus.OK,
      message: 'Credit fetched',
    };
  } catch (ex) {
    this.logger.error(':', ex.response?.data || ex.message);
    throw new HttpException(
      ex.response?.data.message,
      ex.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

async getACredit(id: string): Promise<BaseResponseTypeDTO> {
  try {

    const credit = await this.creditModel.findById(id).exec();
    if (!credit) {
      throw new NotFoundException('Credit not found.');
    }

    return {
      data: credit,
      success: true,
      code: HttpStatus.OK,
      message: 'Credit fetched',
    };
  } catch (ex) {
    this.logger.error(':', ex.response?.data || ex.message);
    throw new HttpException(
      ex.response?.data.message,
      ex.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

async deleteCredit(id: string): Promise<BaseResponseTypeDTO> {
  try {

    const credit = await this.creditModel.findById(id).exec();
    if (!credit) {
      throw new NotFoundException('Credit not found.');
    }

    await this.creditModel.findByIdAndDelete(credit?._id);

    return {
      data: credit,
      success: true,
      code: HttpStatus.OK,
      message: 'Credit fetched',
    };
  } catch (ex) {
    this.logger.error(':', ex.response?.data || ex.message);
    throw new HttpException(
      ex.response?.data.message,
      ex.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

async updateCredit(id: string, dto: CreditDto): Promise<BaseResponseTypeDTO> {
  try {
    const credit = await this.creditModel.findById(id).exec();
    if (!credit) {
      throw new NotFoundException('Credit not found.');
    }

    if ('amount' in dto) {
      credit.previous_amount = credit.amount
      credit.amount = dto.amount;
    }
    if ('name' in dto) {
      credit.name = dto.name;
    }

    if ('credit' in dto) {
      credit.credit = dto.credit;
    }

    credit.updatedAt = new Date();
    const updatedCredit = await credit.save();

    return {
      data: updatedCredit,
      success: true,
      code: HttpStatus.OK,
      message: 'Credit updated successfully.',
    };
  } catch (ex) {
    this.logger.error('Error updating credit:', ex.response?.data || ex.message);
    throw new HttpException(
      ex.response?.data.message || 'An error occurred while updating credit.',
      ex.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

async useCredit(userId: string, dto: UseCreditDto): Promise<BaseResponseTypeDTO> {
  try {
    const record = await this.userModel.findById(userId).exec();
    if (!record) {
      throw new NotFoundException('User not found.');
    }

    if (record.credits < dto.credit) {
      throw new HttpException('Insufficient credit.', HttpStatus.BAD_REQUEST);
    }

    record.credits = Math.max(0, record.credits - dto.credit);

    record.updatedAt = new Date();
    await record.save();

    return {
      data: { remainingCredit: record.credits },
      success: true,
      code: HttpStatus.OK,
      message: `Successfully deducted ${dto.credit} credits.`,
    };
  } catch (ex) {
    this.logger.error('Error deducting credit:', ex.response?.data || ex.message);

    const errorMessage = ex.response?.data?.message || ex.message || 'An error occurred while deducting credit.';
    const errorStatus = ex.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;

    throw new HttpException(errorMessage, errorStatus);
  }
}

}
