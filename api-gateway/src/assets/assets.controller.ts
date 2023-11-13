import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { IConfig } from 'src/common/interfaces/config.interface';
import * as path from 'path';
import { AssetsService } from './assets.service';

@Controller('assets')
export class AssetsController {
  constructor(
    private readonly assetsService: AssetsService,
    readonly configService: ConfigService<IConfig>,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination(req, file, callback) {
          const dir: string = path.join(
            path.resolve(),
            process.env.FILE_PATH,
            req.body.path ?? '',
          );
          if (dir && !existsSync(dir)) mkdirSync(dir);
          callback(null, dir);
        },
        filename(req, file, callback) {
          callback(null, req.body.name);
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('name') name: string,
    @Body('path') dir: string,
  ) {
    return { saved: true };
  }
}
