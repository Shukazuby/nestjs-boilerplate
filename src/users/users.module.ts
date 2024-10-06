import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schema/users.schema';
import { Token, TokenSchema } from 'src/tokens/schema/tokens.schema';
import { TokensModule } from 'src/tokens/tokens.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema}]),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema}]),
   forwardRef(() => TokensModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
