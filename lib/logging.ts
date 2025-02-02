interface LoggingOptions {
    service: string
    component: string
    environment?: string
  }
  
  interface LogData {
    [key: string]: any
  }
  
  export class Logging {
    private service: string
    private component: string
    private environment: string
  
    constructor(options: LoggingOptions) {
      this.service = options.service
      this.component = options.component
      this.environment = options.environment || process.env.NODE_ENV || 'development'
    }
  
    private formatMessage(level: string, message: string, data?: LogData) {
      const timestamp = new Date().toISOString()
      const logData = {
        timestamp,
        level,
        service: this.service,
        component: this.component,
        environment: this.environment,
        message,
        ...data
      }
  
      return JSON.stringify(logData)
    }
  
    info(message: string, data?: LogData) {
      console.log(this.formatMessage('INFO', message, data))
    }
  
    warn(message: string, data?: LogData) {
      console.warn(this.formatMessage('WARN', message, data))
    }
  
    error(message: string, data?: LogData) {
      console.error(this.formatMessage('ERROR', message, data))
    }
  
    debug(message: string, data?: LogData) {
      if (this.environment === 'development') {
        console.debug(this.formatMessage('DEBUG', message, data))
      }
    }
  }