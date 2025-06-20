# Posts Manager - Clean Architecture Implementation

## 🏗️ Arquitectura

Este proyecto implementa Clean Architecture con principios SOLID para demostrar mejores prácticas en desarrollo full-stack.

### Estructura de Capas

```
┌─────────────────────────────────────┐
│     Frameworks & Drivers Layer      │ ← React Components, Express Routes, SQLite
├─────────────────────────────────────┤
│    Interface Adapters Layer         │ ← Controllers, Presenters, Redux Slices
├─────────────────────────────────────┤
│      Use Cases Layer                │ ← Business Logic: CreatePost, DeletePost, ListPosts
├─────────────────────────────────────┤
│       Entities Layer                │ ← Core Domain: Post Entity, Business Rules
└─────────────────────────────────────┘
```

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 18+
- npm o yarn

### 🌟 Opción 1: Ejecución Simultánea (Recomendado)

#### Instalación inicial:
```bash
npm run setup
```

#### Ejecutar backend y frontend simultáneamente:
```bash
npm run dev
```

#### Usando scripts de conveniencia:
```bash
# En Windows
./dev.bat

# En Linux/Mac
./dev.sh
```

### 🐳 Opción 3: Usando Docker (Opcional)
```bash
docker-compose up
```

### 🔧 Opción 4: Usando Make (Linux/Mac)
```bash
make help    # Ver todos los comandos disponibles
make setup   # Instalar dependencias
make dev     # Ejecutar en modo desarrollo
```

### 📋 Opción 2: Ejecución Manual Separada

#### Backend (API)
```bash
cd backend
npm install
npm run migrate
npm run dev
```

#### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

### 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev                    # Ejecuta backend + frontend simultáneamente
npm run backend:dev            # Solo backend en modo desarrollo
npm run frontend:dev           # Solo frontend en modo desarrollo

# Producción
npm run start                  # Ejecuta backend + frontend en modo producción
npm run build                  # Construye ambos proyectos

# Testing
npm run test                   # Ejecuta tests en ambos proyectos
npm run backend:test           # Solo tests del backend
npm run frontend:test          # Solo tests del frontend

# Utilidades
npm run setup                  # Instala dependencias en ambos proyectos
npm run clean                  # Limpia node_modules y archivos build
npm run fresh-install          # Limpia e instala dependencias nuevamente
npm run health                 # Verifica si el backend está funcionando
npm run lint                   # Ejecuta linting en ambos proyectos
npm run type-check             # Verifica tipos TypeScript en ambos proyectos
```

### URLs de la Aplicación
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## ✨ Funcionalidades

- ✅ **Crear posts** con validación en tiempo real
- ✅ **Eliminar posts** con confirmación
- ✅ **Listar posts** ordenados por fecha (más recientes primero)
- ✅ **Filtrar posts** por nombre localmente
- ✅ **Validación de datos** en frontend y backend
- ✅ **Manejo de errores** robusto
- ✅ **Interfaz responsive** y moderna
- ✅ **Arquitectura escalable** y mantenible

## 🏛️ Principios SOLID Aplicados

### **S**ingle Responsibility Principle
- Cada clase tiene una única responsabilidad
- `PostController` solo maneja peticiones HTTP
- `CreatePostUseCase` solo maneja la lógica de creación
- `PostRepository` solo maneja persistencia

### **O**pen-Closed Principle
- Extensible sin modificar código existente
- Nuevos validadores se pueden agregar sin cambiar existentes
- Nuevas implementaciones de repositorio son intercambiables

### **L**iskov Substitution Principle
- `SqlitePostRepository` es completamente intercambiable con cualquier otra implementación
- Los casos de uso funcionan con cualquier implementación del repositorio

### **I**nterface Segregation Principle
- Interfaces específicas y focalizadas
- `PostRepository` solo define operaciones necesarias
- `ValidationError` solo maneja errores de validación

### **D**ependency Inversion Principle
- Casos de uso dependen de abstracciones, no implementaciones
- Inyección de dependencias en todos los niveles
- Fácil testing con mocks

## 📂 Estructura del Proyecto

```
TCIT-Proceso-Seleccion-202506/
├── backend/                          # API Node.js
│   ├── src/
│   │   ├── domain/                   # Entidades y reglas de negocio
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   │   └── value-objects/
│   │   ├── use-cases/                # Lógica de aplicación
│   │   ├── interface-adapters/       # Controladores y presentadores
│   │   │   ├── controllers/
│   │   │   ├── presenters/
│   │   │   └── repositories/
│   │   ├── frameworks-drivers/       # Express, SQLite, rutas
│   │   │   ├── web/
│   │   │   └── database/
│   │   └── shared/                   # Utilidades compartidas
│   ├── package.json
│   └── tsconfig.json
├── frontend/                         # React + Redux
│   ├── src/
│   │   ├── domain/                   # Entidades del lado cliente
│   │   ├── use-cases/                # Lógica de aplicación frontend
│   │   ├── interface-adapters/       # Redux, repositorios API
│   │   ├── frameworks-drivers/       # React components, HTTP client
│   │   │   ├── ui/
│   │   │   ├── http/
│   │   │   └── state/
│   │   └── shared/                   # Tipos y utilidades
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** con TypeScript
- **Express.js** para API REST
- **SQLite** con driver nativo
- **UUID** para generación de IDs
- **CORS** y **Helmet** para seguridad

