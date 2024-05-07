import { deleteApi, postApi, putApi } from "./agent";

const ColumnServices = {
  createNewColumnAPI: async (newColumnData) => {
    try {
      const result = await postApi(`/v1/columns`, newColumnData);
      return result.data;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  updateColumnDetailsAPI: async (columnId, updateData) => {
    try {
      const result = await putApi(`/v1/columns/${columnId}`, updateData);
      return result.data;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  deleteColumnDetailsAPI: async (columnId) => {
    try {
      const result = await deleteApi(`/v1/columns/${columnId}`);
      return result.data;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
};

export default ColumnServices;
