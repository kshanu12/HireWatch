const express = require("express");
const { Op } = require("sequelize");
const db = require("../../config/database");

const {
  User,
  Application,
  ApplicationStatus,
  ApplicationAction,
  Test,
  TechStack,
  Violation,
} = require("../models/models");

/**
 * Create a new record in the `Application` table. The request body will contain:
 *  - user_id
 *  - test_id
 *  - application_status_id
 *  - application_action_id
 *  - started_at
 *  - ended_at
 *  - broadcast_id
 *  - score
 */
exports.createApplication = async function (req, res) {
  try {
    const {
      user_id,
      test_id,
      application_status_id,
      application_action_id,
      started_at,
      ended_at,
      broadcast_id,
      score,
    } = req.body;

    const application = await Application.create({
      user_id,
      test_id,
      application_status_id,
      application_action_id,
      started_at,
      ended_at,
      broadcast_id,
      score,
    });

    return res.status(201).json(application);
  } catch (error) {
    console.log(`applicationController.createApplication: ${error}`);
    return res.status(403).json({ message: "Failed to create application" });
  }
};

/**
 * Fetch all the applications from the `Application` table
 */
exports.getAllApplications = async function (req, res) {
  try {
    const applications = await Application.findAll();
    return res.status(200).json(applications);
  } catch (error) {
    console.log(`applicationController.getAllApplication: ${error}`);
    return res
      .status(403)
      .json({ message: "Failed to fetch all applications" });
  }
};

/**
 * Fetch the application by the application_id
 */
exports.getApplicationById = async function (req, res) {
  try {
    const { id } = req.params;

    const query = `
      SELECT distinct  applications.id,
       applications.score AS scored,
       applications.started_at,applications.ended_at,
       applications.broadcast_id,
       applications.user_id,
       applications.application_status_id,
       applications.application_action_id,
       concat(users.first_name, ' ', users.last_name) AS user_name,
       tests.id as test_id,
       tests.name as test_name,
       tests.score as total_marks,
       tech_stacks."name" as tech_stack_name
       FROM applications
       LEFT JOIN application_status ON applications.application_status_id = application_status.id
       LEFT JOIN violations ON applications.id = violations.application_id
       LEFT JOIN users ON applications.user_id = users.id
       LEFT JOIN tests ON applications.test_id = tests.id
       LEFT JOIN tech_stacks ON tests.tech_stack_id = tech_stacks.id
       WHERE applications.id = ${id};
    `;

    const application = await db.query(query, {
      replacements: { id: Number(id) },
      type: db.QueryTypes.SELECT,
      raw: true,
      nest: true,
    });

    return res.status(200).json(application);
  } catch (error) {
    console.log(`applicationController.getApplicationById: ${error}`);
    return res.status(403).json({ message: "Failure getting application" });
  }
};

/**
 * Delete the application by the application_id
 */
exports.deleteApplicationById = async function (req, res) {
  try {
    const { id } = req.params;

    const removedApplicationRecord = await Application.destroy({
      where: { id: Number(id) },
    });

    return res.status(204).send();
  } catch (error) {
    console.log(`applicationController.deleteApplicationById: ${error}`);
    return res.status(403).json({ message: "Failure deleting application" });
  }
};

exports.filter_Application = async function (req, res) {
  let { minimumScore, maximumViolationCount, status, testName } = req.body;
  console.log(req.body);
  if (status == undefined) status = null;
  if (minimumScore == undefined) minimumScore = 0;
  if (maximumViolationCount == undefined) maximumViolationCount = 9999999;
  if (testName == undefined) testName = null;
  try {
    const query = `SELECT
      applications.id as application_id,
      applications.broadcast_id,
      tech_stacks.name as tech_stack_name,
      tech_stacks.id as tech_stack_id,
      users.first_name,
      users.last_name,
      users.email,
      tests.name AS test_name,
      tests.duration ,
      tests.id as test_id,
      application_status.name AS application_status_name,
      application_status.id AS application_status_id,
      application_action.name AS application_action_name,
      application_action.id AS application_action_id
    FROM
      applications
      INNER JOIN application_status ON applications.application_status_id = application_status.id
      INNER JOIN application_action ON applications.application_action_id = application_action.id
      INNER JOIN users ON applications.user_id = users.id
      INNER JOIN tests ON applications.test_id = tests.id
      INNER JOIN tech_stacks ON tests.tech_stack_id = tech_stacks.id
      INNER JOIN roles ON users.role_id = roles.id
      LEFT JOIN violations ON applications.id = violations.application_id
    WHERE
      tests.id = CASE
        WHEN ${testName} IS NULL THEN tests.id
        ELSE ${testName}
      END
      AND application_status.id = CASE
        WHEN ${status} IS NULL THEN application_status.id
        ELSE ${status}
      END
      AND applications.score >= ${minimumScore}
    GROUP BY
      users.first_name,
      users.last_name,
      users.email,
      tests.name,
      tests.id,
      tech_stacks.name,
      tech_stacks.id,
      application_status.name,
      application_status.id,
      application_action.name,
      application_action.id,
      applications.id,
      tests.duration
    HAVING
      COUNT(violations.id) <= ${maximumViolationCount}
    ORDER BY
    tech_stack_name,
    test_name,
    users.first_name,
    users.last_name;`;
    const [results] = await db.query(query);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve filtered candidates." });
  }
};

/**
 * Delete all the applications from the application table
 */
exports.deleteAllApplication = async function (req, res) {
  try {
    const removedApplicationRecords = await Application.destroy({ where: {} });
    return res.status(204).send();
  } catch (error) {
    console.log(`applicationController.deleteApplication: ${error}`);
    return res.status(403).json({ message: "Failure deleting application" });
  }
};

/**
 * Updates the status of the application in the `Application` table. This API will
 * be called after the candidate completes the test. Usually, we update the:
 *  - application_id
 *  - end_time
 *  - application_status_id
 *  - score
 *
 * This API will be called after submits the test
 */
exports.updateApplication = async function (req, res) {
  try {
    const {
      application_id,
      ended_at,
      application_status_id,
      application_action_id,
      score,
      broadcast_id,
      started_at
    } = req.body;

    // console.log(
    //   "--------------------------------------------------",
    //   application_id
    // );

    const updateApplication = await Application.update(
      {
        started_at,
        ended_at,
        application_status_id,
        application_action_id,
        broadcast_id,
        score
      },
      {
        where: {
          id: application_id,
        },
      }
    );

    console.log(updateApplication);

    if (updateApplication[0] === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res
      .status(201)
      .json({ message: "Application updated successfully" });
  } catch (error) {
    console.log(`userController.updateCandidateCompletion: ${error}`);
    return res
      .status(500)
      .json({ message: "Failure updating user application" });
  }
};

const updateAll = async (application_id, status_id) => {
  const updateApplication = await Application.update(
    {
      application_status_id: status_id,
    },
    {
      where: {
        id: application_id,
      },
    }
  );

  console.log(updateApplication);
};

exports.updateAllApplication = async function (req, res) {
  try {
    // console.log(
    //   "================================================",
    //   req.body.candidates
    // );
    req.body.candidates.map((candidate) => {
      updateAll(candidate.application_id, req.body.status);
    });
  } catch (error) {
    console.log(`applicationController.deleteApplication: ${error}`);
    return res.status(403).json({ message: "Failure deleting application" });
  }
};
