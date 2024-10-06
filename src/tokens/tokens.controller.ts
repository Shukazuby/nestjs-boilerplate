import { Controller } from '@nestjs/common';
import { TokenService } from './tokens.service';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokenService) {}
}
