import fs from 'fs';
import path from 'path';

export class SecurityLogger {
  private logFile: string;

  constructor() {
    this.logFile = path.join(__dirname, '../../security.log');
  }

  public log(event: string, details: any): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      event,
      details,
    };

    fs.appendFileSync(this.logFile, JSON.stringify(logEntry) + '\n');
  }

  public getLogEntries(): any[] {
    const content = fs.readFileSync(this.logFile, 'utf-8');
    return content.split('\n')
      .filter(line => line.trim() !== '')
      .map(line => JSON.parse(line));
  }
}