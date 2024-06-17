import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { BOARD_TYPES } from "~/utils/constants";
import { columnModel } from "~/models/columnModel";
import { cardModel } from "~/models/cardModel";
import { userModel } from "~/models/userModel";

// Define Collection (Name & Schema)
const BOARD_COLLECTION_NAME = "boards";
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(255).trim().strict(),

  type: Joi.string()
    .required()
    .valid(...Object.values(BOARD_TYPES)),

  ownerIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),

  memberIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),

  columnOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

const INVALID_UPDATE_FIELDS = ["_id", "createdAt"];

const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (data, userId) => {
  try {
    const validData = await validateBeforeCreate(data);
    const newBoardToAdd = {
      ...validData,
      ownerIds: [userId],
      memberIds: [userId],
    };
    const createdBoard = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .insertOne(newBoardToAdd);
    return createdBoard;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (boardId) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(boardId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getAll = async (userId) => {
  try {
    const boards = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .find({
        $or: [
          { ownerIds: new ObjectId(userId) },
          { memberIds: new ObjectId(userId) },
        ],
        _destroy: false,
      })
      .toArray();
    return boards;
  } catch (error) {
    throw new Error(error);
  }
};

// Query tổng hợp (aggregate) để lấy toàn bộ Columns và Cards thuộc về Board
const getDetails = async (id) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
            _destroy: false,
          },
        },
        {
          $lookup: {
            from: columnModel.COLUMN_COLLECTION_NAME,
            localField: "_id",
            foreignField: "boardId",
            as: "columns",
          },
        },
        {
          $lookup: {
            from: cardModel.CARD_COLLECTION_NAME,
            localField: "_id",
            foreignField: "boardId",
            as: "cards",
          },
        },
      ])
      .toArray();

    return result[0] || null;
  } catch (error) {
    throw new Error(error);
  }
};

// Đẩy một phần tử columnId vào cuối mảng columnOrderIds
// Dùng $push trong mongodb ở trường hợp này để đẩy 1 phần tử vào cuối mảng
const pushColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(column.boardId) },
        { $push: { columnOrderIds: new ObjectId(column._id) } },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const pushMemberIds = async (invitation) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(invitation.boardInvitation.boardId) },
        { $push: { memberIds: new ObjectId(invitation.inviteeId) } },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const pullColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(column.boardId) },
        { $pull: { columnOrderIds: new ObjectId(column._id) } },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (boardId, updateData) => {
  try {
    // Lọc những field mà chúng ta không cho phép cập nhật linh tinh
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });
    // Đối với những dữ liệu liên quan ObjectId, biến đổi ở đây
    if (updateData.columnOrderIds) {
      updateData.columnOrderIds = updateData.columnOrderIds.map(
        (_id) => new ObjectId(_id)
      );
    }

    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(boardId) },
        { $set: updateData },
        { returnDocument: "after" } // sẽ trả về kết quả mới sau khi cập nhật
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const checkOwnerIds = async (boardId, userId) => {
  try {
    const board = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(boardId),
        ownerIds: new ObjectId(userId),
        _destroy: false,
      });
    return !!board;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteOneById = async (boardId) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(boardId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllUserInBoard = async (boardId) => {
  try {
    const users = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate([
        { $match: { _id: new ObjectId(boardId), _destroy: false } },
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

const updateContent = async (boardId, data) => {
  try {
    const updateFields = {};

    if (data.title !== "") {
      updateFields.title = data.title;
    }
    if (data.description !== "") {
      updateFields.description = data.description;
    }

    if (Object.keys(updateFields).length === 0) {
      return null;
    }

    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(boardId) },
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

const pullManyUserToBoard = async (boardId, userIds) => {
  try {
    const objectIdUserIds = userIds.map((id) => new ObjectId(id));
    const updateResult = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .updateMany(
        { _id: new ObjectId(boardId) },
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
      .collection(BOARD_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(boardId) });

    return updatedCard;
  } catch (error) {
    throw new Error(error);
  }
};

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  pushColumnOrderIds,
  update,
  pullColumnOrderIds,
  getAll,
  pushMemberIds,
  deleteOneById,
  checkOwnerIds,
  getAllUserInBoard,
  updateContent,
  pullManyUserToBoard,
};
