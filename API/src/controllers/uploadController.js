import { StatusCodes } from "http-status-codes";
import { UploadService } from "~/services/uploadService";

const uploadAttachment = async (req, res) => {
  const cardId = req.params.id;
  const userId = req.user._id;
  const { originalname, mimetype } = req.file;
  const fileRelativePath = req.fileRelativePath;
  const fileURL = fileRelativePath.replace(/\\/g, "/");

  const attachmentData = {
    fileName: originalname,
    fileType: mimetype,
    fileURL: fileURL,
    createdAt: new Date(),
  };

  try {
    const result = await UploadService.createAttachment(
      userId,
      cardId,
      attachmentData
    );
    res.status(StatusCodes.CREATED).json(result);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

const uploadAvatar = async (req, res) => {
  const userId = req.user._id;
  const username = req.body.username;
  const fileRelativePath = req.fileRelativePath;

  try {
    const avatarUrl = fileRelativePath?.replace(/\\/g, "/");
    const userData = {
      avatarUrl,
      username,
    };
    const result = await UploadService.updateAvatar(userId, userData);
    res.status(StatusCodes.CREATED).json(result);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

const uploadCoverCard = async (req, res) => {
  const cardId = req.params.id;
  const userId = req.user._id;
  const fileRelativePath = req.fileRelativePath;
  const description = req.body.description;
  const deadline = req.body.deadline;

  try {
    const coverURL = fileRelativePath?.replace(/\\/g, "/");
    const cardData = {
      coverURL,
      description,
      deadline,
    };
    const result = await UploadService.updateCoverCard(
      userId,
      cardId,
      cardData
    );
    res.status(StatusCodes.CREATED).json(result);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

const getAllAttachment = async (req, res, next) => {
  try {
    const cardId = req.params.id;
    const attachments = await UploadService.getAllAttachment(cardId);
    res.status(StatusCodes.OK).json(attachments);
  } catch (error) {
    next(error);
  }
};

const activeAttachment = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const attachmentId = req.params.id;
    const result = await UploadService.activeAttachment(userId, attachmentId);
    res.status(StatusCodes.ACCEPTED).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteSoftAttachment = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const attachmentId = req.params.id;
    const result = await UploadService.deleteSoftAttachment(
      userId,
      attachmentId
    );
    res.status(StatusCodes.ACCEPTED).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteAttachment = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const attachmentId = req.params.id;
    const result = await UploadService.deleteAttachment(userId, attachmentId);
    res.status(StatusCodes.ACCEPTED).json(result);
  } catch (error) {
    next(error);
  }
};

export const uploadController = {
  uploadAttachment,
  getAllAttachment,
  activeAttachment,
  deleteAttachment,
  deleteSoftAttachment,
  uploadAvatar,
  uploadCoverCard,
};
