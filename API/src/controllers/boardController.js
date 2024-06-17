import { StatusCodes } from "http-status-codes";
import { boardService } from "~/services/boardService";

const createNew = async (req, res, next) => {
  try {
    // Điều hướng dữ liệu sang tầng Service
    const userId = req.user._id;
    const createdBoard = await boardService.createNew(req.body, userId);

    // Có kết quả thì trả về phía Client
    res.status(StatusCodes.CREATED).json(createdBoard);
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const boards = await boardService.getAll(userId);
    res.status(StatusCodes.OK).json(boards);
  } catch (error) {
    next(error);
  }
};

const getDetails = async (req, res, next) => {
  try {
    const boardId = req.params.id;
    const board = await boardService.getDetails(boardId);
    res.status(StatusCodes.OK).json(board);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const boardId = req.params.id;
    const updatedBoard = await boardService.update(boardId, req.body);

    res.status(StatusCodes.OK).json(updatedBoard);
  } catch (error) {
    next(error);
  }
};

const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColumn(req.body);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const boardId = req.params.id;
    const userId = req.user._id;
    const result = await boardService.deleteItem(boardId, userId);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllUserInBoard = async (req, res, next) => {
  try {
    const boardId = req.params.id;
    const users = await boardService.getAllUserInBoard(boardId);
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    next(error);
  }
};

const updateContent = async (req, res, next) => {
  const boardId = req.params.id;
  const userId = req.user._id;
  const data = req.body;

  try {
    const result = await boardService.updateContent(userId, boardId, data);
    res.status(StatusCodes.CREATED).json(result);
  } catch (err) {
    next(err);
  }
};

const pullUserToBoard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userIds = req.body.users;
    const boardId = req.params.id;
    const cardAfterPull = await boardService.pullUserToBoard(
      userId,
      boardId,
      userIds
    );
    res.status(StatusCodes.ACCEPTED).json(cardAfterPull);
  } catch (error) {
    next(error);
  }
};

export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  getAll,
  deleteItem,
  getAllUserInBoard,
  updateContent,
  pullUserToBoard,
};
