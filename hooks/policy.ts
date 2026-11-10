// Runtime-neutral guard policy. Claude: PreToolUse hooks. Cursor: .cursor/hooks.json → cursor-hook.ts.
// Erasable TypeScript only, so `node hooks/cursor-hook.ts` runs without a build step.
// Its job is independence: no version may see another version, the harness, or the network.
// Defense in depth, not a sandbox; real isolation is one workspace (Cursor: one VM) per agent.

export type Role = 'implementer' | 'question-writer';

export type ToolEvent =
  | { kind: 'shell'; command: string }
  | { kind: 'read'; path: string }
  | { kind: 'write'; path: string };

export interface PolicyContext { role: Role; workspace: string }
export interface Decision { allow: boolean; reason: string }

const allow = (): Decision => ({ allow: true, reason: 'ok' });
const deny = (reason: string): Decision => ({ allow: false, reason });

const strip = (p: string) => p.replace(/\/+$/, '');
const inside = (p: string, d: string) => strip(p) === strip(d) || strip(p).startsWith(strip(d) + '/');
const resolve = (p: string, ws: string) => (p.startsWith('/') ? p : `${strip(ws)}/${p}`);

function writable(ctx: PolicyContext): string[] {
  const ws = strip(ctx.workspace);
  return ctx.role === 'implementer' ? [`${ws}/impl.ts`, `${ws}/artifacts`, `${ws}/scratch`] : [`${ws}/artifacts`];
}

export function evaluate(ev: ToolEvent, ctx: PolicyContext): Decision {
  if (ev.kind === 'shell') {
    const cmd = ev.command;
    if (/\b(curl|wget|nc|ssh|scp|git\s+(clone|fetch|pull))\b/.test(cmd)) return deny('network access is not allowed');
    // The cloud VM publishes this version by pushing the starting branch. Fetching
    // another ref stays blocked. A URL or a remote other than origin stays blocked.
    if (/\bgit\s+push\b/.test(cmd)) {
      if (/https?:\/\/|git@|\bssh\b/.test(cmd)) return deny('network access is not allowed');
      const stripped = cmd.replace(/(^|\s)--?[A-Za-z0-9][A-Za-z0-9-]*(=\S*)?/g, ' ');
      const rest = stripped.replace(/^.*?\bgit\s+push\b/, '').trim();
      const remote = rest.split(/\s+/).filter(Boolean)[0];
      if (remote && remote !== 'origin') return deny('network access is not allowed');
    }
    if (/\b(npm|pnpm|yarn|npx)\s+(i|install|add)\b/.test(cmd)) return deny('installing packages is not allowed; use only Node built-ins');
    // One level up is fine (scratch/check.ts importing '../impl.ts'); two levels or `cd ..` leave the workspace.
    if (/\.\.\/\.\./.test(cmd) || /(^|\s)cd\s+\.\.\/?(\s|$|;|&)/.test(cmd)) return deny('leaving the workspace is not allowed');
    if (/\$\{?HOME|(^|\s)~\//.test(cmd)) return deny('paths outside the workspace are not allowed');
    for (const m of cmd.matchAll(/(?:^|[\s'"=>:(])((?:\/Users|\/home|\/private|\/tmp|\/var\/folders|\/root)(?:\/[^\s'";|&)]*)?)/g)) {
      if (!inside(m[1], ctx.workspace)) return deny(`${m[1]} is outside this workspace; use scratch/ for temp files`);
    }
    return allow();
  }
  const abs = resolve(ev.path, ctx.workspace);
  if (!inside(abs, ctx.workspace)) return deny(`${abs} is outside this workspace`);
  if (ev.kind === 'write' && !writable(ctx).some((w) => inside(abs, w))) return deny(`${ctx.role} may only write ${writable(ctx).join(', ')}`);
  if (ev.kind === 'write' && /\/(interface\.ts|TICKET\.md)$/.test(abs)) return deny('the ticket and interface are read-only');
  return allow();
}
