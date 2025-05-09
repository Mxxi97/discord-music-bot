import { Test, TestingModule } from '@nestjs/testing';
import { LavalinkController } from './lavalink.controller';

describe('LavalinkController', () => {
  let controller: LavalinkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LavalinkController],
    }).compile();

    controller = module.get<LavalinkController>(LavalinkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
