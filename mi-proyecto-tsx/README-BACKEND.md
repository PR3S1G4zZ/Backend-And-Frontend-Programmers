# Backend Laravel - API de Autenticación

Este es el backend desarrollado en Laravel para el proyecto de programadores y empresas.

## 🚀 Configuración

### Requisitos
- PHP 8.1+
- Composer
- Laravel 11

### Instalación
```bash
# Instalar dependencias
composer install

# Configurar variables de entorno
cp .env.example .env

# Generar clave de aplicación
php artisan key:generate

# Ejecutar migraciones (cuando esté disponible la base de datos)
php artisan migrate

# Iniciar servidor
php artisan serve --port=8000
```

## 📡 API Endpoints

### Autenticación

#### POST `/api/auth/register`
Registrar un nuevo usuario

**Body:**
```json
{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "user_type": "programmer" // o "company"
}
```

**Respuesta exitosa (201):**
```json
{
    "success": true,
    "message": "Usuario registrado exitosamente",
    "data": {
        "user": {
            "id": 1,
            "name": "Juan Pérez",
            "email": "juan@example.com",
            "user_type": "programmer"
        },
        "token": "1|abc123...",
        "token_type": "Bearer"
    }
}
```

#### POST `/api/auth/login`
Iniciar sesión

**Body:**
```json
{
    "email": "juan@example.com",
    "password": "password123"
}
```

**Respuesta exitosa (200):**
```json
{
    "success": true,
    "message": "Inicio de sesión exitoso",
    "data": {
        "user": {
            "id": 1,
            "name": "Juan Pérez",
            "email": "juan@example.com",
            "user_type": "programmer"
        },
        "token": "1|abc123...",
        "token_type": "Bearer"
    }
}
```

#### POST `/api/auth/logout`
Cerrar sesión (requiere autenticación)

**Headers:**
```
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
    "success": true,
    "message": "Sesión cerrada exitosamente"
}
```

#### GET `/api/auth/user`
Obtener información del usuario autenticado (requiere autenticación)

**Headers:**
```
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
    "success": true,
    "data": {
        "user": {
            "id": 1,
            "name": "Juan Pérez",
            "email": "juan@example.com",
            "user_type": "programmer"
        }
    }
}
```

## 🔧 Configuración del Frontend

Para conectar el frontend React con este backend, actualiza la URL base en tu aplicación:

```javascript
// En tu archivo de configuración del frontend
const API_BASE_URL = 'http://localhost:8000/api';

// Ejemplo de uso
const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        email: 'usuario@example.com',
        password: 'password123'
    })
});
```

## 🛠️ Desarrollo

### Estructura del Proyecto
```
app/
├── Http/
│   └── Controllers/
│       └── AuthController.php    # Controlador de autenticación
├── Models/
│   └── User.php                  # Modelo de usuario
routes/
└── api.php                       # Rutas de la API
```

### Próximos Pasos
1. Configurar base de datos (MySQL/PostgreSQL)
2. Ejecutar migraciones
3. Agregar validaciones adicionales
4. Implementar funcionalidades específicas por tipo de usuario
5. Agregar tests unitarios

## 📝 Notas

- El proyecto está configurado para usar Laravel Sanctum para autenticación API
- CORS está configurado para permitir peticiones desde el frontend
- Los tokens de autenticación se almacenan en la base de datos
- El campo `user_type` permite distinguir entre programadores y empresas

## 🐛 Solución de Problemas

### Error de Base de Datos
Si encuentras errores relacionados con la base de datos:
1. Verifica que PHP tenga los drivers necesarios habilitados
2. Configura una base de datos MySQL o PostgreSQL
3. Actualiza el archivo `.env` con las credenciales correctas

### Error de CORS
Si el frontend no puede comunicarse con el backend:
1. Verifica que el servidor esté ejecutándose en el puerto 8000
2. Asegúrate de que la URL del frontend esté en la configuración de CORS
3. Verifica que las rutas API estén correctamente configuradas
