import { Inject, Service } from 'typedi';
import PropertyRepo from '../contracts/PropertyRepo';
import PropertyRepoImpl from '../../infrastructure/repositories/PropertyRepoImpl';

@Service({ global: true })
export default class GetPropertyRequestsFiltered {
  constructor(@Inject(() => PropertyRepoImpl) private readonly propertyRepo: PropertyRepo) {}

  async execute(request) {
    return await this.propertyRepo.getPropertyRequestsFiltered(request);
  }
}
