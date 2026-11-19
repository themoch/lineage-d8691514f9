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
    // shared helpers: ancestor set, founder fractions, spec fields merged with strain fallbacks
    window.up=function up(id,s=new Set()){(window.par[id]||[]).forEach(x=>{if(!s.has(x.p)){s.add(x.p);up(x.p,s)}});return s};
    const memo={};
    window.founders=function founders(id){
      if(memo[id])return memo[id];
      const ps=window.par[id],r={};
      if(!ps)r[id]=1;
      else{
        const w=['lemonheads2','dreammachine','crazyhazey'].includes(id)?[.25,.25,.5]:ps.map(()=>1/ps.length);
        ps.forEach((x,i)=>{const f=founders(x.p);for(const k in f)r[k]=(r[k]||0)+f[k]*w[i]});
      }
      return memo[id]=r;
    };
    window.SPEC=[['type','Type'],['seed','Seed type'],['flower','Flower time'],['height','Height / stretch'],['yield','Yield'],['potency','THC / CBD'],['aroma','Aroma / flavor'],['blurb','About'],['grow','Grow conditions'],['notes','Your notes'],['conflict','Sources disagree']];
    window.specVals=function(id){
      const n=window.byId[id],d=Object.assign({},window.D[id]);
      if(!d.flower&&n.ft)d.flower=n.ft;
      if(!d.aroma&&n.aroma)d.aroma=n.aroma;
      const out={};
      window.SPEC.forEach(([k])=>{if(d[k]&&!/^not listed$/i.test(d[k]))out[k]=d[k]});
      return out;
    };
  }).catch(err=>{
    document.body.insertAdjacentHTML('afterbegin','<p style="padding:16px;color:#c00">Could not load data ('+esc(err.message)+'). If opening from disk, serve over http.</p>');
    throw err;
  });
}
