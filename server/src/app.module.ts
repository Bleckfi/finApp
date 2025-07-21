import { Module } from '@nestjs/common';
import { AppController } from './user/controller';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
