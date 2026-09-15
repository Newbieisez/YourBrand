(function(){
  const sectionTitles=[
    'Welcome',
    'Find Your Center',
    'Who You’re Here For',
    'Find Your Voice',
    'Choose Your Look',
    'Build It in Canva',
    'Shape Your Message',
    'Create With AI',
    'Meet Your Personal Brand'
  ];
  const LAST_STEP_KEY='yourbrand_last_step_v1';
  const MOBILE_POSITION_KEY='yourbrand_mobile_position_v2';
  const desktopGo=window.go;
  const side=document.querySelector('.side');
  const panels=[...document.querySelectorAll('.panel')];
  if(!side || !panels.length)return;

  function isMobile(){return window.matchMedia('(max-width: 860px)').matches;}
  function readPosition(){
    try{
      const value=JSON.parse(localStorage.getItem(MOBILE_POSITION_KEY)||'{}');
      return {panel:Math.max(0,Math.min(8,Number(value.panel)||0)),item:Math.max(0,Number(value.item)||0)};
    }catch(e){return {panel:0,item:0};}
  }
  function savePosition(panel,item){
    try{
      localStorage.setItem(MOBILE_POSITION_KEY,JSON.stringify({panel,item}));
      localStorage.setItem(LAST_STEP_KEY,String(panel));
    }catch(e){}
  }

  function buildChrome(){
    if(document.getElementById('mobileAppbar'))return;

    const appbar=document.createElement('div');
    appbar.id='mobileAppbar';
    appbar.className='mobile-appbar';
    appbar.innerHTML=`
      <div class="mobile-appbar-row">
        <div class="mobile-brand-lockup">
          <strong>YourBrand</strong>
          <span id="mobileSectionTitle">Welcome</span>
        </div>
        <div class="mobile-appbar-actions">
          <button type="button" class="mobile-round-button" id="mobileThemeButton" aria-label="Change appearance">◐</button>
          <button type="button" class="mobile-journey-button" id="mobileJourneyButton" aria-expanded="false">Journey</button>
        </div>
      </div>
      <div class="mobile-progress-row">
        <span id="mobileProgressText">Getting started</span>
        <span id="mobileItemCount">1 of 1</span>
      </div>
      <div class="mobile-progress-track" aria-hidden="true"><i id="mobileProgressFill"></i></div>`;
    document.body.insertBefore(appbar,document.body.firstChild);

    const backdrop=document.createElement('button');
    backdrop.type='button';
    backdrop.className='mobile-sheet-backdrop';
    backdrop.id='mobileSheetBackdrop';
    backdrop.setAttribute('aria-label','Close journey menu');
    document.body.appendChild(backdrop);

    const sheetHead=document.createElement('div');
    sheetHead.className='mobile-sheet-head';
    sheetHead.innerHTML='<div><span>Your journey</span><strong>Go to any section</strong></div><button type="button" id="mobileSheetClose" aria-label="Close journey menu">×</button>';
    side.insertBefore(sheetHead,side.firstChild);

    const controls=document.createElement('div');
    controls.id='mobileFlowControls';
    controls.className='mobile-flow-controls';
    controls.innerHTML=`
      <button type="button" class="mobile-back-button" id="mobileBackButton">← Back</button>
      <button type="button" class="mobile-continue-button" id="mobileContinueButton">Continue →</button>`;
    document.body.appendChild(controls);

    document.getElementById('mobileJourneyButton').addEventListener('click',openMenu);
    document.getElementById('mobileSheetClose').addEventListener('click',closeMenu);
    backdrop.addEventListener('click',closeMenu);
    document.getElementById('mobileThemeButton').addEventListener('click',()=>{
      if(typeof window.toggleYourBrandTheme==='function')window.toggleYourBrandTheme();
    });
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  }

  function openMenu(){
    if(!isMobile())return;
    side.classList.add('mobile-menu-open');
    document.body.classList.add('mobile-menu-is-open');
    document.getElementById('mobileJourneyButton')?.setAttribute('aria-expanded','true');
  }
  function closeMenu(){
    side.classList.remove('mobile-menu-open');
    document.body.classList.remove('mobile-menu-is-open');
    document.getElementById('mobileJourneyButton')?.setAttribute('aria-expanded','false');
  }

  function makeItem(main,parent=null,prefix=null,companions=[]){
    return {mains:Array.isArray(main)?main:[main],parent,prefix,companions};
  }

  function getFlowItems(panelIndex){
    const panel=panels[panelIndex];
    const card=panel?.querySelector('.card');
    if(!card)return [];
    const direct=[...card.children];

    if(panelIndex===0){
      const intro=direct.filter(el=>!el.matches('.step,.footerNav,.buttons'));
      return intro.length?[makeItem(intro)]:[];
    }
    if(panelIndex===8)return [];

    const items=[];
    let pendingPrefix=null;
    for(const el of direct){
      if(el.matches('.step,.footerNav'))continue;
      if(el.classList.contains('softTitle')){
        pendingPrefix=el;
        continue;
      }
      if(el.classList.contains('helpbox'))continue;
      if(el.classList.contains('buttons')){
        const buttons=[...el.querySelectorAll('button')];
        const onlyNavigation=buttons.length && buttons.every(b=>(b.getAttribute('onclick')||'').trim().startsWith('go('));
        if(onlyNavigation)continue;
        const companions=[];
        if(el.nextElementSibling?.classList.contains('helpbox'))companions.push(el.nextElementSibling);
        items.push(makeItem(el,null,pendingPrefix,companions));
        pendingPrefix=null;
        continue;
      }
      if(el.classList.contains('example') && items.length){
        items[items.length-1].companions.push(el);
        continue;
      }
      if((el.classList.contains('grid2') || el.classList.contains('identityRow')) && [...el.children].length && [...el.children].every(child=>child.classList.contains('field'))){
        [...el.children].forEach((child,index)=>{
          items.push(makeItem(child,el,index===0?pendingPrefix:null));
        });
        pendingPrefix=null;
        continue;
      }
      items.push(makeItem(el,null,pendingPrefix));
      pendingPrefix=null;
    }
    return items;
  }

  const counts=panels.map((_,index)=>index===8?1:Math.max(1,getFlowItems(index).length));
  const totalJourney=counts.slice(0,8).reduce((a,b)=>a+b,0);

  function clearMobileFlow(panel){
    const card=panel?.querySelector('.card');
    if(!card)return;
    [...card.children].forEach(el=>{
      el.classList.remove('mobile-flow-hidden','mobile-flow-current','mobile-flow-parent','mobile-flow-prefix-visible');
      [...el.children].forEach(child=>child.classList.remove('mobile-flow-current'));
    });
  }

  function hidePanelContents(panel){
    const card=panel?.querySelector('.card');
    if(!card)return;
    [...card.children].forEach(el=>{
      el.classList.remove('mobile-flow-current','mobile-flow-parent','mobile-flow-prefix-visible');
      [...el.children].forEach(child=>child.classList.remove('mobile-flow-current'));
      if(!el.matches('.step,.footerNav'))el.classList.add('mobile-flow-hidden');
    });
  }

  function revealElement(panel,el,parent=null){
    if(!el)return;
    const card=panel.querySelector('.card');
    const directParent=el.parentElement===card;
    if(parent){
      parent.classList.remove('mobile-flow-hidden');
      parent.classList.add('mobile-flow-parent');
      el.classList.add('mobile-flow-current');
    }else if(directParent){
      el.classList.remove('mobile-flow-hidden');
      el.classList.add('mobile-flow-current');
    }else{
      el.classList.add('mobile-flow-current');
    }
  }

  function journeyPosition(panelIndex,itemIndex){
    if(panelIndex>=8)return {number:totalJourney,total:totalJourney,percent:100};
    const before=counts.slice(0,panelIndex).reduce((a,b)=>a+b,0);
    const number=Math.min(totalJourney,before+itemIndex+1);
    const percent=Math.round((number/totalJourney)*100);
    return {number,total:totalJourney,percent};
  }

  function updateChrome(panelIndex,itemIndex,itemCount){
    const section=document.getElementById('mobileSectionTitle');
    const progressText=document.getElementById('mobileProgressText');
    const itemCountEl=document.getElementById('mobileItemCount');
    const fill=document.getElementById('mobileProgressFill');
    const controls=document.getElementById('mobileFlowControls');
    const back=document.getElementById('mobileBackButton');
    const next=document.getElementById('mobileContinueButton');
    const position=journeyPosition(panelIndex,itemIndex);

    if(section)section.textContent=sectionTitles[panelIndex]||'YourBrand';
    if(progressText)progressText.textContent=panelIndex===8?'Your brand is ready':`${position.percent}% complete`;
    if(itemCountEl)itemCountEl.textContent=panelIndex===8?'Complete':`${itemIndex+1} of ${Math.max(1,itemCount)}`;
    if(fill)fill.style.width=`${position.percent}%`;

    document.body.classList.toggle('mobile-final',panelIndex===8);
    if(controls)controls.hidden=panelIndex===8;
    if(back)back.disabled=panelIndex===0 && itemIndex===0;
    if(next){
      const atLastPanelItem=panelIndex===7 && itemIndex===itemCount-1;
      const atLastItem=itemIndex===itemCount-1;
      next.textContent=atLastPanelItem?'Meet my brand →':atLastItem?'Next section →':'Continue →';
    }
  }

  function activatePanel(panelIndex){
    panels.forEach(panel=>panel.classList.remove('active'));
    const panel=panels[panelIndex];
    if(!panel)return null;
    panel.classList.add('active');
    document.querySelectorAll('.nav').forEach(button=>button.classList.toggle('active',+button.dataset.step===panelIndex));
    if(panelIndex===8 && typeof window.renderGuide==='function')window.renderGuide();
    return panel;
  }

  function showMobile(panelIndex,itemIndex=0,scroll=true){
    panelIndex=Math.max(0,Math.min(8,Number(panelIndex)||0));
    const panel=activatePanel(panelIndex);
    if(!panel)return;
    closeMenu();

    panels.forEach(clearMobileFlow);
    if(panelIndex===8){
      panel.querySelector('.footerNav')?.classList.remove('mobile-flow-hidden');
      updateChrome(panelIndex,0,1);
      savePosition(panelIndex,0);
      if(scroll)window.scrollTo({top:0,behavior:'smooth'});
      return;
    }

    const items=getFlowItems(panelIndex);
    if(!items.length)return;
    itemIndex=Math.max(0,Math.min(items.length-1,Number(itemIndex)||0));
    hidePanelContents(panel);
    const item=items[itemIndex];

    if(item.prefix){
      item.prefix.classList.remove('mobile-flow-hidden');
      item.prefix.classList.add('mobile-flow-prefix-visible');
    }
    item.mains.forEach(el=>revealElement(panel,el,item.parent));
    item.companions.forEach(el=>revealElement(panel,el));

    panel.querySelector('.footerNav')?.classList.add('mobile-flow-hidden');
    updateChrome(panelIndex,itemIndex,items.length);
    savePosition(panelIndex,itemIndex);

    const back=document.getElementById('mobileBackButton');
    const next=document.getElementById('mobileContinueButton');
    back.onclick=()=>{
      if(itemIndex>0)return showMobile(panelIndex,itemIndex-1);
      if(panelIndex>0){
        const previousItems=getFlowItems(panelIndex-1);
        return showMobile(panelIndex-1,Math.max(0,previousItems.length-1));
      }
    };
    next.onclick=()=>{
      if(itemIndex<items.length-1)return showMobile(panelIndex,itemIndex+1);
      return showMobile(panelIndex+1,0);
    };

    if(scroll){
      requestAnimationFrame(()=>{
        const appbar=document.getElementById('mobileAppbar');
        const top=panel.getBoundingClientRect().top+window.scrollY-(appbar?.offsetHeight||92)-12;
        window.scrollTo({top:Math.max(0,top),behavior:'smooth'});
      });
    }
  }

  function applyMode(){
    if(isMobile()){
      document.body.classList.add('mobile-guided-mode');
      const saved=readPosition();
      if(!window.__yourBrandResumePending)showMobile(saved.panel,saved.item,false);
    }else{
      document.body.classList.remove('mobile-guided-mode','mobile-final','mobile-menu-is-open');
      closeMenu();
      panels.forEach(clearMobileFlow);
      document.getElementById('mobileFlowControls').hidden=true;
    }
  }

  buildChrome();

  window.go=function(n){
    if(isMobile()){
      const saved=readPosition();
      const item=saved.panel===Number(n)?saved.item:0;
      showMobile(Number(n),item);
    }else if(typeof desktopGo==='function'){
      desktopGo(Number(n));
    }
  };

  document.querySelectorAll('.nav').forEach(button=>{
    button.onclick=()=>{
      if(isMobile())showMobile(+button.dataset.step,0);
      else if(typeof desktopGo==='function')desktopGo(+button.dataset.step);
    };
  });

  let wasMobile=isMobile();
  applyMode();
  window.addEventListener('resize',()=>{
    const now=isMobile();
    if(now===wasMobile)return;
    wasMobile=now;
    applyMode();
  });
})();