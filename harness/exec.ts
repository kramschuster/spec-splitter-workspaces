// Runs ONE implementation against every input, in its own process.
// Usage: node harness/exec.ts <impl.ts> <inputs.json>   → JSON array of outputs on stdout
// A crash or a non-integer result is recorded as that version's output, not hidden.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [implPath, inputsPath] = process.argv.slice(2);
const inputs = JSON.parse(readFileSync(inputsPath, 'utf8')) as { order: unknown; history: unknown }[];

type Out = { value: number } | { error: string };
const outputs: Out[] = [];
let fn: ((o: unknown, h: unknown) => unknown) | undefined;
try {
  fn = (await import(pathToFileURL(resolve(implPath)).href)).loyaltyDiscount;
  if (typeof fn !== 'function') throw new Error('loyaltyDiscount is not exported');
} catch (e) {
  const msg = `load: ${e instanceof Error ? e.message : String(e)}`.slice(0, 200);
  process.stdout.write(JSON.stringify(inputs.map(() => ({ error: msg }))));
  process.exit(0);
}
for (const i of inputs) {
  try {
    const v = fn!(structuredClone(i.order), structuredClone(i.history));
    outputs.push(typeof v === 'number' && Number.isFinite(v) ? { value: v } : { error: `returned ${JSON.stringify(v)}` });
  } catch (e) {
    outputs.push({ error: (e instanceof Error ? e.message : String(e)).slice(0, 200) });
  }
}
process.stdout.write(JSON.stringify(outputs));
