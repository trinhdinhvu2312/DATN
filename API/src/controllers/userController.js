import { StatusCodes } from "http-status-codes";
import { userService } from "~/services/userService";
import * as bcrypt from "bcrypt";
import { auth } from "~/middlewares/auth";

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!(username && email && password))
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ errMessage: "Please fill all required areas!" });

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    req.body.password = hashedPassword;
    // Điều hướng dữ liệu sang tầng Service
    const user = await userService.register(req.body);
    // Có kết quả thì trả về phía Client
    res.status(StatusCodes.CREATED).json(user);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!(email && password))
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ errMessage: "Please fill all required areas!" });

    const result = await userService.login(email);

    if (!result) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ errMessage: "Your email/password is wrong!" });
    }

    const hashedPassword = result.password;
    if (!bcrypt.compareSync(password, hashedPassword)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ errMessage: "Your email/password is wrong!" });
    }

    // Nếu chưa có, thì tạo mới verifyToken và cập nhật
    const verifyToken = auth.generateToken(result._id.toString(), result.email);
    result.verifyToken = verifyToken;
    await userService.updateVerifyToken(result._id, verifyToken);

    // Xóa password trước khi gửi response
    delete result.password;

    return res
      .status(StatusCodes.OK)
      .send({ message: "User login successful!", user: result });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await userService.getUser(userId);
    if (!result) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ errMessage: "User not found!" });
    }

    result.password = undefined;

    return res.status(StatusCodes.OK).send(result);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ errMessage: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const result = await userService.getUser(userId);
    if (!result) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ errMessage: "User not found!" });
    }

    const dataTransferObject = {
      username: result.username,
      email: result.email,
    };

    return res.status(StatusCodes.OK).send(dataTransferObject);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ errMessage: error.message });
  }
};

const getUserWithMail = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await userService.getUserWithMail(email);
    if (!result) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ errMessage: "User not found!" });
    }

    const dataTransferObject = {
      username: result.username,
      email: result.email,
    };

    return res.status(StatusCodes.OK).send(dataTransferObject);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ errMessage: error.message });
  }
};

export const userController = {
  register,
  login,
  getUser,
  getUserWithMail,
  getUserById,
};
