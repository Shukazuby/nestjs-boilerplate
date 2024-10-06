import { ApiProperty } from '@nestjs/swagger';
import {IsNumber, IsString} from 'class-validator';


export class CreditDto {
@ApiProperty({ example: 'AppName Credit', description: '' })
@IsString()
name: string

@ApiProperty({ example: '20', description: '' })
@IsNumber()
credit: number

@ApiProperty({ example: '50', description: '' })
@IsNumber()
amount: number
}
export class UseCreditDto {

@ApiProperty({ example: '20', description: '' })
@IsNumber()
credit: number

}



export class CreateCreditDto {}
