import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { REMINDER_TYPES } from "~/utils/constants";
import { boardModel } from "./boardModel";
import { userModel } from "./userModel";

// Define Collection (name & schema)
const REMINDER_COLLECTION_NAME = "reminders";
const REMINDER_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  boardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  type: Joi.string()
    .required()
    .valid(...Object.values(REMINDER_TYPES)),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().required().min(3).max(50).trim().strict(),
  dueDate: Joi.date().timestamp("javascript").default(null),
  completed: Joi.boolean().default(false),
  notified: Joi.boolean().default(false),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

const validateBeforeCreate = async (data) => {
  return await REMINDER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createReminder = async (userId, data) => {
  try {
    const validData = await validateBeforeCreate(data);
    const newReminderToAdd = {
      userId: userId,
      ...validData,
    };
    const result = await GET_DB()
      .collection(REMINDER_COLLECTION_NAME)
      .insertOne(newReminderToAdd);

    return result;
  } catch (error) {
    throw new Error("Failed to create reminder: " + error.message);
  }
};

const scheduleReminders = async (userId, now) => {
  try {
    const reminders = await GET_DB()
      .collection(REMINDER_COLLECTION_NAME)
      .find({
        userId: userId,
        dueDate: { $gte: now },
        completed: true,
        notified: false,
        _destroy: false,
      })
      .toArray();
    return reminders;
  } catch (error) {
    throw new Error(error);
  }
};

const updateReminder = async (reminderId, data) => {
  try {
    const validData = await REMINDER_COLLECTION_SCHEMA.validateAsync(data, {
      abortEarly: false,
      allowUnknown: true,
    });
    const result = await GET_DB()
      .collection(REMINDER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(reminderId) },
        { $set: validData },
        { returnDocument: "after" }
      );
    return result.value;
  } catch (error) {
    throw new Error("Failed to update reminder: " + error.message);
  }
};

const deleteReminder = async (reminderId) => {
  try {
    const result = await GET_DB()
      .collection(REMINDER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(reminderId) },
        { $set: { _destroy: true } },
        { returnDocument: "after" }
      );
    return result.value;
  } catch (error) {
    throw new Error("Failed to delete reminder: " + error.message);
  }
};

const toggleReminderCompletion = async (reminderId, completed) => {
  try {
    const result = await GET_DB()
      .collection(REMINDER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(reminderId) },
        { $set: { completed: completed } },
        { returnDocument: "after" }
      );
    return result.value;
  } catch (error) {
    throw new Error("Failed to toggle reminder completion: " + error.message);
  }
};

const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(REMINDER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id), _destroy: false });
    return result;
  } catch (error) {
    throw new Error("Failed to find reminder: " + error.message);
  }
};

const getAllReminderByUserId = async (userId) => {
  try {
    const boards = await GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .find({
        memberIds: new ObjectId(userId),
      })
      .toArray();

    const boardIds = boards.map((board) => board._id.toString());

    const reminders = await GET_DB()
      .collection(REMINDER_COLLECTION_NAME)
      .find({
        $or: [{ userId: userId.toString() }, { boardId: { $in: boardIds } }],
        completed: false,
        _destroy: false,
      })
      .toArray();

    const result = await Promise.all(
      reminders.map(async (reminder) => {
        const user = await GET_DB()
          .collection(userModel.USER_COLLECTION_NAME)
          .findOne({ _id: new ObjectId(reminder.userId) });
        const userDisplayName = user ? user.displayName : "Unknown";
        return {
          ...reminder,
          createdBy: userDisplayName,
        };
      })
    );

    return result;
  } catch (error) {
    throw new Error("Failed to get reminders by user ID: " + error.message);
  }
};

const getAllReminderMarkRead = async (userId) => {
  try {
    const boards = await GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .find({
        memberIds: new ObjectId(userId),
      })
      .toArray();

    const boardIds = boards.map((board) => board._id.toString());

    const reminders = await GET_DB()
      .collection(REMINDER_COLLECTION_NAME)
      .find({
        $or: [{ userId: userId.toString() }, { boardId: { $in: boardIds } }],
        completed: true,
        _destroy: false,
      })
      .toArray();

    return reminders;
  } catch (error) {
    throw new Error("Failed to get reminders by user ID: " + error.message);
  }
};

export const reminderModel = {
  REMINDER_COLLECTION_NAME,
  REMINDER_COLLECTION_SCHEMA,
  createReminder,
  scheduleReminders,
  updateReminder,
  deleteReminder,
  toggleReminderCompletion,
  findOneById,
  getAllReminderByUserId,
  getAllReminderMarkRead,
};
