import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto, PlanDto, SubDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseTypeDTO } from 'src/utils';

@ApiTags('Plan')
@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  @ApiOperation({ summary: 'create a plan' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Plan created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async createPlan(
    @Body() payload: PlanDto,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.planService.createPlan(
      payload
    );
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'get all plan' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Plan fetched',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async getPlans(
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.planService.getPlans( );
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'get a plan' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Plan fetched',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async getAPlan(
    @Param('id') id: string,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.planService.getAPlan(id);
    return result;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete a plan' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Plan deleted',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async deletePlan(
    @Param('id') id: string,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.planService.deletePlan(id);
    return result;
  }


}
