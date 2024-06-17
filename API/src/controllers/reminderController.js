import { StatusCodes } from "http-status-codes";
import { reminderService } from "~/services/reminderService";

const createNew = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const createdReminder = await reminderService.createNewReminder(
      userId,
      req.body
    );
    res.status(StatusCodes.CREATED).json(createdReminder);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const reminderId = req.params.id;
    const updatedReminder = await reminderService.updateReminder(
      reminderId,
      req.body
    );
    res.status(StatusCodes.OK).json(updatedReminder);
  } catch (error) {
    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const reminderId = req.params.id;
    const result = await reminderService.deleteReminder(reminderId);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const toggleCompletion = async (req, res, next) => {
  try {
    const reminderId = req.params.id;
    await reminderService.toggleReminderCompletion(reminderId);
    res.status(StatusCodes.OK).json("You have read this reminder");
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const reminders = await reminderService.getAll(userId);
    res.status(StatusCodes.OK).json(reminders);
  } catch (error) {
    next(error);
  }
};

const getAllMarkRead = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const reminders = await reminderService.getAll(userId);
    res.status(StatusCodes.OK).json(reminders);
  } catch (error) {
    next(error);
  }
};

export const reminderController = {
  createNew,
  update,
  deleteItem,
  toggleCompletion,
  getAll,
  getAllMarkRead,
};
