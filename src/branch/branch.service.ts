import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BranchEntity } from 'src/user/entities/branch.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(BranchEntity)
    private BranchRepository: Repository<BranchEntity>,
  ) {}

  async get(query) {
    const options: any = {};

    if (query.companyId) {
      options.companyId = query.companyId;
    }

    options.relations = ['company', 'user'];

    const branch = await this.BranchRepository.find(options);

    return branch;
  }

  async read(id) {
    const branch = await this.BranchRepository.findOne(
      { id },
      { relations: ['company'] },
    );

    if (!branch) {
      throw new HttpException('Branch not found!', HttpStatus.BAD_REQUEST);
    }

    return branch;
  }

  async create(data, user) {
    const branch = await this.BranchRepository.create({ ...data, user });
    await this.BranchRepository.save(branch);

    return branch;
  }

  async delete(id) {
    const branch = await this.BranchRepository.findOne({ id });

    if (!branch) {
      throw new HttpException('Branch not found!', HttpStatus.BAD_REQUEST);
    }

    await this.BranchRepository.delete({ id });

    return { message: 'Success delete branch' };
  }

  async update(data, id) {
    let branch = await this.BranchRepository.findOne({ id });

    if (!branch) {
      throw new HttpException('Branch not found!', HttpStatus.BAD_REQUEST);
    }

    await this.BranchRepository.update({ id }, data);

    branch = await this.BranchRepository.findOne({ id });

    return branch;
  }
}
