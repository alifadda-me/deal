import { Service } from 'typedi';
import joi from 'joi';
import { OK } from 'http-status';
import {
  HttpError,
  HttpProcessor,
  HttpSuccess,
} from '../../../../shared-kernel/infrastructure/controllers/models/HttpProcessor';
import GetAdsFiltered from '../../application/usecases/GetAdsFiltered';

@Service({ global: true })
export default class GetAdsFilteredController extends HttpProcessor {
  constructor(private readonly getAdsFiltered: GetAdsFiltered) {
    super();
  }

  getValueToValidate(req: any): any {
    return req.query;
  }

  async execute(req, validatedValue): Promise<HttpSuccess | HttpError> {
    try {
      const request = {
        userId: req.decodedToken.user._id,
        propertyType: validatedValue.propertyType,
        price: validatedValue.price,
        area: validatedValue.area,
        city: validatedValue.city,
        district: validatedValue.district,
      };

      const result = await this.getAdsFiltered.execute(request);

      return {
        status: OK,
        data: result,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  schema = joi
    .object({
      propertyType: joi.string().optional().valid('VILLA', 'HOUSE', 'LAND', 'APARTMENT').insensitive().allow('', null),
      price: joi.number().optional().allow('', null),
      area: joi.number().optional().allow('', null),
      city: joi.string().optional().allow('', null),
      district: joi.string().optional().allow('', null),
    })
    .options({ allowUnknown: true, stripUnknown: true });

  private handleError(error: any): HttpError {
    throw error;
  }
}
