const express = require("express");
require("dotenv").config();
const { Violation } = require("../models/models");

/**
 * Adds a field in the `Violation` table with the attributes:
 *  - application_id
 *  - type
 *  - image (base64 encoded image)
 *
 * We convert the `image` field to a Buffer before storing it.
 */
exports.addViolation = async function (req, res) {
  try {
    const { application_id, type, image } = req.body;

    /*
      Edge case: image not in payload for tab switches
    */
    const violation = await Violation.create({
      application_id,
      type,
      image: Buffer.from(image, "utf-8"),
    });

    return res.status(201).json(violation);
  } catch (error) {
    console.log(`violationController.addViolation: ${error}`);
    return res
      .status(403)
      .json({ message: "Failed to add violation to the violation table" });
  }
};

/**
 * Deletes all violations from the `Violation` table
 */
exports.deleteAllViolations = async function (req, res) {
  try {
    await Violation.destroy({ truncate: true });

    return res.status(204).send();
  } catch (error) {
    console.log(`ViolationController.deleteAllViolations: ${error}`);
    return res.status(403).json({ message: "Failed to delete all violations" });
  }
};


/**
 * Fetch all the violations from the `Violation` table by the `application_id` which
 * is passed as params
 */
exports.getViolationByApplicantId = async function (req, res) {
  try {
    const { id } = req.params;

    const violations = await Violation.findAll({
      where: {
        application_id: Number(id),
      },
    });

    if (violations.length === 0) {
      return res.status(404).json({ message: "Application Id not found" });
    }

    violations.forEach((violation) => {
      violation.image = violation.image.toLocaleString("utf8");
    });

    res.json(violations);
  } catch (error) {
    console.log(`violationController.getViolationByApplicantId: ${error}`);
    return res.json({ message: "Failed to retrieve violations" });
  }
};

/**
 *
 * Fetch all the violations from the `Violation` table. We convert the `image`
 * from buffer to string before returning it.
 */
exports.getAllViolations = async function (req, res) {
  try {
    const violations = await Violation.findAll();

    violations.forEach((violation) => {
      violation.image = violation.image.toString("utf8");
    });

    return res.status(200).json(violations);
  } catch (error) {
    console.log(`violationController.getAllViolations: ${error}`);
    return res
      .status(403)
      .json({ message: "Failed to retrieve all violations" });
  }
};
