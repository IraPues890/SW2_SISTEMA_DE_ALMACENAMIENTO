const authController = require('../src/controllers/authController');
const { Usuario, Roles } = require('../src/db/models');
const AuditService = require('../src/services/auditService');
const httpMocks = require('node-mocks-http');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 1. Mocks de dependencias
jest.mock('../src/db/models');
jest.mock('../src/services/auditService');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Controller - Login', () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    req.body = {
      email: 'admin@interbank.pe',
      password: 'UlStorage2025!'
    };
  });

  it('debe retornar 400 si falta email o password', async () => {
    req.body.password = '';
    await authController.login(req, res);
    
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().success).toBe(false);
  });

  it('debe retornar 401 si el usuario no existe', async () => {
    // Simulamos que la BD retorna null
    Usuario.findOne.mockResolvedValue(null);

    await authController.login(req, res);

    expect(Usuario.findOne).toHaveBeenCalled();
    expect(AuditService.log).toHaveBeenCalledWith(expect.objectContaining({
      accion: 'login_fallido'
    }));
    expect(res.statusCode).toBe(401);
  });

  it('debe retornar 401 si la contraseña es incorrecta', async () => {
    const mockUser = { 
      id: 1, 
      activo: true, 
      password_hash: 'hash', 
      email: 'test@test.com' 
    };
    
    Usuario.findOne.mockResolvedValue(mockUser);
    // Simulamos que bcrypt dice que es falso
    bcrypt.compare.mockResolvedValue(false);

    await authController.login(req, res);

    expect(res.statusCode).toBe(401);
    expect(AuditService.logLogin).toHaveBeenCalledWith(1, false, expect.anything(), expect.anything());
  });

  it('debe retornar 200 y un token si las credenciales son válidas', async () => {
    const mockUser = {
      id: 1,
      email: 'admin@interbank.pe',
      activo: true,
      password_hash: 'hash_valido',
      rol_id: 1,
      rol: { nombre: 'Admin' },
      toJSON: () => ({ id: 1, email: 'admin@interbank.pe' }) // Mock de Sequelize toJSON
    };

    Usuario.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('fake_token_jwt');

    await authController.login(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.token).toBe('fake_token_jwt');
    expect(AuditService.logLogin).toHaveBeenCalledWith(1, true, expect.anything(), expect.anything());
  });
});