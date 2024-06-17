import express from "express";
import { invitationController } from "~/controllers/invitationController";

const Router = express.Router();

Router.route("/").get(invitationController.getAll);

Router.route("/:id/accept").post(invitationController.acceptInvite);

export const invitationRoute = Router;
