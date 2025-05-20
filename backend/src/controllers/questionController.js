const { Test, Question, Option } = require("../models/models");

/**
 * Fetch all question from the Question table
 */

exports.getAllQuestions = async function (req, res) {
  try {
    const questions = await Question.findAll({ include: [Option] });
    return res.status(200).json(questions);
  } catch (error) {
    console.log(`questionController.getAllQuestions error: ${error}`);
    return res.status(403).json({ message: "Failed to fetch all questions" });
  }
};

/**
 * Fetch all the questions for a particular test alongwith the options
 */

exports.getQuestionsByTestId = async function (req, res) {
  try {
    const { id } = req.params;

    const questionsByTest = await Question.findAll({
      where: { test_id: Number(id) },
      include: [Option],
    });

    return res.status(200).json(questionsByTest);
  } catch (error) {
    console.log(`questionController.getQuestionsByTestId: ${error}`);
    return res.status(403).json({ message: "Failed to get questions" });
  }
};

/**
 * Fetch a single question from the Question table based on the id
 */
exports.getQuestionById = async function (req, res) {
  try {
    const { id } = req.params;

    const questionById = await Question.findOne({
      where: { id: Number(id) },
      include: [Option],
    });

    return res.status(200).json(questionById);
  } catch (error) {
    console.log(`questionController.getQuestionById error: ${error}`);
    return res.status(403).json({ message: "Failed to fetch question by id" });
  }
};

/**
 * Update a question in the Question table based on the id. The request body will usually contain:
 *  - description
 *  - test_id
 */

exports.updateQuestionById = async function (req, res) {
  try {
    const { id } = req.params;

    const question = await Question.findByPk(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    let { description, test_id } = req.body;

    let data = { description, test_id };

    if (!req.body.description) data.description = question.description;
    if (!req.body.test_id) data.test_id = question.test_id;

    const updatedQuestion = await Question.update(
      {
        description: data.description,
        test_id: data.test_id,
      },
      { where: { id: Number(id) } },
      {
        include: [Test],
      }
    );

    return res.status(201).send();
  } catch (error) {
    console.log(`questionController.updateQuestionById error: ${error}`);
    return res.status(403).json({ message: "Failed to update question" });
  }
};

/**
 * Remove a question from the Question Table based on its id
 */

exports.removeQuestionById = async function (req, res) {
  try {
    const { id } = req.params;

    const question = await Question.findByPk(id);

    if (!question) {
      return res
        .status(404)
        .json({ message: "Question to remove doesn't exist" });
    }

    await question.destroy();

    return res.status(204).send();
  } catch (error) {
    console.log(`questionController.removeQuestionById error: ${error}`);
    return res.status(404).json({ message: "Failed to remove question" });
  }
};

/**
 * Add a field in the `Option` table. The request body will usually contain the
 * following fields:
 *  - description
 *  - is_answer
 *  - question_id? (foreign key to the `Question` table)
 */
const createOption = async function (description, is_answer, question_id) {
  try {
    if (description == is_answer)
      is_answer = "true";
    else
      is_answer = "false";
    const optionData = { description, is_answer };

    if (question_id) {
      const question = await Question.findByPk(question_id);
      if (!question) {
        throw new Error(`Question with ID ${question_id} not found.`);
      }
      optionData.question_id = question.id;
      console.log("OPTIONS",optionData);
    }

    const option = await Option.create(optionData);
    return option;
  } catch (error) {
    console.log(`optionController.createOption: ${error}`);
  }
};

/**
 * Add a new question to the Question table. The request body should contain:
 *  - description
 *  - test_id
 */

const addQuestion = async function (description, test_id, marks) {
  try {
    console.log("INSIDE CREATE QUESTION", description, test_id, marks);
    const question = await Question.create({
      description,
      test_id,
      marks,
    });
    return question;
  } catch (error) {
    console.log(`questionController.addQuestion error: ${error}`);
  }
};

/**
 * Add a new test to the Test table. The request body should contain:
 *  - name
 *  - duration
 *  - score
 *  - type
 *  - user?
 *  - tech_stack_id?
 *  - question_id[]?
 */
const addTest = async function (
  name,
  duration,
  score,
  type,
  creator_id,
  tech_stack_id
) {
  try {
    const test = await Test.create({
      name,
      duration,
      score,
      type,
      creator_id,
      tech_stack_id,
    });

    return test;
  } catch (error) {
    console.log(`testController.addTest error: ${error}`);
    throw new Error("Failed to add test");
  }
};

exports.addTest = async function (req, res) {
  try {
    const quizDetails = req.body.quizQuestions;
    if (quizDetails.testType === 1) quizDetails.testType = "Non-Coding";
    else quizDetails.testType = "Coding";
    const testDetails = await addTest(
      quizDetails.testName,
      quizDetails.duration,
      quizDetails.score,
      quizDetails.testType,
      quizDetails.creator_id,
      quizDetails.selectedTechStack
    );
    quizDetails.questions.map(async (question) => {
      const questionDetails = await addQuestion(
        question.question,
        testDetails.dataValues.id,
        question.marks
      );
      question.options.map(async(option) => {
        const optionDetails = await createOption(option, question.answer, questionDetails.dataValues.id)
      })
    });
  } catch (error) {
    console.log(`questionController.removeQuestionById error: ${error}`);
    return res.status(404).json({ message: "Failed to remove question" });
  }
};
