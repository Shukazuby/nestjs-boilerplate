import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EmployeeDto } from './dto/create-employee.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { AppRole, BaseResponseTypeDTO } from 'src/utils';
import { Users } from 'src/users/schema/users.schema';
import { UsersService } from 'src/users/users.service';
import { Employee } from './schema/employee.schema';

@Injectable()
export class EmployeeService {
  private readonly logger = new Logger(Employee.name);
  constructor(
    private readonly userSrv: UsersService,
    @InjectModel(Employee.name)
    private readonly employeeModel: Model<Employee>,
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
  ) {}
  async createEmployee(
    userId: string,
    payload: EmployeeDto,
  ): Promise<BaseResponseTypeDTO> {
    try {
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new NotFoundException('User not found.');
      }

      const hashedPassword = await this.userSrv.validatePassword(payload?.password);


      const employee = new this.employeeModel({
        firstName: payload?.firstName,
        lastName: payload?.lastName,
        email: payload?.email,
        gender: payload?.gender,
        added_by: user._id,
        permissions: payload.permissions,
        profile: payload.profile,
        password: hashedPassword
      });

      const userEmp = new this.userModel({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        genderDetail: {gender: employee.gender},
        profileImageUrl: employee.profile,
        role: AppRole.ADMIN,
        password: employee.password,
        permissions: employee.permissions
        
      });

      employee.populate('added_by')
      employee.userId = userEmp._id.toJSON()
      const data = await employee.save();
      await userEmp.save();

      return {
        data: data,
        success: true,
        code: HttpStatus.OK,
        message: 'Employee added.',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }
  async getEmployees( ): Promise<BaseResponseTypeDTO> {
    try {
      const employees = await this.userModel.find({ role: 'ADMIN' }).lean();       return {
        data: employees,
        success: true,
        code: HttpStatus.OK,
        message: 'Employees fetched.',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }
}
