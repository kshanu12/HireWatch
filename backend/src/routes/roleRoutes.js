const express = require("express");
const roleController = require("../controllers/roleController");
const router = express.Router();

router.get("/", roleController.getAllRoles);

router.post("/", roleController.addRole);

router.get("/:id", roleController.getRoleById);

router.delete("/:id", roleController.deleteRoleById);

router.patch("/:id", roleController.updateRole);

module.exports = router;
