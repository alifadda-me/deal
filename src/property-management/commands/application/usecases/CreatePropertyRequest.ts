import { Inject, Service } from 'typedi';
import PropertyRepo from '../../domain/contracts/PropertyRepo';
import PropertyRepoImpl from '../../infrastructure/repositories/PropertyRepoImpl';

@Service({ global: true })
export default class CreatePropertyRequest {
  constructor(@Inject(() => PropertyRepoImpl) private readonly propertyRepo: PropertyRepo) {}

  async execute(request) {
    return await this.propertyRepo.createPropertyRequest({ ...request, refreshedAt: new Date() });
  }
}
