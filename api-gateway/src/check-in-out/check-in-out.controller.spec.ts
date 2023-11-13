import { Test, TestingModule } from '@nestjs/testing';
import { CheckInOutController } from './check-in-out.controller';

describe('CheckInOutController', () => {
  let controller: CheckInOutController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckInOutController],
    }).compile();

    controller = module.get<CheckInOutController>(CheckInOutController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
