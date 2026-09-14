(function(){
  const THEME_KEY='yourbrand_theme_v1';

  function preferredTheme(){
    try{
      const saved=localStorage.getItem(THEME_KEY);
      if(saved==='light'||saved==='dark')return saved;
    }catch(e){}
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
  }

  function applyTheme(theme){
    document.documentElement.dataset.theme=theme;
    const button=document.getElementById('themeToggle');
    if(button){
      const dark=theme==='dark';
      button.setAttribute('aria-pressed',String(dark));
      button.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');
      button.innerHTML=dark?'☀ <span>Light</span>':'☾ <span>Dark</span>';
    }
  }

  window.toggleYourBrandTheme=function(){
    const next=document.documentElement.dataset.theme==='dark'?'light':'dark';
    try{localStorage.setItem(THEME_KEY,next)}catch(e){}
    applyTheme(next);
  };

  applyTheme(preferredTheme());
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>applyTheme(document.documentElement.dataset.theme||preferredTheme()),{once:true});
  }
})();
