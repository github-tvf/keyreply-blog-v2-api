import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private blogsRepository: Repository<Blog>,
  ) {}

  createBlog(
    payload: Pick<Blog, 'content' | 'description' | 'title' | 'thumbnail'>,
    userId: string,
  ) {
    return this.blogsRepository.save({
      ...payload,
      authorId: userId,
    });
  }

  getBlogs() {
    return this.blogsRepository.find({
      order: {
        createdAt: 'DESC',
      },
      relations: ['author'],
    });
  }

  getBlogById(id: string) {
    return this.blogsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  deleteBlogById(id: string) {
    return this.blogsRepository.delete(id);
  }

  updateBlogById(id: string, payload: Partial<Blog>) {
    return this.blogsRepository.update({ id }, { ...payload });
  }
}
