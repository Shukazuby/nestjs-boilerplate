import { PartialType } from '@nestjs/swagger';
import { AuthDto, CreateAuthDto } from './auth.dto';

export class UpdateAuthDto extends AuthDto {}
// export class UpdateAuthDto extends PartialType(CreateAuthDto) {}
