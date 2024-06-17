import { deleteApi, getApi, postApi, putApi, putApi2 } from "./agent";

const CardServices = {
  createNewCardAPI: async (newCardData) => {
    try {
      const result = await postApi(`cards`, newCardData);
      return result.data;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
  getCardById: async (id) => {
    try {
      const result = await getApi(`cards/${id}`, "");
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
  updateCardCompletedStatus: async (id, completed) => {
    try {
      const result = await putApi2(`cards/${id}/updateCompleted`, completed);
      return result.data;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
  getAllUserFromCard: async (id) => {
    try {
      const result = await getApi(`cards/${id}/getAllUser`, "");
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  getAllComment: async (id) => {
    try {
      const result = await getApi(`cards/${id}/comments`, "");
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  createComment: async (id, data) => {
    try {
      const result = await postApi(`cards/${id}/comments`, data);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  getAllAttachment: async (id) => {
    try {
      const result = await getApi(`cards/${id}/attachments`, "");
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  deleteCard: async (cardId) => {
    try {
      const result = await deleteApi(`cards/${cardId}`);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  deleteComment: async (commentId) => {
    try {
      const result = await deleteApi(`cards/comments/delete/${commentId}`);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  deleteAttachment: async (attachmentId) => {
    try {
      const result = await deleteApi(
        `uploads/attachments/delete/${attachmentId}`
      );
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  pushMemberToCard: async (id, data) => {
    try {
      const result = await postApi(`cards/${id}/user`, data, false);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  pullMemberToCard: async (id, data) => {
    try {
      const result = await putApi2(`cards/${id}/user`, data);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
};

export default CardServices;
