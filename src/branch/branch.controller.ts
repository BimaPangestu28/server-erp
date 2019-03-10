import {
  Controller,
  Get,
  UseGuards,
  Query,
  Post,
  Body,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { BranchService } from './branch.service';
import { User } from 'src/shared/user.decorator';
import { BranchDTO } from './branch.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';

@Controller('branch')
export class BranchController {
  constructor(private BranchService: BranchService) {}

  @Get()
  @UseGuards(new AuthGuard())
  getBranch(@Query() query) {
    return this.BranchService.get(query);
  }

  @Get(':id')
  @UseGuards(new AuthGuard())
  readBranch(@Param('id') id) {
    return this.BranchService.read(id);
  }

  @Post()
  @UseGuards(new AuthGuard())
  createBranch(@Body(new ValidationPipe()) data: BranchDTO, @User() user) {
    return this.BranchService.create(data, user);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  deleteBranch(@Param('id') id) {
    return this.BranchService.delete(id);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  updateBranch(@Body(new ValidationPipe()) data: BranchDTO, @Param('id') id) {
    return this.BranchService.update(data, id);
  }
}
