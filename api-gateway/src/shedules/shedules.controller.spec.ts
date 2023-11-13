import { Test, TestingModule } from '@nestjs/testing';
import { ShedulesController } from './shedules.controller';

describe('ShedulesController', () => {
  let controller: ShedulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShedulesController],
    }).compile();

    controller = module.get<ShedulesController>(ShedulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
