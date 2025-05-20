const db = require("../../config/database");
const { Role, User } = require("../models/models");

//  Add a new role to the `Role` table. The request body must contain a `type`
exports.addRole = async function (req, res) {
  try {
    var { type } = req.body;
    console.log(req.body);
    const newRole = await Role.create({ type });
    res.status(200).send({ message: "Sucess", role: newRole });
  } catch (e) {
    res.status(404).send({ message: "Error", error: e.message });
  }
};

//  Fetch all the avaiable roles from the `Role` table
exports.getAllRoles = async function (req, res) {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (error) {
    console.log(`roleController.getAllRoles: ${error}`);
    res.status(500).json({ error: "An error occurred while retrieving roles" });
  }
};

//  Get a role from the `Role` table based on the params id
exports.getRoleById = async function (req, res) {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id, { include: { model: User } });

    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    res.status(202).json(role);
  } catch (error) {
    console.log(`roleController.getRoleById: ${error}`);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the role by id" });
  }
};

/**
 * Remove a role from the `Role` table based on the params id
 */
exports.deleteRoleById = async function (req, res) {
  try {
    const { id } = req.params;

    let role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    await role.destroy();

    res.status(204).send({ message: "sucess" });
  } catch (error) {
    console.log(`roleController.deleteRoleById: ${error}`);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the role by id" });
  }
};

/**
 * Update the role for a given id. The req body will contain:
 *  - type
 *
 * Providing user_id list will simply add that user to the role and not remove
 * any existing ones
 */
exports.updateRole = async function (req, res) {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    const { type } = req.body;
    const updatedRole = await role.update({ type });

    res.status(201).json(updatedRole);
  } catch (error) {
    console.log(`roleController.updateRole: ${error}`);
    res
      .status(500)
      .json({ error: "An error occurred while updating the role" });
  }
};
