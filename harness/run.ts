// Standalone harness entry point, for the comparison VM (Cursor) or by hand:
//   node harness/run.ts <ticket-id> <versionsDir> [outDir]
// versionsDir holds one folder per version (A/, B/, …) with impl.ts + interface.ts.
// Writes inputs.json, grid.json and analysis.json. Same code path as the orchestrator.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { analyze, runAll } from './compare.ts';

const [ticket, versionsDir, outDir = '.'] = process.argv.slice(2);
if (!ticket || !versionsDir) { console.error('usage: node harness/run.ts <ticket-id> <versionsDir> [outDir]'); process.exit(2); }
const tdir = resolve('tickets', ticket);
const { generate } = await import(join(tdir, 'inputs.ts'));
const inputs = generate(readFileSync(join(tdir, 'ticket.md'), 'utf8'));
mkdirSync(outDir, { recursive: true });
const inputsPath = join(outDir, 'inputs.json');
writeFileSync(inputsPath, JSON.stringify(inputs, null, 2));
const versions = readdirSync(versionsDir).filter((d) => existsSync(join(versionsDir, d, 'impl.ts')))
  .map((d) => ({ id: d, label: d, control: d === 'X', implPath: join(versionsDir, d, 'impl.ts') }));
const grid = runAll(versions, inputsPath, inputs);
const analysis = analyze(grid, { minorityAsQuestions: process.env.ROUND !== undefined ? process.env.ROUND === '1' : true });
writeFileSync(join(outDir, 'grid.json'), JSON.stringify(grid, null, 2));
writeFileSync(join(outDir, 'analysis.json'), JSON.stringify(analysis, null, 2));
console.log(`${analysis.agreedInputs}/${analysis.totalInputs} agree · ${analysis.clusters.length} clusters · likely bugs: ${analysis.likelyBugVersions.map((b) => b.version).join(', ') || 'none'}`);
