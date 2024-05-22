import { Service } from 'typedi';
import joi from 'joi';
import { CREATED } from 'http-status';
import {
  HttpError,
  HttpProcessor,
  HttpSuccess,
} from '../../../../shared-kernel/infrastructure/controllers/models/HttpProcessor';
import CreateAd from '../../application/usecases/CreateAd';

@Service({ global: true })
export default class CreateAdController extends HttpProcessor {
  constructor(private readonly createAd: CreateAd) {
    super();
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
        description: validatedValue.description,
      };

      await this.createAd.execute(request);

      return {
        status: CREATED,
        data: {},
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  schema = joi
    .object({
      propertyType: joi.string().required().valid('VILLA', 'HOUSE', 'LAND', 'APARTMENT').insensitive(),
      price: joi.number().required(),
      area: joi.number().required(),
      city: joi.string().required(),
      district: joi.string().required(),
      description: joi.string().required(),
    })
    .options({ allowUnknown: true, stripUnknown: true });

  private handleError(error: any): HttpError {
    throw error;
  }
}
