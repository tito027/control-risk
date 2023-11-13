import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IConfig } from 'src/common/interfaces/config.interface';
import * as path from 'path';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

const uploadModule = MulterModule.registerAsync({
  imports: [ConfigModule],
  useFactory: (config: ConfigService<IConfig>) => ({
    storage: diskStorage({
      destination(req, file, callback) {
        console.log('FILE_PATH', path.resolve(config.get('FILE_PATH')));
        callback(null, path.resolve(config.get('FILE_PATH')));
      },
    }),
  }),
  inject: [ConfigService],
});
@Module({
  imports: [uploadModule],
  controllers: [AssetsController],
  providers: [AssetsService],
  exports: [AssetsService],
})
export class AssetsModule {}
