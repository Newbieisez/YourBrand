const panelFiles = Array.from({length:9}, (_,i)=>`panel-${i}.html`);
Promise.all(panelFiles.map(f=>fetch(f).then(r=>{if(!r.ok) throw new Error(`Could not load ${f}`); return r.text()})))
  .then(parts=>{
    document.getElementById('panels').innerHTML=parts.join('\n');
    const s=document.createElement('script');
    s.src='app.js';
    document.body.appendChild(s);
  })
  .catch(()=>{document.getElementById('panels').innerHTML='<div class="card"><h2>We could not load the guide.</h2><p>Please refresh the page. If the problem continues, try again in a moment.</p></div>';});
