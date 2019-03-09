import { Controller, Post, Body, UsePipes, Query, Param } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { RegisterDTO, LoginDTO } from './authentication.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() data: RegisterDTO) {
    return this.authenticationService.register(data);
  }

  @Post('verify')
  createVerify(@Query('token') token) {
    return this.authenticationService.verify(token);
  }

  @Post('verify/resend/:username')
  resendVerify(@Param('username') username) {
    return this.authenticationService.sendVerify(username);
  }

  @Post('login')
  login(@Body() data: LoginDTO) {
    return this.authenticationService.login(data);
  }

  @Post('password/requestReset')
  requestReset(@Body() data) {
    return this.authenticationService.requestReset(data);
  }

  @Post('password/resetPassword')
  verifyTokenResetPassword(@Query('token') token) {
    return this.authenticationService.verifyTokenResetPassword(token);
  }

  @Post('password/reset')
  resetPassword(@Body() data) {
    return this.authenticationService.resetPassword(data);
  }
}
