const { ActivityLog, Usuario, Archivo } = require('../db/models');
const { Op } = require('sequelize');

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
        search
      } = req.query;

      const offset = (page - 1) * limit;
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

      // Búsqueda global en descripción
      if (search) {
        where[Op.or] = [
          { descripcion: { [Op.iLike]: `%${search}%` } },
          { accion: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { rows: logs, count: total } = await ActivityLog.findAndCountAll({
        where,
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nombre', 'email'],
            required: false
          },
          {
            model: Archivo,
            as: 'archivo',
            attributes: ['id', 'nombre', 'tipo'],
            required: false
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset),
        distinct: true
      });

      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: {
          logs,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalRecords: total,
            hasNext: page < totalPages,
            hasPrev: page > 1
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
          [sequelize.fn('COUNT', sequelize.col('accion')), 'count']
        ],
        group: ['accion'],
        order: [[sequelize.fn('COUNT', sequelize.col('accion')), 'DESC']],
        limit: 10
      });

      // Estadísticas por usuario más activo
      const usuariosMasActivos = await ActivityLog.findAll({
        where: whereDate,
        attributes: [
          'usuario_id',
          [sequelize.fn('COUNT', sequelize.col('usuario_id')), 'count']
        ],
        include: [{
          model: Usuario,
          as: 'usuario',
          attributes: ['nombre', 'email']
        }],
        group: ['usuario_id', 'usuario.id'],
        order: [[sequelize.fn('COUNT', sequelize.col('usuario_id')), 'DESC']],
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
          [sequelize.fn('DATE', sequelize.col('createdAt')), 'fecha'],
          [sequelize.fn('COUNT', '*'), 'count']
        ],
        group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
        order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
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
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['nombre', 'email']
          },
          {
            model: Archivo,
            as: 'archivo',
            attributes: ['nombre']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      // Convertir a CSV
      const csvHeader = 'Fecha,Usuario,Email,Acción,Descripción,Archivo,IP\n';
      const csvData = logs.map(log => {
        const fecha = log.createdAt.toISOString().slice(0, 19).replace('T', ' ');
        const usuario = log.usuario ? log.usuario.nombre : 'N/A';
        const email = log.usuario ? log.usuario.email : 'N/A';
        const archivo = log.archivo ? log.archivo.nombre : 'N/A';
        
        return `"${fecha}","${usuario}","${email}","${log.accion}","${log.descripcion}","${archivo}","${log.ip_address}"`;
      }).join('\n');

      const csv = csvHeader + csvData;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="audit_logs_${Date.now()}.csv"`);
      res.send(csv);

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