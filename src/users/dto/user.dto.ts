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
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
} from 'class-validator';
import { accountSettings, customizeSettings, detailsSettings, GenderDetails, notificationSettings, privacySettings, Realtionshipgoals } from '../schema/users.schema';
import { Type } from 'class-transformer';

export enum Gender {
  WOMAN = "woman",
  MAN = "man",
  NON_BINARY = "non_binary",
}

export enum GenderDeet {
  STAIGHTWOMAN = "straight_woman",
  TRANSWOMAN = "trans_woman",
  CISWOMAN = "cis_woman",
  FEMININE = "feminine_presenting",
  STAIGHTMEN = "straight_men",
  TRANSMEN = "trans_men",
  CISMEN = "cis_men",
  MASCULINE = "masculine_presenting",
}
export class createUserWithPhone{
  @ApiProperty({ example: '099998877', description: 'User phone number' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: 'password@123', description: 'User password' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 8 characters long' })
  password: string;

}
export class verifyPhone{
  @ApiProperty({
    example: '2093',
    description: 'User verification code',
  })
  @IsString()
  uniqueVerificationCode: string;

}
export class changePhone{
  @ApiProperty({ example: '0909356218', description: 'Phone Number' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: '2093',
    description: 'change phone number verification code',
  })
  @IsString()
  verifycode: string;

}
export class profileDto{
  @ApiProperty({ example: 'Doe4you', description: 'User name' })
  @IsString()
  userName: string;

  @ApiProperty({ example: '', description: '' })
  @IsString()
  location: [number, number];

  @ApiProperty({ example: '2024-08-15', description: 'User date of birth' })
  @IsDate()
  dob: Date;

  @ApiProperty({ type: () => GenderDetails })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GenderDetails)
  @ArrayNotEmpty({
    message: 'Gender details is added here',
  })  
  genderDetail: GenderDetails;


  @ApiProperty({ type: () => detailsSettings })
  @ValidateNested({ each: true })
  @Type(() => detailsSettings)
  moreInfo: detailsSettings;

  @ApiProperty({ type: () => privacySettings })
  @ValidateNested({ each: true })
  @Type(() => privacySettings)
  privacy: privacySettings;

  @ApiProperty({ type: () => notificationSettings })
  @ValidateNested({ each: true })
  @Type(() => notificationSettings)
  notificication: notificationSettings;

  @ApiProperty({ type: () => customizeSettings})
  @ValidateNested({ each: true })
  @Type(() => customizeSettings)
  customizeExperience: customizeSettings;

  @ApiProperty({ type: () => accountSettings})
  @ValidateNested({ each: true })
  @Type(() => accountSettings)
  account: accountSettings;

}

export class UserDto {
  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsString()
  firstName: string;

  verificationCodeExpiration: Date;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'Doe4you', description: 'User name' })
  @IsString()
  userName: string;

  @ApiProperty({ example: '2024-08-15', description: 'User date of birth' })
  @IsDate()
  dob: Date;


  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  deviceId: string;

  @ApiProperty()
  @IsString()
  profileImageUrl: string;

  @ApiProperty({ example: 'password@123', description: 'User password' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty()
  location: [number, number];

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  userGallery: string[];

  @ApiProperty()
  interests: string[];

  @ApiProperty({ type: () => [Realtionshipgoals] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Realtionshipgoals)
  @ArrayNotEmpty({
    message: 'At least one relationship goals should be added',
  })  
  relationshipStatus: Realtionshipgoals[];

  @ApiProperty({ type: () => GenderDetails })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GenderDetails)
  @ArrayNotEmpty({
    message: 'Gender details is added here',
  })  
  genderDetail: GenderDetails;

  @ApiProperty()
  AppNamePhotoAccess: boolean;

  @ApiProperty()
  AppNameLocationAccess: boolean;

  @ApiProperty()
  isPhoneVerified: boolean;

  @ApiProperty()
  isShowGender: boolean;


}

export class updateUserDto extends UserDto {}

export class CreateUserDto {}
