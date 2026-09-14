const APP_STORAGE_KEY='findYourBrand_v2';
const PRIVATE_SESSION_KEY='yourbrand_private_session_v1';

(function isolateBrandSession(){
  const nativeGet=Storage.prototype.getItem;
  const nativeSet=Storage.prototype.setItem;
  const nativeRemove=Storage.prototype.removeItem;

  // Remove legacy persistent answers. Every browser tab/session starts private.
  try{nativeRemove.call(window.localStorage,APP_STORAGE_KEY)}catch(e){}

  Storage.prototype.getItem=function(key){
    if(this===window.localStorage && key===APP_STORAGE_KEY){
      return nativeGet.call(window.sessionStorage,PRIVATE_SESSION_KEY);
    }
    return nativeGet.call(this,key);
  };

  Storage.prototype.setItem=function(key,value){
    if(this===window.localStorage && key===APP_STORAGE_KEY){
      return nativeSet.call(window.sessionStorage,PRIVATE_SESSION_KEY,value);
    }
    return nativeSet.call(this,key,value);
  };

  Storage.prototype.removeItem=function(key){
    if(this===window.localStorage && key===APP_STORAGE_KEY){
      return nativeRemove.call(window.sessionStorage,PRIVATE_SESSION_KEY);
    }
    return nativeRemove.call(this,key);
  };

  window.startFreshBrandWorkspace=function(){
    const ok=window.confirm('Start a fresh private brand? This clears the answers in this browser tab. Download anything you want to keep first.');
    if(!ok)return;
    try{nativeRemove.call(window.sessionStorage,PRIVATE_SESSION_KEY)}catch(e){}
    window.location.reload();
  };
})();

const panelFiles = Array.from({length:9}, (_,i)=>`panel-${i}.html`);
Promise.all(panelFiles.map(f=>fetch(f).then(r=>{if(!r.ok) throw new Error(`Could not load ${f}`); return r.text()})))
  .then(parts=>{
    document.getElementById('panels').innerHTML=parts.join('\n');
    const s=document.createElement('script');
    s.src='app.js';
    s.onload=()=>{
      const mobile=document.createElement('script');
      mobile.src='mobile-nav.js';
      document.body.appendChild(mobile);
    };
    document.body.appendChild(s);
  })
  .catch(()=>{document.getElementById('panels').innerHTML='<div class="card"><h2>We could not load the guide.</h2><p>Please refresh the page. If the problem continues, try again in a moment.</p></div>';});
