// Cursor command hook. stdin/stdout match https://cursor.com/docs/hooks.
// beforeShellExecution and beforeReadFile gate shell and reads.
// preToolUse gates writes: afterFileEdit has no documented permission response and runs after the edit.
// Role comes from SPLITTER_ROLE (cloud.envVars). Workspace root is workspace_roots[0].
import { appendFileSync, mkdirSync } from 'node:fs';
import { evaluate, type Role, type ToolEvent } from './policy.ts';

const raw = await new Promise<string>((r) => { let s = ''; process.stdin.on('data', (d) => (s += d)).on('end', () => r(s)); });
const input = JSON.parse(raw || '{}') as Record<string, unknown>;
const event = String(input.hook_event_name ?? '');

const toolInput = input.tool_input && typeof input.tool_input === 'object' ? input.tool_input as Record<string, unknown> : {};
let ev: ToolEvent | null = null;
if (event === 'beforeShellExecution') ev = { kind: 'shell', command: String(input.command ?? '') };
else if (event === 'beforeReadFile') ev = { kind: 'read', path: String(input.file_path ?? '') };
else if (event === 'preToolUse' && input.tool_name === 'Write') ev = { kind: 'write', path: String(toolInput.file_path ?? '') };

const roots = input.workspace_roots;
const workspace = Array.isArray(roots) && typeof roots[0] === 'string' ? roots[0] : '';
const role: Role = process.env.SPLITTER_ROLE === 'question-writer' ? 'question-writer' : 'implementer';
const d = ev ? evaluate(ev, { role, workspace }) : { allow: true, reason: 'ok' };

if (workspace) {
  mkdirSync(`${workspace}/artifacts`, { recursive: true });
  appendFileSync(`${workspace}/artifacts/audit.jsonl`, JSON.stringify({ ts: new Date().toISOString(), event, input: ev, decision: d.allow ? 'allow' : 'deny', reason: d.reason }) + '\n');
}

const body = d.allow
  ? { permission: 'allow' }
  : event === 'beforeReadFile'
    ? { permission: 'deny', user_message: d.reason }
    : { permission: 'deny', user_message: d.reason, agent_message: d.reason };
process.stdout.write(JSON.stringify(body));
