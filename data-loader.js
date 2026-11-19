// Loads data/*.json and exposes the shared model as globals:
// N, E, D, byId, par, kids, mine, esc. Usage: loadData().then(init)
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function loadData(){
  const get=f=>fetch('data/'+f,{cache:'no-cache'}).then(r=>{if(!r.ok)throw new Error(f+' '+r.status);return r.json()});
  return Promise.all([get('strains.json'),get('edges.json'),get('details.json')]).then(([strains,edges,details])=>{
    window.D=details;
    window.N=strains;
    window.E=edges.map(e=>[e.child,e.parent,e.kind]);
    window.byId=Object.fromEntries(strains.map(n=>[n.id,{id:n.id,label:n.label,src:n.source,mine:!!n.mine,ft:n.flower,aroma:n.aroma,cross:n.cross,url:n.url,breeder:n.breeder||''}]));
    const par=window.par={},kids=window.kids={};
    window.E.forEach(([c,p,k])=>{(par[c]=par[c]||[]).push({p,k:k||'cross'});(kids[p]=kids[p]||[]).push(c)});
    window.mine=strains.filter(n=>n.mine).map(n=>n.id);
  }).catch(err=>{
    document.body.insertAdjacentHTML('afterbegin','<p style="padding:16px;color:#c00">Could not load data ('+esc(err.message)+'). If opening from disk, serve over http.</p>');
    throw err;
  });
}
