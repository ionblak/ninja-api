import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';

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
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  replacePost(id: number, post: UpdatePostDto) {
    // const postIndex = this.posts.findIndex((post) => post.id === id);
    // if (postIndex > -1) {
    //   this.posts[postIndex] = post;
    //   return post;
    // }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  createPost(post: CreatePostDto) {
    // const newPost = {
    //   id: ++this.lastPostId,
    //   ...post,
    // };
    // this.posts.push(newPost);
    // return newPost;
  }

  deletePost(id: number) {
    // const postIndex = this.posts.findIndex((post) => post.id === id);
    // if (postIndex > -1) {
    //   this.posts.splice(postIndex, 1);
    // } else {
    //   throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    // }
  }
}
