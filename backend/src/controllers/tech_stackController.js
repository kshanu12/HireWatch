const express = require("express");
const db = require("../../config/database");

exports.getAllTechStack = async function (req, res) {
  try {
    const query = `SELECT * FROM tech_stacks`;
    const [techStack] = await db.query(query);
    return res.status(200).json(techStack);
  } catch (error) {
    console.log(`tech_stackController.getAllTechStack error: ${error}`);
    return res.status(403).json({ message: "Failed to fetch all tech stacks" });
  }
};

exports.getTechStackById = async function (req, res) {
  try {
    const { id } = req.params;
    const query = ` SELECT * FROM tech_stacks WHERE id = ${id}`;
    const [techStack] = await db.query(query);
    return res.status(200).json(techStack);
  } catch (error) {
    console.log(`tech_stackController.getAllTechStack error: ${error}`);
    return res
      .status(403)
      .json({ message: "Failed to fetch tech stack by id" });
  }
};

exports.createTechStack = async function (req, res) {
  try {
    const query = `INSERT INTO tech_stacks (name) VALUES ('${req.body.name}')`;
    const result = await db.query(query);

    return res.status(200).json( 'success' );
  } catch (error) {
    console.log(`tech_stackController.getAllTechStack error: ${error}`);
    return res
      .status(403)
      .json({ message: "Failed to create tech stack" });
  }
};