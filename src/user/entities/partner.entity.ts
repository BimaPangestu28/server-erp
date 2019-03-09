import { Entity, Column, OneToOne } from 'typeorm';
import { Base } from './base.entity';
import { UserEntity } from './user.entity';

@Entity('partner')
export class PartnerEntity extends Base {
  @Column('text')
  name: string;

  @Column('text')
  email: string;

  @OneToOne(type => UserEntity, user => user.partner)
  user: UserEntity;
}
