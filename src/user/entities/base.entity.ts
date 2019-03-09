import {
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BranchEntity } from './branch.entity';
import { CompanyEntity } from './company.entity';

export abstract class Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => BranchEntity, branch => branch.partners)
  branch: BranchEntity;

  @ManyToOne(type => CompanyEntity, company => company.partners)
  company: CompanyEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
