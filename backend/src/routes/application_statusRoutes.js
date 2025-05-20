const express = require("express");
const application_statusController = require("../controllers/application_statusController");
const router = express.Router();

router.get("/", application_statusController.getAllApplicationStatus);

router.post("/", application_statusController.addApplicationStatus);

router.delete("/:id", application_statusController.deleteApplicationStatusById);
router.delete("/", application_statusController.deleteAllApplicationStatus);

module.exports = router;