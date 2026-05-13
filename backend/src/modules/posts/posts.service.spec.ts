import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { validate } from 'class-validator';

describe('PostsService', () => {
  let service: PostsService;

  const mockPostRepository = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(post => Promise.resolve({ id: 10, ...post })),
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

  // TEST 6: Validation du DTO (Titre trop long)
  it('should fail if title exceeds 255 chars', async () => {
    const dto = new CreatePostDto();
    dto.title = 'a'.repeat(256);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  // TEST 7: Création avec relation User
  it('should link post to a user ID', async () => {
    const dto = { title: 'Titre', description: 'Desc', userId: 1 };
    const result = await service.create(dto);
    expect(result.user).toEqual({ id: 1 });
  });

  // TEST 8: Validation de la description obligatoire
  it('should fail if description is empty', async () => {
    const dto = new CreatePostDto();
    dto.title = 'Un titre valide';
    dto.description = '';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  // TEST 9: Génération de l'ID
  it('should return a post with a generated ID', async () => {
    const result = await service.create({ title: 'T', description: 'D', userId: 1 });
    expect(result.id).toBe(10);
  });

  // TEST 10: Intégrité des données
  it('should save the exact title and description provided', async () => {
    const data = { title: 'NestJS Rocks', description: 'Indeed', userId: 5 };
    const result = await service.create(data);
    expect(result.title).toBe('NestJS Rocks');
    expect(result.description).toBe('Indeed');
  });
});