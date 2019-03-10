import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { PartnerEntity } from './partner.entity';
import { Standart } from './standart.entity';
import { BranchEntity } from './branch.entity';

@Entity('company')
export class CompanyEntity extends Standart {
  @Column('text')
  name: string;

  @Column('text')
  email: string;

  @OneToMany(type => PartnerEntity, partner => partner.company)
  partners: PartnerEntity[];

  @OneToMany(type => BranchEntity, branch => branch.company)
  branches: BranchEntity[];
}
