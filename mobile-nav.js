(function(){
  function showStep(n){
    const target=document.querySelector(`[data-panel="${n}"]`);
    if(!target)return;

    document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active'));
    target.classList.add('active');
    document.querySelectorAll('.nav').forEach(x=>x.classList.toggle('active',+x.dataset.step===n));
    if(n===8 && typeof window.renderGuide==='function')window.renderGuide();

    const isMobile=window.matchMedia('(max-width: 860px)').matches;
    requestAnimationFrame(()=>{
      if(isMobile){
        const mobileNav=document.querySelector('.side');
        const offset=(mobileNav?.getBoundingClientRect().height||72)+12;
        const top=target.getBoundingClientRect().top+window.scrollY-offset;
        window.scrollTo({top:Math.max(0,top),behavior:'smooth'});
      }else{
        window.scrollTo({top:0,behavior:'smooth'});
      }
    });
  }

  window.go=showStep;
  document.querySelectorAll('.nav').forEach(button=>{
    button.onclick=()=>showStep(+button.dataset.step);
  });
})();
