import { forwardRef, Module } from '@nestjs/common';
import { HelpsupportService } from './helpsupport.service';
import { HelpsupportController } from './helpsupport.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { helpsupport, helpsupportSchema } from './schema/helpsupport.schema';
import { UsersModule } from 'src/users/users.module';
import { Users, UsersSchema } from 'src/users/schema/users.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: helpsupport.name, schema: helpsupportSchema}]),    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema}]),
    forwardRef(() => UsersModule), 

  ],
  controllers: [HelpsupportController],
  providers: [HelpsupportService],
  exports: [HelpsupportService]
})

export class HelpsupportModule {}
