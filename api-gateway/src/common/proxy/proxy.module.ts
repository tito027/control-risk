import { Module } from '@nestjs/common';
import { ClientProxyControl } from './client.proxy';

@Module({
  providers: [ClientProxyControl],
  exports: [ClientProxyControl],
})
export class ProxyModule {}
