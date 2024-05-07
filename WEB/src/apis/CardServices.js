import { postApi, putApi } from "./agent";

const CardServices = {
  createNewCardAPI: async (newCardData) => {
    try {
      const result = await postApi(`/v1/cards`, newCardData);
      return result.data;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
};

export default CardServices;
