import { Test, TestingModule } from '@nestjs/testing';
import { ChatsandnotificationsService } from './chatsandnotifications.service';

describe('ChatsandnotificationsService', () => {
  let service: ChatsandnotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatsandnotificationsService],
    }).compile();

    service = module.get<ChatsandnotificationsService>(ChatsandnotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
