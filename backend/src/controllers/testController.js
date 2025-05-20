const {
  Test,
  User,
  TechStack,
  Question,
  Application,
} = require("../models/models");

/**
 * Fetch all test from the Test table
 */
exports.getAllTests = async function (req, res) {
  try {
    const tests = await Test.findAll({});
    return res.status(200).json(tests);
  } catch (error) {
    console.log(`testController.getAllTests error: ${error}`);
    return res.status(403).json({ message: "Failed to fetch all tests" });
  }
};

/**
 * Fetch a single test from the Test table based on the id
 */
exports.getTestById = async function (req, res) {
  try {
    const { id } = req.params;

    const test = await Test.findOne({
      where: { id: Number(id) },
      include: [User, TechStack, Question, Application],
    });

    return res.status(200).json(test);
  } catch (error) {
    console.log(`testController.getTestById error: ${error}`);
    return res.status(403).json({ message: "Failed to fetch test by id" });
  }
};

exports.getTestByCreatorId = async function (req, res) {
  try {
    const { id } = req.params;

    const test = await Test.findAll({
      where: { creator_id: Number(id) },
      include: TechStack,
    });

    return res.status(200).json(test);
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Failed to fetch test by creator id" });
  }
};



/**
 * Update a test in the Test table based on the id. The request body will usually contain:
 *  - name
 *  - duration
 *  - score
 *  - type
 *  - user (creator_id)
 *  - tech_stack (tech_stack_id)
 *  - question_id[] : New question will be added a foreign key relation to the test
 *  - application_id[] : New application will be added a foreign key relation to the test
 */

exports.updateTestById = async function (req, res) {
  try {
    const { id } = req.params;

    const test = await Test.findByPk(id);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    let { name, duration, score, type, creator_id, tech_stack_id } = req.body;

    let data = { name, duration, score, type, creator_id, tech_stack_id };

    if (!req.body.name) data.name = test.name;
    if (!req.body.duration) data.duration = test.duration;
    if (!req.body.score) data.score = test.score;
    if (!req.body.type) data.type = test.type;
    if (!req.body.creator_id) data.creator_id = test.creator_id;
    if (!req.body.tech_stack_id) data.tech_stack_id = test.tech_stack_id;

    const updatedTest = await Test.update(
      {
        name: data.name,
        score: data.score,
        duration: data.duration,
        tech_stack_id: data.tech_stack_id,
        creator_id: data.creator_id,
        type: data.type,
      },
      { where: { id: Number(id) } },
      {
        include: [User, Application, Question, TechStack],
      }
    );

    return res.status(201).send();
  } catch (error) {
    console.log(`testController.updateTestById error: ${error}`);
    return res.status(403).json({ message: "Failed to update test" });
  }
};

/**
 * Remove a test from the Test Table based on its id
 */

exports.removeTestById = async function (req, res) {
  try {
    const { id } = req.params;

    const test = await Test.findByPk(id);

    if (!test) {
      return res.status(404).json({ message: "Test to remove doesn't exist" });
    }

    await test.destroy();

    return res.status(204).send();
  } catch (error) {
    console.log(`testController.removeTestById error: ${error}`);
    return res.status(404).json({ message: "Failed to remove test" });
  }
};
