import { Service } from 'typedi';
import joi from 'joi';
import { OK, UNAUTHORIZED } from 'http-status';
import {
  HttpError,
  HttpProcessor,
  HttpSuccess,
} from '../../../../shared-kernel/infrastructure/controllers/models/HttpProcessor';
import { InvalidUserNameOrPasswordError } from '../../domain/errors/InvalidUserNameOrPasswordError';
import LoginUser from '../../application/usecases/LoginUser';

@Service({ global: true })
export default class LoginUserController extends HttpProcessor {
  constructor(private readonly loginUser: LoginUser) {
    super();
  }

  async execute(_req, validatedValue): Promise<HttpSuccess | HttpError> {
    try {
      const request = {
        password: validatedValue.password,
        phone: validatedValue.phone,
      };

      const result = await this.loginUser.execute(request);

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
      phone: joi.string().required().trim(),
      password: joi.string().required().trim(),
    })
    .options({ allowUnknown: true, stripUnknown: true });

  private handleError(error: any): HttpError {
    if (error instanceof InvalidUserNameOrPasswordError) {
      return {
        status: UNAUTHORIZED,
        errorCode: 'invalid-user-name-or-password',
        description: 'Invalid username or password!',
      };
    } else {
      throw error;
    }
  }
}
