import { getApi, postApi, putApi2 } from "./agent";

const BoardServices = {
  createBoard: async (payload) => {
    try {
      const result = await postApi("boards", payload);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  fetchBoardDetailsAPI: async (boardId) => {
    try {
      const result = await getApi(`boards/${boardId}`, "");
      return result.data;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  updateBoardDetailsAPI: async (boardId, updateData) => {
    try {
      const result = await putApi2(`boards/${boardId}`, updateData);
      return result.data;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  moveCardToDifferentColumnAPI: async (updateData) => {
    try {
      const result = await putApi2(`boards/supports/moving_card`, updateData);
      return result.data;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
};

export default BoardServices;
