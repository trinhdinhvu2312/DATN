import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import { boardModel } from "~/models/boardModel";
import { cardModel } from "~/models/cardModel";
import { columnModel } from "~/models/columnModel";
import { commentModel } from "~/models/commentModel";
import { userModel } from "~/models/userModel";
import ApiError from "~/utils/ApiError";

const createNew = async (reqBody) => {
  try {
    const newBoardId = new ObjectId(reqBody.boardId);
    const board = await boardModel.findOneById(newBoardId);

    if (!board) {
      throw new Error("Board not found");
    }

    const newCard = {
      ...reqBody,
      memberIds: board.memberIds,
    };

    const createdCard = await cardModel.createNew(newCard);
    const getNewCard = await cardModel.findOneById(createdCard.insertedId);

    if (getNewCard) {
      // Cập nhật mảng cardOrderIds trong collection columns
      await columnModel.pushCardOrderIds(getNewCard);
    }

    return getNewCard;
  } catch (error) {
    throw error;
  }
};

const createComment = async (userId, cardId, content) => {
  try {
    const card = await cardModel.findOneById(cardId);
    if (!card) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Card not found!");
    }

    const user = await userModel.findOneById(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found!");
    }

    const hasPermission = await cardModel.checkMemberIds(cardId, userId);

    if (!hasPermission) {
      throw new ApiError(StatusCodes.FORBIDDEN, "User not permission!");
    }

    const newComment = {
      userId: userId.toString(),
      cardId: cardId.toString(),
      content,
      createdAt: new Date(),
    };

    const createdComment = await commentModel.createComment(newComment);

    const getNewComment = await commentModel.findOneById(
      createdComment.insertedId
    );

    if (getNewComment) {
      await cardModel.addCommentToCard(getNewComment);
    }

    return getNewComment;
  } catch (error) {
    throw error;
  }
};

const getAllComments = async (cardId) => {
  try {
    const comments = await commentModel.getAllComment(cardId);
    return comments;
  } catch (error) {
    throw error;
  }
};

const updateComment = async (userId, commentId, content) => {
  try {
    const comment = await commentModel.findOneById(commentId);
    if (!comment) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Comment not found!");
    }
    if (comment.userId.toString() !== userId.toString()) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized!");
    }
    await commentModel.updateComment(commentId, content);
    const updatedComment = await commentModel.findOneById(commentId);
    return updatedComment;
  } catch (error) {
    throw error;
  }
};

const activeComment = async (userId, commentId) => {
  try {
    const comment = await commentModel.findOneById(commentId);
    if (!comment) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Comment not found!");
    }
    if (comment.userId.toString() !== userId.toString()) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized!");
    }
    await commentModel.activeComment(commentId);
    return { message: "Comment active successfully!" };
  } catch (error) {
    throw error;
  }
};

const deleteSoftComment = async (userId, commentId) => {
  try {
    const comment = await commentModel.findOneById(commentId);
    if (!comment) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Comment not found!");
    }
    if (comment.userId.toString() !== userId.toString()) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized!");
    }
    await commentModel.deleteSoftComment(commentId);
    return { message: "Comment deleted successfully!" };
  } catch (error) {
    throw error;
  }
};

const deleteComment = async (userId, commentId) => {
  try {
    const comment = await commentModel.findOneById(commentId);
    if (!comment) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Comment not found!");
    }
    if (comment.userId.toString() !== userId.toString()) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized!");
    }
    await commentModel.deleteComment(comment._id);
    await cardModel.pullComments(comment);
    return { message: "Comment deleted permanently!" };
  } catch (error) {
    throw error;
  }
};

const checkCompleted = async (userId, cardId, completed) => {
  try {
    const card = await cardModel.findOneById(cardId);
    if (!card) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Card not found!");
    }
    const hasPermission = await cardModel.checkMemberIds(cardId, userId);

    if (!hasPermission) {
      throw new ApiError(StatusCodes.FORBIDDEN, "User not permission!");
    }
    await cardModel.checkCompleted(cardId, completed);
    const updatedCard = await cardModel.findOneById(cardId);
    return updatedCard;
  } catch (error) {
    throw error;
  }
};

const getAllUserInCard = async (cardId) => {
  try {
    const users = await cardModel.getAllUserInCard(cardId);
    return users;
  } catch (error) {
    throw error;
  }
};

const deleteItem = async (userId, cardId) => {
  try {
    const targetCard = await cardModel.findOneById(cardId);

    if (!targetCard) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Card not found!");
    }

    const hasPermission = await boardModel.checkOwnerIds(
      targetCard.boardId,
      userId
    );

    if (!hasPermission) {
      throw new ApiError(StatusCodes.FORBIDDEN, "User not permission!");
    }

    // Xóa Column
    await cardModel.deleteCard(cardId);

    // Xoá columnId trong mảng columnOrderIds của cái Board chứa nó
    await columnModel.pullCardOrderIds(targetCard);

    return { deleteResult: "Cards deleted successfully!" };
  } catch (error) {
    throw error;
  }
};

const getCardById = async (cardId) => {
  try {
    const card = await cardModel.findOneById(cardId);
    if (!card) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Card not found!");
    }
    return card;
  } catch (error) {
    throw error;
  }
};

const pushUserToCard = async (userId, cardId, userIds) => {
  try {
    const card = await cardModel.findOneById(cardId);

    if (!card) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Card not found!");
    }
    const hasPermission = await boardModel.checkOwnerIds(card.boardId, userId);

    if (!hasPermission) {
      throw new ApiError(StatusCodes.FORBIDDEN, "User not permission!");
    }

    const res = await cardModel.pushManyUserToCard(cardId, userIds);
    return res;
  } catch (error) {
    throw error;
  }
};

const pullUserToCard = async (userId, cardId, userIds) => {
  try {
    const card = await cardModel.findOneById(cardId);
    if (!card) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Card not found!");
    }
    const hasPermission = await boardModel.checkOwnerIds(card.boardId, userId);

    if (!hasPermission) {
      throw new ApiError(StatusCodes.FORBIDDEN, "User not permission!");
    }
    const res = await cardModel.pullManyUserToCard(cardId, userIds);
    return res;
  } catch (error) {
    throw error;
  }
};

export const cardService = {
  createNew,
  createComment,
  getAllComments,
  updateComment,
  deleteComment,
  deleteSoftComment,
  activeComment,
  checkCompleted,
  getAllUserInCard,
  deleteItem,
  getCardById,
  pushUserToCard,
  pullUserToCard,
};
