import { getApi, postApi, putApi } from "./agent";

const ReminderServices = {
  getAllReminder: async () => {
    try {
      const result = await getApi(`reminders`, "");
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  getAllReminderMarkRead: async () => {
    try {
      const result = await getApi(`reminders/mark-read`, "");
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
  createReminder: async (payload) => {
    try {
      const result = await postApi("reminders", payload, false);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
  acceptReminder: async (id) => {
    try {
      const result = await putApi(`reminders/${id}/toggleCompletion`);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
};

export default ReminderServices;
