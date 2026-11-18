import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  /** GET /api/health : cek cepat apakah server hidup (tanpa login). */
  @Public()
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}