import { Inject, Service } from 'typedi';
import PropertyRepo from '../contracts/PropertyRepo';
import PropertyRepoImpl from '../../infrastructure/repositories/PropertyRepoImpl';

@Service({ global: true })
export default class GetStats {
  constructor(@Inject(() => PropertyRepoImpl) private readonly propertyRepo: PropertyRepo) {}

  async execute() {
    return await this.propertyRepo.getStats();
  }
}
