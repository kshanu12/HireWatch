const { Application } = require("../models/models");
const {
  createApplication,
  getAllApplications,
  getApplicationById,
  deleteApplicationById,
  deleteAllApplication,
  updateApplication,
  filter_Application,
} = require("../controllers/applicationController");
const { db } = require("../../config/database");


describe("Application Controller", () => {
  describe("createApplication", () => {
    it("should create a new application", async () => {
      // Mock the request and response objects
      const req = {
        body: {
          user_id: "user123",
          test_id: "test123",
          application_status_id: "status123",
          application_action_id: "action123",
          started_at: "2023-06-01",
          ended_at: "2023-06-02",
          broadcast_id: "broadcast123",
          score: 90,
        },
      };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Create a mock application object
      const mockApplication = {
        _id: "app123",
        ...req.body,
      };
  
      // Mock the Application.create method
      Application.create = jest.fn().mockResolvedValue(mockApplication);
  
      // Call the createApplication function
      await createApplication(req, res);
  
      // Verify the response
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockApplication);
    });
  
    it("should return an error when application creation fails", async () => {
      // Mock the request and response objects
      const req = {
        body: {
          // Provide valid data
        },
      };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Mock the Application.create method to throw an error
      const errorMessage = "Application creation failed";
      Application.create = jest.fn().mockRejectedValue(new Error(errorMessage));
  
      // Call the createApplication function
      await createApplication(req, res);
  
      // Verify the response
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to create application",
      });
    });
  });

  describe("getAllApplications", () => {
    it("should fetch all applications", async () => {
      // Mock the request and response objects
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Create a mock applications array
      const mockApplications = [
        { _id: "app123", user_id: "user123", test_id: "test123" },
        { _id: "app456", user_id: "user456", test_id: "test456" },
      ];
  
      // Mock the Application.findAll method
      Application.findAll = jest.fn().mockResolvedValue(mockApplications);
  
      // Call the getAllApplications function
      await getAllApplications(req, res);
  
      // Verify the response
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockApplications);
    });
  
    it("should return an error when fetching applications fails", async () => {
      // Mock the request and response objects
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Mock the Application.findAll method to throw an error
      const errorMessage = "Failed to fetch all applications";
      Application.findAll = jest.fn().mockRejectedValue(new Error(errorMessage));
  
      // Call the getAllApplications function
      await getAllApplications(req, res);
  
      // Verify the response
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to fetch all applications",
      });
    });
  });

  describe("deleteApplicationById", () => {
    it("should delete the application by ID", async () => {
      // Mock the request and response objects
      const req = {
        params: {
          id: "1",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      // Mock the Application.destroy method to return the number of deleted records
      const deletedRecordCount = 1;
      Application.destroy = jest.fn().mockResolvedValue(deletedRecordCount);

      // Call the deleteApplicationById function
      await deleteApplicationById(req, res);

      // Verify the response
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("should return an error when deleting the application fails", async () => {
      // Mock the request and response objects
      const req = {
        params: {
          id: "1",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock the Application.destroy method to throw an error
      const errorMessage = "Failure deleting application";
      Application.destroy = jest.fn().mockRejectedValue(new Error(errorMessage));

      // Call the deleteApplicationById function
      await deleteApplicationById(req, res);

      // Verify the response
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failure deleting application",
      });
    });
  });
  describe("deleteAllApplication", () => {
    it("should delete all applications", async () => {
      // Mock the request and response objects
      const req = {};

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      // Mock the Application.destroy method to return the number of deleted records
      const deletedRecordCount = 10; // Mocking with an arbitrary number
      Application.destroy = jest.fn().mockResolvedValue(deletedRecordCount);

      // Call the deleteAllApplication function
      await deleteAllApplication(req, res);

      // Verify the response
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("should return an error when deleting applications fails", async () => {
      // Mock the request and response objects
      const req = {};

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock the Application.destroy method to throw an error
      const errorMessage = "Failure deleting application";
      Application.destroy = jest.fn().mockRejectedValue(new Error(errorMessage));

      // Call the deleteAllApplication function
      await deleteAllApplication(req, res);

      // Verify the response
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failure deleting application",
      });
    });
  });

  describe("updateApplication", () => {
    it("should update the application", async () => {
      // Mock the request and response objects
      const req = {
        body: {
          application_id: 1,
          ended_at: "2023-06-02",
          application_status_id: 2,
          application_action_id: 3,
          score: 90,
          broadcast_id: "broadcast123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock the Application.update method to return an array with the number of updated rows
      Application.update = jest.fn().mockResolvedValue([1]);

      // Call the updateApplication function
      await updateApplication(req, res);

      // Verify the response
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Application updated successfully",
      });
    });

    it("should return an error when the application is not found", async () => {
      // Mock the request and response objects
      const req = {
        body: {
          application_id: 1,
          ended_at: "2023-06-02",
          application_status_id: 2,
          application_action_id: 3,
          score: 90,
          broadcast_id: "broadcast123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock the Application.update method to return an array with 0 updated rows
      Application.update = jest.fn().mockResolvedValue([0]);

      // Call the updateApplication function
      await updateApplication(req, res);

      // Verify the response
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Application not found" });
    });

    it("should return an error when updating the application fails", async () => {
      // Mock the request and response objects
      const req = {
        body: {
          application_id: 1,
          ended_at: "2023-06-02",
          application_status_id: 2,
          application_action_id: 3,
          score: 90,
          broadcast_id: "broadcast123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock the Application.update method to throw an error
      const errorMessage = "Failure updating user application";
      Application.update = jest.fn().mockRejectedValue(new Error(errorMessage));

      // Call the updateApplication function
      await updateApplication(req, res);

      // Verify the response
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failure updating user application",
      });
    });
  });
});
