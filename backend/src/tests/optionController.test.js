const optionController = require("../controllers/optionController");
const { Option, Question } = require("../models/models");

// Mocking the dependencies
jest.mock("../models/models", () => ({
  Option: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
  },
  Question: {
    findByPk: jest.fn(),
  },
}));

describe("Option Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllOptionsByQuestionId", () => {
    it("should fetch all options for a particular question ID", async () => {
      const req = { params: { id: 1 } };
      const res = { json: jest.fn() };

      Option.findAll.mockResolvedValueOnce([{ id: 1, description: "Option A" }, { id: 2, description: "Option B" }]);
      
      await optionController.getAllOptionsByQuestionId(req, res);
      
      expect(Option.findAll).toHaveBeenCalledWith({ where: { question_id: 1 } });
      expect(res.json).toHaveBeenCalledWith([{ id: 1, description: "Option A" }, { id: 2, description: "Option B" }]);
    });

    it("should handle errors when getting options by question id", async () => {
      const req = { params: { id: 1 } };
      const res = { json: jest.fn() };
  
      const error = "Database error";
      Option.findAll.mockRejectedValueOnce(error);
  
      await optionController.getAllOptionsByQuestionId(req, res);
  
      expect(Option.findAll).toHaveBeenCalledWith({ where: { question_id: 1 } });
      expect(res.json).toHaveBeenCalledWith({ message: "Failure getting options by question id" });
    });
  });

  describe("getAllOptions", () => {
    it("should fetch all options in the Option table", async () => {
      const req = {};
      const res = { json: jest.fn() };

      Option.findAll.mockResolvedValueOnce([{ id: 1, description: "Option A" }, { id: 2, description: "Option B" }]);

      await optionController.getAllOptions(req, res);

      expect(Option.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith([{ id: 1, description: "Option A" }, { id: 2, description: "Option B" }]);
    });

    it("should handle errors when getting options", async () => {
      const req = {};
      const res = { json: jest.fn() };
  
      const error = "Database error";
      Option.findAll.mockRejectedValueOnce(error);
  
      await optionController.getAllOptions(req, res);
  
      expect(Option.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: "Failure getting options" });
    });
  });

  describe("createOption", () => {
    it("should create a new option with a question_id", async () => {
      const req = { body: { description: "Option A", is_answer: true, question_id: 1 } };
      const res = { json: jest.fn() };

      const question = { id: 1 };
      Question.findByPk.mockResolvedValueOnce(question);
      Option.create.mockResolvedValueOnce({ id: 1, ...req.body });

      await optionController.createOption(req, res);

      expect(Question.findByPk).toHaveBeenCalledWith(1);
      expect(Option.create).toHaveBeenCalledWith({
        description: "Option A",
        is_answer: true,
        question_id: 1,
      });
      expect(res.json).toHaveBeenCalledWith({ id: 1, ...req.body });
    });

    it("should create a new option without a question_id", async () => {
      const req = { body: { description: "Option B", is_answer: false } };
      const res = { json: jest.fn() };

      Option.create.mockResolvedValueOnce({ id: 1, ...req.body });

      await optionController.createOption(req, res);

      expect(Option.create).toHaveBeenCalledWith({
        description: "Option B",
        is_answer: false,
      });
      expect(res.json).toHaveBeenCalledWith({ id: 1, ...req.body });
    });

    it("should handle errors when adding an option", async () => {
      const req = { body: { description: "Option A", is_answer: true, question_id: 1 } };
      const res = { json: jest.fn() };
  
      const error = "Database error";
      Question.findByPk.mockRejectedValueOnce(error);
  
      await optionController.createOption(req, res);
  
      expect(Question.findByPk).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({ message: "Failure adding option" });
    });
  
    it("should handle the case when question with provided id does not exist", async () => {
      const req = { body: { description: "Option A", is_answer: true, question_id: 1 } };
      const res = { json: jest.fn() };
  
      Question.findByPk.mockResolvedValueOnce(null);
  
      await optionController.createOption(req, res);
  
      expect(Question.findByPk).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({ message: "Failure adding option" });
    });
  });

  describe("updateOption", () => {
    it("should update an existing option", async () => {
      const req = { params: { id: 1 }, body: { description: "Updated Option", is_answer: true, question_id: 2 } };
      const res = { json: jest.fn() };

      const existingOption = { id: 1, description: "Option A", is_answer: false };
      Option.findByPk.mockResolvedValueOnce(existingOption);
      Question.findByPk.mockResolvedValueOnce({ id: 2 });
      existingOption.update = jest.fn().mockResolvedValueOnce({ id: 1, ...req.body });

      await optionController.updateOption(req, res);

      expect(Option.findByPk).toHaveBeenCalledWith(1);
      expect(Question.findByPk).toHaveBeenCalledWith(2);
      expect(existingOption.update).toHaveBeenCalledWith({
        description: "Updated Option",
        is_answer: true,
        question_id: 2,
      });
      expect(res.json).toHaveBeenCalledWith({ id: 1, ...req.body });
    });

    it("should handle updating a non-existent option", async () => {
      const req = { params: { id: 1 }, body: { description: "Updated Option" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Option.findByPk.mockResolvedValueOnce(null);

      await optionController.updateOption(req, res);

      expect(Option.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Option not found" });
    });

    it("should handle errors when updating an option", async () => {
      const req = { params: { id: 1 }, body: { description: "Updated Option A" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      const error = "Database error";
      Option.findByPk.mockRejectedValueOnce(error);
  
      await optionController.updateOption(req, res);
  
      expect(Option.findByPk).toHaveBeenCalledWith(1);
    });
  
    it("should handle the case when question with provided id does not exist", async () => {
      const req = { params: { id: 1 }, body: { description: "Updated Option A", question_id: 2 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      const existingOption = { id: 1, description: "Option A", is_answer: true };
      Option.findByPk.mockResolvedValueOnce(existingOption);
  
      Question.findByPk.mockResolvedValueOnce(null);
  
      await optionController.updateOption(req, res);
  
      expect(Option.findByPk).toHaveBeenCalledWith(1);
      expect(Question.findByPk).toHaveBeenCalledWith(2);
      expect(res.json).toHaveBeenCalledWith({ message: "Failure updating option" });
    });
  });

  describe("deleteOptionById", () => {
    it("should delete an existing option by ID", async () => {
      const req = { params: { id: 1 } };
      const res = { json: jest.fn() };

      Option.destroy.mockResolvedValueOnce(1);

      await optionController.deleteOptionById(req, res);

      expect(Option.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.json).toHaveBeenCalledWith({ message: "Option deleted successfully" });
    });

    it("should handle deleting a non-existent option", async () => {
      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Option.destroy.mockResolvedValueOnce(0);

      await optionController.deleteOptionById(req, res);

      expect(Option.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Option not found" });
    });
    it("should handle errors when deleting an option", async () => {
      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      const error = "Database error";
      Option.destroy.mockRejectedValueOnce(error);
  
      await optionController.deleteOptionById(req, res);
  
      expect(Option.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.json).toHaveBeenCalledWith({ message: "Failure deleting option" });
    });
  });

  describe("deleteOptionsByQuestionId", () => {
    it("should delete all options for a particular question ID", async () => {
      const req = { params: { id: 1 } };
      const res = { json: jest.fn() };

      Option.destroy.mockResolvedValueOnce(2);

      await optionController.deleteOptionsByQuestionId(req, res);

      expect(Option.destroy).toHaveBeenCalledWith({ where: { question_id: 1 } });
      expect(res.json).toHaveBeenCalledWith(2);
    });
    it("should handle errors when deleting options by question id", async () => {
      const req = { params: { id: 1 } };
      const res = { json: jest.fn() };
  
      const error = "Database error";
      Option.destroy.mockRejectedValueOnce(error);
  
      await optionController.deleteOptionsByQuestionId(req, res);
  
      expect(Option.destroy).toHaveBeenCalledWith({ where: { question_id: 1 } });
      expect(res.json).toHaveBeenCalledWith({ message: "Failure deleting options by question id" });
    });
  });
});
