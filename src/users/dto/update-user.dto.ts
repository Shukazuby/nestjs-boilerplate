import { PartialType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

// export class UpdateUserDto extends PartialType(CreateUserDto) {}
export class UpdateUserDto extends UserDto {}
