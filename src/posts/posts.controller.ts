import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { JwtAuthenticationGuard } from 'src/authentication/jwt-authentication.guard';
import { FindOneParams } from 'src/utils/findOneParams';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get(':id')
  getPostById(@Param() { id }: FindOneParams) {
    return this.postsService.getPostById(Number(id));
  }
  @UseGuards(JwtAuthenticationGuard)
  @Post()
  async createPost(@Body() post: CreatePostDto) {
    return this.postsService.createPost(post);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Put(':id')
  async replacePost(@Param() { id }: FindOneParams, post: UpdatePostDto) {
    return this.postsService.updatePost(Number(id), post);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':id')
  async deletePost(@Param() { id }: FindOneParams) {
    this.postsService.deletePost(Number(id));
  }
}
