import { Test, TestingModule } from '@nestjs/testing';
import { NecordController } from './necord.controller';

describe('NecordController', () => {
  let controller: NecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NecordController],
    }).compile();

    controller = module.get<NecordController>(NecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
