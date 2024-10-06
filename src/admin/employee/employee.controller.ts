import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseTypeDTO } from 'src/utils';

// @ApiTags('Employee')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly EmployeeService: EmployeeService) {}

  // @Post(':userId')
  // @ApiOperation({ summary: '' })
  // @ApiResponse({
  //   status: HttpStatus.CREATED, 
  //   description: '',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Invalid input data',
  // })
  // async createEmployee(
  //   @Param('userId') userId: string,
  //   @Body() payload: EmployeeDto,
  // ): Promise<BaseResponseTypeDTO> {
  //   const result = await this.EmployeeService.createEmployee(userId, payload);
  //   return result;
  // }
}
