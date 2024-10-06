import { ApiProperty } from '@nestjs/swagger';
import {IsEmail, IsString} from 'class-validator';

export class EmployeeDto {
  
@ApiProperty({ example: 'John', description: '' })
@IsString()
firstName: string

@ApiProperty({ example: 'Doe', description: '' })
@IsString()
lastName: string

@ApiProperty({ example: 'joe@gmail.com', description: '' })
@IsEmail()
email: string

@ApiProperty()
@IsString()
permissions?: string[]

@ApiProperty({ example: 'Male', description: '' })
@IsString()
gender: string

@ApiProperty({ example: 'https//cloudinary.com', description: '' })
@IsString()
profile: string

@ApiProperty({ example: 'Admin@123', description: '' })
@IsString()
password: string

}
  
export class updateEmployeeDto extends EmployeeDto {}
  
export class CreateEmployeeDto {}
  