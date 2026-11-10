import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const context = { window: {}, URL, Date };
vm.runInNewContext(readFileSync('js/ui-core.js', 'utf8'), context);
const U = context.window.EOUI;

test('shared source links reject protocols, credentials and deceptive hosts', () => {
  for (const value of [
    'javascript:alert(1)',
    'http://www.oeb.ca/',
    'https://www.oeb.ca.evil.test/',
    'https://user:password@www.oeb.ca/',
    '/relative',
    'https://',
  ]) {
    assert.equal(U.safeSourceURL(value), '#methodology');
  }
  assert.equal(U.safeSourceURL('https://www.oeb.ca/open-data'), 'https://www.oeb.ca/open-data');
  assert.equal(
    U.escapeHTML('<img src=x onerror="bad">'),
    '&lt;img src=x onerror=&quot;bad&quot;&gt;',
  );
});

test('every CSV export neutralizes hidden formulas and preserves quoted text', () => {
  for (const value of ['=2+2', ' +SUM(A1)', '\t@cmd', '\r-2', '\u0000=2'])
    assert.ok(U.csvCell(value).startsWith('"\''));
  assert.equal(U.csvCell('a,"b"'), '"a,""b"""');
  assert.equal(U.csvCell(0), '"0"');
  assert.equal(U.csvCell(-2), '"-2"');
  assert.equal(U.csvCell(null), '""');
});

test('date-only review dates stay on the publication day in Canada and Pacific time zones', () => {
  const code = `globalThis.window={}; await import('./js/ui-core.js'); console.log(window.EOUI.formatDate('2026-11-10'));`;
  for (const TZ of [
    'America/Toronto',
    'America/Vancouver',
    'Pacific/Honolulu',
    'Pacific/Kiritimati',
  ]) {
    const value = execFileSync(process.execPath, ['--input-type=module', '-e', code], {
      env: { ...process.env, TZ },
      encoding: 'utf8',
    });
    assert.match(value, /Nov 10, 2026/);
  }
  assert.equal(U.formatDate('invalid'), 'Not recorded');
});
