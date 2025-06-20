import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createPostRoutes } from './frameworks-drivers/web/routes/postRoutes';
import { errorHandler } from './frameworks-drivers/web/middleware/errorHandler';
import { migrate } from './frameworks-drivers/database/migrate';

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de middlewares de seguridad
app.use(helmet());
// Configuración de CORS más flexible para desarrollo
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Permitir requests sin origin (por ejemplo, aplicaciones móviles, Postman)
    if (!origin) return callback(null, true);
    
    // Lista de orígenes permitidos
    const allowedOrigins = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      process.env.CORS_ORIGIN
    ].filter(Boolean);
    
    // Verificar si el origen está permitido
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`⚠️ CORS: Origen no permitido: ${origin}`);
      // En desarrollo, permitir todos los orígenes localhost
      if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
        callback(null, true);
      } else {
        callback(new Error('No permitido por CORS'), false);
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};

app.use(cors(corsOptions));

// Middlewares para parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging para desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
  });
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    estado: 'ok', 
    timestamp: new Date().toISOString(),
    entorno: process.env.NODE_ENV || 'development'
  });
});

// Inicialización asíncrona del servidor
async function startServer(): Promise<void> {
  try {
    // Ejecutar migraciones
    console.log('🔄 Ejecutando migraciones de base de datos...');
    await migrate();

    // Configurar rutas
    console.log('🔄 Configurando rutas...');
    const postRoutes = await createPostRoutes();
    app.use('/api/posts', postRoutes);

    // Middleware de manejo de errores (debe ir al final)
    app.use(errorHandler);

    // Manejo de rutas no encontradas
    app.use('*', (req, res) => {
      res.status(404).json({ 
        error: 'Ruta no encontrada',
        ruta: req.originalUrl 
      });
    });

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📝 URL base de la API: http://localhost:${PORT}/api/posts`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada en:', promise, 'razón:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Excepción no capturada:', error);
  process.exit(1);
});

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT recibido, cerrando servidor gracefully...');
  process.exit(0);
});

// Iniciar el servidor
startServer(); 