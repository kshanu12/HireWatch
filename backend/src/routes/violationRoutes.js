const express = require("express");
const violationController = require("../controllers/violationController");
const router = express.Router();

router.get("/", violationController.getAllViolations);
router.get("/:id", violationController.getViolationByApplicantId);

router.post("/", violationController.addViolation);

router.delete("/", violationController.deleteAllViolations);

module.exports = router;
