export type SecretFormat = 'base64' | 'hex';

export interface GenerateSecretOptions {
  bytes: number;
  format: SecretFormat;
}

export interface GeneratedSecret {
  value: string;
  format: SecretFormat;
  bytes: number;
  generatedAt: number;
}

export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

export interface GeneratedPassword {
  value: string;
  entropy: number;
  options: PasswordOptions;
}

export interface Base64Result {
  value: string;
  bytes: number;
  generatedAt: number;
}

export interface UUIDResult {
  value: string;
  version: 4;
  generatedAt: number;
}
