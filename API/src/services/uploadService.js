import { StatusCodes } from "http-status-codes";
import { attachmentModel } from "~/models/attachmentModel";
import { cardModel } from "~/models/cardModel";
import { userModel } from "~/models/userModel";
import ApiError from "~/utils/ApiError";

const createAttachment = async (userId, cardId, attachmentData) => {
  try {
    const user = await userModel.findOneById(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found!");
    }

    const card = await cardModel.findOneById(cardId);
    if (!card) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Card not found!");
    }

    const newAttachment = {
      userId: userId.toString(),
      cardId: cardId.toString(),
      ...attachmentData,
    };

    const createdAttachment = await attachmentModel.createAttachment(
      newAttachment
    );

    const getNewAttachment = await attachmentModel.findOneById(
      createdAttachment.insertedId
    );

    if (getNewAttachment) {
      await cardModel.addAttachmentToCard(getNewAttachment);
    }

    return getNewAttachment;
  } catch (error) {
    throw error;
  }
};

const getAllAttachment = async (cardId) => {
  try {
    const attachments = await attachmentModel.getAllAttachment(cardId);
    return attachments;
  } catch (error) {
    throw error;
  }
};

const activeAttachment = async (userId, attachmentId) => {
  try {
    const attachment = await attachmentModel.findOneById(attachmentId);
    if (!attachment) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Attachment not found!");
    }
    if (attachment.userId.toString() !== userId.toString()) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized!");
    }
    await attachmentModel.activeAttachment(attachmentId);
    return { message: "Comment active successfully!" };
  } catch (error) {
    throw error;
  }
};

const deleteSoftAttachment = async (userId, attachmentId) => {
  try {
    const attachment = await attachmentModel.findOneById(attachmentId);
    if (!attachment) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Attachment not found!");
    }
    if (attachment.userId.toString() !== userId.toString()) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized!");
    }
    await attachmentModel.deleteSoftAttachment(attachmentId);
    return { message: "Attachment deleted successfully!!" };
  } catch (error) {
    throw error;
  }
};

const deleteAttachment = async (userId, attachmentId) => {
  try {
    const attachment = await attachmentModel.findOneById(attachmentId);
    if (!attachment) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Attachment not found!");
    }
    if (attachment.userId.toString() !== userId.toString()) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized!");
    }
    await attachmentModel.deleteAttachment(attachmentId);
    await cardModel.pullAttachments(attachment);
    return { message: "Attachment deleted permanently!" };
  } catch (error) {
    throw error;
  }
};

const updateAvatar = async (userId, userData) => {
  try {
    const user = await userModel.findOneById(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found!");
    }

    const updateInfo = await userModel.updateAvatar(userId, userData);

    if (updateInfo.modifiedCount === 0) {
      throw new Error("Failed to update avatar");
    }

    const updatedUser = await userModel.findOneById(userId);
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

const updateCoverCard = async (userId, cardId, cardData) => {
  try {
    const card = await cardModel.findOneById(cardId);

    if (!card) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Card not found!");
    }

    const hasPermission = await cardModel.checkMemberIds(cardId, userId);

    if (!hasPermission) {
      throw new ApiError(StatusCodes.FORBIDDEN, "User not permission!");
    }
    const updateInfo = await cardModel.updateCover(cardId, cardData);

    if (updateInfo.modifiedCount === 0) {
      throw new Error("Failed to update avatar");
    }
    const updatedCard = await cardModel.findOneById(cardId);
    return updatedCard;
  } catch (error) {
    throw error;
  }
};

export const UploadService = {
  createAttachment,
  getAllAttachment,
  activeAttachment,
  deleteSoftAttachment,
  deleteAttachment,
  updateAvatar,
  updateCoverCard,
};
