import { ApiProperty } from '@nestjs/swagger';
import {IsNumber, IsString} from 'class-validator';


export class PlanDto {
@ApiProperty({ example: 'AppName Premium', description: '' })
@IsString()
name: string

@ApiProperty({ example: '500', description: '' })
@IsNumber()
amount: number

@ApiProperty({ example: 'monthly', description: '' })
@IsNumber()
interval: string

@IsString()
planId: string

}
export class SubDto {
@ApiProperty({ example: '66e43305f51526b526444a40', description: '' })
planId: number
}
export class CreatePlanDto {}
