import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";

const invite = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": `"email" cannot be an empty field`,
      "string.email": `"email" must be a valid email`,
      "any.required": `"email" is a required field`,
    }),
  });

  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });

    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};

export const invitationValidation = {
  invite,
};
