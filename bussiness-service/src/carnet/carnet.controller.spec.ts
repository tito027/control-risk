import { Test, TestingModule } from '@nestjs/testing';
import { CarnetController } from './carnet.controller';

describe('CarnetController', () => {
  let controller: CarnetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarnetController],
    }).compile();

    controller = module.get<CarnetController>(CarnetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
