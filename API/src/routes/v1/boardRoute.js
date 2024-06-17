import express from "express";
import { boardValidation } from "~/validations/boardValidation";
import { boardController } from "~/controllers/boardController";
import { invitationValidation } from "~/validations/invitationValidation";
import { invitationController } from "~/controllers/invitationController";

const Router = express.Router();

Router.route("/")
  .get(boardController.getAll)
  .post(boardValidation.createNew, boardController.createNew);

Router.route("/:id")
  .get(boardController.getDetails)
  .put(boardValidation.update, boardController.update)
  .delete(boardValidation.deleteItem, boardController.deleteItem);

Router.route("/:id/user").put(boardController.pullUserToBoard);

Router.route("/updateContent/:id").put(boardController.updateContent);

// API hỗ trợ việc di chuyển card giữa các column khác nhau trong một board
Router.route("/supports/moving_card").put(
  boardValidation.moveCardToDifferentColumn,
  boardController.moveCardToDifferentColumn
);

Router.route("/:id/getAllUser").get(boardController.getAllUserInBoard);

Router.route("/:id/invite").post(
  invitationValidation.invite,
  invitationController.invite
);

export const boardRoute = Router;
