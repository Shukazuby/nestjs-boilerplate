import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  changePhone,
  createUserWithPhone,
  profileDto,
  verifyPhone,
} from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { detailsSettings, Users } from './schema/users.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import {
  BaseResponseTypeDTO,
  generateUniqueKey,
  IPaginationFilter,
  sendPushNotification,
  validateEmailField,
} from 'src/utils';
import { Token } from 'src/tokens/schema/tokens.schema';
import { TokenService } from 'src/tokens/tokens.service';
import { ControlDto } from 'src/admin/dto/admin.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(Users.name);
  constructor(
    private readonly tokenSrv: TokenService,
    @InjectModel(Users.name) private readonly usersModel: Model<Users>,
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {}

  async createUser(dto: createUserWithPhone): Promise<BaseResponseTypeDTO> {
    try {
      const hashedPassword = await this.validatePassword(dto?.password);
      const user = new this.usersModel({
        phoneNumber: dto?.phoneNumber,
        password: hashedPassword,
      });
      const data = await user.save();
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

  async getAUserDetail(id: string, userId: string): Promise<BaseResponseTypeDTO> {
    try {
      const _id = await this.usersModel.findById(id).exec();

      if (!_id) {
        throw new NotFoundException('You are not found.');
      }

      const user = await this.usersModel.findById( userId).exec();

      if (!user) {
        throw new NotFoundException('User not found.');
     } 

      return {
        data: user,
        success: true,
        code: HttpStatus.OK,
        message: 'Account Found',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async updateUser(
    userId: string,
    payload: UpdateUserDto,
  ): Promise<BaseResponseTypeDTO> {
    try {
      const record = await this.usersModel.findOne({ _id: userId });

      if (!record) {
        throw new NotFoundException(
          `User not found, therefore cannot be updated.`,
        );
      }

      if (!record?.id) {
        throw new NotFoundException('User with id not found');
      }

      if ('firstName' in payload) {
        record.firstName = payload.firstName;
      }

      if ('lastName' in payload) {
        record.lastName = payload.lastName;
      }

      // if ('userName' in payload) {
      //   const user = await this.usersModel.findOne({userName: payload.userName})
      //   if(user){
      //     throw new HttpException('Username is unavailable, try another', HttpStatus.BAD_REQUEST);
      //   }
      //   record.userName = payload.userName;
      // }

      if ('userName' in payload) {
        const user = await this.usersModel.findOne({
          userName: { $regex: new RegExp(`^${payload.userName}$`, 'i') } 
        });
      
        if (user) {
          throw new HttpException('Username is unavailable, try another', HttpStatus.BAD_REQUEST);
        }
        
        record.userName = payload.userName;
      }
      

      if ('password' in payload) {
        const hashedPassword = await this.tokenSrv.validatePassword(
          payload?.password,
        );
        record.password = hashedPassword;
      }

      if ('genderDetail' in payload) {
        record.genderDetail = payload.genderDetail;
      }

      if ('interests' in payload) {
        record.interests = payload.interests;
      }

      if ('relationshipStatus' in payload) {
        record.relationshipStatus = payload.relationshipStatus;
      }

      if ('dob' in payload) {
        record.dob = payload.dob;
        const dob = new Date(payload.dob);
        const today = new Date();

        let age = today.getFullYear() - dob.getFullYear();
        const monthDifference = today.getMonth() - dob.getMonth();

        if (
          monthDifference < 0 ||
          (monthDifference === 0 && today.getDate() < dob.getDate())
        ) {
          age--;
        }
        record.age = age;
      }

      if ('userGallery' in payload) {
        // record.userGallery.push(...payload.userGallery);
        record.userGallery = payload.userGallery;
      }

      if ('profileImageUrl' in payload) {
        record.profileImageUrl = payload.profileImageUrl;
      }

      if ('AppNamePhotoAccess' in payload) {
        record.AppNamePhotoAccess = payload.AppNamePhotoAccess;
      }

      if ('AppNameLocationAccess' in payload) {
        record.AppNameLocationAccess = payload.AppNameLocationAccess;
      }

      if ('userName' in payload) {
        record.userName = payload.userName;
      }

      if ('profileImageUrl' in payload) {
        record.profileImageUrl = payload.profileImageUrl;
      }

      if ('isShowGender' in payload) {
        record.isShowGender = payload.isShowGender;
      }

      if ('location' in payload) {
        record.location = payload.location;
      }

      if (payload.deviceId && record.deviceId !== payload.deviceId) {
        record.deviceId = payload.deviceId;
      }

      if (payload.email && payload.email !== record.email) {
        validateEmailField(payload.email);
        record.email = payload.email.toLocaleLowerCase();
      }

      record.updatedAt = new Date();
      const updatedUser = await record.save();

      return {
        data: updatedUser,
        success: true,
        code: HttpStatus.OK,
        message: 'Account Updated',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async verifyPhoneOnReg(
    userId: string,
    payload: verifyPhone,
  ): Promise<BaseResponseTypeDTO> {
    try {
      const record = await this.usersModel.findOne({ _id: userId });

      if (!record) {
        throw new NotFoundException(`User not found`);
      }

      if (!record?.id) {
        throw new NotFoundException('User with id not found');
      }
      if (payload?.uniqueVerificationCode) {
        const token = await this.tokenModel
          .findOne({
            token: payload?.uniqueVerificationCode,
            userId: record?._id,
            expiresAt: { $gt: new Date() },
          })
          .exec();
        if (token) {
          record.uniqueVerificationCode = payload?.uniqueVerificationCode;
          record.isPhoneVerified = true;
        } else {
          throw new BadRequestException('Incorrect code or code expired');
        }
      }
      record.updatedAt = new Date();
      const updatedUser = await record.save();

      return {
        data: updatedUser,
        success: true,
        code: HttpStatus.OK,
        message: 'Account Updated',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async changePhone(
    userId: string,
    payload: changePhone,
  ): Promise<BaseResponseTypeDTO> {
    try {
      const record = await this.usersModel.findOne({ _id: userId });

      if (!record) {
        throw new NotFoundException(`User not found`);
      }

      const existingPhone = await this.usersModel
        .findOne({
          phoneNumber: payload.phoneNumber,
        })
        .exec();

      if (existingPhone) {
        throw new BadRequestException('The phone number is already in use.');
      }

      if (payload?.phoneNumber && !payload?.verifycode) {
        const code = await generateUniqueKey(4);
        await this.tokenSrv.saveToken(record?._id, code, 'uniq4', 1);

        //  await sendSMS('AppName', payload?.phoneNumber, `
        //     Here is your Verification code:
        //     ${code}

        //     `)
        console.log('changePhone', code);

        record.phoneNumber = payload?.phoneNumber;
        record.isPhoneVerified = false;
      }
      record.updatedAt = new Date();
      const updatedUser = await record.save();

      return {
        data: updatedUser,
        success: true,
        code: HttpStatus.OK,
        message: 'Account Updated',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findUsersByFilter(
    userId: string,
    filters?: IPaginationFilter & {
      searchPhrase?: string;
      minAge?: number;
      maxAge?: number;
      interests?: string;
      gender?: string;
      distance?: number;
      goals?: string[];
      relationStatus?: string[];
      sexuality?: string;
      smoking: string;
      drinking: string
    },
  ): Promise<BaseResponseTypeDTO> {
    try {
      const record = await this.usersModel.findOne({ _id: userId });

      if (!record) {
        throw new NotFoundException(`User not found`);
      }

      const queries: any = {};

      // Full-text search (if a search phrase is provided)
      if (filters?.searchPhrase) {
        queries.$text = { $search: filters.searchPhrase };
      }

      // Filter by interests
      if (filters?.interests) {
        queries.interests = { $in: [filters.interests] };
      }

      // Filter by gender
      if (filters?.gender) {
        queries[`genderDetail.gender`] = filters.gender;
      }

      // Filter by goals
      if (filters?.goals) {
        queries['relationshipStatus.name'] = filters.goals;
      }

      // Filter by relationStatus
      if (filters?.relationStatus?.length) {
        queries['relationshipStatus.description'] = filters.relationStatus;
      }

      // Filter by sexuality
      if (filters?.sexuality) {
        queries['moreInfo.sexuality'] = filters.sexuality;
      }
      // Filter by drink
      if (filters?.drinking) {
        queries['moreInfo.drink'] = filters.drinking;
      }

      // Filter by smok
      if (filters?.smoking) {
        queries['moreInfo.smoke'] = filters.smoking;
      }

      // Filter by age range
      if (filters?.minAge !== undefined || filters?.maxAge !== undefined) {
        if (filters.minAge !== undefined) {
          queries.age = { ...queries.age, $gte: filters.minAge };
        }
        if (filters.maxAge !== undefined) {
          queries.age = { ...queries.age, $lte: filters.maxAge };
        }
      }

      ////////////////////DISTANCE FILTERS/////////////////////
      ////////////////////DISTANCE FILTERS/////////////////////
      ////////////////////DISTANCE FILTERS/////////////////////
      ////////////////////DISTANCE FILTERS/////////////////////
      ////////////////////DISTANCE FILTERS/////////////////////
      ////////////////////DISTANCE FILTERS/////////////////////
      ////////////////////DISTANCE FILTERS/////////////////////
      ////////////////////DISTANCE FILTERS/////////////////////
      if (filters?.distance !== undefined) {
        queries.location = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: record.location,
            },
            $maxDistance: filters?.distance,
          },
        };
      }

      queries._id = { $ne: userId }; 
      queries.role = { $ne: 'ADMIN' };

      // Pagination logic
      const page = Math.max(filters?.page || 1, 1);
      const limit = Math.max(filters?.limit || 10, 1);
      const skip = (page - 1) * limit;

      // Fetching users based on filters
      const users = await this.usersModel
        .find(queries)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();

      return {
        totalCount: users?.length,
        data: users,
        success: true,
        code: HttpStatus.OK,
        message: 'Users fetched',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async profileSetting(
    userId: string,
    payload: profileDto,
  ): Promise<BaseResponseTypeDTO> {
    try {
      const record = await this.usersModel.findOne({ _id: userId });

      if (!record) {
        throw new NotFoundException(
          `User not found, therefore cannot be updated.`,
        );
      }

      // if ('userName' in payload) {
      //   record.userName = payload.userName;
      // }

      if ('userName' in payload) {
        const user = await this.usersModel.findOne({
          userName: { $regex: new RegExp(`^${payload.userName}$`, 'i') } 
        });
      
        if (user) {
          throw new HttpException('Username is unavailable, try another', HttpStatus.BAD_REQUEST);
        }
        
        record.userName = payload.userName;
      }

      if ('genderDetail' in payload) {
        if (record.isGenderChanged === false) {
          record.genderDetail = payload.genderDetail;
          record.isGenderChanged = true;
        }else{
          throw new HttpException("You can't change gender more than once", HttpStatus.BAD_REQUEST);
        }
      }

      if ('location' in payload) {
        record.location = payload.location;
      }

      if ('dob' in payload) {
        record.dob = payload.dob;
        const dob = new Date(payload.dob);
        const today = new Date();

        let age = today.getFullYear() - dob.getFullYear();
        const monthDifference = today.getMonth() - dob.getMonth();

        if (
          monthDifference < 0 ||
          (monthDifference === 0 && today.getDate() < dob.getDate())
        ) {
          age--;
        }
        record.age = age;
      }

      if (payload.moreInfo) {
        record.moreInfo = { ...record.moreInfo, ...payload.moreInfo };
      }

      if (payload.privacy) {
        record.privacy = { ...record.privacy, ...payload.privacy };
      }

      if (payload.notificication) {
        record.notificication = {
          ...record.notificication,
          ...payload.notificication,
        };
      }

      if (payload.customizeExperience) {
        record.customizeExperience = {
          ...record.customizeExperience,
          ...payload.customizeExperience,
        };
      }

      if (payload.account) {
        record.account = { ...record.account, ...payload.account };
      }

      record.updatedAt = new Date();
      const updatedUser = await record.save();

      return {
        data: updatedUser,
        success: true,
        code: HttpStatus.OK,
        message: 'Account Updated',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async getAnotherUserDetail(
    id: string,
    userId: string,
  ): Promise<BaseResponseTypeDTO> {
    try {
      const _id = await this.usersModel.findById(id).exec();
      if (!_id) {
        throw new NotFoundException('User not found.');
      }

      const user = await this.usersModel.findById(userId).exec();
      if (!user) {
        throw new NotFoundException('This user is not found.');
      }

      if(user?.notificication?.profileVisitors?.allowPushNotifications === true && _id?.role !== 'ADMIN'){
        const pushNoti =  await sendPushNotification(`${_id?.firstName} ${_id?.lastName} visited your profile`, user?.deviceId, 'Visited')
    
        console.log('Notificationnnnnnnn',pushNoti)
        }


      return {
        data: user,
        success: true,
        code: HttpStatus.OK,
        message: 'Account Found',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async validatePassword(password: string) {
    // Validate password length
    if (password.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters long',
      );
    }
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasNumber || !hasSpecialChar) {
      throw new BadRequestException(
        'Password must contain at least one number and one special character',
      );
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
  }

  //Admin

  async getAUser(userId: string): Promise<BaseResponseTypeDTO> {
    try {
      const user = await this.usersModel.findOne({ _id: userId });

      if (!user) {
        throw new NotFoundException(`User not found.`);
      }

      return {
        data: user,
        success: true,
        code: HttpStatus.OK,
        message: 'Account Fetched',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findAllUsers(): Promise<BaseResponseTypeDTO> {
    try {
      const data = await this.usersModel.find().sort({ createdAt: -1 });
      if (!data) {
        throw new NotFoundException('Users not found.');
      }

      return {
        data: {totalcount: data.length, data},
        success: true,
        code: HttpStatus.OK,
        message: 'All Users Found',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async deleteUser(userId: string): Promise<BaseResponseTypeDTO> {
    try {
      const user = await this.usersModel.findOne({ _id: userId });

      if (!user) {
        throw new NotFoundException(`User not found.`);
      }

      await this.usersModel.findByIdAndDelete(userId);

      return {
        success: true,
        code: HttpStatus.OK,
        message: 'Account Deleted',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async controlUser(
    userId: string,
    payload: ControlDto,
  ): Promise<BaseResponseTypeDTO> {
    try {
      const record = await this.usersModel.findOne({ _id: userId });

      if (!record) {
        throw new NotFoundException(
          `User not found`,
        );
      }

      if (!record?.id) {
        throw new NotFoundException('User with id not found');
      }

      if ('status' in payload) {
        record.account_status = payload.status;
      }


      record.updatedAt = new Date();
      const updatedUser = await record.save();

      return {
        data: updatedUser,
        success: true,
        code: HttpStatus.OK,
        message: 'Control Updated',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async getUsersByAccStatus(status: string): Promise<BaseResponseTypeDTO> {
    try {
      const data = await this.usersModel.find({account_status: status}).sort({ createdAt: -1 });
      if (!data) {
        throw new NotFoundException('Users not found.');
      }

      return {
        data: {totalcount: data.length, data},
        success: true,
        code: HttpStatus.OK,
        message: 'All Users Found',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async getUsersByCountry(country: string): Promise<BaseResponseTypeDTO> {
    try {
      const data = await this.usersModel.find({country}).sort({ createdAt: -1 });
      if (!data) {
        throw new NotFoundException('Users not found.');
      }

      return {
        data: {totalcount: data.length, data},
        success: true,
        code: HttpStatus.OK,
        message: 'All Users Found',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async checkPhoneNumberExists(phoneNumber: string): Promise<BaseResponseTypeDTO> {
    try {  
      const phoneExists = await this.usersModel.findOne({ phoneNumber }).exec();
  
      // Add logging to see the exact result of the query
      console.log('Result from database:', phoneExists);
  
      // Check if the query returned null
      if (phoneExists === null) {
        console.log('Phone number not found');
      } else {
        console.log('Phone number found:', phoneExists);
      }
  
      return {
        data: !!phoneExists,  
        success: !!phoneExists,  
        code: HttpStatus.OK,
        message: phoneExists ? 'Phone number exists' : 'Phone number does not exist',
      };
    } catch (ex) {
      this.logger.error('Error checking phone number:', ex);
      throw ex;
    }
  }
  
}
