import { IsString, IsDefined } from 'class-validator';

export class BranchDTO {
  @IsString()
  @IsDefined()
  name: string;

  @IsString()
  @IsDefined()
  company: string;
}
