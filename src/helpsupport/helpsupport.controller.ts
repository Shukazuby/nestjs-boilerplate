import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { HelpsupportService } from './helpsupport.service';
import { hsDto } from './dto/create-helpsupport.dto';
import { UpdateHelpsupportDto } from './dto/update-helpsupport.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseTypeDTO } from 'src/utils';
// @ApiTags('Help and Support')
@Controller('help')
export class HelpsupportController {
  constructor(private readonly helpsupportService: HelpsupportService) {}

  // @Post(':id')
  @ApiOperation({ summary: 'Create help and support' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'help and support created' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async createhelp(@Param('id') id: string, @Body() payload: hsDto): Promise<BaseResponseTypeDTO> {
    const result = await this.helpsupportService.createhelp(id, payload);
    return result;
  }

  // @Get()
  @ApiOperation({ summary: 'Get all help and support' })
  @ApiResponse({ status: HttpStatus.OK, description: 'help and support fetched' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async getallhelp(): Promise<BaseResponseTypeDTO> {
    const result = await this.helpsupportService.getAllHelps();
    return result;
  }

  // @Get(':id')
  @ApiOperation({ summary: 'Get a help and support' })
  @ApiResponse({ status: HttpStatus.OK, description: 'help and support fetched' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async getahelp(@Param('id') id:string): Promise<BaseResponseTypeDTO> {
    const result = await this.helpsupportService.getAHelp(id);
    return result;
  }

}
