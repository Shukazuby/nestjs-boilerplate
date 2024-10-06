import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Headers,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  UserDto,
  changePhone,
  createUserWithPhone,
  profileDto,
  verifyPhone,
} from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseTypeDTO, IPaginationFilter } from '../../src/utils';
import { query } from 'express';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get(':id/:userId')
  // @ApiOperation({ summary: 'A user data fetch their data' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'A user data fetch their data',
  // })
  // @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  // async findAUser(@Param('id') id: string, @Param('userId') userId: string): Promise<BaseResponseTypeDTO> {
  //   const result = await this.usersService.getAUserDetail(id, userId);
  //   return result;
  // }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User update their account',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async updateUser(
    @Param('id') id: string,
    @Body() payload: UpdateUserDto,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.usersService.updateUser(id, payload);
    return result;
  }

  @Patch('verify/:id')
  @ApiOperation({ summary: 'Verify phone number on reg' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User verify their account',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async verifyPhoneOnReg(
    @Param('id') id: string,
    @Body() payload: verifyPhone,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.usersService.verifyPhoneOnReg(id, payload);
    return result;
  }
  @Patch('change/:id')
  @ApiOperation({ summary: 'change phone number' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User change their account',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async changePhone(
    @Param('id') id: string,
    @Body() payload: changePhone,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.usersService.changePhone(id, payload);
    return result;
  }

  @Get('filters/:id')
  @ApiOperation({ summary: 'Fetch users based on filter' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Fetch users',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No user Found' })
  @ApiQuery({
    name: 'searchPhrase',
    required: false,
    type: String,
    description: 'Search term for full-text search',
  })
  @ApiQuery({
    name: 'minAge',
    required: false,
    type: Number,
    description: 'Minimum age for filtering',
  })
  @ApiQuery({
    name: 'maxAge',
    required: false,
    type: Number,
    description: 'Maximum age for filtering',
  })
  @ApiQuery({
    name: 'interests',
    required: false,
    type: String,
    description: 'Array of interest ',
  })
  @ApiQuery({
    name: 'gender',
    required: false,
    type: String,
    description: 'Gender filter',
  })
  @ApiQuery({
    name: 'distance',
    required: false,
    type: Number,
    description: 'Distance filter in kilometers',
  })
  @ApiQuery({
    name: 'goals',
    required: false,
    type: [String],
    description: 'Array of goals',
  })
  @ApiQuery({
    name: 'relationStatus',
    required: false,
    type: [String],
    description: 'Array of relationship statuses',
  })
  @ApiQuery({
    name: 'sexuality',
    required: false,
    type: String,
    description: 'Sexuality filter',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of results to return per page',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  async findUsersByFilter(
    @Param('id') id: string,
    @Query()
    filters: IPaginationFilter & {
      searchPhrase?: string;
      minAge?: number;
      maxAge?: number;
      interests?: string;
      gender?: string;
      distance?: number;
      goals?: string[];
      relationStatus?: string[];
      sexuality?: string;
      drinking: string;
      smoking: string;

    },
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.usersService.findUsersByFilter(id, filters);
    return result;
  }

  @Get(':id/:userId')
  @ApiOperation({ summary: 'Get a user by their Id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A user get another user by id ',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async getAnotherUserDetail(
    @Param('id') id: string,       
    @Param('userId') userId: string,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.usersService.getAnotherUserDetail(id, userId);
    return result;
  }

  @Patch('profile/setting/:id')
  @ApiOperation({ summary: 'Update a user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User update their account',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async profileSetting(
    @Param('id') id: string,
    @Body() payload: profileDto,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.usersService.profileSetting(id, payload);
    return result;
  }

  
    @Get('/check-phonenumber')
    @ApiOperation({ summary: 'Check if phone is registered' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Phone number check successful',
    }) 
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid input data',
    })
    async checkPhoneNumberExists(
      @Query('phoneNumber') phoneNumber: string, 
    ) {
      const result = await this.usersService.checkPhoneNumberExists(phoneNumber);
      return result;  
    }
  }
