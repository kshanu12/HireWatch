const express = require("express");
const testController = require("../controllers/testController");
const router = express.Router();

router.get("/", testController.getAllTests);

router.get("/:id", testController.getTestById);

router.get("/creator/:id", testController.getTestByCreatorId);

router.patch("/:id", testController.updateTestById);

router.delete("/:id", testController.removeTestById);

module.exports = router;
