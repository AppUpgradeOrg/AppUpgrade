import { IEnvironment } from '../types';

export class Environment implements IEnvironment {
  public has(key: string): boolean {
    return process.env[key] !== undefined;
  }

  public getString(key: string): string | undefined {
    return process.env[key];
  }

  public expectString(key: string): string {
    const value = this.getString(key);
    if (value === undefined) {
      throw new Error(`Expected value for key=${key}, but none found.`);
    }

    return value;
  }

  public getBoolean(key: string): boolean | undefined {
    const value = this.getString(key);
    if (value === undefined) return undefined;

    const lowerCasedTrimmedValue = value.toLowerCase().trim();

    if (lowerCasedTrimmedValue === 'true') return true;
    if (lowerCasedTrimmedValue === 'false') return false;

    throw new Error(`Failed to parse key ${key} value ${value} into a boolean`);
  }

  public expectBoolean(key: string): boolean {
    const bool = this.getBoolean(key);
    if (bool === undefined) {
      throw new Error(`Expected value for key=${key}, but none found.`);
    }

    return bool;
  }

  public getNumber(key: string): number | undefined {
    const value = this.getString(key);
    if (value === undefined) return undefined;

    const trimmedValue = value.toLowerCase().trim();
    const numericValue = Number(trimmedValue);
    if (isNaN(numericValue)) {
      throw new Error(
        `Failed to parse key=${key} value ${value} into a number`
      );
    }

    return numericValue;
  }

  public expectNumber(key: string): number {
    const num = this.getNumber(key);
    if (num === undefined) {
      throw new Error(`Expected value for key=${key}, but none found.`);
    }

    return num;
  }
}
