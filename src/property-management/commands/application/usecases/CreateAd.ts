import { Inject, Service } from 'typedi';
import PropertyRepo from '../../domain/contracts/PropertyRepo';
import PropertyRepoImpl from '../../infrastructure/repositories/PropertyRepoImpl';

@Service({ global: true })
export default class CreateAd {
  constructor(@Inject(() => PropertyRepoImpl) private readonly propertyRepo: PropertyRepo) {}

  async execute(request) {
    return await this.propertyRepo.createAd({ ...request, refreshedAt: new Date() });
  }
}
