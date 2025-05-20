const express = require("express");
const db = require("../../config/database");
const { ApplicationAction } = require("../models/models");

exports.getAllApplicationAction = async function (req, res) {
  try {
    const query = `
    SELECT * 
    FROM application_action
    `;
    const [applicationAction] = await db.query(query);
    return res.status(200).json(applicationAction);
  } catch (error) {
    console.log(
      `applicationActionController.getAllApplicationAction error: ${error}`
    );
    return res
      .status(403)
      .json({ message: "Failed to get all application actions" });
  }
};

exports.getApplicationActionById = async function (req, res) {
  try {
    const { id } = req.params;

    const query = `
            SELECT *
            FROM application_action
            WHERE id = ${id}
        `;

    const [applicationAction] = await db.query(query);
    return res.status(200).json(applicationAction);
  } catch (error) {
    console.log(
      `applicationActionController: getApplicationStatusById error: ${error}`
    );
    return res
      .status(403)
      .json({ message: "Failed to get application status by id" });
  }
};

exports.createApplicationAction = async function (req, res) {
  try {
    const { name } = req.body;

    const query = `
        INSERT INTO application_action (name)
        VALUES ('${name}')
    `;

    await db.query(query);
    return res.status(201).json({ message: "success" });
  } catch (error) {
    console.log(
      `application_actionController.createApplicationAction error: ${error}`
    );
    return res
      .status(403)
      .json({ message: "Failed to create application action" });
  }
};
