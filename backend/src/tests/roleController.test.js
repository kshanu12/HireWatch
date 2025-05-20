const { Role, User } = require("../models/models");
const {
  addRole,
  getAllRoles,
  getRoleById,
  deleteRoleById,
  updateRole,
} = require("../controllers/roleController");

describe("Role Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addRole", () => {
    it("should create a new role and return status 200", async () => {
      const mockRole = { id: 1, type: "Role 1" };

      Role.create = jest.fn().mockResolvedValue(mockRole);

      const req = { body: { type: "Role 1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await addRole(req, res);

      expect(Role.create).toHaveBeenCalledWith({ type: "Role 1" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ message: "Sucess", role: mockRole });
    });

    it("should handle error and return status 404", async () => {
      const errorMessage = "Error";

      Role.create = jest.fn().mockRejectedValue(new Error(errorMessage));

      const req = { body: { type: "Role 1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await addRole(req, res);

      expect(Role.create).toHaveBeenCalledWith({ type: "Role 1" });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: "Error", error: errorMessage });
    });
  });

  describe("getAllRoles", () => {
    it("should fetch all roles and return status 200", async () => {
      const mockRoles = [{ id: 1, type: "Role 1" }];

      Role.findAll = jest.fn().mockResolvedValue(mockRoles);

      const req = {};
      const res = {
        json: jest.fn(),
      };

      await getAllRoles(req, res);

      expect(Role.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockRoles);
    });

    it("should handle error and return status 500", async () => {
      const errorMessage = "An error occurred while retrieving roles";

      Role.findAll = jest.fn().mockRejectedValue(new Error(errorMessage));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAllRoles(req, res);

      expect(Role.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe("getRoleById", () => {
    it("should fetch role by ID and return status 202", async () => {
      const roleId = 1;
      const mockRole = { id: roleId, type: "Role 1" };

      Role.findByPk = jest.fn().mockResolvedValue(mockRole);

      const req = { params: { id: roleId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getRoleById(req, res);

      expect(Role.findByPk).toHaveBeenCalledWith(roleId, { include: { model: User } });
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith(mockRole);
    });

    it("should handle role not found and return status 404", async () => {
      const roleId = 1;

      Role.findByPk = jest.fn().mockResolvedValue(null);

      const req = { params: { id: roleId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getRoleById(req, res);

      expect(Role.findByPk).toHaveBeenCalledWith(roleId, { include: { model: User } });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Role not found" });
    });

    it("should handle error and return status 500", async () => {
      const roleId = 1;
      const errorMessage = "An error occurred while fetching the role by id";

      Role.findByPk = jest.fn().mockRejectedValue(new Error(errorMessage));

      const req = { params: { id: roleId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getRoleById(req, res);

      expect(Role.findByPk).toHaveBeenCalledWith(roleId, { include: { model: User } });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe("deleteRoleById", () => {
    it("should delete role by ID and return status 204", async () => {
      const roleId = 1;
      const mockRole = { id: roleId, type: "Role 1", destroy: jest.fn() };

      Role.findByPk = jest.fn().mockResolvedValue(mockRole);

      const req = { params: { id: roleId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await deleteRoleById(req, res);

      expect(Role.findByPk).toHaveBeenCalledWith(roleId);
      expect(mockRole.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalledWith({ message: "sucess" });
    });

    it("should handle role not found and return status 404", async () => {
      const roleId = 1;

      Role.findByPk = jest.fn().mockResolvedValue(null);

      const req = { params: { id: roleId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await deleteRoleById(req, res);

      expect(Role.findByPk).toHaveBeenCalledWith(roleId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Role not found" });
    });

    it("should handle error and return status 500", async () => {
      const roleId = 1;
      const errorMessage = "An error occurred while deleting the role by id";

      Role.findByPk = jest.fn().mockRejectedValue(new Error(errorMessage));

      const req = { params: { id: roleId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await deleteRoleById(req, res);

      expect(Role.findByPk).toHaveBeenCalledWith(roleId);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe("updateRole", () => {
        it('should update role by ID and return status 201', async () => {
          const roleId = 1;
          const mockRole = { id: roleId, type: 'Role 1', update: jest.fn() };
    
          Role.findByPk = jest.fn().mockResolvedValue(mockRole);
    
          const req = { params: { id: roleId }, body: { type: 'Updated Role' } };
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
    
          await updateRole(req, res);
    
          expect(Role.findByPk).toHaveBeenCalledWith(roleId);
          expect(mockRole.update).toHaveBeenCalledWith({ type: 'Updated Role' });
          expect(res.status).toHaveBeenCalledWith(201);
          expect(res.json).toHaveBeenCalledWith(mockRole.update);
        });

    it("should handle role not found and return status 404", async () => {
      const roleId = 1;

      Role.findByPk = jest.fn().mockResolvedValue(null);

      const req = { params: { id: roleId }, body: { type: "Updated Role" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateRole(req, res);

      expect(Role.findByPk).toHaveBeenCalledWith(roleId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Role not found" });
    });

    it("should handle error and return status 500", async () => {
      const roleId = 1;
      const errorMessage = "An error occurred while updating the role";

      Role.findByPk = jest.fn().mockRejectedValue(new Error(errorMessage));

      const req = { params: { id: roleId }, body: { type: "Updated Role" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateRole(req, res);

      expect(Role.findByPk).toHaveBeenCalledWith(roleId);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
