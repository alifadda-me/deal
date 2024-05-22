import { Inject, Service } from 'typedi';
import PropertyRepo from '../../domain/contracts/PropertyRepo';
import PropertyRepoImpl from '../../infrastructure/repositories/PropertyRepoImpl';
import { PropertyRequestIsNotFoundError } from '../../domain/errors/PropertyRequestIsNotFoundError';

@Service({ global: true })
export default class UpdatePropertyRequest {
  constructor(@Inject(() => PropertyRepoImpl) private readonly propertyRepo: PropertyRepo) {}

  async execute(request) {
    const propertyRequest = await this.propertyRepo.findPropertyRequestById(request.propertyRequestId);
    if (!propertyRequest) throw new PropertyRequestIsNotFoundError();
    if (request.userRole !== 'ADMIN' && propertyRequest.userId.toString() !== request.userId.toString()) {
      throw new PropertyRequestIsNotFoundError();
    }
    await this.propertyRepo.updatePropertyRequest(request);
  }
}
