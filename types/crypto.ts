export type SecretFormat = 'base64' | 'hex';

export interface GenerateSecretOptions {
  bytes: number; // Jumlah bytes: 16 | 32 | 48 | 64
  format: SecretFormat;
}

export interface GeneratedSecret {
  value: string;
  format: SecretFormat;
  bytes: number;
  generatedAt: number;
}

export interface PasswordOptions {
  length: number; // 8–128
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

export interface GeneratedPassword {
  value: string;
  entropy: number; // Bits of entropy
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
