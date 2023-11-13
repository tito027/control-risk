import { Test, TestingModule } from '@nestjs/testing';
import { UsersInformationsController } from './users-informations.controller';
import { UsersInformationsService } from './users-informations.service';

describe('UsersInformationsController', () => {
  let controller: UsersInformationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersInformationsController],
      providers: [UsersInformationsService],
    }).compile();

    controller = module.get<UsersInformationsController>(UsersInformationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
