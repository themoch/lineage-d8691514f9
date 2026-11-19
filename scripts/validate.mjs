import fs from 'node:fs';
const rd=f=>JSON.parse(fs.readFileSync(new URL('../data/'+f,import.meta.url),'utf8'));
const strains=rd('strains.json'),edges=rd('edges.json'),details=rd('details.json');
const errs=[],ids=new Set();
for(const s of strains){
  if(!s.id||!s.label)errs.push('strain missing id/label: '+JSON.stringify(s));
  if(ids.has(s.id))errs.push('duplicate id '+s.id);ids.add(s.id);
  if(!['archive','offsite','unknown','own'].includes(s.source))errs.push(s.id+': bad source '+s.source);
}
const par={};
for(const e of edges){
  if(!ids.has(e.child))errs.push('edge child unknown: '+e.child);
  if(!ids.has(e.parent))errs.push('edge parent unknown: '+e.parent);
  if(e.kind&&!['sel','dash'].includes(e.kind))errs.push('bad kind '+e.kind);
  (par[e.child]=par[e.child]||[]).push(e.parent);
}
for(const id of Object.keys(details))if(!ids.has(id))errs.push('details for unknown strain '+id);
const state={};
const dfs=(id,path)=>{if(state[id]===1){errs.push('cycle: '+[...path,id].join(' > '));return}if(state[id]===2)return;state[id]=1;(par[id]||[]).forEach(p=>dfs(p,[...path,id]));state[id]=2};
ids.forEach(id=>dfs(id,[]));
if(errs.length){console.error(errs.join('\n'));process.exit(1)}
console.log(`ok: ${strains.length} strains (${strains.filter(s=>s.mine).length} mine), ${edges.length} edges, ${Object.keys(details).length} details`);
