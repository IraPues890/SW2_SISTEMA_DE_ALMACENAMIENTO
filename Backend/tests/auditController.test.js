const auditController = require('../src/controllers/auditController');
const { ActivityLog, Usuario } = require('../src/db/models');
const httpMocks = require('node-mocks-http');
const { Op } = require('sequelize');

jest.mock('../src/db/models');

describe('Audit Controller - HU-4: Visualizar logs de auditoría', () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/api/audit/logs',
      query: {}
    });
    res = httpMocks.createResponse();
    
    // Limpiar mocks antes de cada prueba
    jest.clearAllMocks();
  });

  describe('GET /api/audit/logs', () => {
    it('debe obtener los logs con paginación por defecto', async () => {
      // Simulamos respuesta de Sequelize
      const mockLogs = {
        rows: [
          { 
            id: 1, 
            accion: 'LOGIN',
            descripcion: 'Usuario inició sesión',
            usuario: { nombre: 'Juan Pérez' },
            createdAt: new Date()
          }
        ],
        count: 1
      };
      ActivityLog.findAndCountAll.mockResolvedValue(mockLogs);

      await auditController.getLogs(req, res);

      expect(res.statusCode).toBe(200);
      const response = res._getJSONData();
      expect(response.success).toBe(true);
      expect(response.data.pagination.currentPage).toBe(1);
      expect(response.data.pagination.totalPages).toBe(1);
      expect(response.data.pagination.totalRecords).toBe(1);
      expect(response.data.logs).toHaveLength(1);
      
      // Verificamos que se llamó a la BD con limit 20 (default)
      expect(ActivityLog.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
        limit: 20,
        offset: 0
      }));
    });

    it('debe aplicar filtros de búsqueda correctamente', async () => {
      req.query = {
        accion: 'UPLOAD',
        usuario_id: '5',
        prioridad: 'high',
        entidad_tipo: 'Archivo'
      };

      ActivityLog.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });

      await auditController.getLogs(req, res);

      // Verificamos que los filtros del where se construyeron bien
      const callArgs = ActivityLog.findAndCountAll.mock.calls[0][0];
      
      // Verificar que tiene la estructura del where con los filtros
      expect(callArgs).toHaveProperty('where');
      expect(callArgs.where).toHaveProperty('usuario_id', '5');
      expect(callArgs.where).toHaveProperty('prioridad', 'high');
      expect(callArgs.where).toHaveProperty('entidad_tipo', 'Archivo');
      
      // Verificar que la accion tiene el filtro iLike usando el operador real
      expect(callArgs.where.accion).toEqual({ [Op.iLike]: '%UPLOAD%' });
    });

    it('debe aplicar filtros de fecha correctamente', async () => {
      req.query = {
        fecha_inicio: '2025-11-01',
        fecha_fin: '2025-11-22'
      };

      ActivityLog.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });

      await auditController.getLogs(req, res);

      const callArgs = ActivityLog.findAndCountAll.mock.calls[0][0];
      expect(callArgs.where).toHaveProperty('createdAt');
      expect(callArgs.where.createdAt).toHaveProperty(Op.gte);
      expect(callArgs.where.createdAt).toHaveProperty(Op.lte);
    });

    it('debe manejar búsqueda global en descripción', async () => {
      req.query.search = 'archivo subido';

      ActivityLog.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });

      await auditController.getLogs(req, res);

      const callArgs = ActivityLog.findAndCountAll.mock.calls[0][0];
      // Con búsqueda global debe usar Op.or
      expect(callArgs.where).toHaveProperty(Op.or);
      expect(callArgs.where[Op.or]).toBeInstanceOf(Array);
      expect(callArgs.where[Op.or]).toContainEqual(
        expect.objectContaining({
          descripcion: { [Op.iLike]: '%archivo subido%' }
        })
      );
    });

    it('debe aplicar paginación correctamente', async () => {
      req.query = {
        page: '3',
        limit: '15'
      };

      ActivityLog.findAndCountAll.mockResolvedValue({ rows: [], count: 50 });

      await auditController.getLogs(req, res);

      const callArgs = ActivityLog.findAndCountAll.mock.calls[0][0];
      expect(callArgs.offset).toBe(30); // (3-1) * 15
      expect(callArgs.limit).toBe(15);
      
      const response = res._getJSONData();
      expect(response.data.pagination.currentPage).toBe(3);
      expect(response.data.pagination.totalPages).toBe(4); // Math.ceil(50/15)
    });

    it('debe manejar errores de base de datos correctamente', async () => {
      const errorMsg = 'Error de conexión DB simulado';
      ActivityLog.findAndCountAll.mockRejectedValue(new Error(errorMsg));

      await auditController.getLogs(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData().success).toBe(false);
      expect(res._getJSONData().message).toBe('Error al obtener logs de auditoría');
    });

    it('debe incluir información del usuario en los logs', async () => {
      const mockLogs = {
        rows: [{ 
          id: 1, 
          accion: 'LOGIN',
          usuario: { nombre: 'Juan Pérez', email: 'juan@test.com' }
        }],
        count: 1
      };
      ActivityLog.findAndCountAll.mockResolvedValue(mockLogs);

      await auditController.getLogs(req, res);

      const callArgs = ActivityLog.findAndCountAll.mock.calls[0][0];
      expect(callArgs.include).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            as: 'usuario',
            attributes: ['id', 'nombre', 'email']
          })
        ])
      );
    });
  });

  describe('GET /api/audit/export', () => {
    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/audit/export',
        query: {}
      });
    });

    it('debe exportar logs a CSV correctamente', async () => {
      const mockLogs = [
        {
          id: 1,
          accion: 'LOGIN',
          descripcion: 'Usuario inició sesión',
          usuario: { nombre: 'Juan Pérez' },
          entidad_tipo: 'Usuario',
          entidad_id: 1,
          ip_address: '192.168.1.1',
          createdAt: new Date('2025-11-22')
        }
      ];
      ActivityLog.findAll.mockResolvedValue(mockLogs);

      await auditController.exportLogs(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.getHeader('content-type')).toBe('text/csv; charset=utf-8');
      expect(res.getHeader('content-disposition')).toMatch(/attachment; filename="audit_logs_/);
    });

    it('debe aplicar filtros en la exportación', async () => {
      req.query = {
        accion: 'UPLOAD',
        fecha_inicio: '2025-11-01'
      };

      ActivityLog.findAll.mockResolvedValue([]);

      await auditController.exportLogs(req, res);

      const callArgs = ActivityLog.findAll.mock.calls[0][0];
      expect(callArgs.where).toHaveProperty('accion');
      expect(callArgs.where).toHaveProperty('createdAt');
    });
  });

  describe('GET /api/audit/stats', () => {
    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/audit/stats',
        query: {}
      });
    });

    it('debe retornar estadísticas de auditoría', async () => {
      // Mock para accionesMasComunes
      const mockAcciones = [
        { accion: 'LOGIN', count: '15' },
        { accion: 'FILE_UPLOAD', count: '8' },
        { accion: 'FILE_DELETE', count: '3' }
      ];

      // Mock para usuariosMasActivos
      const mockUsuarios = [
        { usuario_id: 1, count: '10', usuario: { nombre: 'Juan', email: 'juan@test.com' } }
      ];

      // Mock para logsPorDia
      const mockLogsPorDia = [
        { fecha: '2025-11-20', count: '5' },
        { fecha: '2025-11-21', count: '8' }
      ];

      // Configurar los mocks en el orden que se llaman
      ActivityLog.findAll
        .mockResolvedValueOnce(mockAcciones)  // accionesMasComunes
        .mockResolvedValueOnce(mockUsuarios)  // usuariosMasActivos
        .mockResolvedValueOnce(mockLogsPorDia); // logsPorDia

      ActivityLog.count.mockResolvedValue(26); // totalLogs

      await auditController.getStats(req, res);

      expect(res.statusCode).toBe(200);
      const response = res._getJSONData();
      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('totalLogs', 26);
      expect(response.data).toHaveProperty('accionesMasComunes');
      expect(response.data).toHaveProperty('usuariosMasActivos');
      expect(response.data).toHaveProperty('logsPorDia');
    });
  });

  describe('Validaciones y edge cases', () => {
    it('debe manejar parámetros inválidos graciosamente', async () => {
      req.query = {
        page: 'invalid',
        limit: 'invalid',
        fecha_inicio: 'invalid-date'
      };

      ActivityLog.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });

      await auditController.getLogs(req, res);

      expect(res.statusCode).toBe(200);
      // Debe usar valores por defecto para parámetros inválidos
    });

    it('debe limitar el número máximo de resultados', async () => {
      req.query.limit = '1000';

      ActivityLog.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });

      await auditController.getLogs(req, res);

      const callArgs = ActivityLog.findAndCountAll.mock.calls[0][0];
      // Debe limitar a un máximo (ej: 100)
      expect(callArgs.limit).toBeLessThanOrEqual(100);
    });
  });
});