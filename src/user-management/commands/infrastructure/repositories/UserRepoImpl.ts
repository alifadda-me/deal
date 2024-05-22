import { Service } from 'typedi';
import UserRepo from '../../domain/contracts/UserRepo';
import UserSchema from '../../../common/infrastructure/db/models/schemas/UserSchema';

@Service({ global: true })
export default class UserRepoImpl implements UserRepo {
  async findByPhone(phone: string) {
    return await UserSchema.findOne({
      phone,
    })
      .lean(true)
      .exec();
  }
}
