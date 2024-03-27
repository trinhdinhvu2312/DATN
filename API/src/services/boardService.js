import { slugify } from "~/utils/formatters";
import { boardModel } from "~/models/boardModel";
import { columnModel } from "~/models/columnModel";
import { cardModel } from "~/models/cardModel";

import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { cloneDeep } from "lodash";

const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    };

    // Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database
    const createdBoard = await boardModel.createNew(newBoard);

    // Lấy bản ghi board sau khi gọi (tùy mục đích dự án mà có cần bước này hay không)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId);

    // Bắn email, notification về cho admin khi có 1 cái board mới được tạo...vv

    // Trả kết quả về, trong Service luôn phải có return
    return getNewBoard;
  } catch (error) {
    throw error;
  }
};

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId);
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Board not found!");
    }
    const resBoard = cloneDeep(board);

    // B2: Đưa card về đúng column của nó
    resBoard.columns.forEach((column) => {
      // Cách dùng .equals này là bởi vì chúng ta hiểu ObjectId trong MongoDB có support method .equals
      column.cards = resBoard.cards.filter((card) =>
        card.columnId.equals(column._id)
      );
    });

    // B3: Xóa mảng cards khỏi board ban đầu
    delete resBoard.cards;

    return resBoard;
  } catch (error) {
    throw error;
  }
};

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };
    const updatedBoard = await boardModel.update(boardId, updateData);

    return updatedBoard;
  } catch (error) {
    throw error;
  }
};

const moveCardToDifferentColumn = async (reqBody) => {
  try {
    // B1: Cập nhật mảng cardOrderIds của Column ban đầu chứa nó (Hiểu bản chất là xóa cái _id của Card ra khỏi mảng)
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now(),
    });
    // B2: Cập nhật mảng cardOrderIds của Column tiếp theo (Hiểu bản chất là thêm _id của Card vào mảng)
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now(),
    });
    // B3: Cập nhật lại trường columnId mới của cái Card đã kéo
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId,
    });

    return { updateResult: "Successfully!" };
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
};
