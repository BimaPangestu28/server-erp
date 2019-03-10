import { Entity, Column, OneToOne, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { UserEntity } from './user.entity';
import { BranchEntity } from './branch.entity';

@Entity('partner')
export class PartnerEntity extends Base {
  @Column('text')
  name: string;

  @Column('text')
  email: string;

  @OneToOne(type => UserEntity, user => user.partner)
  user: UserEntity;

  @ManyToOne(type => BranchEntity, branch => branch.partners)
  branch: BranchEntity;
}
