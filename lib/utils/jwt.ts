export interface JwtParts {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  rawHeader: string;
  rawPayload: string;
  rawSignature: string;
  isValidStructure: boolean;
}

export function extractJwt(input: string): string | null {
  const trimmed = input.trim();
  
  const directJwtRegex = /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/;
  if (directJwtRegex.test(trimmed)) {
    return trimmed;
  }

  const bearerRegex = /(?:Bearer\s+|Authorization:\s*Bearer\s+)([a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+)/i;
  const bearerMatch = trimmed.match(bearerRegex);
  if (bearerMatch) {
    return bearerMatch[1];
  }

  const curlRegex = /(?:-H|--header)\s+["']Authorization:\s*Bearer\s+([a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+)["']/i;
  const curlMatch = trimmed.match(curlRegex);
  if (curlMatch) {
    return curlMatch[1];
  }

  try {
    const parsed = JSON.parse(trimmed);
    const foundToken = findJwtInObject(parsed);
    if (foundToken) return foundToken;
  } catch (e) {
  }

  const genericRegex = /([a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+)/;
  const genericMatch = trimmed.match(genericRegex);
  if (genericMatch) {
    return genericMatch[1];
  }

  return null;
}

function findJwtInObject(obj: unknown): string | null {
  if (typeof obj === 'string') {
    const directJwtRegex = /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/;
    if (directJwtRegex.test(obj)) return obj;
    const bearerRegex = /Bearer\s+([a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+)/i;
    const match = obj.match(bearerRegex);
    if (match) return match[1];
  } else if (typeof obj === 'object' && obj !== null) {
    for (const value of Object.values(obj)) {
      const result = findJwtInObject(value);
      if (result) return result;
    }
  }
  return null;
}

export function decodeJwt(token: string): JwtParts | null {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  try {
    const [rawHeader, rawPayload, rawSignature] = parts;
    const headerStr = base64UrlDecode(rawHeader);
    const payloadStr = base64UrlDecode(rawPayload);

    return {
      header: JSON.parse(headerStr),
      payload: JSON.parse(payloadStr),
      signature: rawSignature,
      rawHeader,
      rawPayload,
      rawSignature,
      isValidStructure: true,
    };
  } catch (e) {
    return null;
  }
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

export async function verifySignature(
  token: string,
  secretOrPublicKey: string,
  algorithm: string
): Promise<{ isValid: boolean; message: string }> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return { isValid: false, message: 'Malformed token' };
  }

  const [header, payload, signature] = parts;
  const dataToVerify = `${header}.${payload}`;

  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(dataToVerify);
    const signatureBuffer = base64UrlToBuffer(signature);

    if (algorithm.toUpperCase() === 'HS256') {
      if (!secretOrPublicKey) {
        return { isValid: false, message: 'Secret key is required for HS256' };
      }
      
      const keyBuffer = encoder.encode(secretOrPublicKey);
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'HMAC', hash: { name: 'SHA-256' } },
        false,
        ['verify']
      );

      const isValid = await crypto.subtle.verify(
        'HMAC',
        cryptoKey,
        signatureBuffer,
        dataBuffer
      );

      return {
        isValid,
        message: isValid ? 'Signature verified successfully!' : 'Invalid signature',
      };
    } else if (algorithm.toUpperCase() === 'RS256') {
      if (!secretOrPublicKey) {
        return { isValid: false, message: 'Public key (PEM format) is required for RS256' };
      }

      const pemContents = secretOrPublicKey
        .replace(/-----BEGIN PUBLIC KEY-----/, '')
        .replace(/-----END PUBLIC KEY-----/, '')
        .replace(/\s/g, '');

      const keyBuffer = base64ToBuffer(pemContents);
      const cryptoKey = await crypto.subtle.importKey(
        'spki',
        keyBuffer,
        { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' } },
        false,
        ['verify']
      );

      const isValid = await crypto.subtle.verify(
        'RSASSA-PKCS1-v1_5',
        cryptoKey,
        signatureBuffer,
        dataBuffer
      );

      return {
        isValid,
        message: isValid ? 'Signature verified successfully!' : 'Invalid signature',
      };
    }

    return { isValid: false, message: `Algorithm ${algorithm} signature verification is unsupported in this browser helper` };
  } catch (e) {
    const error = e as Error;
    return { isValid: false, message: `Verification failed: ${error.message}` };
  }
}

function base64UrlToBuffer(base64url: string): ArrayBuffer {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const buffer = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    buffer[i] = binary.charCodeAt(i);
  }
  return buffer.buffer;
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const buffer = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    buffer[i] = binary.charCodeAt(i);
  }
  return buffer.buffer;
}
