import { StatusCodes } from "http-status-codes";
import { invitationService } from "~/services/invitationService";

const getAll = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const invites = await invitationService.getAll(userId);
    res.status(StatusCodes.OK).json(invites);
  } catch (error) {
    next(error);
  }
};

const invite = async (req, res, next) => {
  try {
    const { email } = req.body;
    const boardId = req.params.id;
    const inviterId = req.user._id;

    //complete it
    const createInvite = await invitationService.invite(
      email,
      boardId,
      inviterId
    );

    res.status(StatusCodes.CREATED).json(createInvite);
  } catch (error) {
    next(error);
  }
};

const acceptInvite = async (req, res, next) => {
  try {
    const invitationId = req.params.id;
    const userId = req.user._id;

    await invitationService.acceptInvite(invitationId, userId);

    res.status(StatusCodes.OK).json("You have successfully joined the board");
  } catch (error) {
    next(error);
  }
};

export const invitationController = {
  invite,
  acceptInvite,
  getAll,
};
