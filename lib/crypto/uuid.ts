import { v4 as uuidv4 } from 'uuid';
import { UUIDResult } from '@/types/crypto';

export function generateUUID(): UUIDResult {
  return {
    value: uuidv4(),
    version: 4,
    generatedAt: Date.now(),
  };
}

export function generateMultipleUUIDs(count: number): UUIDResult[] {
  const results: UUIDResult[] = [];
  for (let i = 0; i < count; i++) {
    results.push(generateUUID());
  }
  return results;
}
