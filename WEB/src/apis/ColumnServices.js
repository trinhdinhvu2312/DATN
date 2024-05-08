import { deleteApi, postApi, putApi } from "./agent";

const ColumnServices = {
  createNewColumnAPI: async (newColumnData) => {
    try {
      const result = await postApi(`columns`, newColumnData);
      return result.data;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  updateColumnDetailsAPI: async (columnId, updateData) => {
    try {
      const result = await putApi(`columns/${columnId}`, updateData);
      return result.data;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  deleteColumnDetailsAPI: async (columnId) => {
    try {
      const result = await deleteApi(`columns/${columnId}`);
      return result.data;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
};

export default ColumnServices;
