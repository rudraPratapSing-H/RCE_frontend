// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { sanitizeProblemHtml } from './htmlSanitizer';

describe('sanitizeProblemHtml', () => {
  it('keeps allowed formatting tags', () => {
    const input = '<p>Hello <strong>World</strong></p>';
    const output = sanitizeProblemHtml(input);

    expect(output).toContain('<p>Hello <strong>World</strong></p>');
  });

  it('removes script tags', () => {
    const input = '<p>Safe</p><script>alert("xss")</script>';
    const output = sanitizeProblemHtml(input);

    expect(output).toContain('<p>Safe</p>');
    expect(output).not.toContain('<script>');
    expect(output).not.toContain('alert("xss")');
  });

  it('removes inline event handlers', () => {
    const input = '<img src="x" onerror="alert(1)"><p>Body</p>';
    const output = sanitizeProblemHtml(input);

    expect(output).not.toContain('onerror');
    expect(output).toContain('<p>Body</p>');
  });

  it('removes javascript URLs from links', () => {
    const input = '<a href="javascript:alert(1)">Click</a>';
    const output = sanitizeProblemHtml(input);

    expect(output).toContain('<a>Click</a>');
    expect(output).not.toContain('javascript:');
  });
});
