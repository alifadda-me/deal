import { Inject, Service } from 'typedi';
import PropertyRepo from '../contracts/PropertyRepo';
import PropertyRepoImpl from '../../infrastructure/repositories/PropertyRepoImpl';

@Service({ global: true })
export default class GetAdsFiltered {
  constructor(@Inject(() => PropertyRepoImpl) private readonly propertyRepo: PropertyRepo) {}

  async execute(request) {
    return await this.propertyRepo.getAdsFiltered(request);
  }
}
