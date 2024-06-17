import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { userModel } from "~/models/userModel";

// Define Collection (name & schema)
const CARD_COLLECTION_NAME = "cards";
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  memberIds: Joi.array().default([]),
  completed: Joi.boolean().default(false),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  cover: Joi.string().default(null),
  description: Joi.string().default(""),
  comments: Joi.array().default([]),
  attachments: Joi.array().default([]),
  deadline: Joi.date().timestamp("javascript").default(Date.now),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

// Chỉ định ra những Fields mà chúng ta không muốn cho phép cập nhật trong hàm update()
const INVALID_UPDATE_FIELDS = ["_id", "boardId", "createdAt"];

const validateBeforeCreate = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    // Biến đổi một số dữ liệu liên quan tới ObjectId chuẩn chỉnh
    const newCardToAdd = {
      ...validData,
      boardId: new ObjectId(validData.boardId),
      columnId: new ObjectId(validData.columnId),
      memberIds: validData.memberIds,
    };

    const createdCard = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .insertOne(newCardToAdd);
    return createdCard;
  } catch (error) {
    throw new Error(error);
  }
};

const checkDeadlines = async (userId, now) => {
  try {
    const cards = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .find({
        memberIds: { $elemMatch: { $eq: new ObjectId(userId) } },
        deadline: { $gte: now },
        completed: false,
        _destroy: false,
      })
      .toArray();
    return cards;
  } catch (error) {
    throw new Error(error);
  }
};

const pushMemberIdsToCard = async (boardId, userId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .updateMany(
        { boardId: new ObjectId(boardId) },
        { $push: { memberIds: new ObjectId(userId) } },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const pushManyUserToCard = async (cardId, userIds) => {
  try {
    const objectIdUserIds = userIds.map((id) => new ObjectId(id));
    const updateResult = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .updateMany(
        { _id: new ObjectId(cardId) },
        { $addToSet: { memberIds: { $each: objectIdUserIds } } },
        { returnDocument: "after" }
      );
    if (updateResult.modifiedCount === 0) {
      throw new Error(
        "No documents matched the query or documents already updated."
      );
    }

    // Lấy lại tài liệu đã được cập nhật
    const updatedCard = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(cardId) });

    return updatedCard;
  } catch (error) {
    throw new Error(error);
  }
};

const pullManyUserToCard = async (cardId, userIds) => {
  try {
    const objectIdUserIds = userIds.map((id) => new ObjectId(id));
    const updateResult = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .updateMany(
        { _id: new ObjectId(cardId) },
        { $pull: { memberIds: { $in: objectIdUserIds } } },
        { returnDocument: "after" }
      );
    if (updateResult.modifiedCount === 0) {
      throw new Error(
        "No documents matched the query or documents already updated."
      );
    }

    // Lấy lại tài liệu đã được cập nhật
    const updatedCard = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(cardId) });

    return updatedCard;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (cardId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(cardId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (cardId, updateData) => {
  try {
    // Lọc những field mà chúng ta không cho phép cập nhật linh tinh
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });

    // Đối với những dữ liệu liên quan ObjectId, biến đổi ở đây
    if (updateData.columnId)
      updateData.columnId = new ObjectId(updateData.columnId);

    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId) },
        { $set: updateData },
        { returnDocument: "after" } // sẽ trả về kết quả mới sau khi cập nhật
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const addCommentToCard = async (comment) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(comment.cardId) },
        { $push: { comments: new ObjectId(comment._id) } },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const addAttachmentToCard = async (attachment) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(attachment.cardId) },
        { $push: { attachments: attachment._id } }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteManyByColumnId = async (columnId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .deleteMany({ columnId: new ObjectId(columnId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteManyByBoardId = async (boardId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .deleteMany({ boardId: new ObjectId(boardId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteSoftCard = async (cardId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(cardId) }, { $set: { _destroy: true } });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteCard = async (cardId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(cardId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const activeCard = async (cardId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(cardId) }, { $set: { _destroy: false } });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const pullComments = async (comment) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(comment.cardId) },
        { $pull: { comments: new ObjectId(comment._id) } },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const checkMemberIds = async (cardId, userId) => {
  try {
    const board = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(cardId),
        memberIds: new ObjectId(userId),
        _destroy: false,
      });
    return !!board;
  } catch (error) {
    throw new Error(error.message);
  }
};

const pullAttachments = async (attachment) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(attachment.cardId) },
        { $pull: { attachments: new ObjectId(attachment._id) } },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const updateCover = async (cardId, cardData) => {
  try {
    const updateFields = {
      description: cardData.description,
      deadline: new Date(cardData.deadline),
      updatedAt: new Date(),
    };

    if (cardData.coverURL) {
      updateFields.cover = cardData.coverURL;
    }
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(cardId) },
        {
          $set: updateFields,
        },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const checkCompleted = async (cardId, completed) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(cardId) },
        { $set: { completed: completed } }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllUserInCard = async (cardId) => {
  try {
    const users = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .aggregate([
        { $match: { _id: new ObjectId(cardId), _destroy: false } },
        { $unwind: "$memberIds" },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: "memberIds",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 0,
            userId: "$user._id",
            email: "$user.email",
            displayName: "$user.displayName",
            avatar: "$user.avatar",
          },
        },
      ])
      .toArray();

    return users;
  } catch (error) {
    throw new Error(error);
  }
};

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update,
  deleteManyByColumnId,
  addAttachmentToCard,
  pushMemberIdsToCard,
  deleteManyByBoardId,
  checkDeadlines,
  addCommentToCard,
  deleteSoftCard,
  activeCard,
  pullComments,
  pullAttachments,
  checkMemberIds,
  updateCover,
  checkCompleted,
  getAllUserInCard,
  deleteCard,
  pushManyUserToCard,
  pullManyUserToCard,
};
