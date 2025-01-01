type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private scope: string;

  constructor(scope: string) {
    this.scope = scope;
  }

  private log(level: LogLevel, message: string, ...args: any[]) {
    console[level](`[${this.scope}] ${message}`, ...args);
  }

  trace(message: string, ...args: any[]) {
    this.log('debug', message, ...args);
  }

  debug(message: string, ...args: any[]) {
    this.log('debug', message, ...args);
  }

  info(message: string, ...args: any[]) {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.log('error', message, ...args);
  }
}

export const createScopedLogger = (scope: string) => new Logger(scope);