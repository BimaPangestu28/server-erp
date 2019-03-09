import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nest-modules/mailer';
import { CompanyEntity } from 'src/user/entities/company.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { PartnerEntity } from 'src/user/entities/partner.entity';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(UserEntity)
    private UserRepository: Repository<UserEntity>,
    @InjectRepository(CompanyEntity)
    private CompanyRepository: Repository<CompanyEntity>,
    @InjectRepository(PartnerEntity)
    private PartnerRepository: Repository<PartnerEntity>,
    private MailerService: MailerService,
  ) {}

  async login(data) {
    const { username, password } = data;

    const user: any = await this.UserRepository.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Username or password invalid!',
        HttpStatus.BAD_REQUEST,
      );
    } else if (!user.active) {
      throw new HttpException(
        'Your account is non active!',
        HttpStatus.BAD_REQUEST,
      );
    }

    return user.toResponseObject(true);
  }

  async register(data) {
    const { username } = data;

    if (await this.UserRepository.findOne({ username })) {
      throw new HttpException('Username already used', HttpStatus.BAD_REQUEST);
    }

    const partner = await this.PartnerRepository.create(data);
    await this.PartnerRepository.save(partner);

    const user = await this.UserRepository.create({ ...data, partner });
    await this.UserRepository.save(user);

    return this.sendVerify(data);
  }

  async jwtVerify(token, cekActive = false, verifyToken = false) {
    try {
      const { id } = jwt.verify(token, process.env.SECRET_KEY);

      const user = await this.UserRepository.findOne({ id });

      if (cekActive) {
        if (user.active) {
          throw new HttpException(
            'Your account has been actived!',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (verifyToken) {
        if (token !== user.verifyToken) {
          throw new HttpException('Invalid token!', HttpStatus.BAD_REQUEST);
        }
      } else {
        if (token !== user.resetToken) {
          throw new HttpException('Invalid token!', HttpStatus.BAD_REQUEST);
        }
      }

      return user;
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.BAD_REQUEST);
    }
  }

  async verify(token) {
    const user = await this.jwtVerify(token, true, true);

    user.active = true;
    user.verifyToken = null;
    await this.UserRepository.save(user);

    return { status: 'success verify token!' };
  }

  async sendVerify(data) {
    let { username } = data;

    if (!username) {
      username = data;
    }

    const company = await this.CompanyRepository.findOne();

    const savedUser = await this.UserRepository.findOne(
      { username },
      { relations: ['partner'] },
    );

    if (!savedUser) {
      throw new HttpException('User not found!', HttpStatus.BAD_REQUEST);
    }

    const token = await savedUser.generateToken('1d');

    savedUser.verifyToken = token;
    await this.UserRepository.save(savedUser);

    return this.mailer({
      to: savedUser,
      from: company.email,
      template: __dirname + '/templates/mail/verificationUser',
      subject: 'Activate your account',
      context: {
        link: `${process.env.CLIENT_URL}/authentication/verify?=${token}`,
        name: savedUser.partner.name,
      },
    });
  }

  async requestReset(data) {
    let { email } = data;

    if (!email) {
      email = data;
    }

    const company = await this.CompanyRepository.findOne();

    const partner = await this.PartnerRepository.findOne(
      { email },
      { relations: ['user'] },
    );

    const user = await this.UserRepository.findOne({ id: partner.user.id });

    if (!partner) {
      throw new HttpException('User not found!', HttpStatus.BAD_REQUEST);
    }

    const token = await user.generateToken('1d');

    user.resetToken = token;
    await this.UserRepository.save(user);

    return this.mailer({
      to: email,
      from: company.email,
      template: __dirname + '/templates/mail/resetPassword',
      subject: 'Reset your password',
      context: {
        link: `${
          process.env.CLIENT_URL
        }/authentication/password/resetPassword?token=${token}`,
        name: partner.name,
      },
    });
  }

  async verifyTokenResetPassword(token) {
    const user = await this.jwtVerify(token);

    return user.toResponseObject();
  }

  async resetPassword(data) {
    const { password, token } = data;

    const user = await this.jwtVerify(token);

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = '';
    await this.UserRepository.save(user);

    return { response: 'Success change password' };
  }

  async mailer(data) {
    const { to, from, template, subject, context } = data;

    try {
      this.MailerService.sendMail({
        to,
        from,
        subject,
        template,
        context,
      });

      return { status: 'Send email success!' };
    } catch (error) {
      throw new HttpException(
        `Something error on mailer service : ${error}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
