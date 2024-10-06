import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';
import { Subscription } from './schema/subscription.schema';
import { Model } from 'mongoose';
import { SubDto } from '../plan/dto/create-plan.dto';
import { BaseResponseTypeDTO } from 'src/utils';
import { Users } from 'src/users/schema/users.schema';
import { Plan } from '../plan/schema/plan.schema';
import { Transaction } from '../transaction/schema/transaction.schema';
import * as crypto from 'crypto';
import { Credit } from '../credit/schema/credit.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
// import {  } from 'src/users/users.service';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(Subscription.name);
  private _axios: AxiosInstance;

  constructor(
    @InjectModel(Subscription.name)
    private readonly subModel: Model<Subscription>,
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
    @InjectModel(Plan.name) private readonly planModel: Model<Plan>,
    @InjectModel(Credit.name) private readonly creditModel: Model<Credit>,
    @InjectModel(Transaction.name)
    private readonly tranModel: Model<Transaction>,
  ) {
    const secKey = process.env.PAYSTACK_SECRET;
    this._axios = axios.create({
      baseURL: 'https://api.paystack.co',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${secKey}`,
        'Content-Type': 'application/json',
        'cache-control': 'no-cache',
      },
    });
  }

  async createSub(userId: string, dto: SubDto): Promise<BaseResponseTypeDTO> {
    try {
      const user = await this.userModel.findById(userId).exec();

      if (!user) {
        throw new NotFoundException('User not found.');
      }
      const plan = await this.planModel.findOne({ _id: dto?.planId }).exec();

      if (!plan) {
        throw new NotFoundException('Plan not found.');
      }

      const paystackApiUrl = 'https://api.paystack.co/transaction/initialize';
      const secretKey = process.env.PAYSTACK_SECRET;

      const paystackPayload = {
        email: user?.email,
        amount: plan?.amount,
        plan: plan?.plan_code,
      };

      const paystackResponse = await axios.post(
        paystackApiUrl,
        paystackPayload,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const paystackData = paystackResponse.data;

      const subscription = new this.subModel({
        plan: plan._id,
        customer: user?._id,
        customer_email: user?.email,
        sub_id: paystackData.data.subscription_code,
        status: paystackData.data.status,
        reference: paystackData.data.reference,
        access_code: paystackData.data.access_code,
        plan_interval: plan?.interval
      });

      const transaction = new this.tranModel({
        plan: plan._id,
        customer: user?._id,
        status: 'Pending',
        trans_type: 'Subscription',
        plan_interval: plan?.interval,
        reference: paystackData.data.reference,
      });

      const data = await subscription.save();
      const tran = await transaction.save();

      return {
        data: { payment_url: paystackData.data.authorization_url },
        success: true,
        code: HttpStatus.OK,
        message: 'Subscription Created Successfully',
      };
    } catch (ex) {
      this.logger.error('Error creating Paystack subscription:', ex.message);
    }
  }

  async verify(eventData, signature): Promise<boolean> {
    const hmac = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET);
    const expectedSignature = hmac
      .update(JSON.stringify(eventData))
      .digest('hex');
    return expectedSignature === signature;
  }

  async handlePaymentCallback(eventData, signature) {
    console.log('Payload from paystck', eventData);
    if (!this.verify(eventData, signature)) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid signature',
      };
    }

    if (eventData.event === 'charge.success') {
      const data = eventData.data;
      const reference = eventData.data.reference;
      const pendingPayment = await this.tranModel
        .findOne({
          status: 'Pending',
          reference,
        })
        .exec();

      if (pendingPayment) {
        pendingPayment.status = 'Completed';
        pendingPayment.amount = data.amount/100;
        pendingPayment.updatedAt = new Date()
        await pendingPayment.save();

        if (pendingPayment?.trans_type === 'Subscription') {
          const user = await this.userModel
            .findById(pendingPayment?.customer)
            .exec();
          const sub = await this.subModel
            .findOne({customer: pendingPayment?.customer})
            .exec();

          user.isSubscribed = true;
          user.subscriber_type = 'Premium';
          user.sub_interval = data.plan.interval;
          const expirationDate = new Date();
          expirationDate.setMonth(expirationDate.getMonth() + 1);
          user.sub_expiration = expirationDate;
          sub.status = 'Active'
          sub.start_date = new Date()
          sub.end_date = expirationDate
          user.updatedAt = new Date()
          sub.updatedAt = new Date()
          await user.save();        
          await sub.save();        
        }

        if (pendingPayment?.trans_type === 'Credit') {
          const user = await this.userModel
            .findById(pendingPayment?.customer)
            .exec();

          const cred = await this.creditModel
            .findById(pendingPayment?.credit)
            .exec();

          const credCal =  user.credits + cred.credit

          user.credits = credCal;
          user.updatedAt = new Date()
          await user.save();        
        }
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Webhook received and processed successfully',
      };
    }

    if (eventData.event === 'invoice.created') {
      const invoice = eventData.data;

      const subscription = await this.subModel.findOne({
        sub_id: invoice.subscription,
      }).exec();

      if (!subscription) {
        throw new NotFoundException('Subscription not found.');
      }

      const sub = new this.subModel({
        plan: subscription?.plan,
        customer: subscription?.customer,
        customer_email: subscription?.customer_email,
        sub_id: invoice.subscription,
        status: invoice.status,
        reference: invoice.reference,
        access_code: invoice.access_code,
        plan_interval: subscription?.plan_interval
      });

      // subscription.status = invoice.status;
      // subscription.updatedAt = new Date()
      // await subscription.save();

      const transaction = new this.tranModel({
        customer: sub.customer,
        plan: sub.plan,
        reference: invoice.reference,
        status: invoice.status === 'paid' ? 'Completed' : 'Pending',
        amount: invoice.amount / 100, 
        trans_type: 'Subscription',
        plan_interval: sub.plan_interval,
      });

      await transaction.save();

      this.logger.log(
        `Invoice ${invoice.reference} for subscription ${sub.sub_id} processed successfully.`,
      );
    }

    if (eventData.event === 'invoice.payment_failed') {
      const invoice = eventData.data;

      const subscription = await this.subModel.findOne({
        sub_id: invoice.subscription,
      }).exec();

      if (!subscription) {
        throw new NotFoundException('Subscription not found.');
      }

      subscription.status = 'Deactivated'; 
      subscription.updatedAt = new Date()
      await subscription.save();

      const transaction = await this.tranModel.findOne({ reference: invoice.reference }).exec();
      if (transaction) {
        transaction.status = 'Failed';
        transaction.updatedAt = new Date()
        await transaction.save();
      }

      this.logger.log(`Subscription ${subscription.sub_id} deactivated due to payment failure.`);
    }

    return { statusCode: HttpStatus.OK, message: 'Webhook received' };
  }

  async initialize(
    amount: number,
    redirectUrl: string | null,
    reference: string,
    currency: string,
  ) {
    try {
      let payload = {
        amount: amount * 100,
        reference,
        // channels: ['card'],
        callback_url: redirectUrl,
        currency,
      };
      const response = await this._axios.post(
        `/transaction/initialize`,
        payload,
      );
      return {
        data: response.data,
        success: true,
        code: HttpStatus.OK,
        message: ' ',
      };
    } catch (e) {
      return { error: e.message, res: e };
    }
  }

  async charge(
    transactionId: string,
    chargeAuth: string,
    amount: number,
    email: string,
    subAccount = null,
  ) {
    try {
      let payload = {
        reference: transactionId,
        authorization_code: chargeAuth,
        amount: amount * 100,
        currency: 'NGN',
        email: email.trim().toString(),
      };

      const { data } = await this._axios.post(
        `/transaction/charge_authorization`,
        payload,
      );
      return {
        error:
          data.data.status != 'success'
            ? data.data.gateway_response ||
              'Unable to charge card at the moment'
            : undefined,
        data: data.data,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  async getBanks() {
    try {
      const response = await this._axios.get('/bank');

      return { data: response.data };
    } catch (e) {
      return { error: e.message };
    }
  }

  async resolveAccount(accountNumber: any, bankCode: any) {
    try {
      const response = await this._axios.get('/bank/resolve', {
        params: {
          account_number: accountNumber,
          bank_code: bankCode,
        },
      });

      return { data: response.data };
    } catch (e) {
      return { error: e.message };
    }
  }
  
  @Cron(CronExpression.EVERY_HOUR)
  async subscriberCron(): Promise<BaseResponseTypeDTO> {
    try {
      const users = await this.userModel
        .find({ isSubscribed: true, sub_expiration: { $lte: new Date() } })
        .exec();
  
      if (!users || users.length === 0) {
        throw new NotFoundException('No subscribed users.');
      }
  
      await this.userModel.updateMany(
        { _id: { $in: users.map(user => user._id) } },
        { $set: { sub_type: 'Basic', isSubscribed: false } }
      );
  
      return {
        data: '',
        success: true,   
        code: HttpStatus.OK,
        message: 'User subscription updated.',
      };
    } catch (ex) {
      this.logger.error('Error updating user subscriptions:', ex.message);
    }
  }
}
