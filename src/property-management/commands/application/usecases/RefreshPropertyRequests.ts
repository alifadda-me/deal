import { Inject, Service } from 'typedi';
import PropertyRepo from '../../domain/contracts/PropertyRepo';
import PropertyRepoImpl from '../../infrastructure/repositories/PropertyRepoImpl';

@Service({ global: true })
export default class RefreshPropertyRequests {
  constructor(@Inject(() => PropertyRepoImpl) private readonly propertyRepo: PropertyRepo) {}

  async execute() {
    return await this.propertyRepo.refreshPropertyRequests();
  }
}
