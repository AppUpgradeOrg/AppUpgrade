import { IEnvironment } from '../types';

export class Environment implements IEnvironment {
  public has(key: string): boolean {
    return process.env[key] !== undefined;
  }

  public getValue(key: string): string | undefined {
    return process.env[key];
  }

  public expectValue(key: string): string {
    const value = this.getValue(key);
    if (value === undefined) {
      throw new Error(`Expected value for key=${key}, but none found.`);
    }

    return value;
  }
}
