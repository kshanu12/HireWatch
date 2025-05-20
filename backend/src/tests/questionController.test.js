const questionController = require("../controllers/questionController");
const { Test, Question, Option } = require("../models/models");

// Mocking the dependencies
jest.mock("../models/models", () => ({
  Test: {
    findAll: jest.fn(),
  },
  Question: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
  },
  Option: {
    findAll: jest.fn(),
  },
}));

describe("Question Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllQuestions", () => {
    it("should fetch all questions with options", async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const questions = [{ id: 1, description: "Question 1", options: [{ id: 1, description: "Option A" }] }];
      Question.findAll.mockResolvedValueOnce(questions);

      await questionController.getAllQuestions(req, res);

      expect(Question.findAll).toHaveBeenCalledWith({ include: [Option] });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(questions);
    });

    it("should handle errors when fetching all questions", async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const error = "Database error";
      Question.findAll.mockRejectedValueOnce(error);

      await questionController.getAllQuestions(req, res);

      expect(Question.findAll).toHaveBeenCalledWith({ include: [Option] });
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Failed to fetch all questions" });
    });
  });

  describe("getQuestionsByTestId", () => {
    it("should fetch all questions with options for a specific test ID", async () => {
      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const questions = [{ id: 1, description: "Question 1", options: [{ id: 1, description: "Option A" }] }];
      Question.findAll.mockResolvedValueOnce(questions);

      await questionController.getQuestionsByTestId(req, res);

      expect(Question.findAll).toHaveBeenCalledWith({
        include: [Option],
        where: { test_id: 1 },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(questions);
    });

    it("should handle errors when fetching questions for a specific test ID", async () => {
      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const error = "Database error";
      Question.findAll.mockRejectedValueOnce(error);

      await questionController.getQuestionsByTestId(req, res);

      expect(Question.findAll).toHaveBeenCalledWith({
        include: [Option],
        where: { test_id: 1 },
      });
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Failed to get questions" });
    });
  });

  describe("getQuestionById", () => {
    it("should fetch a question by ID with options", async () => {
      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const question = { id: 1, description: "Question 1", options: [{ id: 1, description: "Option A" }] };
      Question.findOne.mockResolvedValueOnce(question);

      await questionController.getQuestionById(req, res);

      expect(Question.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        include: [Option],
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(question);
    });

    it("should handle errors when fetching a question by ID", async () => {
      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const error = "Database error";
      Question.findOne.mockRejectedValueOnce(error);

      await questionController.getQuestionById(req, res);

      expect(Question.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        include: [Option],
      });
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Failed to fetch question by id" });
    });
  });

  describe("addQuestion", () => {
    it("should add a new question to the database", async () => {
      const req = { body: { description: "New question", test_id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const question = { id: 1, description: "New question", test_id: 1 };
      Question.create.mockResolvedValueOnce(question);

      await questionController.addQuestion(req, res);

      expect(Question.create).toHaveBeenCalledWith({
        description: "New question",
        test_id: 1,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(question);
    });

    it("should handle errors when adding a new question", async () => {
      const req = { body: { description: "New question", test_id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const error = "Database error";
      Question.create.mockRejectedValueOnce(error);

      await questionController.addQuestion(req, res);

      expect(Question.create).toHaveBeenCalledWith({
        description: "New question",
        test_id: 1,
      });
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Failed to add question" });
    });
  });

  describe("updateQuestionById", () => {
    it("should update an existing question by ID", async () => {
      const req = { params: { id: 1 }, body: { description: "Updated question", test_id: 2 } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      const question = { id: 1, description: "Question 1", test_id: 1 };
      Question.findByPk.mockResolvedValueOnce(question);
      Question.update.mockResolvedValueOnce([1]);

      await questionController.updateQuestionById(req, res);

      expect(Question.findByPk).toHaveBeenCalledWith(1);
      expect(Question.update).toHaveBeenCalledWith(
        {
          description: "Updated question",
          test_id: 2,
        },
        { where: { id: 1 } },
        { include: [Test] }
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalled();
    });

    it("should handle updating a non-existent question", async () => {
      const req = { params: { id: 1 }, body: { description: "Updated question", test_id: 2 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Question.findByPk.mockResolvedValueOnce(null);

      await questionController.updateQuestionById(req, res);

      expect(Question.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Question not found" });
    });

    it("should handle errors when updating a question", async () => {
      const req = { params: { id: 1 }, body: { description: "Updated question", test_id: 2 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const question = { id: 1, description: "Question 1", test_id: 1 };
      Question.findByPk.mockResolvedValueOnce(question);

      const error = "Database error";
      Question.update.mockRejectedValueOnce(error);

      await questionController.updateQuestionById(req, res);

      expect(Question.findByPk).toHaveBeenCalledWith(1);
      expect(Question.update).toHaveBeenCalledWith(
        {
          description: "Updated question",
          test_id: 2,
        },
        { where: { id: 1 } },
        { include: [Test] }
      );
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Failed to update question" });
    });
  });

  describe("removeQuestionById", () => {
    it("should remove an existing question by ID", async () => {
      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      const question = { id: 1, description: "Question 1", test_id: 1 };
      Question.findByPk.mockResolvedValueOnce(question);
      question.destroy = jest.fn().mockResolvedValueOnce();

      await questionController.removeQuestionById(req, res);

      expect(Question.findByPk).toHaveBeenCalledWith(1);
      expect(question.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("should handle removing a non-existent question", async () => {
      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Question.findByPk.mockResolvedValueOnce(null);

      await questionController.removeQuestionById(req, res);

      expect(Question.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Question to remove doesn't exist" });
    });

    it("should handle errors when removing a question", async () => {
      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const question = { id: 1, description: "Question 1", test_id: 1 };
      Question.findByPk.mockResolvedValueOnce(question);

      const error = "Database error";
      question.destroy = jest.fn().mockRejectedValueOnce(error);

      await questionController.removeQuestionById(req, res);

      expect(Question.findByPk).toHaveBeenCalledWith(1);
      expect(question.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Failed to remove question" });
    });
  });
});
