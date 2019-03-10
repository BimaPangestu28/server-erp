import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { PartnerEntity } from './partner.entity';
import { Standart } from './standart.entity';
import { CompanyEntity } from './company.entity';
import { UserEntity } from './user.entity';

@Entity('branch')
export class BranchEntity extends Standart {
  @Column('text')
  name: string;

  @OneToMany(type => PartnerEntity, partner => partner.branch)
  partners: PartnerEntity[];

  @ManyToOne(type => CompanyEntity, company => company.branches)
  company: CompanyEntity;

  @ManyToOne(type => UserEntity, user => user.branches)
  user: UserEntity;
}
