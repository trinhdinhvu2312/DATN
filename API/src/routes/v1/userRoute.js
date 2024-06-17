import express from "express";
import { userController } from "~/controllers/userController";

const Router = express.Router();

Router.route("/").get(userController.getUser);

Router.route("/getUserById/:id").get(userController.getUserById);

Router.route("/getUseByMail").post(userController.getUserWithMail);

export const userRoute = Router;
