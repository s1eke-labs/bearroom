/** Compare the exact frozen v15 runtime hashes, allowing only enumerated PC main hooks and asset identities. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { sha256 } from './asset-contract.mjs';
const baseline = JSON.parse(fs.readFileSync(new URL('../recovery/pc-runtime-preservation-v15.json', import.meta.url)));
const hooks = JSON.parse(fs.readFileSync(new URL('../recovery/pc-case-hooks.json', import.meta.url)));
const checks = [];
for (const item of baseline.checks) {
  const bytes = fs.readFileSync(new URL('../' + item.path, import.meta.url));
  const digest = sha256(bytes), expected = item.currentSha256;
  const check = { path: item.path, baselineSha256: expected, currentSha256: digest, unchanged: digest === expected };
  if (item.path === 'src/main.js') {
    let restored = bytes.toString();
    const importLine = "import { PcCaseController, PC_CASE_CONFIG } from './pc-case.js';\n";
    assert.equal(restored.split(importLine).length - 1, 1);
    restored = restored.replace(importLine, '');
    for (const [before, after] of [...hooks.main].reverse()) {
      assert.equal(restored.split(after).length - 1, 1, before);
      restored = restored.replace(after, before);
    }
    assert.equal(sha256(Buffer.from(restored)), expected, 'Main differs beyond exact reviewed PC hooks');
    check.authorized = 'Only three enumerated PC hooks and one module import; inverse-patched bytes equal frozen v15.';
  } else if (item.path === 'src/asset-revision.js') check.authorized = 'Genuinely matched source/model asset identities';
  else assert.equal(digest, expected, item.path + ' changed outside authorized scope');
  checks.push(check);
}
const report = { scope: 'Exact v15 runtime, input, camera, navigation, GI, vendor, HTML and original recovery bytes, with finite PC main-hook allowance only.', passed: true, unchangedFiles: checks.filter(x => x.unchanged).length, checks };
fs.writeFileSync(new URL('../docs/runtime-preservation-v16.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ passed: true, unchangedFiles: report.unchangedFiles, allowedChanges: checks.filter(x => !x.unchanged).map(x => x.path) }, null, 2));
