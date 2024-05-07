import { userModel } from "~/models/userModel";

const register = async (reqBody) => {
  try {
    const newUser = {
      ...reqBody,
      isActive: true,
    };

    const createdUser = await userModel.register(newUser);

    // Lấy bản ghi board sau khi gọi
    const getNewUser = await userModel.findOneById(createdUser.insertedId);

    // Trả kết quả về, trong Service luôn phải có return
    return getNewUser;
  } catch (error) {
    throw error;
  }
};

const login = async (email) => {
  try {
    const user = await userModel.findOneByEmail(email);
    if (!user) throw new Error("Your email/password is wrong!");
    return user;
  } catch (err) {
    throw new Error("Login wrong: " + err.message);
  }
};

const updateVerifyToken = async (userId, verifyToken) => {
  try {
    // Gọi hàm từ model để cập nhật verifyToken
    await userModel.updateVerifyToken(userId, verifyToken);
  } catch (error) {
    throw new Error("Error updating verifyToken: " + error.message);
  }
};

const getUser = async (id) => {
  try {
    const user = await userModel.findOneById(id);
    if (!user) throw new Error("User not found!");
    return user;
  } catch (err) {
    throw new Error("Something went wrong: " + err.message);
  }
};

const getUserWithMail = async (email) => {
  try {
    const user = await userModel.findOneByEmail(email);
    if (!user) throw new Error("There is no registered user with this e-mail.");
    return user;
  } catch (error) {
    throw new Error("Something went wrong: " + error.message);
  }
};

export const userService = {
  register,
  login,
  getUser,
  getUserWithMail,
  updateVerifyToken,
};
