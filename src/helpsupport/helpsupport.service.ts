import {HttpStatus,Injectable,Logger,NotFoundException,} from '@nestjs/common';
import { UpdateHelpsupportDto } from './dto/update-helpsupport.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  BaseResponseTypeDTO,
} from 'src/utils';
import { hsDto } from './dto/create-helpsupport.dto';
import { helpsupport } from './schema/helpsupport.schema';
import { Users } from 'src/users/schema/users.schema';



@Injectable()
export class HelpsupportService {

  private readonly logger = new Logger(helpsupport.name);
  constructor(
    @InjectModel(helpsupport.name) private readonly helpModel: Model<helpsupport>,
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
  ) {}

  async createhelp(userId: string, dto: hsDto): Promise<BaseResponseTypeDTO> {
    try {
      const user = await this.userModel.findById(userId).exec();
  
      if (!user) {
        throw new NotFoundException('User not found.');
      }
  
      const helps = new this.helpModel({
        question: dto?.question,
        answer: dto?.answer,
        createdBy: user?._id,
      })
   
       const data = await helps.save();
       return   {
        data: data, 
        success: true, 
        code: HttpStatus.OK, 
        message: 'Help and Support Created'
      }; 
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
  
    }
    }
  
  async getAllHelps(): Promise<BaseResponseTypeDTO> {
      try {     
         const help = await this.helpModel
           .find()
           .populate('createdBy') 
           .sort({createdAt: -1});
          
         return {
           data: help,
           success: true,
           code: HttpStatus.OK,
           message: 'Help and support fetched.',
         };
       } catch (ex) {
         this.logger.error(ex);
         throw ex;
       }
     
       }
     
  async getAHelp(id: string): Promise<BaseResponseTypeDTO> {
    try {     
        const help = await this.helpModel
          .findById(id)
          .populate('createdBy') 
          .sort({createdAt: -1});
        
        return {
          data: help,
          success: true,
          code: HttpStatus.OK,
          message: 'Help and support fetched.',
        };
      } catch (ex) {
        this.logger.error(ex);
        throw ex;
      }
    
      }
       
  
}
