import { Service } from 'typedi';
import joi from 'joi';
import { NOT_FOUND, OK } from 'http-status';
import {
  HttpError,
  HttpProcessor,
  HttpSuccess,
} from '../../../../shared-kernel/infrastructure/controllers/models/HttpProcessor';
import UpdatePropertyRequest from '../../application/usecases/UpdatePropertyRequest';
import { PropertyRequestIsNotFoundError } from '../../domain/errors/PropertyRequestIsNotFoundError';

@Service({ global: true })
export default class UpdatePropertyRequestController extends HttpProcessor {
  constructor(private readonly updatePropertyRequest: UpdatePropertyRequest) {
    super();
  }

  getValueToValidate(req: any): any {
    return { ...req.body, ...req.params };
  }

  async execute(req, validatedValue): Promise<HttpSuccess | HttpError> {
    try {
      const request = {
        userId: req.decodedToken.user._id,
        userRole: req.decodedToken.user.role,
        propertyRequestId: validatedValue.id,
        propertyType: validatedValue.propertyType,
        price: validatedValue.price,
        area: validatedValue.area,
        city: validatedValue.city,
        district: validatedValue.district,
        description: validatedValue.description,
      };

      await this.updatePropertyRequest.execute(request);

      return {
        status: OK,
        data: {},
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  schema = joi
    .object({
      id: joi.string().required(),
      propertyType: joi.string().optional().valid('VILLA', 'HOUSE', 'LAND', 'APARTMENT').insensitive(),
      price: joi.number().optional(),
      area: joi.number().optional(),
      city: joi.string().optional(),
      district: joi.string().optional(),
      description: joi.string().optional(),
    })
    .options({ allowUnknown: true, stripUnknown: true });

  private handleError(error: any): HttpError {
    if (error instanceof PropertyRequestIsNotFoundError) {
      return {
        status: NOT_FOUND,
        errorCode: 'property-request-is-not-found-error',
        description: 'Property request is not found error!',
      };
    }
    throw error;
  }
}
