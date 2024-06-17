import { getApi, postApi } from "./agent";

const UserServices = {
  getUser: async () => {
    try {
      const result = await getApi(`user/`, "");
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  getUserById: async (id) => {
    try {
      const result = await getApi(`user/getUserById/${id}`, "");
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  getUserWithMail: async (payload) => {
    try {
      const result = await postApi(`user/getUserWithMail`, payload);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

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
