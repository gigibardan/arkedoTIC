export const DEFAULT_TEACHER_PASS_SHA256 =
  'c25e0d996798e499b9b7907a556e10b8432d9dc35c32449f1215da452464f533';

export const DEFAULT_ADMIN_PASS_SHA256_LIST = [
  'c25e0d996798e499b9b7907a556e10b8432d9dc35c32449f1215da452464f533',
  'de880b06b911831254cb9f2e1eba01acf2ac4fbdc0fcdbb3fc463f15a9c92945',
];

const SHA256_HEX_REGEX = /^[a-f0-9]{64}$/;

export async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function matchesHashOrPlain(input: string, envValue: string): Promise<boolean> {
  const trimmedLower = envValue.trim().toLowerCase();
  if (SHA256_HEX_REGEX.test(trimmedLower)) {
    const computed = await sha256Hex(input);
    return computed === trimmedLower;
  }
  return input === envValue || input === envValue.trim();
}

export async function verifyTeacherCredential(input: string): Promise<boolean> {
  const envPlain = import.meta.env.VITE_TEACHER_PASSWORD as string | undefined;
  if (envPlain && envPlain.trim().length > 0) {
    return input === envPlain || input === envPlain.trim();
  }
  const envHashOrPass = import.meta.env.VITE_TEACHER_PASS_HASH as string | undefined;
  if (envHashOrPass && envHashOrPass.trim().length > 0) {
    return matchesHashOrPlain(input, envHashOrPass);
  }
  const computed = await sha256Hex(input);
  return computed === DEFAULT_TEACHER_PASS_SHA256;
}

export async function verifySuperAdminRecoveryCredential(input: string): Promise<boolean> {
  const envPlain = import.meta.env.VITE_SUPERADMIN_PASSWORD as string | undefined;
  if (envPlain && envPlain.trim().length > 0) {
    return input === envPlain || input === envPlain.trim();
  }
  const envHashOrPass = import.meta.env.VITE_SUPERADMIN_PASS_HASH as string | undefined;
  if (envHashOrPass && envHashOrPass.trim().length > 0) {
    return matchesHashOrPlain(input, envHashOrPass);
  }
  const computed = await sha256Hex(input);
  return DEFAULT_ADMIN_PASS_SHA256_LIST.includes(computed);
}
