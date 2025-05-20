const { addApplicationStatus, getAllApplicationStatus, deleteApplicationStatusById, deleteAllApplicationStatus } = require("../controllers/application_statusController");
const db = require("../../config/database");

jest.mock("../../config/database");

describe("applicationStatusController", () => {
  describe("addApplicationStatus", () => {
    it("should add a new application status and return status 200", async () => {
      // Mock request and response objects
      const req = { body: { name: "New Status" } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      // Mock the successful execution of db.query
      db.query.mockResolvedValueOnce();

      // Call the addApplicationStatus function
      await addApplicationStatus(req, res);

      // Verify the mocks
      expect(db.query).toHaveBeenCalledWith(expect.any(String));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalled();
    });

    it("should handle error and return status 403", async () => {
      // Mock request and response objects
      const req = { body: { name: "New Status" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      // Mock the error execution of db.query
      db.query.mockRejectedValueOnce(new Error("DB error"));

      // Call the addApplicationStatus function
      await addApplicationStatus(req, res);

      // Verify the mocks
      expect(db.query).toHaveBeenCalledWith(expect.any(String));
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Failure adding application status" });
    });
  });

  describe("getAllApplicationStatus", () => {
    it("should fetch all application statuses and return status 200", async () => {
      // Mock request and response objects
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      // Mock the successful execution of db.query
      const mockResult = [{ id: 1, name: "Status 1" }, { id: 2, name: "Status 2" }];
      db.query.mockResolvedValueOnce([mockResult]);

      // Call the getAllApplicationStatus function
      await getAllApplicationStatus(req, res);

      // Verify the mocks
      expect(db.query).toHaveBeenCalledWith(expect.any(String));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle error and return status 403", async () => {
      // Mock request and response objects
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      // Mock the error execution of db.query
      db.query.mockRejectedValueOnce(new Error("DB error"));

      // Call the getAllApplicationStatus function
      await getAllApplicationStatus(req, res);

      // Verify the mocks
      expect(db.query).toHaveBeenCalledWith(expect.any(String));
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Failure getting application status" });
    });
  });

  describe("deleteApplicationStatusById", () => {
    it("should delete an application status by ID and return status 204", async () => {
      // Mock request and response objects
      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      // Mock the successful execution of db.query
      db.query.mockResolvedValueOnce();

      // Call the deleteApplicationStatusById function
      await deleteApplicationStatusById(req, res);

      // Verify the mocks
      expect(db.query).toHaveBeenCalledWith(expect.any(String));
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("should handle error and return status 500", async () => {
      // Mock request and response objects
      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      // Mock the error execution of db.query
      db.query.mockRejectedValueOnce(new Error("DB error"));

      // Call the deleteApplicationStatusById function
      await deleteApplicationStatusById(req, res);

      // Verify the mocks
      expect(db.query).toHaveBeenCalledWith(expect.any(String));
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Failure deleting application status" });
    });
  });

  describe("deleteAllApplicationStatus", () => {
    it("should delete all application statuses and return status 204", async () => {
      // Mock request and response objects
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      // Mock the successful execution of db.query
      db.query.mockResolvedValueOnce();

      // Call the deleteAllApplicationStatus function
      await deleteAllApplicationStatus(req, res);

      // Verify the mocks
      expect(db.query).toHaveBeenCalledWith(expect.any(String));
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("should handle error and return status 403", async () => {
      // Mock request and response objects
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      // Mock the error execution of db.query
      db.query.mockRejectedValueOnce(new Error("DB error"));

      // Call the deleteAllApplicationStatus function
      await deleteAllApplicationStatus(req, res);

      // Verify the mocks
      expect(db.query).toHaveBeenCalledWith(expect.any(String));
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Failure deleting all application status" });
    });
  });
});
