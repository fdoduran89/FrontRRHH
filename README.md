# FrontRRHH

Descripción General
Sistema de gestión de empleados con operaciones CRUD completas, desarrollado con React y Vite en el frontend, conectado a un backend Django REST Framework. Interfaz moderna, responsiva y con tema oscuro mediante Bootstrap.

Resumen por Fases

Fase Nombre Objetivo Principal Tecnologías Clave Resultado

0 Setup Configurar entorno de desarrollo Vite, pnpm, Bootstrap Servidor en localhost:5173

1 READ Visualizar listado de empleados Axios, react-number-format Tabla interactiva con sueldos formateados

2 CREATE Agregar nuevos empleados react-router-dom, formularios Alta funcional con redirección

3 UPDATE Modificar empleados existentes useParams, PUT Edición con datos precargados

4 DELETE + Búsqueda Eliminar registros y filtrar Filtrado local en tiempo real CRUD completo + buscador instantáneo

Integración con Backend
URL Base: http://127.0.0.1:8080/api/empleados/

Método Endpoint Propósito
GET /api/empleados/ Obtener todos
GET /api/empleados/{id}/ Obtener uno
POST /api/empleados/ Crear
PUT /api/empleados/{id}/ Actualizar
DELETE /api/empleados/{id}/ Eliminar
