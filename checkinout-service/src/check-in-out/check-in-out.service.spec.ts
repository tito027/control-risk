import { Test, TestingModule } from '@nestjs/testing';
import { CheckInOutService } from './check-in-out.service';

describe('CheckInOutService', () => {
  let service: CheckInOutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckInOutService],
    }).compile();

    service = module.get<CheckInOutService>(CheckInOutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
