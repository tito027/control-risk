import { Test, TestingModule } from '@nestjs/testing';
import { ReasonsController } from './reasons.controller';

describe('ReasonsController', () => {
  let controller: ReasonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReasonsController],
    }).compile();

    controller = module.get<ReasonsController>(ReasonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
