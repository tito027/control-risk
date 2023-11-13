import { Test, TestingModule } from '@nestjs/testing';
import { CarnetService } from './carnet.service';

describe('CarnetService', () => {
  let service: CarnetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarnetService],
    }).compile();

    service = module.get<CarnetService>(CarnetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
