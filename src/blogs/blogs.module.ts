import { BadRequestException, Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public');
  },
  filename: (req, file, cb) => {
    const imageMime = 'image/';
    if (!file.mimetype.startsWith(imageMime)) {
      cb(new BadRequestException(['Sorry we only accept image file']), '');
    } else {
      cb(null, `${Date.now()}.${file.mimetype.split('/')[1]}`);
    }
  },
});

@Module({
  imports: [
    MulterModule.register({
      storage,
    }),
    TypeOrmModule.forFeature([Blog]),
  ],
  providers: [BlogsService],
  controllers: [BlogsController],
})
export class BlogsModule {}
