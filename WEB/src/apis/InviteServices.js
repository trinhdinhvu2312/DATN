import { getApi, postApi } from "./agent";

const InviteService = {
  getAllInvite: async () => {
    try {
      const result = await getApi(`invite`, "");
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  acceptInvite: async (id) => {
    try {
      const result = await postApi(`invite/${id}/accept`);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
};

export default InviteService;
