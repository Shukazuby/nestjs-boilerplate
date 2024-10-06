import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { CreditService } from './credit.service';
import { CreateCreditDto, CreditDto, UseCreditDto } from './dto/create-credit.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseTypeDTO } from 'src/utils';

@ApiTags('Credit')
@Controller('credit')
export class CreditController {
  constructor(private readonly creditService: CreditService) {}
  @Post()
  @ApiOperation({ summary: 'create a credit' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Credit created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async createCredit(
    @Body() payload: CreditDto,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.creditService.createCredit(
      payload
    );
    return result;
  }

  @Post(':userId/buy/:creditId')
  @ApiOperation({ summary: 'Buy a Credit' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Credit Purchased',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async buyCredit(
    @Param('userId') userId: string,
    @Param('creditId') creditId: string,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.creditService.buyCredit(
     userId, creditId
    );
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'get all credit' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'credit fetched',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async getCredits(
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.creditService.getCredits( );
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'get a credit' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'credit fetched',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async getACredit(
    @Param('id') id: string,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.creditService.getACredit(id);
    return result;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete a credit' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'credit deleted',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async deleteCredit(
    @Param('id') id: string,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.creditService.deleteCredit(id);
    return result;
  }

  @Patch(':creditId/update-credit')
  @ApiOperation({ summary: 'Update Credits' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credit updated',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async updateCredit(
    @Param('creditId') creditId: string,
    @Body() payload: CreditDto,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.creditService.updateCredit(
     creditId, payload
    );
    return result;
  }

  @Post(':userId/use-credit')
  @ApiOperation({ summary: 'Use Credits' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Credit used',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async useCredit(
    @Param('userId') userId: string,
    @Body() payload: UseCreditDto,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.creditService.useCredit(
     userId, payload
    );
    return result;
  }

}
