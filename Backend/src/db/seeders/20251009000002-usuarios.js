'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Hash de contraseñas para los usuarios de prueba
    const saltRounds = 12;
    const defaultPassword = 'UlStorage2025!';
    
    const passwordHash = await bcrypt.hash(defaultPassword, saltRounds);
    
    await queryInterface.bulkInsert('Usuarios', [
      // Administradores (rol_id: 1)
      {
        id: 1,
        nombre: 'Carlos Mendoza',
        email: 'admin@interbank.pe',
        password_hash: passwordHash,
        rol_id: 1,
        activo: true,
        ultimo_login: new Date('2025-10-09T08:30:00Z'),
        createdAt: new Date('2025-09-01T10:00:00Z'),
        updatedAt: new Date('2025-10-09T08:30:00Z')
      },
      {
        id: 2,
        nombre: 'Ana García',
        email: 'ana.garcia@interbank.pe',
        password_hash: passwordHash,
        rol_id: 1,
        activo: true,
        ultimo_login: new Date('2025-10-08T16:45:00Z'),
        createdAt: new Date('2025-09-01T10:15:00Z'),
        updatedAt: new Date('2025-10-08T16:45:00Z')
      },
      {
        id: 3,
        nombre: 'Test Admin',
        email: 'test.admin@interbank.pe',
        password_hash: passwordHash,
        rol_id: 1,
        activo: true,
        ultimo_login: new Date('2025-10-09T11:00:00Z'),
        createdAt: new Date('2025-09-01T08:00:00Z'),
        updatedAt: new Date('2025-10-09T11:00:00Z')
      },
      
      // Usuarios regulares (rol_id: 3 - Viewer)
      {
        id: 4,
        nombre: 'Sandra Vega',
        email: 'sandra.vega@interbank.pe',
        password_hash: passwordHash,
        rol_id: 3,
        activo: true,
        ultimo_login: new Date('2025-10-09T07:45:00Z'),
        createdAt: new Date('2025-09-05T11:30:00Z'),
        updatedAt: new Date('2025-10-09T07:45:00Z')
      },
      {
        id: 5,
        nombre: 'Luis Martínez',
        email: 'luis.martinez@interbank.pe',
        password_hash: passwordHash,
        rol_id: 2, // Editor
        activo: true,
        ultimo_login: new Date('2025-10-08T14:20:00Z'),
        createdAt: new Date('2025-09-05T12:15:00Z'),
        updatedAt: new Date('2025-10-08T14:20:00Z')
      },
      {
        id: 6,
        nombre: 'Patricia Flores',
        email: 'patricia.flores@interbank.pe',
        password_hash: passwordHash,
        rol_id: 3,
        activo: true,
        ultimo_login: new Date('2025-10-09T10:30:00Z'),
        createdAt: new Date('2025-09-06T08:45:00Z'),
        updatedAt: new Date('2025-10-09T10:30:00Z')
      },
      {
        id: 7,
        nombre: 'Jorge Herrera',
        email: 'jorge.herrera@interbank.pe',
        password_hash: passwordHash,
        rol_id: 2, // Editor
        activo: true,
        ultimo_login: new Date('2025-10-07T16:10:00Z'),
        createdAt: new Date('2025-09-06T13:20:00Z'),
        updatedAt: new Date('2025-10-07T16:10:00Z')
      },
      {
        id: 8,
        nombre: 'Carmen Torres',
        email: 'carmen.torres@interbank.pe',
        password_hash: passwordHash,
        rol_id: 3,
        activo: true,
        ultimo_login: new Date('2025-10-08T09:25:00Z'),
        createdAt: new Date('2025-09-07T15:40:00Z'),
        updatedAt: new Date('2025-10-08T09:25:00Z')
      },
      {
        id: 9,
        nombre: 'Roberto Silva',
        email: 'roberto.silva@interbank.pe',
        password_hash: passwordHash,
        rol_id: 3,
        activo: true,
        ultimo_login: new Date('2025-10-09T09:15:00Z'),
        createdAt: new Date('2025-09-02T14:20:00Z'),
        updatedAt: new Date('2025-10-09T09:15:00Z')
      },
      {
        id: 10,
        nombre: 'María López',
        email: 'maria.lopez@interbank.pe',
        password_hash: passwordHash,
        rol_id: 3,
        activo: true,
        ultimo_login: new Date('2025-10-08T18:30:00Z'),
        createdAt: new Date('2025-09-02T14:35:00Z'),
        updatedAt: new Date('2025-10-08T18:30:00Z')
      },
      
      // Usuario inactivo (para pruebas)
      {
        id: 11,
        nombre: 'Usuario Desactivado',
        email: 'usuario.inactivo@interbank.pe',
        password_hash: passwordHash,
        rol_id: 3,
        activo: false,
        ultimo_login: new Date('2025-09-25T12:00:00Z'),
        createdAt: new Date('2025-09-10T16:30:00Z'),
        updatedAt: new Date('2025-09-28T10:15:00Z')
      }
    ], {});
    
    console.log('Seeders de Usuario ejecutados correctamente');
    console.log('Email de prueba: admin@interbank.pe');
    console.log('Contraseña por defecto: UlStorage2025!');
    console.log('Usuarios creados: 11 (3 admins, 8 users)');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Usuarios', {
      email: {
        [Sequelize.Op.in]: [
          'admin@interbank.pe',
          'ana.garcia@interbank.pe',
          'test.admin@interbank.pe',
          'sandra.vega@interbank.pe',
          'luis.martinez@interbank.pe',
          'patricia.flores@interbank.pe',
          'jorge.herrera@interbank.pe',
          'carmen.torres@interbank.pe',
          'roberto.silva@interbank.pe',
          'maria.lopez@interbank.pe',
          'usuario.inactivo@interbank.pe'
        ]
      }
    }, {});
    
    console.log('Seeders de Usuario revertidos correctamente');
  }
};
