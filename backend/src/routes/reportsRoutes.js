const express = require("express");
const reportController = require("../controllers/reportController");
const router = express.Router();

router.get("/application/:id", reportController.getCandidateReport);

router.post("/", reportController.addCandidateResponse);

module.exports = router;
