import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { PostNotFoundException } from './exception/postNotFound.exception';
import { User } from 'src/users/users.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  getAllPosts(): Promise<Post[]> {
    return this.postRepository.find({ relations: ['author'] });
  }

  async getPostById(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (post) {
      return post;
    }
    throw new PostNotFoundException(id);
  }

  async updatePost(id: number, post: UpdatePostDto): Promise<Post> {
    await this.postRepository.update(id, post);
    const updatedPost = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (updatedPost) {
      return updatedPost;
    }
    throw new PostNotFoundException(id);
  }

  async createPost(post: CreatePostDto, user: User): Promise<Post> {
    const newPost = this.postRepository.create({ ...post, author: user });
    await this.postRepository.save(newPost);
    return newPost;
  }

  async deletePost(id: number): Promise<void> {
    const deleteResponce = await this.postRepository.delete(id);
    if (!deleteResponce.affected) {
      throw new PostNotFoundException(id);
    }
  }
}
