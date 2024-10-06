import { Body, Controller, Headers, HttpStatus, Param, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubDto } from '../plan/dto/create-plan.dto';
import { BaseResponseTypeDTO } from 'src/utils';
import { PlanService } from '../plan/plan.service';

@ApiTags('Subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subService: SubscriptionService) {}
  @Post('creating-subscription/:id')
  @ApiOperation({ summary: 'create a subscription' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Sub created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async createSub(
    @Param('id') id: string,
    @Body() payload: SubDto,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.subService.createSub(
     id, payload
    );
    return result;
  }

  

  @Post('/webhook')
  async handleWebhook(@Body() eventData: any, @Headers('x-paystack-signature') signature: string): Promise<any> {
   return await this.subService.handlePaymentCallback(eventData, signature)
  }

}
