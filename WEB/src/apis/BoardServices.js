import { deleteApi, getApi, postApi, putApi, putApi2 } from "./agent";

const BoardServices = {
  getAllBoard: async () => {
    try {
      const result = await getApi(`boards`, "");
      return result.data;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  getBoardDetails: async (id) => {
    try {
      const result = await getApi(`boards/${id}`, "");
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  createBoard: async (payload) => {
    try {
      const result = await postApi("boards", payload);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  inviteToBoard: async (id, payload) => {
    try {
      const result = await postApi(`boards/${id}/invite`, payload);
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

  updateContent: async (boardId, updateData) => {
    try {
      const result = await putApi2(
        `boards/updateContent/${boardId}`,
        updateData
      );
      return result;
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
  getAllUserFromBoard: async (id) => {
    try {
      const result = await getApi(`boards/${id}/getAllUser`, "");
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  pullMemberToBoard: async (id, data) => {
    try {
      const result = await putApi2(`boards/${id}/user`, data);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
  deleteBoard: async (cardId) => {
    try {
      const result = await deleteApi(`boards/${cardId}`);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
};

export default BoardServices;
