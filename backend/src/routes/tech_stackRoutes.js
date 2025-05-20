const express = require("express");
const tech_stackController = require("../controllers/tech_stackController");
const router = express.Router();

router.get("/", tech_stackController.getAllTechStack);
router.get("/:id", tech_stackController.getTechStackById);
router.post("/", tech_stackController.createTechStack);

module.exports = router;
