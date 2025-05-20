const express = require("express");
const codingResponsesController = require("../controllers/codingResponsesController");
const router = express.Router();

router.get("/application/:id", codingResponsesController.getCandidateCodingResponse);

router.post("/", codingResponsesController.addCandidateCodingResponse);

module.exports=router;