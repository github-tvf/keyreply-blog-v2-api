import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '@/auth/types';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dtos/create-blog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  @Post('thumbnail')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  uploadThumbnail(@UploadedFile() file: Express.Multer.File) {
    return {
      fileName: file.filename,
    };
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  publishBlog(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateBlogDto,
  ) {
    return this.blogsService.createBlog({ ...body }, user.id);
  }

  @Get()
  getBlogs() {
    return this.blogsService.getBlogs();
  }

  @Get(':id')
  getBlogById(@Param('id') id: string) {
    return this.blogsService.getBlogById(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteBlogById(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const blog = await this.blogsService.getBlogById(id);
    if (!blog) {
      throw new BadRequestException(['This blog does not exist']);
    }

    if (blog.authorId !== user.id) {
      throw new BadRequestException([
        "You don't have permission to delete this blog",
      ]);
    }

    return this.blogsService.deleteBlogById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateBlog(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() payload: CreateBlogDto,
  ) {
    const blog = await this.blogsService.getBlogById(id);
    if (!blog) {
      throw new BadRequestException(['This blog does not exist']);
    }

    if (blog.authorId !== userId) {
      throw new BadRequestException([
        "You don't have permission to update this blog",
      ]);
    }

    await this.blogsService.updateBlogById(id, payload);
    return {
      status: 'success',
    };
  }
}
