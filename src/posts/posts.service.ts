import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { PostNotFoundException } from './exception/postNotFound.exception';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  getAllPosts() {
    return this.postRepository.find();
  }

  async getPostById(id: number) {
    const post = await this.postRepository.findOne({ where: { id } });
    if (post) {
      return post;
    }
    throw new PostNotFoundException(id);
  }

  async updatePost(id: number, post: UpdatePostDto) {
    await this.postRepository.update(id, post);
    const updatedPost = await this.postRepository.findOne({ where: { id } });
    if (updatedPost) {
      return updatedPost;
    }
    throw new PostNotFoundException(id);
  }

  async createPost(post: CreatePostDto) {
    const newPost = this.postRepository.create(post);
    await this.postRepository.save(newPost);
    return newPost;
  }

  async deletePost(id: number) {
    const deleteResponce = await this.postRepository.delete(id);
    if (!deleteResponce.affected) {
      throw new PostNotFoundException(id);
    }
  }
}
