import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AdminDto {
  @ApiProperty({ example: 'John', description: '' })
  @IsString()
  firstName: string;

}

export class ControlDto {
  @ApiProperty({ example: 'Suspended', description: '' })
  @IsString()
  status: string;

}

export enum DowloadFormat {
  PDF = 'pdf',
  CSV = 'csv',
  EXCEL = 'excel',
}

export class GenerateUserReportDto {
  // @ApiProperty({
  //   example: '1234567890abcdef12345678', // Example user ID
  // })
  // @IsString()
  // userId: string;

  @ApiProperty({
    example: '2024-08-29T12:35:01.673+00:00', // Example start date
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    example: '2024-09-27T15:09:43.356+00:00', // Example end date
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    enum: DowloadFormat,
    example: DowloadFormat.CSV, // Example document type
  })
  @IsEnum(DowloadFormat)
  docType: DowloadFormat;
}

export class updateAdminDto extends AdminDto {}

export class CreateAdminDto {}