### Frontend
- **React 18** con TypeScript
- **Redux Toolkit** para gestión de estado
- **Axios** para peticiones HTTP
- **Vite** como bundler
- **CSS moderno** con variables y Grid

### DevOps & Tooling
- **TypeScript** estricto en ambos proyectos
- **ESLint** para calidad de código
- **Path aliases** para imports limpios
- **Error boundaries** para manejo de errores
- **Responsive design** para móviles

## 📋 API Endpoints

### Posts
- `GET /api/posts` - Obtener todos los posts
- `POST /api/posts` - Crear nuevo post
- `DELETE /api/posts/:id` - Eliminar post por ID

### Otros
- `GET /health` - Health check del servidor

### Ejemplo de Requests

**Crear Post:**
```bash
curl -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -d '{"name": "Mi Post", "description": "Descripción del post"}'
```

**Obtener Posts:**
```bash
curl http://localhost:3001/api/posts
```

## 🧪 Testing

El proyecto está preparado para testing con:

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

### Estrategias de Testing
- **Unit tests** para casos de uso
- **Integration tests** para API endpoints
- **Component tests** para React components
- **Mocks** para dependencias externas

## 🎯 Patrones de Diseño Implementados

### Repository Pattern
- Abstrae la persistencia de datos
- Facilita el testing con mocks
- Permite cambiar de SQLite a cualquier otra BD

### Use Case Pattern
- Encapsula la lógica de negocio
- Un caso de uso por operación
- Fácil testing y mantenimiento

### Dependency Injection
- Constructor injection en clases
- Factory pattern para configuración
- Thunk middleware para Redux

### Error Handling
- Custom domain errors
- Global error boundaries
- Consistent error responses

## 🔧 Configuración del Entorno

### Variables de Entorno

**Backend (.env):**
```
PORT=3001
NODE_ENV=development
DATABASE_PATH=./database.sqlite
CORS_ORIGIN=http://localhost:5173
```

**Frontend:**
```
VITE_API_BASE_URL=http://localhost:3001
```

## 🌟 Características Destacadas

### Clean Architecture
- **Independencia de frameworks**: La lógica de negocio no depende de React o Express
- **Independencia de UI**: Se puede cambiar React por Vue sin afectar casos de uso
- **Independencia de BD**: Se puede cambiar SQLite por PostgreSQL sin modificar casos de uso
- **Testabilidad**: Cada capa se puede testear independientemente

### Experiencia de Usuario
- **Interfaz moderna** con diseño responsive
- **Validación en tiempo real** con feedback visual
- **Loading states** para mejor UX
- **Error handling** elegante con recovery options
- **Filtrado instantáneo** sin llamadas adicionales al servidor
- **Totalmente en español** - Aplicación diseñada para desarrolladores hispanohablantes

### Desarrollo
- **Hot reload** en desarrollo
- **TypeScript estricto** para safety
- **Path aliases** para imports limpios
- **Error boundaries** para debugging
- **Logging structurado** para monitoring
- **Mensajes de error en español** en toda la aplicación

## 📈 Escalabilidad

Esta arquitectura permite:

### Horizontal Scaling
- **Microservicios**: Cada caso de uso puede ser un servicio independiente
- **Event sourcing**: Fácil implementación de eventos de dominio
- **CQRS**: Separación de commands y queries

### Vertical Scaling
- **Nuevas features**: Solo agregar nuevos casos de uso
- **Nuevas UIs**: Web, mobile, desktop usando los mismos casos de uso
- **Nuevas BDs**: Solo cambiar la implementación del repositorio

## 👥 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

---

**Desarrollado con ❤️ siguiendo principios de Clean Architecture y SOLID**
