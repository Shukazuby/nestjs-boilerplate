import { Test, TestingModule } from '@nestjs/testing';
import { ChatsandnotificationsGateway } from './chatsandnotifications.gateway';
import { ChatsandnotificationsService } from './chatsandnotifications.service';

describe('ChatsandnotificationsGateway', () => {
  let gateway: ChatsandnotificationsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatsandnotificationsGateway, ChatsandnotificationsService],
    }).compile();

    gateway = module.get<ChatsandnotificationsGateway>(ChatsandnotificationsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
