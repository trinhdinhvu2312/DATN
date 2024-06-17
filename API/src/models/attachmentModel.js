import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { userModel } from "~/models/userModel";

// Define Collection (name & schema)
const ATTACHMENT_COLLECTION_NAME = "attachments";
const ATTACHMENT_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  cardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  fileName: Joi.string().required().min(3).trim().strict(),
  fileType: Joi.string().required().min(3).trim().strict(),
  fileURL: Joi.string().required().min(3).trim().strict(),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

const validateBeforeCreate = async (data) => {
  return await ATTACHMENT_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createAttachment = async (attachmentData) => {
  try {
    const validData = await validateBeforeCreate(attachmentData);
    const newAttachment = {
      ...validData,
      cardId: new ObjectId(validData.cardId),
      userId: new ObjectId(validData.userId),
    };
    const result = await GET_DB()
      .collection(ATTACHMENT_COLLECTION_NAME)
      .insertOne(newAttachment);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (attachmentId) => {
  try {
    const result = await GET_DB()
      .collection(ATTACHMENT_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(attachmentId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllAttachment = async (cardId) => {
  try {
    const attachments = await GET_DB()
      .collection(ATTACHMENT_COLLECTION_NAME)
      .aggregate([
        { $match: { cardId: new ObjectId(cardId), _destroy: false } },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $project: {
            _id: 1,
            fileName: 1,
            fileType: 1,
            fileURL: 1,
            createdAt: 1,
            user: { $arrayElemAt: ["$user", 0] },
          },
        },
        {
          $addFields: {
            createdAt: {
              $dateToString: { format: "%d/%m/%Y", date: "$createdAt" },
            },
          },
        },
        {
          $project: {
            "user.displayName": 1,
            "user.avatar": 1,
            "user.email": 1,
            fileName: 1,
            fileType: 1,
            fileURL: 1,
            createdAt: 1,
          },
        },
      ])
      .toArray();

    return attachments;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteSoftAttachment = async (attachmentId) => {
  try {
    const result = await GET_DB()
      .collection(ATTACHMENT_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(attachmentId) },
        { $set: { _destroy: true } }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const activeAttachment = async (attachmentId) => {
  try {
    const result = await GET_DB()
      .collection(ATTACHMENT_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(attachmentId) },
        { $set: { _destroy: false } }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteAttachment = async (attachmentId) => {
  try {
    const result = await GET_DB()
      .collection(ATTACHMENT_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(attachmentId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const attachmentModel = {
  ATTACHMENT_COLLECTION_NAME,
  ATTACHMENT_COLLECTION_SCHEMA,
  createAttachment,
  findOneById,
  getAllAttachment,
  deleteSoftAttachment,
  activeAttachment,
  deleteAttachment,
};
