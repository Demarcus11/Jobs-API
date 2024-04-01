import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "../errors/custom-api.js";

export const errorHandlerMiddleware = (err, req, res, next) => {
  // if an error comes from a controller
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  // if error comes from elsewhere
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
};
