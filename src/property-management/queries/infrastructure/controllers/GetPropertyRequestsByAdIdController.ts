import { Service } from 'typedi';
import joi from 'joi';
import { OK } from 'http-status';
import {
  HttpError,
  HttpProcessor,
  HttpSuccess,
} from '../../../../shared-kernel/infrastructure/controllers/models/HttpProcessor';
import GetPropertyRequestsByAddId from '../../application/usecases/GetPropertyRequestsByAddId';

@Service({ global: true })
export default class GetPropertyRequestsByAdIdController extends HttpProcessor {
  constructor(private readonly getPropertyRequestsByAddId: GetPropertyRequestsByAddId) {
    super();
  }

  getValueToValidate(req: any): any {
    return { ...req.query, ...req.params };
  }

  async execute(_req, validatedValue): Promise<HttpSuccess | HttpError> {
    try {
      const request = {
        adId: validatedValue.adId,
        limit: validatedValue.limit,
        page: validatedValue.page,
      };

      const result = await this.getPropertyRequestsByAddId.execute(request);

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
      adId: joi.string().required(),
      limit: joi.number().required().min(10),
      page: joi.number().required().min(1),
    })
    .options({ allowUnknown: true, stripUnknown: true });

  private handleError(error: any): HttpError {
    throw error;
  }
}
