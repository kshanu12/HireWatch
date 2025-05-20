const express = require("express");
const codingQuestionsController = require("../controllers/codingQuestionsController");
const router = express.Router();

router.get("/test/:id", codingQuestionsController.getCodingQuestionByTestId);
router.post("/", codingQuestionsController.createCodingQuestion);

module.exports=router;