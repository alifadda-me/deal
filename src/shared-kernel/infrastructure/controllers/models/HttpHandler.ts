import * as core from 'express-serve-static-core';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'http-status';
import Logger from '../../logging/general.log';
import { AsyncHttpProcessor, HttpProcessor } from './HttpProcessor';
import { Constructable } from 'typedi/types/types/constructable.type';
import { Container } from 'typedi';

export async function handle<T extends HttpProcessor | AsyncHttpProcessor>(processorClass: Constructable<T>, req, res) {
  const processor = Container.of().get(processorClass);
  //validate the request
  const validationResult = processor.schema
    .options({ allowUnknown: true, stripUnknown: true })
    .validate(processor.getValueToValidate(req));
  if (validationResult.error) {
    return res.status(BAD_REQUEST).json({
      description: validationResult.error.message,
    });
  }
  // start execute the http processor
  try {
    const result = await processor.execute(req, validationResult.value, res);
    if ('data' in result) {
      const data = result.data;
      res.status(result.status).json({ data });
    } else if ('file' in result) {
      res
        .attachment(`${result.file?.name}`)
        .status(result.status)
        .contentType(result.file?.type)
        .send(result.file?.data);
    } else if ('errorCode' in result) {
      res.status(result.status).json({
        errorCode: result.errorCode,
        description: result.description,
        message: result.message,
      });
    }
  } catch (err) {
    Logger.error(`Error in httpHandler: ${(err as Error).stack}`);
    const message = (err as Error).message;
    return res.status(INTERNAL_SERVER_ERROR).json({
      description: message,
      message: `Something went wrong, please contact support!`,
    });
  }
  if ('executeInBackground' in processor) {
    try {
      await processor.executeInBackground(req, validationResult.value);
    } catch (e) {
      // @ts-ignore
      Logger.error(`Error in executeInBackground httpHandler: ${e.stack}`);
    }
  }
}

export const registerPost = <T extends HttpProcessor>(
  path: string,
  processor: Constructable<T>,
  router: core.Router,
  ...middlewares: ((req, res, next) => void)[]
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  router.post(path, middlewares, async (req, res, next) => {
    return await handle(processor, req, res);
  });
};
export const registerGet = <T extends HttpProcessor>(
  path: string,
  processor: Constructable<T>,
  router: core.Router,
  ...middlewares: ((req, res, next) => void)[]
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  router.get(path, middlewares, async (req, res, next) => {
    return await handle(processor, req, res);
  });
};
export const registerPut = <T extends HttpProcessor>(
  path: string,
  processor: Constructable<T>,
  router: core.Router,
  ...middlewares: ((req, res, next) => void)[]
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  router.put(path, middlewares, async (req, res, next) => {
    return await handle(processor, req, res);
  });
};
export const registerPatch = <T extends HttpProcessor>(
  path: string,
  processor: Constructable<T>,
  router: core.Router,
  ...middlewares: ((req, res, next) => void)[]
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  router.patch(path, middlewares, async (req, res, next) => {
    return await handle(processor, req, res);
  });
};
export const registerDelete = <T extends HttpProcessor>(
  path: string,
  processor: Constructable<T>,
  router: core.Router,
  ...middlewares: ((req, res, next) => void)[]
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  router.delete(path, middlewares, async (req, res, next) => {
    return await handle(processor, req, res);
  });
};
