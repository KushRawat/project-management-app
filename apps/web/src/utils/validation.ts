export function validatePassword(pw: string) {
  const errors: string[] = [];
  if (pw.length < 6) errors.push('Must be ≥6 chars');
  if (!/[a-z]/.test(pw)) errors.push('Missing lowercase');
  if (!/[A-Z]/.test(pw)) errors.push('Missing uppercase');
  if (!/[0-9]/.test(pw)) errors.push('Missing digit');
  if (!/[^A-Za-z0-9]/.test(pw)) errors.push('Missing special char');
  return { valid: errors.length === 0, errors };
}
