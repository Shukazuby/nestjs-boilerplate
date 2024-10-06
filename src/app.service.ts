import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FileResponseDTO, uploadFileToS3 } from './utils';
import {RtcTokenBuilder, RtcRole} from 'agora-token';
const appId = process.env.AGORA_APP_ID
const appCert = process.env.AGORA_APP_CERT


@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    return 'Hello World!';
  }

  async uploadMultipleFiles(
    files: Array<any>,
  ): Promise<FileResponseDTO> {
    console.log("Sent Files From The Server",files)
    try {
      const filePaths = files.map((data) => ({
        path: `uploads/${data.filename}`,
        mimeType: data.mimetype,
      }));
      const filePathAsync = filePaths.map((file) =>
        uploadFileToS3(file.path, true),
      );
      const [...uploadedFilePaths] = await Promise.all(filePathAsync);
      return {
        success: true,
        code: HttpStatus.OK,
        message: 'Uploaded',
        data: uploadedFilePaths,
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  // Agora token function

async nocache(req: any, res:any, next){
  res.header('Cache-Control', 'private', 'no-cache', 'no-store', 'must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next()

  
}

async  generateAgoraToken(channelName?: string, uid?: any, role?: any, expires?: any){
  if(!channelName){
    throw new HttpException('Channel is required', HttpStatus.INTERNAL_SERVER_ERROR);
  }
  
  let _uid = uid
  if(!_uid || _uid === ''){
    _uid = 0
  }
  let Role = RtcRole.SUBSCRIBER
  if(role === 'publisher'){
    Role = RtcRole.PUBLISHER
  }
  let expireTime = expires
  if(!expireTime || expireTime === ''){
    expireTime = 3600;
  }else{
    expireTime = parseInt(expireTime, 10)
  }

  const currentTime = Math.floor(Date.now() / 1000)
  const privilagedExpireTime = currentTime + expireTime

  const token = RtcTokenBuilder.buildTokenWithUid(appId, appCert, channelName, uid,Role, expireTime,privilagedExpireTime)

  return token

}

}
