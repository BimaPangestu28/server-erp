import {
  Entity,
  Column,
  BeforeInsert,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { PartnerEntity } from './partner.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Standart } from './standart.entity';
import { BranchEntity } from './branch.entity';

@Entity('user')
export class UserEntity extends Standart {
  @Column({
    type: 'text',
    unique: true,
  })
  username: string;

  @Column('text')
  password: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  active: boolean;

  @Column({
    type: 'text',
    default: null,
  })
  verifyToken: string;

  @Column({
    type: 'text',
    default: null,
  })
  resetToken: string;

  @OneToOne(type => PartnerEntity, partner => partner.user)
  @JoinColumn()
  partner: PartnerEntity;

  @OneToMany(type => BranchEntity, branch => branch.user)
  branches: BranchEntity;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async generateToken(expire = '7d') {
    const { id, username } = this;

    return await jwt.sign({ id, username }, process.env.SECRET_KEY, {
      expiresIn: expire,
    });
  }

  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  async toResponseObject(showToken = false) {
    const { username, token } = this;

    const toResponse: any = { username };

    if (showToken) {
      toResponse.token = await token;
    }

    return await toResponse;
  }

  private get token() {
    return this.generateToken();
  }
}
