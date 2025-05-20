const db = require("../../config/database");
const {
  getAllTechStack,
  getTechStackById,
  createTechStack,
} = require("../controllers/tech_stackController");

describe("Tech Stack Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllTechStack", () => {
    it("should fetch all tech stacks and return status 200", async () => {
      const mockTechStack = [{ id: 1, name: "Tech Stack 1" }];

      db.query = jest.fn().mockResolvedValue([mockTechStack]);

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAllTechStack(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTechStack);
    });

    it("should handle error and return status 403", async () => {
      const errorMessage = "Failed to fetch all tech stacks";

      db.query = jest.fn().mockRejectedValue(new Error(errorMessage));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAllTechStack(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe("getTechStackById", () => {
    it("should fetch tech stack by ID and return status 200", async () => {
      const techStackId = 1;
      const mockTechStack = { id: techStackId, name: "Tech Stack 1" };

      db.query = jest.fn().mockResolvedValue([mockTechStack]);

      const req = { params: { id: techStackId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getTechStackById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTechStack);
    });

    it("should handle error and return status 403", async () => {
      const techStackId = 1;
      const errorMessage = "Failed to fetch tech stack by id";

      db.query = jest.fn().mockRejectedValue(new Error(errorMessage));

      const req = { params: { id: techStackId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getTechStackById(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe("createTechStack", () => {
    it("should create tech stack and return status 200", async () => {
      const techStackName = "Tech Stack 1";

      db.query = jest.fn().mockResolvedValue();

      const req = { body: { name: techStackName } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createTechStack(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith("success");
    });

    it("should handle error and return status 403", async () => {
      const techStackName = "Tech Stack 1";
      const errorMessage = "Failed to create tech stack";

      db.query = jest.fn().mockRejectedValue(new Error(errorMessage));

      const req = { body: { name: techStackName } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createTechStack(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
});
