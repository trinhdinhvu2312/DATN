import { postApi, putApi } from "./agent";

const UploadServices = {
  uploadAttachment: async (id, data) => {
    try {
      const result = await postApi(`uploads/${id}/attachments`, data, true);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
  updateCard: async (id, data) => {
    try {
      const result = await putApi(`uploads/cards/${id}/cover`, data);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
  updateUser: async (data) => {
    try {
      const result = await putApi(`uploads/users/avatar`, data);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
};

export default UploadServices;
