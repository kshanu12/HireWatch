const { loginUser } = require("../controllers/authController");
const { User } = require("../models/models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Mock the User model and bcrypt.compare function
jest.mock("../models/models");
jest.mock("bcrypt");

describe("Auth Controller", () => {
  describe("loginUser", () => {
    it("should return a token when provided with valid credentials", async () => {
      // Mock the request and response objects
      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      // Mock the user record returned by the findOne method
      const mockUser = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "test@example.com",
        password: "hashedPassword",
        role: { type: "user" },
      };
      User.findOne.mockResolvedValue(mockUser);

      // Mock the bcrypt.compare function to return true
      bcrypt.compare.mockResolvedValue(true);

      // Mock the jwt.sign function
      jwt.sign = jest.fn().mockReturnValue("mockToken");

      // Call the loginUser function
      await loginUser(req, res);

      // Verify the response
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ token: "mockToken" });
    });

    it("should return an error message when user is not found", async () => {
      // Mock the request and response objects
      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      // Mock the findOne method to return null
      User.findOne.mockResolvedValue(null);

      // Call the loginUser function
      await loginUser(req, res);

      // Verify the response
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return an error message when password is incorrect", async () => {
      // Mock the request and response objects
      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      // Mock the user record returned by the findOne method
      const mockUser = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "test@example.com",
        password: "hashedPassword",
        role: { type: "user" },
      };
      User.findOne.mockResolvedValue(mockUser);

      // Mock the bcrypt.compare function to return false
      bcrypt.compare.mockResolvedValue(false);

      // Call the loginUser function
      await loginUser(req, res);

      // Verify the response
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Password incorrect" });
    });

    it("should return an error message when an error occurs", async () => {
      // Mock the request and response objects
      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      // Mock the findOne method to throw an error
      User.findOne.mockRejectedValue(new Error("Database error"));

      // Call the loginUser function
      await loginUser(req, res);

      // Verify the response
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Provided credentials are not valid",
      });
    });

    // Additional test cases can be added for other scenarios

  });
});
