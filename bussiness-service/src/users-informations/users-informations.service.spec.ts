import { Test, TestingModule } from '@nestjs/testing';
import { UsersInformationsService } from './users-informations.service';

describe('UsersInformationsService', () => {
  let service: UsersInformationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersInformationsService],
    }).compile();

    service = module.get<UsersInformationsService>(UsersInformationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
