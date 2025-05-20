const express = require("express");
const router = express.Router();
const application_actionController = require("../controllers/application_actionController");

router.get("/", application_actionController.getAllApplicationAction);
router.get("/:id", application_actionController.getApplicationActionById);
router.post("/", application_actionController.createApplicationAction);

module.exports = router;