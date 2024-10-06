import { forwardRef, Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schema/admin.schema';
import { Token, TokenSchema } from 'src/tokens/schema/tokens.schema';
import { TokensModule } from 'src/tokens/tokens.module';
import { Users, UsersSchema } from 'src/users/schema/users.schema';
import { UsersModule } from 'src/users/users.module';
import {
  Transaction,
  TransactionSchema,
} from 'src/Billings/transaction/schema/transaction.schema';
import { TransactionModule } from 'src/Billings/transaction/transaction.module';
import {
  Employee,
  EmployeeSchema,
} from 'src/admin/employee/schema/employee.schema';
import { EmployeeModule } from 'src/admin/employee/employee.module';
import { helpsupport, helpsupportSchema } from 'src/helpsupport/schema/helpsupport.schema';
import { HelpsupportModule } from 'src/helpsupport/helpsupport.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    forwardRef(() => TokensModule),
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    forwardRef(() => TransactionModule),
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
    ]),
    forwardRef(() => EmployeeModule),
    MongooseModule.forFeature([
      { name: helpsupport.name, schema: helpsupportSchema },
    ]),
    forwardRef(() => HelpsupportModule),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
