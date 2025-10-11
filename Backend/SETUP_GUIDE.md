# 🚀 Sistema de Almacenamiento Multi-Cloud ULStorage

## 📋 Configuración Inicial

### 1. Instalación de Dependencias

```bash
cd Backend
npm install aws-sdk @azure/storage-blob @google-cloud/storage oci-sdk multer jsonwebtoken
```

### 2. Configuración del Archivo .env

Copia el archivo `.env` y configura las credenciales de cada proveedor:

```bash
# Database Configuration
DB_NAME=ulstorage_db
DB_USER=postgres
DB_PASSWORD=tu_password_aqui
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres

# JWT Secret
JWT_SECRET=tu_jwt_secret_super_seguro_aqui_2024

# AWS Configuration
AWS_ACCESS_KEY_ID=tu_aws_access_key
AWS_SECRET_ACCESS_KEY=tu_aws_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=ulstorage-bucket

# Azure Configuration
AZURE_STORAGE_ACCOUNT_NAME=ulstorageaccount
AZURE_STORAGE_ACCESS_KEY=tu_azure_storage_key
AZURE_CONTAINER_NAME=ulstorage-container

# Google Cloud Platform Configuration
GCP_PROJECT_ID=tu-gcp-project-id
GCP_KEY_FILE_PATH=./config/gcp-service-account.json
GCP_BUCKET_NAME=ulstorage-gcp-bucket

# Oracle Cloud Infrastructure Configuration
OCI_USER_ID=ocid1.user.oc1..tu_user_id_aqui
OCI_TENANCY_ID=ocid1.tenancy.oc1..tu_tenancy_id_aqui
OCI_FINGERPRINT=tu:fingerprint:aqui
OCI_PRIVATE_KEY_PATH=./config/oci_private_key.pem
OCI_REGION=us-ashburn-1
OCI_COMPARTMENT_ID=ocid1.compartment.oc1..tu_compartment_id_aqui
OCI_BUCKET_NAME=ulstorage-oci-bucket

# Application Configuration
PORT=3000
NODE_ENV=development
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=100MB
ALLOWED_EXTENSIONS=pdf,doc,docx,txt,jpg,png,gif,zip,rar
```

## 🔐 Configuración de Credenciales por Proveedor

### AWS S3
1. Ve a AWS IAM Console
2. Crea un usuario con permisos de S3
3. Genera Access Key y Secret Key
4. Crea un bucket en S3

### Azure Blob Storage
1. Ve a Azure Portal
2. Crea una Storage Account
3. Obtén el nombre de la cuenta y la clave de acceso
4. Crea un container

### Google Cloud Storage
1. Ve a Google Cloud Console
2. Crea un proyecto
3. Habilita la API de Cloud Storage
4. Crea una cuenta de servicio y descarga el JSON
5. Crea un bucket

### Oracle Cloud Infrastructure
1. Ve a OCI Console
2. Crea un usuario en IAM
3. Genera un par de claves API
4. Configura las políticas necesarias
5. Crea un bucket en Object Storage

## 📁 Estructura de Directorios

```
Backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── fileController.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── fileService.js
│   │   ├── AWS/
│   │   │   ├── awsClient.js
│   │   │   └── awsRepository.js
│   │   ├── AZ/
│   │   │   ├── azureClient.js
│   │   │   └── azureRepository.js
│   │   ├── GCP/
│   │   │   ├── gcpClient.js
│   │   │   └── gcpRepository.js
│   │   └── OCI/
│   │       ├── oracleClient.js
│   │       └── oracleRepository.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── authRoutes.js
│   │   └── fileRoutes.js
│   └── db/
│       └── models/
├── config/
│   ├── gcp-service-account.json (para GCP)
│   └── oci_private_key.pem (para OCI)
├── uploads/ (archivos locales)
└── .env
```

