import { StatusCodes } from "http-status-codes";
import { boardModel } from "~/models/boardModel";
import { cardModel } from "~/models/cardModel";
import { invitationModel } from "~/models/invitationModel";
import { userModel } from "~/models/userModel";
import ApiError from "~/utils/ApiError";
import { INVITE_STATUS } from "~/utils/constants";

const getAll = async (userId) => {
  try {
    const invites = await invitationModel.getAll(userId);

    return invites;
  } catch (error) {
    throw error;
  }
};

const invite = async (email, boardId, inviterId) => {
  try {
    const board = await boardModel.findOneById(boardId);

    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Board not found");
    }

    const invitee = await userModel.findOneByEmail(email);

    if (!invitee) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    if (inviterId.toString() === invitee._id.toString()) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "You can't invite yourself");
    }

    const createdInvitation = await invitationModel.invite(
      invitee._id,
      boardId,
      inviterId
    );

    const getNewInvite = await invitationModel.findOneById(
      createdInvitation.insertedId
    );

    // Trả kết quả về, trong Service luôn phải có return
    return getNewInvite;
  } catch (error) {
    throw error;
  }
};

const acceptInvite = async (invitationId, userId) => {
  try {
    const existInvitation = await invitationModel.findOneById(invitationId);

    if (!existInvitation) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Invitation not found!");
    }

    if (existInvitation.inviteeId.toString() !== userId.toString()) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Not authorized!");
    }

    await invitationModel.updateInviteStatus(
      invitationId,
      INVITE_STATUS.ACCEPTED
    );

    const board = await boardModel.findOneById(
      existInvitation.boardInvitation.boardId
    );

    const userIdStr = userId.toString();
    const memberIdsStr = board.memberIds.map((id) => id.toString());

    if (!memberIdsStr.includes(userIdStr)) {
      await boardModel.pushMemberIds(existInvitation);
      await invitationModel.deleteInvite(invitationId);
    } else {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "UserId is exist in this board"
      );
    }
  } catch (error) {
    throw error;
  }
};

export const invitationService = {
  invite,
  acceptInvite,
  getAll,
};
