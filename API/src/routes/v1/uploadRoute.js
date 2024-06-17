import express from "express";
import multer from "multer";
import path from "path";
import { uploadController } from "~/controllers/uploadController";

const Router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.env.UPLOAD_DIR));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename =
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
    req.fileRelativePath = `http://${process.env.LOCAL_DEV_APP_HOST}:${process.env.LOCAL_DEV_APP_PORT}/uploads/${filename}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

Router.route("/:id/attachments").post(
  upload.single("file"),
  uploadController.uploadAttachment
);

Router.route("/cards/:id/cover").put(
  upload.single("file"),
  uploadController.uploadCoverCard
);

Router.route("/users/avatar").put(
  upload.single("file"),
  uploadController.uploadAvatar
);

Router.route("/attachments/active/:id").put(uploadController.activeAttachment);

Router.route("/attachments/delete/:id")
  .put(uploadController.deleteSoftAttachment)
  .delete(uploadController.deleteAttachment);

export const uploadRoute = Router;
