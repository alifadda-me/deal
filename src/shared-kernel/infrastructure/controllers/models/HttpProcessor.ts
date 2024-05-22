import { Schema } from 'joi';
import { Request } from 'express';

export abstract class HttpProcessor {
  public abstract schema: Schema;

  getValueToValidate(req: Request): any {
    return req.body;
  }

  abstract execute(req: any, joiValue: any, res: any): Promise<HttpSuccess | HttpError>;

  isValidToken(validTokens: string[], authorizationHeader?: string): boolean {
    if (!authorizationHeader) return false;
    const token = authorizationHeader.replace('Basic ', '').replace('Bearer ', '');
    return validTokens.includes(token);
  }
}

export abstract class AsyncHttpProcessor extends HttpProcessor {
  abstract executeInBackground(req: any, joiValue: any);
}

export interface HttpSuccess {
  status: any;
  data?: any;
  file?: { type: string; name: string; data: any };
}

export interface HttpError {
  status: any;
  errorCode: string;
  description: string;
  message?: string;
}
