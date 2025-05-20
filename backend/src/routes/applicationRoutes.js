const express = require("express");
const applicationController = require("../controllers/applicationController");
const router = express.Router();

router.get("/", applicationController.getAllApplications);

router.get("/:id", applicationController.getApplicationById);

router.post("/", applicationController.createApplication);

router.patch("/", applicationController.updateApplication);

router.post("/filters", applicationController.filter_Application);

router.delete("/:id", applicationController.deleteApplicationById);

router.delete("/", applicationController.deleteAllApplication);

router.post("/updateAll", applicationController.updateAllApplication);

module.exports = router;
