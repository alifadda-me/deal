import { Service } from 'typedi';
import joi from 'joi';
import { OK } from 'http-status';
import {
  HttpError,
  HttpProcessor,
  HttpSuccess,
} from '../../../../shared-kernel/infrastructure/controllers/models/HttpProcessor';
import GetStats from '../../application/usecases/GetStats';

@Service({ global: true })
export default class GetStatsController extends HttpProcessor {
  constructor(private readonly getStats: GetStats) {
    super();
  }

  async execute(_req, _validatedValue): Promise<HttpSuccess | HttpError> {
    try {
      const result = await this.getStats.execute();

      return {
        status: OK,
        data: result,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  schema = joi.object({}).options({ allowUnknown: true, stripUnknown: true });

  private handleError(error: any): HttpError {
    throw error;
  }
}
