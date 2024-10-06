import { Test, TestingModule } from '@nestjs/testing';
import { HelpsupportService } from './helpsupport.service';

describe('HelpsupportService', () => {
  let service: HelpsupportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelpsupportService],
    }).compile();

    service = module.get<HelpsupportService>(HelpsupportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
