import { Service } from 'typedi';
import PropertyRepo from '../../application/contracts/PropertyRepo';
import AdSchema from '../../../common/infrastructure/db/models/schemas/AdSchema';
import PropertyRequestSchema from '../../../common/infrastructure/db/models/schemas/PropertyRequestSchema';
import UserSchema from '../../../../user-management/common/infrastructure/db/models/schemas/UserSchema';
import mongoose from 'mongoose';

@Service({ global: true })
export default class PropertyRepoImpl implements PropertyRepo {
  async findPropertyRequestByAdIdPaginated(adId: string, page: number, limit: number) {
    const ad = await AdSchema.findById(adId);
    if (!ad) return { data: [], page, limit, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false };

    const priceTolerance = 0.1 * ad.price;
    const lowerPriceLimit = ad.price - priceTolerance;
    const upperPriceLimit = ad.price + priceTolerance;
    // Assuming a 10% tolerance for area as well if needed
    const areaTolerance = 0.1 * ad.area;
    const lowerAreaLimit = ad.area - areaTolerance;
    const upperAreaLimit = ad.area + areaTolerance;

    const skip = (page - 1) * limit;

    const paginatedPropertyRequests = await PropertyRequestSchema.aggregate([
      {
        $match: {
          district: ad.district,
          price: { $gte: lowerPriceLimit, $lte: upperPriceLimit },
          area: { $gte: lowerAreaLimit, $lte: upperAreaLimit },
        },
      },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [{ $sort: { refreshedAt: -1 } }, { $skip: skip }, { $limit: limit }],
        },
      },
    ]);

    if (paginatedPropertyRequests.length > 0 && paginatedPropertyRequests[0].metadata.length === 0) {
      return { data: [], page, limit, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false };
    }

    const total = paginatedPropertyRequests[0].metadata[0].total;
    const totalPages = Math.ceil(total / limit);

    return {
      propertyRequests: paginatedPropertyRequests[0].data,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      page,
      limit,
    };
  }

  async getStats() {
    return UserSchema.aggregate([
      {
        $lookup: {
          from: 'ads',
          localField: '_id',
          foreignField: 'userId',
          as: 'ads',
        },
      },
      {
        $lookup: {
          from: 'propertyrequests',
          localField: '_id',
          foreignField: 'userId',
          as: 'requests',
        },
      },
      {
        $project: {
          name: 1,
          role: 1,
          adsCount: { $size: '$ads' },
          totalAdsAmount: { $sum: '$ads.price' },
          requestsCount: { $size: '$requests' },
          totalRequestsAmount: { $sum: '$requests.price' },
        },
      },
    ]);
  }

  async getPropertyRequestsFiltered(filterQuery) {
    const query = PropertyRepoImpl.extractFilterQuery(filterQuery);
    return PropertyRequestSchema.find(query);
  }

  async getAdsFiltered(filterQuery) {
    const query = PropertyRepoImpl.extractFilterQuery(filterQuery);
    return AdSchema.find(query);
  }

  private static extractFilterQuery(filterQuery) {
    const { propertyType, price, area, city, district } = filterQuery;
    const query = {
      userId: filterQuery.userId,
    };
    if (propertyType) {
      query['propertyType'] = propertyType;
    }
    if (price) {
      const priceTolerance = 0.1 * price;
      const lowerPriceLimit = price - priceTolerance;
      const upperPriceLimit = price + priceTolerance;
      query['price'] = { $lte: upperPriceLimit, $gte: lowerPriceLimit };
    }
    if (area) {
      // Assuming a 10% tolerance for area as well if needed
      const areaTolerance = 0.1 * area;
      const lowerAreaLimit = area - areaTolerance;
      const upperAreaLimit = area + areaTolerance;
      query['area'] = { $lte: upperAreaLimit, $gte: lowerAreaLimit };
    }
    if (city) {
      query['city'] = city;
    }
    if (district) {
      query['district'] = district;
    }
    return query;
  }
}
