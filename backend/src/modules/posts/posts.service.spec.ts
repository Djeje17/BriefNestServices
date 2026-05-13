import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { validate } from 'class-validator';

describe('PostsService', () => {
  let service: PostsService;

  const mockPostRepository = {
    create: jest.fn().mockImplementation(dto => ({
      ...dto,
      user: { id: dto.userId } 
    })),
    save: jest.fn().mockImplementation(post => 
      Promise.resolve({ 
        id: 10, 
        ...post,
        title: post.title,
        description: post.description
      })
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getRepositoryToken(Post), useValue: mockPostRepository },
      ],
    }).compile();
    service = module.get<PostsService>(PostsService);
  });

  it('should fail if title exceeds 255 chars', async () => {
    const dto = new CreatePostDto();
    dto.title = 'a'.repeat(256);
    dto.description = 'Valide';
    dto.userId = 1;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should link post to a user ID', async () => {
    const dto = { title: 'Titre', description: 'Desc', userId: 1 };
    const result = await service.create(dto);
    // On vérifie si result existe d'abord pour éviter l'erreur undefined
    expect(result).toBeDefined();
    if (result) {
        expect(result.user).toBeDefined();
    }
  });

  it('should return a post with a generated ID', async () => {
    const result = await service.create({ title: 'T', description: 'D', userId: 1 });
    expect(result).toBeDefined();
    expect(result?.id).toBe(10);
  });

  it('should save the exact title and description provided', async () => {
    const data = { title: 'NestJS Rocks', description: 'Indeed', userId: 5 };
    const result = await service.create(data);
    expect(result?.title).toBe('NestJS Rocks');
    expect(result?.description).toBe('Indeed');
  });
});