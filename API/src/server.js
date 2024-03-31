import express from "express";
import cors from "cors";
import { corsOptions } from "~/config/cors";
import exitHook from "async-exit-hook";
import { CONNECT_DB, CLOSE_DB } from "~/config/mongodb";
import { env } from "~/config/environment";
import { APIs_V1 } from "~/routes/v1";
import { errorHandlingMiddleware } from "~/middlewares/errorHandlingMiddleware";

const START_SERVER = () => {
  const app = express();

  // Xử lý CORS
  app.use(cors(corsOptions));

  // Enable req.body json data
  app.use(express.json());

  // Use APIs V1
  app.use("/v1", APIs_V1);

  // Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware);

  if (env.BUILD_MODE === "production") {
    app.listen(process.env.PORT, () => {
      console.log(
        `3. Production: Hi ${env.AUTHOR}, Back-end Server is running successfully at Port: ${process.env.PORT}`
      );
    });
  } else {
    // Môi trường Local Dev
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(
        `3. Local DEV: Hi ${env.AUTHOR}, Back-end Server is running successfully at Host: ${env.LOCAL_DEV_APP_HOST} and Port: ${env.LOCAL_DEV_APP_PORT}`
      );
    });
  }
  exitHook(() => {
    console.log("4. Server is shutting down...");
    CLOSE_DB();
    console.log("5. Disconnected from MongoDB Cloud Atlas");
  });
};

// Chỉ khi Kết nối tới Database thành công thì mới Start Server Back-end lên.
console.log("1. Connecting to MongoDB Cloud Atlas...");
CONNECT_DB()
  .then(() => console.log("2. Connected to MongoDB Cloud Atlas!"))
  .then(() => START_SERVER())
  .catch((error) => {
    console.error(error);
    process.exit(0);
  });
