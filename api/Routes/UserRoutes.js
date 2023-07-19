const express = require("express");
const router = express.Router();
const {
  register,
  login,
  profile,
  logout,
  updatePassword,
  UpdateUser,
  ChangeUserToAdmin,
  getAllUsers,
  deleteUser,
  updateUserBySuperAdmin,
} = require("../Controllers/User");

  router.post("/register", register);
  router.post("/login", login);
  router.put("/login", updatePassword);
  router.get("/profile", profile);
  router.post("/logout", logout);
  router.put("/updateuser", UpdateUser);
  router.put("/changeUserToAdmin", ChangeUserToAdmin);
  router.get("/allUsers", getAllUsers);
  router.delete("/deleteUser/:id", deleteUser);
  router.put("/updateUserBySuperAdmin", updateUserBySuperAdmin);

module.exports = router;
