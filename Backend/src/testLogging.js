/**
 * SCRIPT DE PRUEBA PARA LOGGING AUTOMÁTICO
 * 
 * Ejecuta este script para verificar que el logging automático funciona
 */

const AuditService = require('./services/auditService');

async function testLogging() {
  console.log('🧪 Probando logging automático...');
  
  try {
    // Simular request object
    const mockReq = {
      ip: '192.168.1.100',
      connection: { remoteAddress: '192.168.1.100' },
      headers: { 'user-agent': 'Test Browser 1.0' },
      get: (header) => header === 'User-Agent' ? 'Test Browser 1.0' : null
    };
    
    // Test log manual
    await AuditService.log({
      usuario_id: 1,
      accion: 'test_logging',
      descripcion: 'Prueba de logging automático',
      entidad_tipo: 'sistema',
      prioridad: 'info',
      ip_address: '192.168.1.100',
      user_agent: 'Test Browser 1.0',
      metadata: { test: true, timestamp: new Date().toISOString() }
    });
    
    // Test log de login exitoso
    await AuditService.logLogin(1, true, mockReq, {
      email: 'test@example.com',
      test_mode: true
    });
    
    // Test log de upload
    await AuditService.logFileUpload(1, 999, 'test_file.pdf', mockReq);
    
    console.log('✅ Logging automático funcionando correctamente');
    console.log('🔍 Revisa los logs en el panel de admin para ver los nuevos registros');
    
  } catch (error) {
    console.error('❌ Error en logging automático:', error);
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  testLogging().then(() => {
    console.log('Test completed');
    process.exit(0);
  }).catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  });
}

module.exports = { testLogging };