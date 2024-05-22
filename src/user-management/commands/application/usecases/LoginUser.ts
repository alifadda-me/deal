import { Inject, Service } from 'typedi';
import { UserManagementLogger } from '../../../../shared-kernel/infrastructure/logging/general.log';
import { InvalidUserNameOrPasswordError } from '../../domain/errors/InvalidUserNameOrPasswordError';
import Env from '../../../../../config/Env';
import jwt from 'jsonwebtoken';
import UserRepo from '../../domain/contracts/UserRepo';
import UserRepoImpl from '../../infrastructure/repositories/UserRepoImpl';
import bcrypt from 'bcryptjs';

@Service({ global: true })
export default class LoginUser {
  constructor(@Inject(() => UserRepoImpl) private readonly userRepo: UserRepo) {}

  async execute(request) {
    UserManagementLogger.debug(`Login user`, {
      phone: request.phone,
    });

    const user = await this.userRepo.findByPhone(request.phone);
    if (!user) throw new InvalidUserNameOrPasswordError();

    const isMatchedPassword = await bcrypt.compare(request.password, user.password);
    if (!isMatchedPassword) throw new InvalidUserNameOrPasswordError();

    const accessToken = await this.generateAccessToken(user);

    return {
      accessToken,
      user: {
        userId: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
    };
  }

  private async generateAccessToken(user): Promise<string> {
    const userPayload = {
      _id: user._id,
      phone: user.phone,
      role: user.role,
    };

    return await this.signAccessToken(userPayload, Env.ACCESS_TOKEN_EXPIRY);
  }

  private async signAccessToken(payload, expiresIn = '1d'): Promise<string> {
    return jwt.sign({ user: payload }, Env.SECRET, {
      expiresIn: expiresIn,
    });
  }
}
