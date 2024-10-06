import { ApiProperty } from '@nestjs/swagger';
import {IsString,} from 'class-validator';

export class hsDto {
  @ApiProperty({ example: 'What is AppName?', description: '' })
  @IsString()
  question: string;

  @ApiProperty({ example: 'AppName is a blah blah. ', description: '' })
  @IsString()
  answer: string;


}

export class updateHelpsupportDto extends hsDto {}


export class CreateHelpsupportDto {}
