const express = require("express");
const db = require("../../config/database");

/**
 * Add a field in the `application_status` table. The request body will usually have:
 *  - name: The name of the field
 */
exports.addApplicationStatus = async function (req, res) {
  try {
    const { name } = req.body;

    let query = `
      INSERT INTO application_status(name)
      VALUES ('${name}')
    `;

    await db.query(query);
    return res.status(200).send();
  } catch (error) {
    console.log(
      `applicationStatusController.addApplicationStatus error: ${error}`
    );
    return res
      .status(403)
      .json({ message: "Failure adding application status" });
  }
};

/**
 * Fetch all the records from the `application_status` table
 */
exports.getAllApplicationStatus = async function (req, res) {
  try {
    let query = `
    SELECT * 
    FROM application_status
    `;

    const [result] = await db.query(query);
    return res.status(200).json(result);
  } catch (error) {
    console.log(
      `applicationStatusController.getAllApplicationStatus error: ${error}`
    );
    return res
      .status(403)
      .json({ message: "Failure getting application status" });
  }
};

/**
 * Delete a record in the `Applicaton_status` table by `id`
 */
exports.deleteApplicationStatusById = async function (req, res) {
  try {
    const { id } = req.params;

    let query = `
    DELETE from application_status
    WHERE id = '${id}'
    `;

    await db.query(query);
    return res.status(204).send();
  } catch (error) {
    console.log(
      `applicationStatusController.deleteApplicationStatusById error: ${error}`
    );
    res.status(500).json({ message: "Failure deleting application status" });
  }
};

/**
 * Delete all records from the `Application_status` table
 */
exports.deleteAllApplicationStatus = async function (req, res) {
  try {
    let query = `
    DELETE
    FROM application_status
    `;

    await db.query(query);
    return res.status(204).send();
  } catch (error) {
    console.log(
      `applicationStatusController.deleteAllApplicationStatus error: ${error}`
    );
    return res
      .status(403)
      .json({ message: "Failure deleting all application status" });
  }
};
