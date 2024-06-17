import { StatusCodes } from "http-status-codes";
import { cardService } from "~/services/cardService";

const createNew = async (req, res, next) => {
  try {
    const createdCard = await cardService.createNew(req.body);
    res.status(StatusCodes.CREATED).json(createdCard);
  } catch (error) {
    next(error);
  }
};

const getAllComments = async (req, res, next) => {
  try {
    const cardId = req.params.id;
    const comments = await cardService.getAllComments(cardId);
    res.status(StatusCodes.OK).json(comments);
  } catch (error) {
    next(error);
  }
};

const getAllUserInCard = async (req, res, next) => {
  try {
    const cardId = req.params.id;
    const users = await cardService.getAllUserInCard(cardId);
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    next(error);
  }
};

const createComment = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const cardId = req.params.id;
    const content = req.body;

    const createdComment = await cardService.createComment(
      userId,
      cardId,
      content.data
    );

    res.status(StatusCodes.CREATED).json(createdComment);
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const content = req.body;
    const commentId = req.params.id;
    const updatedCard = await cardService.updateComment(
      userId,
      commentId,
      content.data
    );
    res.status(StatusCodes.ACCEPTED).json(updatedCard);
  } catch (error) {
    next(error);
  }
};

const updateCompleted = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const completed = req.body.completed;
    const cardId = req.params.id;
    const updatedCard = await cardService.checkCompleted(
      userId,
      cardId,
      completed
    );
    res.status(StatusCodes.ACCEPTED).json(updatedCard);
  } catch (error) {
    next(error);
  }
};

const activeComment = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const commentId = req.params.id;
    const result = await cardService.activeComment(userId, commentId);
    res.status(StatusCodes.ACCEPTED).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteSoftComment = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const commentId = req.params.id;
    const result = await cardService.deleteSoftComment(userId, commentId);
    res.status(StatusCodes.ACCEPTED).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const commentId = req.params.id;
    const result = await cardService.deleteComment(userId, commentId);
    res.status(StatusCodes.ACCEPTED).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const cardId = req.params.id;
    const result = await cardService.deleteItem(userId, cardId);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const getCardById = async (req, res, next) => {
  try {
    const cardId = req.params.id;
    const card = await cardService.getCardById(cardId);
    res.status(StatusCodes.OK).json(card);
  } catch (error) {
    next(error);
  }
};

const pushUserToCard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userIds = req.body.users;
    const cardId = req.params.id;
    const cardAfterPush = await cardService.pushUserToCard(
      userId,
      cardId,
      userIds
    );
    res.status(StatusCodes.ACCEPTED).json(cardAfterPush);
  } catch (error) {
    next(error);
  }
};

const pullUserToCard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userIds = req.body.users;
    const cardId = req.params.id;
    const cardAfterPull = await cardService.pullUserToCard(
      userId,
      cardId,
      userIds
    );
    res.status(StatusCodes.ACCEPTED).json(cardAfterPull);
  } catch (error) {
    next(error);
  }
};

export const cardController = {
  createNew,
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
  deleteSoftComment,
  activeComment,
  updateCompleted,
  getAllUserInCard,
  deleteItem,
  getCardById,
  pushUserToCard,
  pullUserToCard,
};
