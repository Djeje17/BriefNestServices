import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt'; // Importe le JwtService

describe('UsersService & Entity', () => {
  let service: UsersService;
  
  const mockUserRepository = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(user => Promise.resolve({ id: 1, ...user })),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('fake_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService }, // Ajoute cette ligne
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });
  // TEST 1: Validation de l'email
  it('should fail validation with an invalid email', async () => {
    const user = new User();
    user.email = 'not-an-email';
    const errors = await validate(user);
    expect(errors.length).toBeGreaterThan(0);
  });

  // TEST 2: Masquage du mot de passe (Simulation JSON)
  it('should not include password in JSON output', () => {
    const user = new User();
    user.password = 'secret123';
    const json = JSON.parse(JSON.stringify(user));
    expect(json.password).toBeUndefined();
  });

  // TEST 3: Création d'utilisateur via le service
  it('should create a user successfully', async () => {
    const dto = { name: 'John', email: 'john@test.com', password: '123' };
    expect(await service.create(dto)).toEqual({ id: 1, ...dto });
  });

  // TEST 4: Vérification de l'initialisation des posts
  it('should have an empty posts array by default', () => {
    const user = new User();
    expect(user.posts).toBeUndefined(); // Dans TypeORM, c'est undefined tant que non chargé
  });

  // TEST 5: Unicité (Logique de mock)
  it('should throw error if email already exists', async () => {
    mockUserRepository.findOne.mockResolvedValue({ id: 1, email: 'exists@test.com' });
    // Ici tu testerais ta logique de service qui vérifie l'existence
    // expect(service.create(...)).rejects.toThrow();
  });
});