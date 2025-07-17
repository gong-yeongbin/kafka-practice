import {
  Get,
  Post,
  Body,
  Controller,
  Inject,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { RecordMetadata } from '@nestjs/microservices/external/kafka.interface';

@Controller()
export class AppController implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly appService: AppService,
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit(): Promise<void> {
    const topics = ['sum', 'max'];
    topics.forEach((topic) => this.kafkaClient.subscribeToResponseOf(topic));
    await this.kafkaClient.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.kafkaClient.close();
  }

  /* return Observable<number> */
  @Post('sum')
  sum(@Body() body: number[]): Observable<number> {
    return this.kafkaClient.send<number>('sum', { value: body });
  }

  /* return Promise<number> */
  @Post('max')
  async max(@Body() body: number[]): Promise<number> {
    return await lastValueFrom(
      this.kafkaClient.send<number>('max', { value: body }),
    );
  }

  @Post('print')
  print(
    @Body() { message }: { message: string },
  ): Observable<RecordMetadata[]> {
    return this.kafkaClient.emit<RecordMetadata[]>('print', { value: message });
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
