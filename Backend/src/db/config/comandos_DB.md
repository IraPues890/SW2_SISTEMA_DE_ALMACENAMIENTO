npx sequelize db:drop --debug
npx sequelize db:create --debug
npx sequelize db:migrate
npx sequelize db:seed:all

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