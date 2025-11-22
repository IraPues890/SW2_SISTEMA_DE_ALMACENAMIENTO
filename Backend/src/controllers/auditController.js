const { ActivityLog, Usuario } = require('../db/models');
const { Op, fn, col } = require('sequelize');

class AuditController {
  // GET /api/audit/logs - Obtener todos los logs con filtros
  async getLogs(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        accion,
        usuario_id,
        fecha_inicio,
        fecha_fin,
        prioridad,
        entidad_tipo,
        search
      } = req.query;

      // Validar y limitar parámetros
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20)); // Límite máximo de 100
      const offset = (pageNum - 1) * limitNum;
      const where = {};

      // Filtros
      if (accion) {
        where.accion = { [Op.iLike]: `%${accion}%` };
      }

      if (usuario_id) {
        where.usuario_id = usuario_id;
      }

      if (fecha_inicio || fecha_fin) {
        where.createdAt = {};
        if (fecha_inicio) {
          where.createdAt[Op.gte] = new Date(fecha_inicio);
        }
        if (fecha_fin) {
          where.createdAt[Op.lte] = new Date(fecha_fin + ' 23:59:59');
        }
      }

      if (prioridad) {
        where.prioridad = prioridad;
      }

      if (entidad_tipo) {
        where.entidad_tipo = entidad_tipo;
      }

      // Búsqueda global en descripción
      if (search) {
        where[Op.or] = [
          { descripcion: { [Op.iLike]: `%${search}%` } },
          { accion: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { rows: logs, count: total } = await ActivityLog.findAndCountAll({
        where,
        attributes: [
          'id', 'usuario_id', 'accion', 'descripcion', 
          'entidad_tipo', 'entidad_id', 'prioridad', 
          'ip_address', 'user_agent', 'metadata', 'createdAt'
        ],
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nombre', 'email'],
            required: false
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: limitNum,
        offset: offset,
        distinct: true
      });

      const totalPages = Math.ceil(total / limitNum);

      res.json({
        success: true,
        data: {
          logs,
          pagination: {
            currentPage: pageNum,
            totalPages,
            totalRecords: total,
            hasNext: pageNum < totalPages,
            hasPrev: pageNum > 1
          }
        }
      });

    } catch (error) {
      console.error('Error getting audit logs:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener logs de auditoría',
        error: error.message
      });
    }
  }

  // GET /api/audit/stats - Estadísticas de auditoría
  async getStats(req, res) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;
      
      const whereDate = {};
      if (fecha_inicio || fecha_fin) {
        whereDate.createdAt = {};
        if (fecha_inicio) {
          whereDate.createdAt[Op.gte] = new Date(fecha_inicio);
        }
        if (fecha_fin) {
          whereDate.createdAt[Op.lte] = new Date(fecha_fin + ' 23:59:59');
        }
      }

      // Estadísticas por acción
      const accionesMasComunes = await ActivityLog.findAll({
        where: whereDate,
        attributes: [
          'accion',
          [fn('COUNT', col('accion')), 'count']
        ],
        group: ['accion'],
        order: [[fn('COUNT', col('accion')), 'DESC']],
        limit: 10
      });

      // Estadísticas por usuario más activo
      const usuariosMasActivos = await ActivityLog.findAll({
        where: whereDate,
        attributes: [
          'usuario_id',
          [fn('COUNT', col('usuario_id')), 'count']
        ],
        include: [{
          model: Usuario,
          as: 'usuario',
          attributes: ['nombre', 'email']
        }],
        group: ['usuario_id', 'usuario.id'],
        order: [[fn('COUNT', col('usuario_id')), 'DESC']],
        limit: 10
      });

      // Total de logs en el período
      const totalLogs = await ActivityLog.count({ where: whereDate });

      // Logs por día (últimos 7 días)
      const logsPorDia = await ActivityLog.findAll({
        where: {
          ...whereDate,
          createdAt: {
            [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        attributes: [
          [fn('DATE', col('createdAt')), 'fecha'],
          [fn('COUNT', '*'), 'count']
        ],
        group: [fn('DATE', col('createdAt'))],
        order: [[fn('DATE', col('createdAt')), 'ASC']]
      });

      res.json({
        success: true,
        data: {
          totalLogs,
          accionesMasComunes,
          usuariosMasActivos,
          logsPorDia
        }
      });

    } catch (error) {
      console.error('Error getting audit stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas de auditoría'
      });
    }
  }

  // GET /api/audit/export - Exportar logs a CSV
  async exportLogs(req, res) {
    try {
      const {
        accion,
        usuario_id,
        fecha_inicio,
        fecha_fin
      } = req.query;

      const where = {};

      // Aplicar mismos filtros que getLogs
      if (accion) where.accion = { [Op.iLike]: `%${accion}%` };
      if (usuario_id) where.usuario_id = usuario_id;
      
      if (fecha_inicio || fecha_fin) {
        where.createdAt = {};
        if (fecha_inicio) where.createdAt[Op.gte] = new Date(fecha_inicio);
        if (fecha_fin) where.createdAt[Op.lte] = new Date(fecha_fin + ' 23:59:59');
      }

      const logs = await ActivityLog.findAll({
        where,
        attributes: [
          'id', 'usuario_id', 'accion', 'descripcion', 
          'entidad_tipo', 'entidad_id', 'prioridad', 
          'ip_address', 'user_agent', 'metadata', 'createdAt'
        ],
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['nombre', 'email']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      // Convertir a CSV
      const csvHeader = 'Fecha,Usuario,Email,Acción,Descripción,Entidad,IP\n';
      const csvData = logs.map(log => {
        const fecha = log.createdAt.toISOString().slice(0, 19).replace('T', ' ');
        const usuario = log.usuario ? log.usuario.nombre : 'N/A';
        const email = log.usuario ? log.usuario.email : 'N/A';
        const entidad = log.entidad_tipo ? `${log.entidad_tipo} (ID: ${log.entidad_id || 'N/A'})` : 'N/A';
        
        return `"${fecha}","${usuario}","${email}","${log.accion}","${log.descripcion}","${entidad}","${log.ip_address}"`;
      }).join('\n');

      const csv = csvHeader + csvData;

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="audit_logs_${Date.now()}.csv"`);
      res.send('\uFEFF' + csv); // BOM para UTF-8

    } catch (error) {
      console.error('Error exporting audit logs:', error);
      res.status(500).json({
        success: false,
        message: 'Error al exportar logs'
      });
    }
  }
}

module.exports = new AuditController();