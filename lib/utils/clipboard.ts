export async function copyToClipboard(text: string): Promise<void> {
  if (typeof window === 'undefined' || !navigator.clipboard) {
    throw new Error('Clipboard API not available');
  }
  await navigator.clipboard.writeText(text);
}
