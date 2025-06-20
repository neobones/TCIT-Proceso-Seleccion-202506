type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export class Logger {
  private static isDevelopment = import.meta.env.DEV;

  static debug(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  static info(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  static warn(message: string, ...args: unknown[]): void {
    console.warn(`[WARN] ${message}`, ...args);
  }

  static error(message: string, error?: Error, ...args: unknown[]): void {
    console.error(`[ERROR] ${message}`, error, ...args);
  }

  static group(label: string, callback: () => void): void {
    if (this.isDevelopment) {
      console.group(label);
      try {
        callback();
      } finally {
        console.groupEnd();
      }
    }
  }
} 