## 🚀 Endpoints de la API

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/profile/:userId` | Obtener perfil |

### Gestión de Archivos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/files/upload` | Subir archivo |
| GET | `/api/files/:id/download` | Descargar archivo |
| DELETE | `/api/files/:id` | Eliminar archivo |
| GET | `/api/files` | Listar archivos |
| GET | `/api/files/search?q=query` | Buscar archivos |
| GET | `/api/files/:id` | Info del archivo |
| PUT | `/api/files/:id/version` | Nueva versión |
| GET | `/api/files/providers/list` | Proveedores |
| GET | `/api/files/stats/storage` | Estadísticas |

## 📝 Ejemplos de Uso

### Subir Archivo

```bash
curl -X POST http://localhost:3000/api/files/upload \
  -H "Authorization: Bearer your_jwt_token" \
  -F "file=@documento.pdf" \
  -F "provider=aws" \
  -F "carpeta_id=1"
```

### Descargar Archivo

```bash
curl -X GET http://localhost:3000/api/files/123/download \
  -H "Authorization: Bearer your_jwt_token" \
  --output archivo_descargado.pdf
```

### Listar Archivos

```bash
curl -X GET "http://localhost:3000/api/files?page=1&limit=10" \
  -H "Authorization: Bearer your_jwt_token"
```

### Buscar Archivos

```bash
curl -X GET "http://localhost:3000/api/files/search?q=documento&page=1" \
  -H "Authorization: Bearer your_jwt_token"
```

## 🛠 Comandos de Desarrollo

### Iniciar el Servidor
```bash
npm start
# o para desarrollo
npm run dev
```

### Ejecutar Migraciones
```bash
npx sequelize-cli db:migrate
```

### Ejecutar Seeders
```bash
npx sequelize-cli db:seed:all
```

## 🔧 Configuración Avanzada

### Variables de Entorno Adicionales

```env
# Configuración de archivos
MAX_FILE_SIZE=100MB              # Tamaño máximo de archivo
ALLOWED_EXTENSIONS=pdf,doc,txt   # Extensiones permitidas
UPLOAD_DIR=./uploads             # Directorio de subida local

# Configuración de JWT
JWT_SECRET=your_secret_key       # Clave secreta para JWT
JWT_EXPIRES_IN=24h               # Tiempo de expiración

# Configuración de CORS
CORS_ORIGIN=http://localhost:5173  # Origen permitido para CORS
```

### Configuración de Buckets/Containers

Asegúrate de crear los buckets/containers en cada proveedor:

- **AWS**: Bucket S3 con permisos de lectura/escritura
- **Azure**: Container en Storage Account
- **GCP**: Bucket en Cloud Storage
- **OCI**: Bucket en Object Storage

## 📊 Monitoreo y Logs

El sistema incluye logging automático de:
- Subidas de archivos
- Descargas
- Errores de proveedores
- Operaciones de base de datos

## 🚨 Solución de Problemas

### Error: "Proveedor no configurado"
- Verifica que las credenciales estén en el archivo `.env`
- Confirma que el bucket/container existe

### Error: "Archivo demasiado grande"
- Ajusta `MAX_FILE_SIZE` en `.env`
- Verifica límites del proveedor de nube

### Error: "Extensión no permitida"
- Modifica `ALLOWED_EXTENSIONS` en `.env`

### Error de conexión a base de datos
- Verifica credenciales de PostgreSQL
- Confirma que el servidor esté ejecutándose

## 📚 Próximas Funcionalidades

- [ ] Compartir archivos entre usuarios
- [ ] Sincronización automática entre proveedores
- [ ] Cifrado de archivos
- [ ] Auditoría completa de operaciones
- [ ] Panel de administración
- [ ] API de webhooks
- [ ] Integración con servicios de terceros

## 🤝 Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📜 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

---

**¡Tu sistema de almacenamiento multi-cloud está listo! 🎉**

Para cualquier duda o problema, revisa la documentación o crea un issue en el repositorio.