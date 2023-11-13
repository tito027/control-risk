import { Test, TestingModule } from '@nestjs/testing';
import { PhysicalPositionsController } from './physical-positions.controller';

describe('PhysicalPositionsController', () => {
  let controller: PhysicalPositionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhysicalPositionsController],
    }).compile();

    controller = module.get<PhysicalPositionsController>(
      PhysicalPositionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
