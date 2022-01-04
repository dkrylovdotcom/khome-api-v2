import { Module } from '@nestjs/common';
import { TCPClient } from './components/TCPClient';
import { MQTTMediator } from './MQTTMediator';

// NOTE:: https://docs.nestjs.com/modules#global-modules
// ?@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [TCPClient, MQTTMediator],
  exports: [TCPClient, MQTTMediator],
})
export class CoreModule {}
