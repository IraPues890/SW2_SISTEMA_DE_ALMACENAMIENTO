npx sequelize db:drop --debug
npx sequelize db:create --debug
npx sequelize db:migrate
npx sequelize db:seed:all

# Comandos para deshacer seeders
npx sequelize db:seed:undo:all
npx sequelize db:seed:undo --seed=20251011000001-carpetas-archivos.js
npx sequelize db:seed:undo --seed=20251012000001-activity-logs.js
npx sequelize db:seed:undo --seed=20251009000002-usuarios.js
npx sequelize db:seed:undo --seed=20251009000001-roles.js

\c ulstorage_db
\dt
\d "Usuarios"
SELECT * FROM "Usuarios";
SELECT 
    id, 
    nombre, 
    email, 
    rol, 
    activo 
FROM "Usuarios" 
ORDER BY rol DESC, nombre;