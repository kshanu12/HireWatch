const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController")
const router = express.Router();

// All Routes of user
// These are handled in controller
router.get("/", userController.getAllUsers);

router.post("/", userController.addUser);

router.post("/login", userController.authenticateUser);

router.post("/mail", userController.sendemail);

router.get("/:id", userController.getUserById);

router.patch("/:id", userController.updateUserById);

router.delete("/:id", userController.deleteUserById);

module.exports = router;
