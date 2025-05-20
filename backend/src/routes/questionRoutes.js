const express = require("express");
const questionController = require("../controllers/questionController");
const router = express.Router();

router.get("/", questionController.getAllQuestions);

router.get("/:id", questionController.getQuestionById);

router.get("/test/:id", questionController.getQuestionsByTestId);

// router.post("/", questionController.addQuestion);

router.post("/test", questionController.addTest);

router.patch("/:id", questionController.updateQuestionById);

router.delete("/:id", questionController.removeQuestionById);

module.exports = router;

