import { IsString, IsDefined, Length } from 'class-validator';

export class RegisterDTO {
  @IsString()
  @IsDefined()
  @Length(4, 12)
  username: string;

  @IsString()
  @IsDefined()
  @Length(4, 12)
  password: string;
}

export class LoginDTO {
  @IsString()
  @IsDefined()
  username: string;

  @IsString()
  @IsDefined()
  password: string;
}
