import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { userModel } from "./userModel";

// Define Collection (name & schema)
const COMMENT_COLLECTION_NAME = "comments";
const COMMENT_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  cardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  content: Joi.string().required().min(3).max(50).trim().strict(),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

const validateBeforeCreate = async (data) => {
  return await COMMENT_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createComment = async (commentData) => {
  try {
    const validData = await validateBeforeCreate(commentData);
    const newComment = {
      ...validData,
      cardId: new ObjectId(validData.cardId),
      userId: new ObjectId(validData.userId),
    };
    const result = await GET_DB()
      .collection(COMMENT_COLLECTION_NAME)
      .insertOne(newComment);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllComment = async (cardId) => {
  try {
    const comments = await GET_DB()
      .collection(COMMENT_COLLECTION_NAME)
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
            content: 1,
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
            content: 1,
            createdAt: 1,
          },
        },
      ])
      .toArray();

    return comments;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (commentId) => {
  try {
    const result = await GET_DB()
      .collection(COMMENT_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(commentId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const updateComment = async (commentId, content) => {
  try {
    const result = await GET_DB()
      .collection(COMMENT_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(commentId) },
        { $set: { content: content } }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteSoftComment = async (commentId) => {
  try {
    const result = await GET_DB()
      .collection(COMMENT_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(commentId) },
        { $set: { _destroy: true } }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const activeComment = async (commentId) => {
  try {
    const result = await GET_DB()
      .collection(COMMENT_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(commentId) },
        { $set: { _destroy: false } }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteComment = async (commentId) => {
  try {
    const result = await GET_DB()
      .collection(COMMENT_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(commentId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const commentModel = {
  COMMENT_COLLECTION_NAME,
  COMMENT_COLLECTION_SCHEMA,
  createComment,
  updateComment,
  deleteSoftComment,
  deleteComment,
  findOneById,
  getAllComment,
  activeComment,
};
