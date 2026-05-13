import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    // Création de l'objet Post avec la liaison User
    const newPost = this.postsRepository.create({
      title: createPostDto.title,
      description: createPostDto.description,
      user: { id: createPostDto.userId } as any,
    });
    
    // On retourne le résultat de la sauvegarde
    return await this.postsRepository.save(newPost);
  }

  findAll() {
    return this.postsRepository.find({ relations: ['user'] });
  }

  findOne(id: number) {
    return this.postsRepository.findOne({ where: { id }, relations: ['user'] });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.postsRepository.update(id, updatePostDto);
  }

  remove(id: number) {
    return this.postsRepository.delete(id);
  }
}