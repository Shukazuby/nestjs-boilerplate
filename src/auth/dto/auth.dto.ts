import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsDate,
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { AppRole } from 'src/utils';

export class registerWithPhone {
  @ApiProperty({ example: '099998877', description: 'User phone number' })
  @IsString()
  phoneNumber: string;
  
  @ApiProperty({ example: 'USER', description: '' })
  @IsString()
  role?: AppRole
}

export class SignUpAndInDto {
  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'USER', description: '' })
  @IsString()
  role?: AppRole

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '08080372921', description: 'User phone number' })
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ example: 'password@123', description: 'User password' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({ example: 'GOOGLE', description: '' })
  @IsString()
  provider: string;

  @ApiProperty({ example: '12345IdGoogle', description: '' })
  @IsString()
  thirdPartyUserId?: string;

  @ApiProperty({ example: 'deviceId', description: '' })
  @IsString()
  deviceId?: string;
}

export class loginWithPhone {
  @ApiProperty({ example: '099998877', description: 'User phone number' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: 'password@123', description: 'User password' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({ example: 'deviceId', description: 'user device' })
  @IsString()
  deviceId: string;

}

export class logoutDTO {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjFkNTgyZTAzYjQyNWI2ZTg3ZTFmNWQiLCJlbWFpbCI6InNodWthenVieUBnbWFpbC5jb20iLCJyb2xlcyI6WyI2M2ZiYTAzNGEzY2M2N2IyNTdhMGQ4MWIiLCI2M2ZiYTAzNGEzY2M2N2IyNTdhMGQ3YzIiXSwiaXNfdmVyaWZpZWQiOnRydWUsImlhdCI6MTcyMzk4Njg4NCwiZXhwIjoxNzI2OTIwNDcxNTQ5LCJhdWQiOiJodHRwOi8vZWF0bm91cmlzaGEuY29tIn0.WaKwRwujxjMDlh1GIpkvHqM4CV2bxORPAN_UoDT1Qkg',
    description: 'access token',
  })
  @IsString()
  authorizationHeader: string;
}

export class resetPasswordDTO {
  @ApiProperty({ example: '', description: 'reset token' })
  @IsString()
  resetToken: string;

  @ApiProperty({ example: 'Zuzu@123', description: 'User new password' })
  @IsString()
  newPassword: string;

  @ApiProperty({ example: 'deviceId', description: 'User deviceId' })
  @IsString()
  deviceId: string;
}

export class forgotPasswordDTO {
  @ApiProperty({ example: '099998877', description: 'User phone number' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: 'deviceId', description: 'User deviceId' })
  @IsString()
  deviceId: string;
}

export class AuthDto {
  @ApiProperty({ example: '099998877', description: 'User phone number' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class changePasswordDTO {
  @ApiProperty({ example: 'JohnD@e5', description: 'old password' })
  @IsString()
  currentPassword: string;
  @ApiProperty({ example: 'Doerw77@1', description: 'new password' })
  @IsString()
  newPassword: string;

  @ApiProperty({ example: 'deviceId', description: 'user deviceId' })
  @IsString()
  deviceId: string;
}


export class updateAuthDto extends AuthDto {}

export class CreateAuthDto {}
