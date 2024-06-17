import { StatusCodes } from "http-status-codes";
import { reminderModel } from "~/models/reminderModel";
import { userModel } from "~/models/userModel";
import ApiError from "~/utils/ApiError";

const createNewReminder = async (userId, reqBody) => {
  try {
    const createdReminder = await reminderModel.createReminder(userId, reqBody);
    const getNewReminder = await reminderModel.findOneById(
      createdReminder.insertedId
    );

    const user = await userModel.findOneById(userId);
    const userDisplayName = user ? user.displayName : "Unknown";

    const result = {
      ...getNewReminder,
      createdBy: userDisplayName,
    };

    return result;
  } catch (error) {
    throw new Error("Failed to create reminder: " + error.message);
  }
};

const updateReminder = async (reminderId, reqBody) => {
  try {
    const updatedReminder = await reminderModel.updateReminder(
      reminderId,
      reqBody
    );

    if (!updatedReminder) {
      throw new Error("Reminder not found");
    }

    return updatedReminder;
  } catch (error) {
    throw new Error("Failed to update reminder: " + error.message);
  }
};

const deleteReminder = async (reminderId) => {
  try {
    const deletedReminder = await reminderModel.deleteReminder(reminderId);

    if (!deletedReminder) {
      throw new Error("Reminder not found");
    }

    return deletedReminder;
  } catch (error) {
    throw new Error("Failed to delete reminder: " + error.message);
  }
};

const toggleReminderCompletion = async (reminderId) => {
  try {
    const existReminder = await reminderModel.findOneById(reminderId);

    if (!existReminder) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Reminder not found!");
    }
    await reminderModel.toggleReminderCompletion(reminderId, true);
  } catch (error) {
    throw new Error("Failed to toggle reminder completion: " + error.message);
  }
};

const getAll = async (userId) => {
  try {
    const reminders = await reminderModel.getAllReminderByUserId(userId);
    if (!reminders) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Reminder not found!");
    }
    return reminders;
  } catch (error) {
    throw error;
  }
};

const getAllMarkRead = async (userId) => {
  try {
    const reminders = await reminderModel.getAllReminderByUserId(userId);
    const user = await userModel.findOneById(reminders.userId);
    const userDisplayName = user ? user.displayName : "Unknown";

    const result = reminders.map((reminder) => ({
      ...reminder,
      createdBy: userDisplayName,
    }));
    return result;
  } catch (error) {
    throw error;
  }
};

export const reminderService = {
  createNewReminder,
  updateReminder,
  deleteReminder,
  toggleReminderCompletion,
  getAll,
  getAllMarkRead,
};
