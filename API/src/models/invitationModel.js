import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { INVITE_STATUS } from "~/utils/constants";
import { OBJECT_ID_RULE } from "~/utils/validators";

// Define Collection (Name & Schema)
const INVITATION_COLLECTION_NAME = "invitations";
const INVITATION_COLLECTION_SCHEMA = Joi.object({
  boardInvitation: Joi.object({
    boardId: Joi.string().pattern(OBJECT_ID_RULE).optional(),
    status: Joi.string()
      .optional()
      .valid(
        INVITE_STATUS.PENDING,
        INVITE_STATUS.ACCEPTED,
        INVITE_STATUS.REJECTED
      ),
  }),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

// const validateBeforeCreate = async (data) => {
//   return await INVITATION_COLLECTION_SCHEMA.validateAsync(data, {
//     abortEarly: false,
//   });
// };

const getAll = async (userId) => {
  try {
    const invites = await GET_DB()
      .collection(INVITATION_COLLECTION_NAME)
      .find({
        inviteeId: userId,
        _destroy: false,
      })
      .toArray();
    return invites;
  } catch (error) {
    throw new Error(error);
  }
};

const invite = async (inviteeId, boardId, inviterId) => {
  try {
    const newInvitation = {
      inviterId,
      inviteeId: inviteeId,
      type: "board",
      boardInvitation: {
        boardId: new ObjectId(boardId),
        status: INVITE_STATUS.PENDING,
      },
      createdAt: new Date(),
      updatedAt: null,
      _destroy: false,
    };

    const createdInvitation = await GET_DB()
      .collection(INVITATION_COLLECTION_NAME)
      .insertOne(newInvitation);
    return createdInvitation;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (inviteId) => {
  try {
    const result = await GET_DB()
      .collection(INVITATION_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(inviteId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const updateInviteStatus = async (inviteId, status) => {
  try {
    const result = await GET_DB()
      .collection(INVITATION_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(inviteId) },
        {
          $set: {
            "boardInvitation.status": status,
            _destroy: true,
            updatedAt: new Date(),
          },
        }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteInvite = async (inviteId) => {
  try {
    const result = await GET_DB()
      .collection(INVITATION_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(inviteId) });
    return result;
  } catch (error) {
    throw new Error("Failed to delete reminder: " + error.message);
  }
};

export const invitationModel = {
  INVITATION_COLLECTION_NAME,
  INVITATION_COLLECTION_SCHEMA,
  invite,
  findOneById,
  updateInviteStatus,
  getAll,
  deleteInvite,
};
