import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PartnerEntity } from './partner.entity';
import { Standart } from './standart.entity';

@Entity('company')
export class CompanyEntity extends Standart {
  @Column('text')
  name: string;

  @Column('text')
  email: string;

  @OneToMany(type => PartnerEntity, partner => partner.company)
  partners: PartnerEntity[];
}
