const APP_STORAGE_KEY='findYourBrand_v2';
const LAST_STEP_KEY='yourbrand_last_step_v1';
const VISIT_KEY='yourbrand_visit_active_v1';
const LEGACY_SESSION_KEY='yourbrand_private_session_v1';

(function lightweightSaveAndResume(){
  // Preserve work from the earlier session-only version when possible.
  try{
    const legacy=sessionStorage.getItem(LEGACY_SESSION_KEY);
    if(legacy && !localStorage.getItem(APP_STORAGE_KEY))localStorage.setItem(APP_STORAGE_KEY,legacy);
    sessionStorage.removeItem(LEGACY_SESSION_KEY);
  }catch(e){}

  let hasSavedWork=false;
  let activeVisit=false;
  try{
    const saved=localStorage.getItem(APP_STORAGE_KEY);
    hasSavedWork=!!(saved && saved!=='{}');
    activeVisit=sessionStorage.getItem(VISIT_KEY)==='1';
  }catch(e){}

  window.__yourBrandResumePending=hasSavedWork && !activeVisit;

  window.startFreshBrandWorkspace=function(){
    const ok=window.confirm('Start a fresh brand? This clears the saved answers on this device. Download anything you want to keep first.');
    if(!ok)return;
    try{
      localStorage.removeItem(APP_STORAGE_KEY);
      localStorage.removeItem(LAST_STEP_KEY);
      sessionStorage.setItem(VISIT_KEY,'1');
    }catch(e){}
    window.location.reload();
  };

  window.continueSavedBrand=function(){
    try{sessionStorage.setItem(VISIT_KEY,'1')}catch(e){}
    window.__yourBrandResumePending=false;
    document.getElementById('resumeBrandGate')?.remove();
    let step=0;
    try{step=Math.max(0,Math.min(8,Number(localStorage.getItem(LAST_STEP_KEY))||0))}catch(e){}
    if(typeof window.go==='function')window.go(step);
  };

  if(window.__yourBrandResumePending){
    const gate=document.createElement('div');
    gate.id='resumeBrandGate';
    gate.setAttribute('role','dialog');
    gate.setAttribute('aria-modal','true');
    gate.setAttribute('aria-labelledby','resumeBrandTitle');
    gate.innerHTML=`
      <div style="width:min(92vw,520px);background:#fffdf9;border:1px solid rgba(116,88,111,.16);border-radius:24px;box-shadow:0 24px 70px rgba(38,50,56,.24);padding:28px">
        <div style="font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#8f626e;margin-bottom:8px">Welcome back</div>
        <h2 id="resumeBrandTitle" style="margin:0 0 10px;font-size:28px;line-height:1.12;color:#263238">Your progress is still here.</h2>
        <p style="margin:0 0 22px;color:#66736f;line-height:1.55">Continue where you left off on this device, or start a new brand. No account or password needed.</p>
        <button type="button" onclick="continueSavedBrand()" style="width:100%;border:0;border-radius:14px;padding:15px 18px;background:#8f626e;color:white;font:700 16px/1.2 system-ui;cursor:pointer;margin-bottom:10px">Continue my brand →</button>
        <button type="button" onclick="startFreshBrandWorkspace()" style="width:100%;border:1px solid #d9cfca;border-radius:14px;padding:14px 18px;background:white;color:#4b5652;font:700 15px/1.2 system-ui;cursor:pointer">Start a new brand</button>
        <p style="margin:14px 0 0;font-size:12px;color:#8a908d;line-height:1.45">Using a shared device? Choose “Start a new brand” so the previous person's saved answers are not opened.</p>
      </div>`;
    Object.assign(gate.style,{position:'fixed',inset:'0',zIndex:'9999',display:'grid',placeItems:'center',padding:'18px',background:'rgba(38,50,56,.46)',backdropFilter:'blur(5px)'});
    document.body.appendChild(gate);
  }else{
    try{sessionStorage.setItem(VISIT_KEY,'1')}catch(e){}
  }
})();

const panelFiles = Array.from({length:9}, (_,i)=>`panel-${i}.html`);
Promise.all(panelFiles.map(f=>fetch(f).then(r=>{if(!r.ok) throw new Error(`Could not load ${f}`); return r.text()})))
  .then(parts=>{
    document.getElementById('panels').innerHTML=parts.join('\n');
    const app=document.createElement('script');
    app.src='app.js';
    app.onload=()=>{
      const mobile=document.createElement('script');
      mobile.src='mobile-nav.js';
      document.body.appendChild(mobile);

      const pdfBranding=document.createElement('script');
      pdfBranding.src='pdf-branding.js';
      pdfBranding.onload=()=>{
        const downloads=document.createElement('script');
        downloads.src='downloads.js';
        document.body.appendChild(downloads);
      };
      document.body.appendChild(pdfBranding);
    };
    document.body.appendChild(app);
  })
  .catch(()=>{document.getElementById('panels').innerHTML='<div class="card"><h2>We could not load the guide.</h2><p>Please refresh the page. If the problem continues, try again in a moment.</p></div>';});
