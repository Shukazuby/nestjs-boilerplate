import {
  Controller,
  Get,
  Header,
  Headers,
  HttpStatus,
  Next,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiResponse, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FileResponseDTO } from './utils/utils.types';
import { MulterValidators } from './utils/multer.validator';
import { AppService } from './app.service';
import * as crypto from 'crypto';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): { message: string } {
    return { message: 'Welcome to Nest-Boilerplate Api' };
  }

  @Get('/health-check')
  healthCheck(@Res() res: Response): void {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now(),
    };
    try {
      res.send(healthcheck);
    } catch (ex) {
      healthcheck.message = ex;
      res.status(503).send();
    }
  }

  @ApiConsumes('multipart/form-data')
  @ApiResponse({ type: () => FileResponseDTO })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        'files[]': {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  
  @UseInterceptors(
    FilesInterceptor('files[]', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: MulterValidators.preserveOriginalFileName,
      }),
      fileFilter: MulterValidators.fileTypeFilter,
    }),
  )
  @ApiTags('Upload')
  @Post('/upload-files')
  async uploadMultipleFiles(
    @UploadedFiles() files: Array<any>,
  ): Promise<FileResponseDTO> {
    return await this.appService.uploadMultipleFiles(files);
  }
  @ApiTags('Agora')
  @Get('/agora-token')
  async agoraToken(
    @Query('channel') channel: string,
    @Query('uid') uid: number,       
    @Query('role') role: string,      
    @Query('expire') expire: number
  ) {
    // await this.appService.nocache(req,res,next)
    return await this.appService.generateAgoraToken(channel, uid, role, expire);
  }  

}
