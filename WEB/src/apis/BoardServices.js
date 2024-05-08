import { getApi, putApi } from "./agent";

const BoardServices = {
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
      const result = await putApi(`boards/${boardId}`, updateData);
      return result.data;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  moveCardToDifferentColumnAPI: async (updateData) => {
    try {
      const result = await putApi(`boards/supports/moving_card`, updateData);
      return result.data;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
};

export default BoardServices;
