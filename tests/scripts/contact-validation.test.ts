import { describe, expect, it } from 'vitest';
import { validateContactFields } from '../../src/scripts/contact-validation';

describe('contact-validation', () => {
  it('returns field errors for invalid contact data', () => {
    expect(
      validateContactFields({ name: '', email: 'wrong', message: '' }),
    ).toEqual({
      name: 'required',
      email: 'invalid',
      message: 'required',
    });
  });

  it('accepts a valid email surrounded by spaces', () => {
    expect(
      validateContactFields({
        name: 'Bryan',
        email: ' user@example.com ',
        message: 'Hello',
      }),
    ).toEqual({
      name: undefined,
      email: undefined,
      message: undefined,
    });
  });
});
