import { randomInt } from 'node:crypto';

export const INVITE_CODE_PREFIX = 'BB-';
export const INVITE_CODE_LENGTH = 6;

// Tanpa karakter yang mudah tertukar: I, L, O, 0, 1 (31 karakter).
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/** Membuat kode undangan acak, contoh: BB-K7M3QX. */
export function generateInviteCode(length = INVITE_CODE_LENGTH): string {
  let suffix = '';
  for (let i = 0; i < length; i++) {
    suffix += ALPHABET[randomInt(ALPHABET.length)];
  }
  return `${INVITE_CODE_PREFIX}${suffix}`;
}

/** Merapikan input pengguna: hapus spasi tepi dan ubah ke huruf besar. */
export function normalizeInviteCode(code: string): string {
  return code.trim().toUpperCase();
}