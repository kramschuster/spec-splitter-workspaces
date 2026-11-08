// The judge. Runs every version on the same inputs and classifies each disagreement.
// No model is involved here: the same versions and inputs always give the same verdict.
//
//   version alone on ≥50% of disputed inputs → likely-bug version, set aside (e.g. the control)
//   ≥2 groups of ≥2 versions                 → ambiguity; inputs clustered by how versions split
//   one version alone on ≥3 inputs           → minority reading (round 1 only): a question to
//                                              confirm, labeled 1-vs-rest; later rounds: a bug
//   one version alone on 1–2 inputs          → isolated outlier, likely bug
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ProbeInput } from '../tickets/MF-1427/inputs.ts';

export interface Version { id: string; label: string; model?: string; control?: boolean; implPath: string }
export type Output = { value: number } | { error: string };

export interface Grid { inputs: ProbeInput[]; versions: Omit<Version, 'implPath'>[]; outputs: Record<string, Output[]> }

export interface Cluster {
  id: string;
  /** split: groups of versions disagree. minority: one version consistently against the rest. */
  kind: 'split' | 'minority';
  /** e.g. "A C | B D E": the versions in each agreeing group. */
  signature: string;
  groups: { versions: string[] }[];
  inputIds: string[];
}

export interface Analysis {
  totalInputs: number;
  agreedInputs: number;
  likelyBugVersions: { version: string; soloInputs: number; examples: string[] }[];
  outliers: { inputId: string; version: string; output: string; majority: string }[];
  clusters: Cluster[];
  converged: boolean;
}

const HERE = fileURLToPath(new URL('.', import.meta.url));
export const key = (o: Output) => ('error' in o ? `error: ${o.error}` : String(o.value));

export function runAll(versions: Version[], inputsPath: string, inputs: ProbeInput[]): Grid {
  const outputs: Grid['outputs'] = {};
  for (const v of versions) {
    const r = spawnSync(process.execPath, [join(HERE, 'exec.ts'), v.implPath, inputsPath], { encoding: 'utf8', timeout: 20_000 });
    try { outputs[v.id] = JSON.parse(r.stdout); }
    catch { outputs[v.id] = inputs.map(() => ({ error: r.error ? 'timeout' : `crashed: ${r.stderr.slice(-160)}` })); }
  }
  return { inputs, versions: versions.map(({ implPath, ...v }) => (void implPath, v)), outputs };
}

function groupsAt(grid: Grid, i: number, versions: string[]): Map<string, string[]> {
  const g = new Map<string, string[]>();
  for (const v of versions) { const k = key(grid.outputs[v][i]); g.set(k, [...(g.get(k) ?? []), v]); }
  return g;
}

export function analyze(grid: Grid, opts: { minorityAsQuestions?: boolean } = {}): Analysis {
  const all = grid.versions.map((v) => v.id);
  const n = grid.inputs.length;

  // 1. Versions that stand alone on a large share of inputs are likely bugs, not readings.
  const solo: Record<string, string[]> = Object.fromEntries(all.map((v) => [v, []]));
  let disputed = 0;
  grid.inputs.forEach((inp, i) => {
    const g = groupsAt(grid, i, all);
    if (g.size > 1) disputed++;
    for (const vs of g.values()) if (vs.length === 1 && all.length >= 3) solo[vs[0]].push(inp.id);
  });
  // Alone on at least half of the disputed inputs: a broken version, not a reading.
  const likelyBugVersions = all.filter((v) => solo[v].length >= Math.max(3, 0.5 * disputed))
    .map((v) => ({ version: v, soloInputs: solo[v].length, examples: solo[v].slice(0, 5) }));
  const considered = all.filter((v) => !likelyBugVersions.some((b) => b.version === v));

  // 2. Among the rest, classify each input.
  const outliers: Analysis['outliers'] = [];
  const bySig = new Map<string, Cluster>();
  let agreedInputs = 0;
  grid.inputs.forEach((inp, i) => {
    const g = [...groupsAt(grid, i, considered).entries()];
    if (g.length === 1) { agreedInputs++; return; }
    const big = g.filter(([, vs]) => vs.length >= 2);
    if (big.length >= 2) {
      const groups = g.map(([, vs]) => ({ versions: [...vs].sort() })).sort((a, b) => b.versions.length - a.versions.length || a.versions[0].localeCompare(b.versions[0]));
      const signature = groups.map((x) => x.versions.join(' ')).join(' | ');
      const c = bySig.get(signature) ?? { id: '', kind: 'split' as const, signature, groups, inputIds: [] };
      c.inputIds.push(inp.id); bySig.set(signature, c);
    } else {
      const majority = big[0] ? big[0][0] : '(no majority)';
      for (const [k, vs] of g) if (vs.length === 1) outliers.push({ inputId: inp.id, version: vs[0], output: k, majority });
    }
  });

  // 3. A version that dissents consistently may hold a real reading the others missed.
  //    In round 1 it becomes a question to confirm; after clarification it is a bug.
  let remaining = outliers;
  if (opts.minorityAsQuestions) {
    const byVersion = new Map<string, typeof outliers>();
    for (const o of outliers) byVersion.set(o.version, [...(byVersion.get(o.version) ?? []), o]);
    for (const [v, os] of byVersion) {
      if (os.length < 3) continue;
      const rest = considered.filter((x) => x !== v).sort();
      const signature = `${rest.join(' ')} | ${v}`;
      bySig.set(signature, { id: '', kind: 'minority', signature, groups: [{ versions: rest }, { versions: [v] }], inputIds: os.map((o) => o.inputId) });
      remaining = remaining.filter((o) => o.version !== v);
    }
  }
  const clusters = [...bySig.values()]
    .sort((a, b) => (a.kind === b.kind ? b.inputIds.length - a.inputIds.length : a.kind === 'split' ? -1 : 1))
    .map((c, i) => ({ ...c, id: `${c.kind === 'split' ? 'S' : 'M'}${i + 1}` }));
  return { totalInputs: n, agreedInputs, likelyBugVersions, outliers: remaining, clusters, converged: clusters.length === 0 };
}
