import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ControlDto, DowloadFormat, GenerateUserReportDto } from './dto/admin.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BaseResponseTypeDTO } from 'src/utils';
import { Token } from 'src/tokens/schema/tokens.schema';
import { TokenService } from 'src/tokens/tokens.service';
import { Admin } from 'src/admin/schema/admin.schema';
import { UsersService } from 'src/users/users.service';
import {
  REVENUEFILTER,
  TransactionService,
} from 'src/Billings/transaction/transaction.service';
import { EmployeeService } from 'src/admin/employee/employee.service';
import { EmployeeDto } from 'src/admin/employee/dto/create-employee.dto';
import { HelpsupportService } from 'src/helpsupport/helpsupport.service';
import { hsDto } from 'src/helpsupport/dto/create-helpsupport.dto';
import * as csvWriter from 'csv-writer';
import { Users } from 'src/users/schema/users.schema';
import * as path from 'path';
import * as fs from 'fs';
import * as excel from 'excel4node';
import * as pdf from 'pdfkit';




@Injectable()
export class AdminService {
  private readonly logger = new Logger(Admin.name);
  constructor(
    private readonly tokenSrv: TokenService,
    private readonly userSrv: UsersService,
    private readonly tranSrv: TransactionService,
    private readonly empSrv: EmployeeService,
    private readonly helpSrv: HelpsupportService,
    @InjectModel(Admin.name) private readonly AdminModel: Model<Admin>,
    @InjectModel(Users.name) private readonly usersModel: Model<Users>,
  ) {
    const reportDir = path.join(__dirname, '..', 'usersReport');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir);
    }
  
  }

  async getAUser(userId: string): Promise<BaseResponseTypeDTO> {
    try {
      return await this.userSrv.getAUser(userId);
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findAllUsers(): Promise<BaseResponseTypeDTO> {
    try {
      return await this.userSrv.findAllUsers();
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async deleteUser(userId: string): Promise<BaseResponseTypeDTO> {
    try {
      return await this.userSrv.deleteUser(userId);
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
      return await this.userSrv.controlUser(userId, payload);
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async getUsersByAccStatus(status: string): Promise<BaseResponseTypeDTO> {
    try {
      return await this.userSrv.getUsersByAccStatus(status);
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async getUsersByCountry(country: string): Promise<BaseResponseTypeDTO> {
    try {
      return await this.userSrv.getUsersByCountry(country);
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }


  async getCreditRevenue(filter: REVENUEFILTER): Promise<BaseResponseTypeDTO> {
    try {
      return await this.tranSrv.getCreditRevenue(filter);
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async getSubscriptionRevenue(
    filter: REVENUEFILTER,
  ): Promise<BaseResponseTypeDTO> {
    try {
      return await this.tranSrv.getSubscriptionRevenue(filter);
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async getRevenue(filter: REVENUEFILTER): Promise<BaseResponseTypeDTO> {
    try {
      return await this.tranSrv.getRevenue(filter);
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }


  async getAllTrans(): Promise<BaseResponseTypeDTO> {
    try {
      return await this.tranSrv.getAllTrans();
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }
  
  async creatHelp(
    userId:string,
    payload: hsDto,
  ): Promise<BaseResponseTypeDTO> {
    try {
      return await this.helpSrv.createhelp(userId,payload);
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async getHelp(
    id:string,
  ): Promise<BaseResponseTypeDTO> {
    try {
      return await this.helpSrv.getAHelp(id);
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }
  async getAllHelps(): Promise<BaseResponseTypeDTO> {
    try {
      return await this.helpSrv.getAllHelps();
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async addEmployee(
    userId: string,
    payload: EmployeeDto,
  ): Promise<BaseResponseTypeDTO> {
    try {
      return await this.empSrv.createEmployee(userId, payload);
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async getEmployees(): Promise<BaseResponseTypeDTO> {
    try {
      return await this.empSrv.getEmployees();
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async getAUserDetails(userId: string){
    try {
      const BIODATA = await this.userSrv.getAUser(userId);

    return {
      data: BIODATA,
      success: true,
      code: HttpStatus.OK,
      message: 'User Details fetched',
    };
  
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

// private async generateCSV(transactions: Users[]): Promise<string> {
//     const filePath = path.join(__dirname, '..', 'users', 'users.csv');
//     const createCsvWriter = csvWriter.createObjectCsvWriter;
//     const writer = createCsvWriter({
//       path: filePath,
//       header: [
//         { id: '_id', title: 'User ID' },
//         { id: 'email', title: 'Email' },
//         { id: 'firstName', title: 'First Name' },
//         { id: 'lastName', title: 'Last Name' },
//         { id: 'age', title: 'Age' },
//         { id: 'account_status', title: 'Account Status' },
//         { id: 'lastLogged', title: 'Last Logged' },
//         { id: 'createdAt', title: 'Created Date' },
//         { id: 'updatedAt', title: 'Updated Date' },
//       ],
//     });
//     await writer.writeRecords(transactions);
//     return filePath;
//   }

 async generateCSV(users: Users[]): Promise<string> {
  const dirPath = path?.join(__dirname, '..', 'usersReport');
  const filePath = path?.join(dirPath, 'users.csv');

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const createCsvWriter = csvWriter.createObjectCsvWriter;
  const writer = createCsvWriter({
    path: filePath,
    header: [
      { id: '_id', title: 'User ID' },
      { id: 'email', title: 'Email' },
      { id: 'firstName', title: 'First Name' },
      { id: 'lastName', title: 'Last Name' },
      { id: 'age', title: 'Age' },
      { id: 'account_status', title: 'Account Status' },
      { id: 'lastLogged', title: 'Last Logged' },
      { id: 'createdAt', title: 'Created Date' },
      { id: 'updatedAt', title: 'Updated Date' },
    ],
  });

  try {
    // Write records to CSV file
    await writer.writeRecords(users);

    return filePath
  } catch (error) {
    throw new Error(`Failed to generate CSV: ${error.message}`);
  }
}

private async generateExcel(users: Users[]): Promise<string> {
  const filePath = path.join(__dirname, '..', 'usersReport', 'users.xlsx');
  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet('Transactions');

  const headers = [
    'User ID',
    'Email',
    'First Name',
    'Last Name',
    'Account Status',
    'Last Logged',
    'Age',
    'Created Date',
    'Updated Date',
  ];

  users.forEach((header, index) => {
    worksheet.cell(1, index + 1).string(header);
  });

  users.forEach((user, rowIndex) => {
    worksheet.cell(rowIndex + 2, 1).string(user.firstName);
    worksheet.cell(rowIndex + 2, 2).string(user.lastName);
    worksheet.cell(rowIndex + 2, 3).string(user.email);
    worksheet.cell(rowIndex + 2, 4).string(user.account_status);
    worksheet.cell(rowIndex + 2, 5).date(user.lastLogged);
    worksheet.cell(rowIndex + 2, 6).date(user.age);
    worksheet.cell(rowIndex + 2, 7).date(user.createdAt);
    worksheet.cell(rowIndex + 2, 8).date(user.updatedAt);
  });

  workbook.write(filePath);
  return filePath;
}

private async generatePDF(users: Users[]): Promise<string> {
  const filePath = path.join(__dirname, '..', 'usersReport', 'users.pdf');
  const doc = new pdf();
  doc.pipe(fs.createWriteStream(filePath));

  users.forEach((user) => {
    // doc.text(`User ID: ${user._id}`);
    doc.text(`First Name: ${user.firstName}`);
    doc.text(`Last Name: ${user.lastName}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Account Status: ${user.account_status}`);
    doc.text(`Last Logged: ${user.lastLogged}`);
    doc.text(`Age: ${user.age}`);
    doc.text(`Created Date: ${user.createdAt}`);
    doc.text(`Updated Date: ${user.updatedAt}`);
    doc.text('------------------------------------');
  });

  doc.end();
  return filePath;
}

async generateUserReport(dto: GenerateUserReportDto): Promise<any> {
  const { startDate, endDate, docType } = dto;

  const user = await this.usersModel.find({
    createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
  }).exec();

  if (!user.length) {
    throw new BadRequestException(
      'No users found for the given criteria',
    );
  }

  let filePath: string | any;
  switch (docType) {
    case DowloadFormat.CSV:
      filePath = await this.generateCSV(user);
      break;
    case DowloadFormat.EXCEL:
      filePath = await this.generateExcel(user);
      break;
    case DowloadFormat.PDF:
      filePath = await this.generatePDF(user);
      break;
  }

  console.log('downloadingg', filePath)
  // const ExistingUser = await this.userSrv.getAUser(userId);
  // await this.sendEmailWithAttachment(filePath, ExistingUser.data.email);
  return {
    data: filePath,
    success: true,
    code: 201,
    message: 'Your report has been generated successfully',
  };
}


}
