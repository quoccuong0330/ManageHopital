import userService from "../services/userService";

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errorCode: 1,
      message: "Missing username and password",
    });
  }

  let userData = await userService.handleUserLogin(email, password);

  return res.status(200).json({
    errorCode: userData.errorCode,
    message: userData.message,
    user: userData.user ? userData.user : {},
  });
};

let handleGetAllUser = async (req, res) => {
  let id = req.query.id;
  let users = await userService.getAllUsers(id);

  if (!id) {
    return res.status(200).json({
      errorCode: 1,
      errorMessage: "Missing  params ",
      users: [],
    });
  }
  return res.status(200).json({
    errorCode: 0,
    errorMessage: "ok",
    users,
  });
};

let handleCreateNewUser = async (req, res) => {
  let message = await userService.createNewUser(req.body);
  console.log(message);
  return res.status(200).json(message);
};

let handleDeleteUser = async (req, res) => {
  let id = req.query.id;
  let message = await userService.deleteUser(id);
  return res.status(200).json(message);
};

let handleEditUser = async (req, res) => {
  let message = await userService.editUser(req.body);
  return res.status(200).json(message);
};

let getAllCode = async (req, res) => {
  try {
    let data = await userService.getAllCodeService(req.query.type);
    return res.status(200).json(data);
  } catch (e) {
    console.log("get all code error: ", e);
    return res
      .status(200)
      .json({ errorCode: -1, errorMessage: "error from sever", e });
  }
};

module.exports = {
  handleLogin,
  handleGetAllUser,
  handleCreateNewUser,
  handleDeleteUser,
  handleEditUser,
  getAllCode,
};
