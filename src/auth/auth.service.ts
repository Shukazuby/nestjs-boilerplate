import {
  ConflictException,
  HttpCode,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AuthDto,
  changePasswordDTO,
  forgotPasswordDTO,
  logoutDTO,
  registerWithPhone,
  resetPasswordDTO,
  SignUpAndInDto,
} from './dto/auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth } from './schema/auth.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { AuthProvider, BaseResponseTypeDTO, checkForRequiredFields, compareEnumValueFields, generateUniqueKey, sendSMS, validateEmailField } from 'src/utils';
import { Users } from 'src/users/schema/users.schema';
import * as jwt from 'jsonwebtoken';
import { TokenService } from 'src/tokens/tokens.service';
import { Token } from 'src/tokens/schema/tokens.schema';
import { FindOneOptions, ObjectId } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(Users.name);
  constructor(
    private readonly tokenSrv: TokenService,
    @InjectModel(Users.name) private readonly authModel: Model<Users>,
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {}

  async register(dto: registerWithPhone): Promise<BaseResponseTypeDTO> {
    try {

      const phone = await this.authModel.findOne({phoneNumber: dto?.phoneNumber}).exec();

      if (phone) {
        throw new ConflictException('Phone number already exists');
      }

      const user = new this.authModel({
        phoneNumber: dto?.phoneNumber,
        role: dto?.role
  
      });
      const code = await generateUniqueKey(4)
  
      await this.tokenSrv.saveToken(user?._id, code, 'uniq4', 1)
  
      console.log('regis', code)
      user.sentOTP = code
      const data = await user.save();
      

    

      // await sendSMS('APPNAME', user?.phoneNumber, `
      //   Here is your Verification code:
      //   ${code}
        
      //   `)

      // Generate JWT
      // const accessToken = await this.tokenSrv.generateJwt(user);
      // await this.tokenSrv.saveToken(user?._id, accessToken, 'access', 48);
      
      return {
        data: data,
        success: true,
        code: HttpStatus.OK,
        message: 'Account Created',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async login(
    phoneNumber: string,
    password: string,
    deviceId: string
  ): Promise<BaseResponseTypeDTO> {
    try {
      // Find user by phone number
      const user = await this.authModel.findOne({ phoneNumber }).exec();

      if (!user) {
        throw new UnauthorizedException('Incorrect phone number or password. try again ');
      }

      // Validate password
      const isPasswordValid = await this.tokenSrv.confirmPassword(
        password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Incorrect phone number or password. try again ');
      }

      // Generate JWT
      const accessToken = await this.tokenSrv.generateJwt(user);

      await this.tokenSrv.saveToken(user?._id, accessToken, 'access', 48);

      if (user.account_status.toLowerCase() === 'suspended' || user.account_status.toLowerCase() === 'suspend') {       
         throw new   UnauthorizedException('Your account is suspended, try again later');
      }

      if(user.deviceId !== deviceId){

        user.lastLogged = new Date()
        await user.save()

      }else{
        user.lastLogged = new Date()
        await user.save()
      }

      return {
        data: {user, accessToken },
        success: true,
        code: HttpStatus.OK,
        message: 'Login successful',
      };
    } catch (error) {
      throw error;
    }
  }

  async logout(payload: logoutDTO): Promise<BaseResponseTypeDTO> {
    try {
      // Extract the bearer token from the authorization header
      const authHeader = payload?.authorizationHeader;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new BadRequestException(
          'Invalid or missing authorization header',
        );
      }

      // Extract the token from the header
      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new BadRequestException('Token not provided');
      }

      // Verify the token and extract the user ID

      const decodedToken = await this.tokenSrv.verifyAsync(token);
      if (!decodedToken || !decodedToken.sub) {
        throw new UnauthorizedException('Invalid token');
      }

      const userId = decodedToken?.sub;

      // Delete all tokens associated with the user
      await this.tokenModel.deleteMany({ userId }).exec();

      const user = await this.authModel.findById(userId).exec();

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return {
        data: null,
        success: true,
        code: HttpStatus.OK,
        message: 'Logout successful',
      };
    } catch (error) {
      throw new InternalServerErrorException('Logout failed', error.message);
    }
  }

  async resetPassword(payload: resetPasswordDTO): Promise<BaseResponseTypeDTO> {
    try {
      // Verify the reset token
      const tokenRecord = await this.tokenModel
        .findOne({ token: payload?.resetToken })
        .exec();

      if (!tokenRecord) {
        throw new UnauthorizedException('Invalid or expired reset token');
      }

      // Find the user associated with the reset token
      const user = await this.authModel.findById(tokenRecord?.userId).exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Hash the new password
      const hashedPassword = await this.tokenSrv.validatePassword(payload?.newPassword);

      // Update the user's password
      user.password = hashedPassword;
      await user.save();

      // Delete the reset token after successful password reset
      await this.tokenModel.deleteOne({ token: payload?.resetToken, type: 'reset'}).exec();


      return {
        success: true,
        code: HttpStatus.OK,
        message: 'Password reset successful',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Password reset failed',
        error.message,
      );
    }
  }

  async forgotPassword(
    payload: forgotPasswordDTO,
  ): Promise<BaseResponseTypeDTO> {
    try {
      const user = await this.authModel
        .findOne({ phoneNumber: payload?.phoneNumber })
        .exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }
      const resetToken = generateUniqueKey(4);

      console.log('forgot', resetToken)

      await this.tokenSrv.saveToken(user?._id, resetToken, 'reset', 1)

      // await sendSMS('APPNAME', user?.phoneNumber, `
      //   Here is your Reset Password code:
      //   ${resetToken}
        
      //   `)
  
      return {
        data:{ token: resetToken },
        success: true,
        code: HttpStatus.OK,
        message: 'Reset code sent to your phone number',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Forgot password process failed',
        error.message,
      );
    }
  }

  async signUpOrLogin(payload: SignUpAndInDto): Promise<BaseResponseTypeDTO> {
    try {
      checkForRequiredFields(['provider', 'thirdPartyUserId'], payload);
      
      compareEnumValueFields(payload.provider, Object.values(AuthProvider), 'provider');
      
      let isNewUser = false;
  
      let record = await this.authModel.findOne({ externalUserId: payload.thirdPartyUserId }).exec();
  
      if (payload.email) {
        const emailToLowercase = payload.email.toLowerCase();
        record = record ;  
        payload.email = emailToLowercase;
      }
  
      if (!record?._id) {
        isNewUser = true;
        record = new this.authModel({
          ...payload,
          firstName: payload.firstName,
          lastName: payload.lastName,
          role: payload?.role,
          externalUserId: payload.thirdPartyUserId,
        });
        await record.save(); 
      }
  
      const token = await this.tokenSrv.generateJwt(record);
      const decodedToken: any = jwt.decode(token);
      const { exp, iat } = decodedToken;
  
      const { createdAt, email, role, _id } = record;

      if (record.account_status.toLowerCase() === 'suspended' || record.account_status.toLowerCase() === 'suspend') {       
        throw new   UnauthorizedException('Your account is suspended, try again later');
     }

      if(record.deviceId !== payload.deviceId){
        record.lastLogged = new Date()
        await record.save()

      }else{
        record.lastLogged = new Date()
        await record.save()

      }

      return {
        success: true,
        message: isNewUser ? 'Signup successful' : 'Login successful',
        code: HttpStatus.OK,
        data: {
          userId: _id,
          isNewUser,
          role,
          email,
          createdAt,
          token,
          tokenInitializationDate: iat,
          tokenExpiryDate: exp,
          user: record,
        },
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async changePassword(userId:string, payload: changePasswordDTO): Promise<BaseResponseTypeDTO> {
    try {
      const user = await this.authModel.findById(userId).exec();
  
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      // Compare old password with the current one
      const isMatch = await bcrypt.compare(payload.currentPassword, user.password);
      if (!isMatch) {
        return {
          success: false,
          code: HttpStatus.BAD_REQUEST,
          message: 'Old password is incorrect',
        };
      }
  
      const isSameAsOld = await bcrypt.compare(payload.newPassword, user.password);
      if (isSameAsOld) {
        return {
          success: false,
          code: HttpStatus.BAD_REQUEST,
          message: 'New password cannot be the same as the old password',
        };
      }
  
      const hashedPassword = await bcrypt.hash(payload.newPassword, 10);
  
      user.password = hashedPassword;
      await user.save();

      return {
        success: true,
        code: HttpStatus.OK,
        message: 'Password updated successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Password change process failed',
        error.message,
      );
    }
  }
  
  
}
