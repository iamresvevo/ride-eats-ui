import fs from 'node:fs';
import { loaders } from '../react/icons/loaders.js';
import { authoredMotion } from '../react/icons/authored-motion.js';
const problems = [], pending = [];
const commands = d => String(d).match(/[a-df-zA-DF-Z]/g)?.join('');
for (const load of Object.values(loaders)) {
  for (const [name, nodes] of Object.entries((await load()).default)) {
    if (['headset', 'folder'].includes(name)) continue;
    const definition = authoredMotion[name];
    if (!definition) { pending.push(name); continue; }
    if (!definition.intent?.trim()) problems.push(`${name}: missing intent`);
    for (const [index, part] of Object.entries(definition.parts)) {
      const node = nodes[Number(index)];
      if (!node || node[1][part.attributeName] === undefined) {
        problems.push(`${name}: missing part ${index}/${part.attributeName}`); continue;
      }
      if (part.attributeName === 'd' && commands(node[1].d) !== commands(part.peak))
        problems.push(`${name}: incompatible path topology at ${index}`);
      if (String(node[1][part.attributeName]) === part.peak)
        problems.push(`${name}: unchanged part ${index}`);
    }
  }
}
fs.writeFileSync('docs/icon-choreography-pending.json', JSON.stringify({
  note: 'Missing explicit choreography. Structural validation is not visual approval.',
  pendingCount: pending.length, problems, pending: pending.sort()
}, null, 2) + '\n');
console.log(`${pending.length} icons still require explicit choreography; ${problems.length} structural errors.`);
for (const problem of problems) console.error(problem);
if (problems.length || (process.argv.includes('--complete') && pending.length)) process.exitCode = 1;
