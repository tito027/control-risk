import { Test, TestingModule } from '@nestjs/testing';
import { PhysicalPositionController } from './physical-position.controller';

describe('PhysicalPositionController', () => {
  let controller: PhysicalPositionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhysicalPositionController],
    }).compile();

    controller = module.get<PhysicalPositionController>(
      PhysicalPositionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
