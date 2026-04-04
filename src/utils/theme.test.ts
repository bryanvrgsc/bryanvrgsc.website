import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveDocumentTheme } from './theme.ts';

test('uses explicit light theme over dark system preference', () => {
  assert.equal(
    resolveDocumentTheme({
      dataTheme: 'light',
      hasDarkClass: false,
      systemPrefersDark: true
    }),
    'light'
  );
});

test('uses explicit dark theme over light system preference', () => {
  assert.equal(
    resolveDocumentTheme({
      dataTheme: 'dark',
      hasDarkClass: false,
      systemPrefersDark: false
    }),
    'dark'
  );
});

test('treats the dark class as dark theme', () => {
  assert.equal(
    resolveDocumentTheme({
      dataTheme: null,
      hasDarkClass: true,
      systemPrefersDark: false
    }),
    'dark'
  );
});

test('falls back to the system preference when no explicit theme exists', () => {
  assert.equal(
    resolveDocumentTheme({
      dataTheme: null,
      hasDarkClass: false,
      systemPrefersDark: true
    }),
    'dark'
  );
});
