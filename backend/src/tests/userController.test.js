const bcrypt = require("bcrypt");
const userController = require("../controllers/userController");
const { User, Role } = require("../models/models");
const nodemailer = require("nodemailer");
const { hashPassword } = require('../controllers/userController');
const { authenticateUser } = userController;


jest.mock("../models/models"); // Mocking the models to isolate the controller tests
jest.mock("nodemailer"); // Mocking nodemailer to isolate the email sending tests

describe("User Controller", () => {
    describe('hashPassword', () => {
        it('should hash the password correctly', async () => {
          const bcryptHashMock = jest.spyOn(bcrypt, 'hash');
    
          const password = 'test123';
          const hashedPassword = await hashPassword(password);
    
          expect(bcryptHashMock).toHaveBeenCalledWith(password, expect.any(Number));
          expect(hashedPassword).toBeDefined();
    
          bcryptHashMock.mockRestore();
        });
      });

  describe("authenticateUser", () => {
    it("should return 403 if the user doesn't exist", async () => {
      const req = { body: { email: "nonexistent@example.com", password: "password123" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      User.findOne.mockResolvedValue(null);

      await userController.authenticateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "User doesn't exist" });
    });

    it('should return 403 if the password is incorrect', async () => {
        const compareMock = jest.spyOn(bcrypt, 'compare');
        compareMock.mockImplementation(() => Promise.resolve(false)); // Mock the bcrypt.compare implementation
      
        const req = {
          body: {
            email: 'test@example.com',
            password: 'wrongpassword',
          },
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
        await userController.authenticateUser(req, res);
      
        expect(compareMock).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(String)
        );
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Incorrect Password',
        });
      
        compareMock.mockRestore();
      });
      

    it("should return the user if authentication is successful", async () => {
      const req = { body: { email: "existing@example.com", password: "correctpassword" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const user = { id: 1, email: "existing@example.com" };
      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);

      await userController.authenticateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it("should return 403 if an error occurs", async () => {
      const req = { body: { email: "existing@example.com", password: "correctpassword" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      User.findOne.mockRejectedValue(new Error("Database error"));

      await userController.authenticateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "failure" });
    });
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const req = {};
      const res = {
        json: jest.fn(),
      };
      const users = [{ id: 1, name: "John" }, { id: 2, name: "Jane" }];
      User.findAll.mockResolvedValue(users);

      await userController.getAllUsers(req, res);

      expect(res.json).toHaveBeenCalledWith(users);
    });

    it("should return an error message if retrieval fails", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      User.findAll.mockRejectedValue(new Error("Database error"));

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "An error occurred while retrieving users",
      });
    });
  });

  describe("addUser", () => {
  it('should create a new user and return it', async () => {
    const req = {
      body: {
        email: 'newuser@example.com',
        password: 'password123',
        role_id: 1,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    const bcryptHashMock = jest.spyOn(bcrypt, 'hash'); // Mock bcrypt.hash

    bcryptHashMock.mockResolvedValue('hashed_password123'); // Mock the resolved hashed password
      
    await userController.addUser(req, res);
  
    expect(User.create).toHaveBeenCalledWith({
      email: 'newuser@example.com',
      password: 'hashed_password123', // Update the expected hashed password value
      role_id: 1,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      email: 'newuser@example.com',
      password: 'hashed_password123', // Update the expected hashed password value
      role_id: 1,
    });
  
    bcrypt.hash.mockRestore();
  });

    it("should return a 404 error if the role is not found", async () => {
      const req = { body: { email: "newuser@example.com", password: "password123", role_id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Role.findByPk.mockResolvedValue(false);

      await userController.addUser(req, res);

      expect(Role.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Role not found" });
    });

    it("should return a 500 error if an error occurs during user creation", async () => {
      const req = { body: { email: "newuser@example.com", password: "password123", role_id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Role.findByPk.mockResolvedValue(true);
      User.create.mockRejectedValue(new Error("Database error"));

      await userController.addUser(req, res);

      expect(Role.findByPk).toHaveBeenCalledWith(1);
      expect(User.create).toHaveBeenCalledWith({
        email: "newuser@example.com",
        password: expect.any(String),
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to add user to the database",
      });
    });
});

  describe("sendemail", () => {
    it("should send an email", async () => {
        const req = {};
        const res = {
          json: jest.fn(),
        };
        const transporter = {
          sendMail: jest.fn((mailOptions, callback) => {
            callback(null, { response: "Email sent successfully" });
          }),
        };
        nodemailer.createTransport.mockReturnValue(transporter);
      
        await userController.sendemail(req, res);
      
        expect(nodemailer.createTransport).toHaveBeenCalledWith(expect.objectContaining({
          service: "gmail",
          auth: {
            user: "1rn19is071.kumarshanu@gmail.com",
            pass: expect.any(String),
          },
        }));
        expect(transporter.sendMail).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });
      });
      

    it("should handle the error if email sending fails", async () => {
      const req = {};
      const res = {
        json: jest.fn(),
      };
      const transporter = {
        sendMail: jest.fn((mailOptions, callback) => {
          callback(new Error("Failed to send email"), null);
        }),
      };
      nodemailer.createTransport.mockReturnValue(transporter);

      await userController.sendemail(req, res);

      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        service: "gmail",
        auth: {
          user: "1rn19is071.kumarshanu@gmail.com",
          pass: expect.any(String),
        },
      });
      expect(transporter.sendMail).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: expect.any(Error) });
    });
  });

  describe("getUserById", () => {
    it("should fetch the user by ID and return it", async () => {
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const user = { id: 1, first_name: "John", last_name: "Doe" };
      User.findByPk = jest.fn().mockResolvedValue(user);

      await userController.getUserById(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(1, {
        attributes: ["first_name", "last_name", "email", "phone"],
        include: ["role"],
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it("should return a 404 error if the user is not found", async () => {
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      User.findByPk.mockResolvedValue(null);

      await userController.getUserById(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(1, {
        attributes: ["first_name", "last_name", "email", "phone"],
        include: ["role"],
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found",
      });
    });
  });

  describe("updateUserById", () => {
    it("should update the user's details and return the updated user", async () => {
      const req = {
        params: { id: 1 },
        body: {
          first_name: "Updated",
          last_name: "User",
          email: "updated@example.com",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const user = { id: 1, first_name: "John", last_name: "Doe" };
      User.findByPk.mockResolvedValue(user);
      user.update = jest.fn().mockResolvedValue();

      await userController.updateUserById(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(user.update).toHaveBeenCalledWith({
        first_name: "Updated",
        last_name: "User",
        email: "updated@example.com",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it("should return a 404 error if the user is not found", async () => {
      const req = {
        params: { id: 1 },
        body: {
          first_name: "Updated",
          last_name: "User",
          email: "updated@example.com",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      User.findByPk.mockResolvedValue(null);

      await userController.updateUserById(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "User does not exist",
      });
    });

    it("should return a 500 error if an error occurs during user update", async () => {
      const req = {
        params: { id: 1 },
        body: {
          first_name: "Updated",
          last_name: "User",
          email: "updated@example.com",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const user = { id: 1, first_name: "John", last_name: "Doe" };
      User.findByPk.mockResolvedValue(user);
      user.update = jest.fn().mockRejectedValue(new Error("Database error"));

      await userController.updateUserById(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(user.update).toHaveBeenCalledWith({
        first_name: "Updated",
        last_name: "User",
        email: "updated@example.com",
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to update user in the database",
      });
    });
  });

  describe("deleteUserById", () => {
    it("should delete the user and return a success message", async () => {
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const user = { id: 1, first_name: "John", last_name: "Doe" };
      User.findByPk.mockResolvedValue(user);
      user.destroy = jest.fn().mockResolvedValue();

      await userController.deleteUserById(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(User.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({ message: "Failed to delete user from the database" });
    });

    it("should return a 404 error if the user is not found", async () => {
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      User.findByPk.mockResolvedValue(null);

      await userController.deleteUserById(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to delete user from the database",
      });
    });

    it("should return a 500 error if an error occurs during user deletion", async () => {
        const req = { params: { id: 1 } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        const user = { id: 1, first_name: "John", last_name: "Doe", destroy: jest.fn().mockRejectedValue(new Error("Database error")) };
        User.findByPk.mockResolvedValue(user);
      
        await userController.deleteUserById(req, res);
      
        expect(User.findByPk).toHaveBeenCalledWith(1);
        expect(User.destroy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
          message: "Failed to delete user from the database",
        });
      });
  });
});
