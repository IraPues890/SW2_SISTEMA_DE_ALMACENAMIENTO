// Implementación sencilla y legible para compartir carpetas
// Usa el modelo Permiso ya existente para representar accesos compartidos

const { Permiso, Usuario, Carpeta } = require('../db/models');
const AuditService = require('../services/auditService');

async function shareFolder(req, res) {
  try {
    const folderId = req.params.id;
    const { email } = req.body;

    if (!email) return res.status(400).json({ success: false, message: 'Falta email' });

    const carpeta = await Carpeta.findByPk(folderId);
    if (!carpeta) return res.status(404).json({ success: false, message: 'Carpeta no encontrada' });

    // Solo propietario
    if (carpeta.usuario_id !== req.user.id) return res.status(403).json({ success: false, message: 'Solo el propietario puede compartir' });

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

    // Crear permiso simple tipo 'view'
    const permiso = await Permiso.create({
      propietario_id: req.user.id,
      usuario_id: usuario.id,
      carpeta_id: folderId,
      tipo_permiso: 'view',
      activo: true
    });

    // Log de compartir carpeta
    await AuditService.log({
      usuario_id: req.user.id,
      accion: 'share_carpeta',
      descripcion: `Compartió carpeta "${carpeta.nombre}" con ${usuario.nombre} (${email})`,
      entidad_tipo: 'carpeta',
      entidad_id: folderId,
      prioridad: 'info',
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('User-Agent'),
      metadata: { 
        carpeta_nombre: carpeta.nombre,
        usuario_compartido: { id: usuario.id, nombre: usuario.nombre, email },
        tipo_permiso: 'view'
      }
    });

    return res.status(201).json({ success: true, data: permiso });
  } catch (err) {
    console.error('shareFolder:', err.message || err);
    return res.status(500).json({ success: false, message: 'Error compartiendo carpeta' });
  }
}

async function listShared(req, res) {
  try {
    const folderId = req.params.id;
    const carpeta = await Carpeta.findByPk(folderId);
    if (!carpeta) return res.status(404).json({ success: false, message: 'Carpeta no encontrada' });
    if (carpeta.usuario_id !== req.user.id) return res.status(403).json({ success: false, message: 'No autorizado' });

    const permisos = await Permiso.findAll({ where: { carpeta_id: folderId, activo: true } });
    return res.json({ success: true, data: permisos });
  } catch (err) {
    console.error('listShared:', err.message || err);
    return res.status(500).json({ success: false, message: 'Error listando compartidos' });
  }
}

async function revokeShare(req, res) {
  try {
    const { id: folderId, shareId } = req.params;
    const permiso = await Permiso.findByPk(shareId, {
      include: [{ model: Usuario, as: 'usuario' }, { model: Carpeta, as: 'carpeta' }]
    });
    if (!permiso) return res.status(404).json({ success: false, message: 'Permiso no encontrado' });
    
    // Solo el propietario del permiso o propietario de la carpeta
    const carpeta = await Carpeta.findByPk(folderId);
    const isFolderOwner = carpeta && carpeta.usuario_id === req.user.id;
    if (permiso.propietario_id !== req.user.id && !isFolderOwner) return res.status(403).json({ success: false, message: 'No autorizado' });

    // Log antes de revocar
    await AuditService.log({
      usuario_id: req.user.id,
      accion: 'revoke_share_carpeta',
      descripcion: `Revocó acceso compartido de carpeta "${carpeta?.nombre || 'N/A'}"`,
      entidad_tipo: 'carpeta',
      entidad_id: folderId,
      prioridad: 'info',
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('User-Agent'),
      metadata: { 
        permiso_id: shareId,
        carpeta_nombre: carpeta?.nombre,
        usuario_afectado: permiso.usuario?.nombre
      }
    });

    permiso.activo = false;
    await permiso.save();
    return res.status(204).send();
  } catch (err) {
    console.error('revokeShare:', err.message || err);
    return res.status(500).json({ success: false, message: 'Error revocando permiso' });
  }
}

module.exports = { shareFolder, listShared, revokeShare };
