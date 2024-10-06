import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFiles,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ControlDto, GenerateUserReportDto } from './dto/admin.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseTypeDTO, IPaginationFilter } from '../utils';
import { query } from 'express';
import { REVENUEFILTER } from 'src/Billings/transaction/transaction.service';
import { EmployeeDto } from 'src/admin/employee/dto/create-employee.dto';
import { hsDto } from 'src/helpsupport/dto/create-helpsupport.dto';
import { UsersService } from 'src/users/users.service';
import * as fs from 'fs';
import * as path from 'path';


import { Users } from 'src/users/schema/users.schema';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UsersService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Admin find all users' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Get all users' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async findAllUsers(): Promise<BaseResponseTypeDTO> {
    const result = await this.adminService.findAllUsers();
    return result;
  }

  @Patch('control/:userId')
  @ApiOperation({ summary: 'Admin control user account status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async controlUser(
    @Param('userId') userId: string,
    @Body() payload: ControlDto,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.adminService.controlUser(userId, payload);
    return result;
  }

  @Get('users/status')
  @ApiOperation({ summary: 'Admin fetch a user by status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async getUsersByAccStatus(
    @Query('status') status: string,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.adminService.getUsersByAccStatus(status);
    return result;
  }

  @Get('users/country/get')
  @ApiOperation({ summary: 'Admin fetch a user by status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async getUsersByCountry(
    @Query('country') country: string,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.adminService.getUsersByCountry(country);
    return result;
  }


  @Get('revenue/credit-sub')
  @ApiOperation({ summary: 'Admin gets credit revenue' })
  @ApiResponse({ status: HttpStatus.OK, description: '' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async getRevenue(
    @Query('filter') filter: REVENUEFILTER,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.adminService.getRevenue(filter);
    return result;
  }

  @Get('revenue/sub')
  @ApiOperation({ summary: 'Admin gets credit revenue' })
  @ApiResponse({ status: HttpStatus.OK, description: '' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async getSubscriptionRevenue(
    @Query('filter') filter: REVENUEFILTER,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.adminService.getSubscriptionRevenue(filter);
    return result;
  }

  @Get('revenue/credit')
  @ApiOperation({ summary: 'Admin gets credit revenue' })
  @ApiResponse({ status: HttpStatus.OK, description: '' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async getCreditRevenue(
    @Query('filter') filter: REVENUEFILTER,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.adminService.getCreditRevenue(filter);
    return result;
  }

  @Delete('delete/user/:id')
  @ApiOperation({ summary: 'Admin deletes a user' })
  @ApiResponse({ status: HttpStatus.OK, description: '' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async deleteUser(@Param('id') id: string): Promise<BaseResponseTypeDTO> {
    const result = await this.adminService.deleteUser(id);
    return result;
  }

  @Get('get/all-transactions')
  @ApiOperation({ summary: 'Admin gets all transactions' })
  @ApiResponse({ status: HttpStatus.OK, description: '' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async getAllTrans(): Promise<BaseResponseTypeDTO> {
    const result = await this.adminService.getAllTrans();
    return result;
  }

  @Post('/add/employee/:userId')
  @ApiOperation({ summary: 'Admin add an employee' })
  @ApiResponse({ status: HttpStatus.CREATED, description: '' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async addEmployee(
    @Param('userId') userId: string,
    @Body() payload: EmployeeDto,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.adminService.addEmployee(userId, payload);
    return result;
  }

  @Post('/create-help/support/:id')
  @ApiOperation({ summary: 'Admin create help and support' })
  @ApiResponse({ status: HttpStatus.CREATED, description: '' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async creatHelp(
    @Param('userId') userId: string,
    @Body() payload: hsDto,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.adminService.creatHelp(userId, payload);
    return result;
  }

  @Get('/get-help/support/:id')
  @ApiOperation({ summary: 'Admin get help and support' })
  @ApiResponse({ status: HttpStatus.OK, description: '' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async getHelp(
    @Param('id') id: string,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.adminService.getHelp(id);
    return result;
  }

  @Get('/get-help/all/support')
  @ApiOperation({ summary: 'Admin get help and support' })
  @ApiResponse({ status: HttpStatus.OK, description: '' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async getHelps(
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.adminService.getAllHelps();
    return result;
  }
  @Get('/fetch/all/employees/admin')
  @ApiOperation({ summary: 'Admin get all other admins' })
  @ApiResponse({ status: HttpStatus.OK, description: '' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async getEmployees(
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.adminService.getEmployees();
    return result;
  }

  @Get('/fetch/user/:userId/details')
  @ApiOperation({ summary: 'Admin fetch a user data' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async getAUserDetails(
    @Param('userId') userId: string,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.adminService.getAUserDetails(userId);
    return result;
  }


  @Post('generate-report/generate-report-for-user')
  async generateReport(@Body() dto: GenerateUserReportDto): Promise<void> {
    return await this.adminService.generateUserReport(dto);
  }

}