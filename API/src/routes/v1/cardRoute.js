import express from "express";
import { cardValidation } from "~/validations/cardValidation";
import { cardController } from "~/controllers/cardController";
import { uploadController } from "~/controllers/uploadController";

const Router = express.Router();

Router.route("/").post(cardValidation.createNew, cardController.createNew);

Router.route("/:id/comments")
  .get(cardController.getAllComments)
  .post(cardController.createComment);

Router.route("/:id")
  .get(cardController.getCardById)
  .delete(cardController.deleteItem);

Router.route("/:id/user")
  .post(cardController.pushUserToCard)
  .put(cardController.pullUserToCard);

Router.route("/:id/updateCompleted").put(cardController.updateCompleted);

Router.route("/:id/getAllUser").get(cardController.getAllUserInCard);

Router.route("/:id/attachments").get(uploadController.getAllAttachment);

Router.route("/comments/:id").put(cardController.updateComment);

Router.route("/comments/active/:id").put(cardController.activeComment);

Router.route("/comments/delete/:id")
  .put(cardController.deleteSoftComment)
  .delete(cardController.deleteComment);

export const cardRoute = Router;
