const express = require("express");
const optionController = require("../controllers/optionController");
const router = express.Router();

router.get("/",optionController.getAllOptions);

router.get("/question/:id",optionController.getAllOptionsByQuestionId);

router.post("/",optionController.createOption);

router.patch("/:id",optionController.updateOption);

router.delete("/:id",optionController.deleteOptionById);

router.delete("/question/:id",optionController.deleteOptionsByQuestionId);

module.exports = router;
