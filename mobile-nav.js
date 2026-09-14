(function(){
  const steps=[
    'Welcome',
    'Find Your Center',
    'Who You’re Here For',
    'Find Your Voice',
    'Choose Your Look',
    'Shape Your Message',
    'Create With AI',
    'Build Your Visual Brand',
    'Your Brand Guide'
  ];
  const LAST_STEP_KEY='yourbrand_last_step_v1';

  const side=document.querySelector('.side');
  if(!side)return;

  function isMobile(){return window.matchMedia('(max-width: 860px)').matches;}

  function buildMobileNavigation(){
    if(document.getElementById('mobileJourneyHeader'))return;

    const header=document.createElement('div');
    header.id='mobileJourneyHeader';
    header.className='mobile-nav-header';
    header.innerHTML=`
      <button type="button" class="mobile-menu-toggle" aria-expanded="false" aria-controls="mobileJourneyMenu">
        <span class="mobile-menu-icon" aria-hidden="true">☰</span>
        <span>Menu</span>
      </button>
      <div class="mobile-current-step">
        <span class="mobile-step-eyebrow" id="mobileStepCount">Start here</span>
        <strong id="mobileStepTitle">Welcome</strong>
      </div>`;

    side.insertBefore(header,side.firstChild);
    side.id='mobileJourneyMenu';

    const next=document.createElement('div');
    next.className='mobile-next-step';
    next.innerHTML=`
      <div class="mobile-next-copy">
        <span>Suggested next step</span>
        <strong id="mobileNextTitle">Find Your Center</strong>
      </div>
      <button type="button" class="mobile-next-button" id="mobileNextButton">Continue →</button>`;

    const sideNote=side.querySelector('.side-note');
    if(sideNote)side.insertBefore(next,sideNote);
    else side.appendChild(next);

    const toggle=header.querySelector('.mobile-menu-toggle');
    toggle.addEventListener('click',()=>{
      const open=side.classList.toggle('mobile-menu-open');
      toggle.setAttribute('aria-expanded',String(open));
      toggle.querySelector('.mobile-menu-icon').textContent=open?'×':'☰';
      toggle.querySelector('span:last-child').textContent=open?'Close':'Menu';
    });

    document.addEventListener('keydown',e=>{
      if(e.key==='Escape' && side.classList.contains('mobile-menu-open'))closeMenu();
    });
  }

  function closeMenu(){
    side.classList.remove('mobile-menu-open');
    const toggle=side.querySelector('.mobile-menu-toggle');
    if(toggle){
      toggle.setAttribute('aria-expanded','false');
      const icon=toggle.querySelector('.mobile-menu-icon');
      const label=toggle.querySelector('span:last-child');
      if(icon)icon.textContent='☰';
      if(label)label.textContent='Menu';
    }
  }

  function updateMobileState(n){
    const title=document.getElementById('mobileStepTitle');
    const count=document.getElementById('mobileStepCount');
    const nextTitle=document.getElementById('mobileNextTitle');
    const nextButton=document.getElementById('mobileNextButton');

    if(title)title.textContent=steps[n]||'Your Brand Journey';
    if(count)count.textContent=n===0?'Start here':`Step ${n} of 8`;

    const nextStep=n<8?n+1:0;
    const nextText=n<8?steps[nextStep]:'Review from the beginning';
    if(nextTitle)nextTitle.textContent=nextText;
    if(nextButton){
      nextButton.textContent=n<8?'Continue →':'Review →';
      nextButton.onclick=()=>showStep(nextStep);
    }
  }

  function showStep(n){
    const target=document.querySelector(`[data-panel="${n}"]`);
    if(!target)return;

    document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active'));
    target.classList.add('active');
    document.querySelectorAll('.nav').forEach(x=>x.classList.toggle('active',+x.dataset.step===n));
    if(n===8 && typeof window.renderGuide==='function')window.renderGuide();

    try{localStorage.setItem(LAST_STEP_KEY,String(n))}catch(e){}
    updateMobileState(n);
    if(isMobile())closeMenu();

    requestAnimationFrame(()=>{
      if(isMobile()){
        const offset=(side.getBoundingClientRect().height||118)+18;
        const top=target.getBoundingClientRect().top+window.scrollY-offset;
        window.scrollTo({top:Math.max(0,top),behavior:'smooth'});
      }else{
        window.scrollTo({top:0,behavior:'smooth'});
      }
    });
  }

  buildMobileNavigation();

  let initialStep=0;
  try{initialStep=Math.max(0,Math.min(8,Number(localStorage.getItem(LAST_STEP_KEY))||0))}catch(e){}
  updateMobileState(initialStep);

  window.go=showStep;
  document.querySelectorAll('.nav').forEach(button=>{
    button.onclick=()=>showStep(+button.dataset.step);
  });

  if(!window.__yourBrandResumePending && initialStep>0){
    requestAnimationFrame(()=>showStep(initialStep));
  }
})();