import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PartnerEntity } from './partner.entity';
import { Standart } from './standart.entity';

@Entity('branch')
export class BranchEntity extends Standart {
  @Column('text')
  name: string;

  @OneToMany(type => PartnerEntity, partner => partner.branch)
  partners: PartnerEntity[];
}
