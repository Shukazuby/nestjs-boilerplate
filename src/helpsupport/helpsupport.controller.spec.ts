import { Test, TestingModule } from '@nestjs/testing';
import { HelpsupportController } from './helpsupport.controller';
import { HelpsupportService } from './helpsupport.service';

describe('HelpsupportController', () => {
  let controller: HelpsupportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelpsupportController],
      providers: [HelpsupportService],
    }).compile();

    controller = module.get<HelpsupportController>(HelpsupportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
