import app from './app';
import { connectDB } from './config/database';
import { ENV } from './config/env';
import { logger } from './utils/logger';

async function bootstrap(): Promise<void> {
  try {
    await connectDB();
    
    const server = app.listen(ENV.PORT, () => {
      logger.info(`
╔══════════════════════════════════════╗
║       Hotel The Anand API            ║
║    Server running on port ${ENV.PORT}        ║
║    Environment: ${ENV.NODE_ENV}           ║
╚══════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Promise Rejection:', reason);
      server.close(() => process.exit(1));
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      server.close(() => process.exit(1));
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();