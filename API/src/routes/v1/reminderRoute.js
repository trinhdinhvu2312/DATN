import express from "express";
import { reminderController } from "~/controllers/reminderController";

const Router = express.Router();

Router.route("/")
  .get(reminderController.getAll)
  .post(reminderController.createNew);

Router.route("/mark-read").get(reminderController.getAllMarkRead);

Router.route("/:id")
  .put(reminderController.update)
  .delete(reminderController.deleteItem);

Router.route("/:id/toggleCompletion").put(reminderController.toggleCompletion);

export const reminderRoute = Router;
