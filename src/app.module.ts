import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KAFKA_OPTION } from './constants';
import { AppMessageController } from './app.message.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: KAFKA_OPTION,
      },
    ]),
  ],
  controllers: [AppController, AppMessageController],
  providers: [AppService],
})
export class AppModule {}
