import { validatePassword } from './validation';

describe('validatePassword', () => {
  it('rejects too short', () => {
    const { valid, errors } = validatePassword('Aa1!');
    expect(valid).toBe(false);
    expect(errors).toContain('Must be ≥6 chars');
  });

  it('requires all classes', () => {
    const { valid, errors } = validatePassword('abcdef');
    expect(valid).toBe(false);
    expect(errors).toEqual(
      expect.arrayContaining([
        'Missing uppercase',
        'Missing digit',
        'Missing special char',
      ]),
    );
  });

  it('accepts a good password', () => {
    const { valid, errors } = validatePassword('Abcde1!');
    expect(valid).toBe(true);
    expect(errors).toHaveLength(0);
  });
});
