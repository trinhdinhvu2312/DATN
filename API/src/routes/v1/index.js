import express from "express";
import { boardRoute } from "~/routes/v1/boardRoute";
import { columnRoute } from "~/routes/v1/columnRoute";
import { cardRoute } from "~/routes/v1/cardRoute";
import { userRoute } from "~/routes/v1/userRoute";
import { auth } from "~/middlewares/auth";

const Router = express.Router();

Router.use("/boards", auth.verifyToken); // Xác thực token cho các tài nguyên khác trừ "/users"
Router.use("/columns", auth.verifyToken);
Router.use("/cards", auth.verifyToken);
/** Board APIs */
Router.use("/boards", boardRoute);

/** Column APIs */
Router.use("/columns", columnRoute);

/** Card APIs */
Router.use("/cards", cardRoute);

/** User APIs */
Router.use("/auth", userRoute);

export const APIs_V1 = Router;
