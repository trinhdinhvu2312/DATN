const jwt = require("jsonwebtoken");
import { StatusCodes } from "http-status-codes";
import { env } from "~/config/environment";
import { userModel } from "~/models/userModel";
const generateToken = (id, email) => {
  const token = jwt.sign({ id, email }, env.JWT_SECRET, {
    expiresIn: env.TOKEN_EXPIRE_TIME,
  });
  return token.toString();
};

const verifyToken = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ errMessage: "Authorization token not found!" });

    const token = authorizationHeader.split(" ")[1];
    if (!token)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ errMessage: "Authorization token not found!" });

    const verifiedToken = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOneById(verifiedToken.id);

    if (!user)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ errMessage: "User not found!" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      errMessage: "Internal server error occurred!",
      details: error.message,
    });
  }
};

export const auth = {
  generateToken,
  verifyToken,
};
