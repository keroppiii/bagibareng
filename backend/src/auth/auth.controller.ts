import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post } from '@nestjs/common';
import { type AuthUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return user;
  }

  @Patch('profile')
updateProfile(
  @CurrentUser() user: AuthUser,
  @Body('name') name: string,
) {
  return this.authService.updateProfile(user.id, name);
}

  /** JWT stateless: logout dilakukan client dengan membuang token. */
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout() {
    return;
  }
}