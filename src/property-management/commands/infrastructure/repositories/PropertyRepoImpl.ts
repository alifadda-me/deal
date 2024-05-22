import { Service } from 'typedi';
import PropertyRepo from '../../domain/contracts/PropertyRepo';
import PropertyRequestSchema from '../../../common/infrastructure/db/models/schemas/PropertyRequestSchema';
import AdSchema from '../../../common/infrastructure/db/models/schemas/AdSchema';

@Service({ global: true })
export default class PropertyRepoImpl implements PropertyRepo {
  async createPropertyRequest(propertyRequest) {
    await PropertyRequestSchema.create(propertyRequest);
  }

  async updatePropertyRequest(propertyRequest) {
    const propertyRequestToUpdate = deleteUndefinedAttributes({
      propertyType: propertyRequest.propertyType,
      area: propertyRequest.area,
      price: propertyRequest.price,
      city: propertyRequest.city,
      district: propertyRequest.district,
      description: propertyRequest.description,
    });
    await PropertyRequestSchema.findOneAndUpdate(
      {
        _id: propertyRequest.propertyRequestId,
      },
      propertyRequestToUpdate,
    );
  }

  async refreshPropertyRequests() {
    await PropertyRequestSchema.updateMany({}, { $set: { refreshedAt: new Date() } });
  }

  async createAd(ad) {
    await AdSchema.create(ad);
  }

  async findPropertyRequestById(id) {
    return await PropertyRequestSchema.findById(id).lean(true).exec();
  }
}

const deleteUndefinedAttributes = (object: any): any => {
  Object.keys(object).forEach((key) => {
    if (object[key] === undefined) {
      delete object[key];
    }
  });
  return object;
};
