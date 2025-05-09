import { Test, TestingModule } from '@nestjs/testing';
import { NecordService } from './necord.service';

describe('NecordService', () => {
  let service: NecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NecordService],
    }).compile();

    service = module.get<NecordService>(NecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
