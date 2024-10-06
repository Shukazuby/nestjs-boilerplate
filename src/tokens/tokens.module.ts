import { Module } from '@nestjs/common';
import { TokenService } from './tokens.service';
import { TokensController } from './tokens.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './schema/tokens.schema';


@Module({
  imports: [MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema}])],
  controllers: [TokensController],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokensModule {}
