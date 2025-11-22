const auditController = require('../src/controllers/auditController');
const { ActivityLog, Usuario } = require('../src/db/models');
const httpMocks = require('node-mocks-http');
const { Op } = require('sequelize');

jest.mock('../src/db/models');

describe('Audit Controller - Get Logs', () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/api/audit/logs',
      query: {}
    });
    res = httpMocks.createResponse();
  });

  it('debe obtener los logs con paginación por defecto', async () => {
    // Simulamos respuesta de Sequelize
    const mockLogs = {
      rows: [{ id: 1, accion: 'LOGIN' }],
      count: 1
    };
    ActivityLog.findAndCountAll.mockResolvedValue(mockLogs);

    await auditController.getLogs(req, res);

    expect(res.statusCode).toBe(200);
    const response = res._getJSONData();
    expect(response.data.pagination.currentPage).toBe(1);
    expect(response.data.logs).toHaveLength(1);
    
    // Verificamos que se llamó a la BD con limit 20 (default)
    expect(ActivityLog.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
      limit: 20,
      offset: 0
    }));
  });

  it('debe aplicar filtros de búsqueda correctamente', async () => {
    req.query.accion = 'UPLOAD';
    req.query.usuario_id = '5';

    ActivityLog.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });

    await auditController.getLogs(req, res);

    // Verificamos que los filtros del where se construyeron bien
    const callArgs = ActivityLog.findAndCountAll.mock.calls[0][0];
    expect(callArgs.where).toHaveProperty('accion');
    expect(callArgs.where).toHaveProperty('usuario_id', '5');
  });

  it('debe manejar errores de base de datos correctamente', async () => {
    const errorMsg = 'Error de conexión DB simulado';
    ActivityLog.findAndCountAll.mockRejectedValue(new Error(errorMsg));

    await auditController.getLogs(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData().message).toBe('Error al obtener logs de auditoría');
  });
});