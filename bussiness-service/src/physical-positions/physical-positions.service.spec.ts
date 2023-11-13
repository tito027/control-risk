import { Test, TestingModule } from '@nestjs/testing';
import { PhysicalPositionsService } from './physical-positions.service';

describe('PhysicalPositionsService', () => {
  let service: PhysicalPositionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhysicalPositionsService],
    }).compile();

    service = module.get<PhysicalPositionsService>(PhysicalPositionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
