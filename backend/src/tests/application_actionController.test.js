const { getAllApplicationAction, getApplicationActionById, createApplicationAction } = require('../controllers/application_actionController');
const db = require('../../config/database');

describe('Application Action Controller', () => {
  describe('getAllApplicationAction', () => {
    it('should get all application actions and return status 200', async () => {
      // Mock the database query
      db.query = jest.fn().mockResolvedValue([[{ id: 1, name: 'Action 1' }, { id: 2, name: 'Action 2' }]]);

      // Mock request and response objects
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Call the getAllApplicationAction function
      await getAllApplicationAction(req, res);

      // Verify the mocks
      expect(db.query).toHaveBeenCalledWith(expect.any(String));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1, name: 'Action 1' }, { id: 2, name: 'Action 2' }]);
    });

    it('should handle error and return status 403', async () => {
        // Mock the database query to throw an error
        db.query = jest.fn().mockRejectedValue(new Error('Database error'));
  
        // Mock request and response objects
        const req = {};
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        // Call the getAllApplicationAction function
        await getAllApplicationAction(req, res);
  
        // Verify the mocks
        expect(db.query).toHaveBeenCalledWith(expect.any(String));
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Failed to get all application actions' });
      });
    // Add other test cases for error scenarios
  });

  describe('getApplicationActionById', () => {
    it('should get application action by ID and return status 200', async () => {
      // Mock the database query
      db.query = jest.fn().mockResolvedValue([[{ id: 1, name: 'Action 1' }]]);

      // Mock request and response objects
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Call the getApplicationActionById function
      await getApplicationActionById(req, res);

      // Verify the mocks
      expect(db.query).toHaveBeenCalledWith(expect.any(String));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1, name: 'Action 1' }]);
    });

    it('should handle error and return status 403', async () => {
        // Mock the database query to throw an error
        db.query = jest.fn().mockRejectedValue(new Error('Database error'));
  
        // Mock request and response objects
        const req = { params: { id: 1 } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        // Call the getApplicationActionById function
        await getApplicationActionById(req, res);
  
        // Verify the mocks
        expect(db.query).toHaveBeenCalledWith(expect.any(String));
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Failed to get application status by id' });
      });
    // Add other test cases for error scenarios
  });

  describe('createApplicationAction', () => {
    it('should create an application action and return status 201', async () => {
        // Mock request and response objects
        const req = { body: { name: 'New Action' } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        // Mock the successful execution of db.query
        db.query.mockResolvedValueOnce();
    
        // Call the createApplicationAction function
        await createApplicationAction(req, res);
    
        // Verify the mocks
        expect(db.query).toHaveBeenCalledWith(expect.any(String));
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'success' });
      });

        it('should handle error and return status 403', async () => {
      // Mock the database query to throw an error
      db.query = jest.fn().mockRejectedValue(new Error('Database error'));

      // Mock request and response objects
      const req = { body: { name: 'New Action' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Call the createApplicationAction function
      await createApplicationAction(req, res);

      // Verify the mocks
      expect(db.query).toHaveBeenCalledWith(expect.any(String));
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to create application action' });
    });
    // Add other test cases for error scenarios
  });
});
