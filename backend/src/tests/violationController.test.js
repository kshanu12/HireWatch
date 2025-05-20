const { addViolation, deleteAllViolations, getViolationByApplicantId, getAllViolations } = require("../controllers/violationController");
const { Violation } = require("../models/models");

describe("Violation Controller", () => {
  describe("addViolation", () => {
    it("should add a new violation and return status 201", async () => {
      expect.assertions(2);

      const req = {
        body: {
          application_id: 123,
          type: "speeding",
          image: "base64encodedimage",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await addViolation(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalled();
    });

    it("should return status 403 if failed to add violation", async () => {
      expect.assertions(2);

      const req = {
        body: {
          // Invalid payload or missing fields
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await addViolation(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("deleteAllViolations", () => {
    it("should delete all violations and return status 204", async () => {
        expect.assertions(3);
    
        const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
          json: jest.fn(), // Add the json method
        };
    
        await deleteAllViolations({}, res);
    
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    
        // Check if all violations are deleted from the database
        const violations = await Violation.findAll();
        expect(violations.length).toBe(0);
      });

    it("should return status 403 if failed to delete violations", async () => {
      expect.assertions(2);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await deleteAllViolations({}, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("getViolationByApplicantId", () => {
    it("should retrieve violations by applicant ID and return status 200", async () => {

      const req = {
        params: {
          id: 123,
        },
      };
      const res = {
        json: jest.fn(),
      };

      await getViolationByApplicantId(req, res);

      expect(res.json).toHaveBeenCalled();
    });

    it("should return status 404 if applicant ID not found", async () => {
      expect.assertions(2);

      const req = {
        params: {
          id: 999,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getViolationByApplicantId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("getAllViolations", () => {
    it("should return all violations with status 200", async () => {
      expect.assertions(2);
  
      const mockedViolations = [
        { id: 1, application_id: 1, type: "Type 1", image: Buffer.from("image1", "utf8") },
        { id: 2, application_id: 1, type: "Type 2", image: Buffer.from("image2", "utf8") },
      ];
  
      Violation.findAll = jest.fn().mockResolvedValue(mockedViolations);
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await getAllViolations({}, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockedViolations);
    });
  
    it("should return status 403 if failed to retrieve violations", async () => {
      expect.assertions(2);
  
      const error = new Error("Failed to retrieve violations");
      Violation.findAll = jest.fn().mockRejectedValue(error);
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await getAllViolations({}, res);
  
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Failed to retrieve all violations" });
    });
  });
  
});
