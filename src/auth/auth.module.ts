import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './schema/auth.schema';
import { Users } from 'src/users/schema/users.schema';
import { Token, TokenSchema } from 'src/tokens/schema/tokens.schema';
import { TokensModule } from 'src/tokens/tokens.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: AuthSchema}]),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    forwardRef(() => TokensModule),
],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
