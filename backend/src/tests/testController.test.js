const {
    getAllTests,
    getTestById,
    addTest,
    updateTestById,
    removeTestById,
  } = require("../controllers/testController");
  const {
    Test,
    User,
    TechStack,
    Question,
    Application,
  } = require("../models/models");
  
  jest.mock("../models/models");
  
  describe("testController", () => {
    describe("getAllTests", () => {
      it("should fetch all tests and return status 200", async () => {
        // Mock request and response objects
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        // Mock the successful execution of Test.findAll
        const mockResult = [{ id: 1, name: "Test 1" }, { id: 2, name: "Test 2" }];
        Test.findAll.mockResolvedValueOnce(mockResult);
  
        // Call the getAllTests function
        await getAllTests(req, res);
  
        // Verify the mocks
        expect(Test.findAll).toHaveBeenCalledWith({});
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockResult);
      });
  
      it("should handle error and return status 403", async () => {
        // Mock request and response objects
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        // Mock the error execution of Test.findAll
        Test.findAll.mockRejectedValueOnce(new Error("DB error"));
  
        // Call the getAllTests function
        await getAllTests(req, res);
  
        // Verify the mocks
        expect(Test.findAll).toHaveBeenCalledWith({});
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: "Failed to fetch all tests" });
      });
    });
  
    describe("getTestById", () => {
      it("should fetch a test by ID and return status 200", async () => {
        // Mock request and response objects
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        // Mock the successful execution of Test.findOne
        const mockResult = { id: 1, name: "Test 1" };
        Test.findOne.mockResolvedValueOnce(mockResult);
  
        // Call the getTestById function
        await getTestById(req, res);
  
        // Verify the mocks
        expect(Test.findOne).toHaveBeenCalledWith({
          where: { id: Number(req.params.id) },
          include: [User, TechStack, Question, Application],
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockResult);
      });
  
      it("should handle error and return status 403", async () => {
        // Mock request and response objects
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        // Mock the error execution of Test.findOne
        Test.findOne.mockRejectedValueOnce(new Error("DB error"));
  
        // Call the getTestById function
        await getTestById(req, res);
  
        // Verify the mocks
        expect(Test.findOne).toHaveBeenCalledWith({
          where: { id: Number(req.params.id) },
          include: [User, TechStack, Question, Application],
        });
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: "Failed to fetch test by id" });
      });
    });
  
    describe("addTest", () => {
      it("should add a new test and return status 201", async () => {
        // Mock request and response objects
        const req = { body: { name: "New Test", duration: 60, score: 100, type: "Multiple Choice" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        // Mock the successful execution of Test.create
        const mockResult = { id: 1, name: "New Test", duration: 60, score: 100, type: "Multiple Choice" };
        Test.create.mockResolvedValueOnce(mockResult);
  
        // Call the addTest function
        await addTest(req, res);
  
        // Verify the mocks
        expect(Test.create).toHaveBeenCalledWith({
          name: req.body.name,
          duration: req.body.duration,
          score: req.body.score,
          type: req.body.type,
          creator_id: undefined,
          tech_stack_id: undefined,
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockResult);
      });
  
      it("should handle error and return status 403", async () => {
        // Mock request and response objects
        const req = { body: { name: "New Test", duration: 60, score: 100, type: "Multiple Choice" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        // Mock the error execution of Test.create
        Test.create.mockRejectedValueOnce(new Error("DB error"));
  
        // Call the addTest function
        await addTest(req, res);
  
        // Verify the mocks
        expect(Test.create).toHaveBeenCalledWith({
          name: req.body.name,
          duration: req.body.duration,
          score: req.body.score,
          type: req.body.type,
          creator_id: undefined,
          tech_stack_id: undefined,
        });
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: "Failed to add test" });
      });
    });
  
    describe("updateTestById", () => {
      it("should update a test by ID and return status 201", async () => {
        // Mock request and response objects
        const req = {
          params: { id: 1 },
          body: { name: "Updated Test", duration: 90, score: 80, type: "Essay" },
        };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  
        // Mock the successful execution of Test.findByPk and Test.update
        const mockTest = {
          id: 1,
          name: "Existing Test",
          duration: 60,
          score: 100,
          type: "Multiple Choice",
          creator_id: 1,
          tech_stack_id: 1,
        };
        Test.findByPk.mockResolvedValueOnce(mockTest);
        Test.update.mockResolvedValueOnce();
  
        // Call the updateTestById function
        await updateTestById(req, res);
  
        // Verify the mocks
        expect(Test.findByPk).toHaveBeenCalledWith(req.params.id);
        expect(Test.update).toHaveBeenCalledWith(
          {
            name: req.body.name || mockTest.name,
            duration: req.body.duration || mockTest.duration,
            score: req.body.score || mockTest.score,
            type: req.body.type || mockTest.type,
            creator_id: req.body.creator_id || mockTest.creator_id,
            tech_stack_id: req.body.tech_stack_id || mockTest.tech_stack_id,
          },
          { where: { id: Number(req.params.id) } },
          { include: [User, Application, Question, TechStack] }
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalled();
      });
  
      it("should handle error and return status 403 if test not found", async () => {
        // Mock request and response objects
        const req = {
          params: { id: 1 },
          body: { name: "Updated Test", duration: 90, score: 80, type: "Essay" },
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        // Mock the error execution of Test.findByPk (test not found)
        Test.findByPk.mockResolvedValueOnce(null);
  
        // Call the updateTestById function
        await updateTestById(req, res);
  
        // Verify the mocks
        expect(Test.findByPk).toHaveBeenCalledWith(req.params.id);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Test not found" });
      });
  
      it("should handle error and return status 403", async () => {
        // Mock request and response objects
        const req = {
          params: { id: 1 },
          body: { name: "Updated Test", duration: 90, score: 80, type: "Essay" },
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        // Mock the error execution of Test.findByPk (test found) and Test.update
        const mockTest = {
          id: 1,
          name: "Existing Test",
          duration: 60,
          score: 100,
          type: "Multiple Choice",
          creator_id: 1,
          tech_stack_id: 1,
        };
        Test.findByPk.mockResolvedValueOnce(mockTest);
        Test.update.mockRejectedValueOnce(new Error("DB error"));
  
        // Call the updateTestById function
        await updateTestById(req, res);
  
        // Verify the mocks
        expect(Test.findByPk).toHaveBeenCalledWith(req.params.id);
        expect(Test.update).toHaveBeenCalledWith(
          {
            name: req.body.name || mockTest.name,
            duration: req.body.duration || mockTest.duration,
            score: req.body.score || mockTest.score,
            type: req.body.type || mockTest.type,
            creator_id: req.body.creator_id || mockTest.creator_id,
            tech_stack_id: req.body.tech_stack_id || mockTest.tech_stack_id,
          },
          { where: { id: Number(req.params.id) } },
          { include: [User, Application, Question, TechStack] }
        );
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: "Failed to update test" });
      });
    });
  
    describe("removeTestById", () => {
      it("should remove a test by ID and return status 204", async () => {
        // Mock request and response objects
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  
        // Mock the successful execution of Test.findByPk and test.destroy
        const mockTest = { destroy: jest.fn() };
        Test.findByPk.mockResolvedValueOnce(mockTest);
  
        // Call the removeTestById function
        await removeTestById(req, res);
  
        // Verify the mocks
        expect(Test.findByPk).toHaveBeenCalledWith(req.params.id);
        expect(mockTest.destroy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
      });
  
      it("should handle error and return status 404 if test not found", async () => {
        // Mock request and response objects
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        // Mock the error execution of Test.findByPk (test not found)
        Test.findByPk.mockResolvedValueOnce(null);
  
        // Call the removeTestById function
        await removeTestById(req, res);
  
        // Verify the mocks
        expect(Test.findByPk).toHaveBeenCalledWith(req.params.id);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Test to remove doesn't exist" });
      });
  
      it("should handle error and return status 404", async () => {
        // Mock request and response objects
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        // Mock the error execution of Test.findByPk (test found) and test.destroy
        const mockTest = { destroy: jest.fn().mockRejectedValueOnce(new Error("DB error")) };
        Test.findByPk.mockResolvedValueOnce(mockTest);
  
        // Call the removeTestById function
        await removeTestById(req, res);
  
        // Verify the mocks
        expect(Test.findByPk).toHaveBeenCalledWith(req.params.id);
        expect(mockTest.destroy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Failed to remove test" });
      });
    });
  });
  