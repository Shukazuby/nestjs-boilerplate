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
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  changePasswordDTO,
  forgotPasswordDTO,
  loginWithPhone,
  logoutDTO,
  registerWithPhone,
  resetPasswordDTO,
  SignUpAndInDto,
} from './dto/auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseTypeDTO } from '../../src/utils';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User Register' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async createUser(
    @Body() payload: registerWithPhone,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.authService.register(payload);
    return result;
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User login' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async login(@Body() payload: loginWithPhone): Promise<BaseResponseTypeDTO> {
    const result = await this.authService.login(
      payload?.phoneNumber,
      payload?.password,
      payload.deviceId
    );
    return result;
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User lougout' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid input data',
  })
  async logout(
    @Headers('authorization') authHeader: string, 
  ): Promise<BaseResponseTypeDTO> {
    const payload: logoutDTO = { authorizationHeader: authHeader };
    const result = await this.authService.logout(payload);
    return result;
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'User reset password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User reset password' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async resetPassword(
    @Body() payload: resetPasswordDTO,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.authService.resetPassword(payload);
    return result;
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'User forgot password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User forgot password' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async forgotPassword(
    @Body() payload: forgotPasswordDTO,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.authService.forgotPassword(payload);
    return result;
  }

  @Post('register/provider')
  @ApiOperation({ summary: 'Register a user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User Register' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async signUpOrLogin(
    @Body() payload: SignUpAndInDto,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.authService.signUpOrLogin(payload);
    return result;
  }

  @Post('change/paassword/:userId')
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Change password' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async changePassword(@Param('userId') userId:string, @Body() payload: changePasswordDTO,): Promise<BaseResponseTypeDTO> {
  const result = await this.authService.changePassword(userId, payload);
    return result;
  }

}
