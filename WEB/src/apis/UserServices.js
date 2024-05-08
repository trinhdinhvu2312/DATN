import { postApi } from "./agent";

const UserServices = {
  register: async (payload) => {
    try {
      const result = await postApi("auth/register", payload);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
  login: async (payload) => {
    try {
      const result = await postApi("auth/login", payload);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
};

export default UserServices;
