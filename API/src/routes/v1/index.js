import express from "express";
import { boardRoute } from "~/routes/v1/boardRoute";
import { columnRoute } from "~/routes/v1/columnRoute";
import { cardRoute } from "~/routes/v1/cardRoute";
import { authRoute } from "~/routes/v1/authRoute";
import { auth } from "~/middlewares/auth";
import { invitationRoute } from "~/routes/v1/invitationRoute";
import { uploadRoute } from "~/routes/v1/uploadRoute";
import { userRoute } from "~/routes/v1/userRoute";
import { reminderRoute } from "~/routes/v1/reminderRoute";

const Router = express.Router();

/** APIs verify */
Router.use("/boards", auth.verifyToken);
Router.use("/user", auth.verifyToken);
Router.use("/columns", auth.verifyToken);
Router.use("/cards", auth.verifyToken);
Router.use("/invite", auth.verifyToken);
Router.use("/uploads", auth.verifyToken);
Router.use("/reminders", auth.verifyToken);

/** Board APIs */
Router.use("/boards", boardRoute);

/** User APIs */
Router.use("/user", userRoute);

/** Column APIs */
Router.use("/columns", columnRoute);

/** Card APIs */
Router.use("/cards", cardRoute);

/** Upload APIs */
Router.use("/uploads", uploadRoute);

/** Invitation APIs */
Router.use("/invite", invitationRoute);

/** Reminder APIs */
Router.use("/reminders", reminderRoute);

/** Auth APIs */
Router.use("/auth", authRoute);

export const APIs_V1 = Router;
