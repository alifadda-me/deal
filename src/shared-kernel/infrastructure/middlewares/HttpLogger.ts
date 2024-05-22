import { v4 as Uuid } from "uuid";
import Logger from "../logging/general.log";
import { getFormattedDate } from "../utils/date";

function logRequest(req, logParams) {
  Logger.info("Request triggered", {
    traceId: logParams.traceId,
    timeStamp: `[${getFormattedDate()}]`,
    request: {
      method: req.method,
      url: req.url,
      taagerId: logParams.taagerId,
    },
  });
}

function logResponse(req, res, logParams) {
  Logger.info("Response triggered", {
    traceId: logParams.traceId,
    timeStamp: `[${getFormattedDate()}]`,
    request: {
      method: req.method,
      url: req.url,
      taagerId: logParams.taagerId,
    },
    response: {
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
    },
  });
}

function maskCharacters(str, mask, n = 1) {
  return (
    ("" + str).slice(0, -n).replace(/(?<=..).(?=.)/g, mask) +
    ("" + str).slice(-n)
  );
}

function logError(err, req) {
  Logger.error("Error encountered by HttpLogger middleware", {
    error: err,
    errorMessage: err.message,
    authorizationHeader: req.headers.authorization
      ? maskCharacters(req.headers.authorization, "#", 1)
      : "no user-management header",
  });
}

export default async (req, res, next) => {
  try {
    const logParams = {
      traceId: Uuid(),
    };
    logRequest(req, logParams);
    res.on("finish", () => logResponse(req, res, logParams));
    next();
  } catch (err) {
    logError(err, req);
    next();
  }
};
