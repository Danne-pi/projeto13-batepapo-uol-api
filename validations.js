import joi from "joi";

export const userSchema = joi.object({
    user: joi.string().min(3).required()
  });