import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { USER_ROLE } from "~/utils/constants";

// Define Collection (Name & Schema)
const USER_COLLECTION_NAME = "users";
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).strict(),
  username: Joi.string().required().alphanum().min(3).max(30).trim().strict(),
  displayName: Joi.string().default(Joi.ref("username")),
  avatar: Joi.string().default(""),
  role: Joi.string().valid(...Object.values(USER_ROLE)),
  isActive: Joi.boolean().default(true),
  verifyToken: Joi.string().allow(null, ""),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});

const INVALID_UPDATE_FIELDS = ["_id", "createdAt"];

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const register = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    const createdUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .insertOne(validData);
    return createdUser;
  } catch (error) {
    throw new Error(error);
  }
};

const updateVerifyToken = async (userId, verifyToken) => {
  try {
    await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(userId) },
        { $set: { verifyToken: verifyToken } }
      );
  } catch (error) {
    throw new Error(
      "Error updating verifyToken in userModel: " + error.message
    );
  }
};

const findOneById = async (userId) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(userId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneByEmail = async (email) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ email: email });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  register,
  findOneById,
  findOneByEmail,
  updateVerifyToken,
};
