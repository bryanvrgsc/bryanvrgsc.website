import { afterEach } from 'vitest';

afterEach(() => {
  document.documentElement.className = '';
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('data-performance');
  localStorage.clear();
});
