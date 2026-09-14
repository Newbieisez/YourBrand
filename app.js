const STORAGE='findYourBrand_v2';
const fields=[...document.querySelectorAll('[data-key]')];
function v(k){const e=document.querySelector(`[data-key="${k}"]`);if(!e)return'';return e.type==='checkbox'?e.checked:(e.value||'').trim()}
function save(){const d={};fields.forEach(e=>d[e.dataset.key]=e.type==='checkbox'?e.checked:e.value);try{localStorage.setItem(STORAGE,JSON.stringify(d))}catch(e){} update()}
function load(){let d={};try{d=JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch(e){}fields.forEach(e=>{if(d[e.dataset.key]!==undefined){if(e.type==='checkbox')e.checked=!!d[e.dataset.key];else e.value=d[e.dataset.key]}});update()}
fields.forEach(e=>e.addEventListener(e.type==='checkbox'?'change':'input',save));
function go(n){document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active'));document.querySelector(`[data-panel="${n}"]`).classList.add('active');document.querySelectorAll('.nav').forEach(x=>x.classList.toggle('active',+x.dataset.step===n));if(n===8)renderGuide();window.scrollTo({top:0,behavior:'smooth'})}
document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>go(+b.dataset.step));
function addWord(k,w){const e=document.querySelector(`[data-key="${k}"]`);let a=(e.value||'').split(',').map(s=>s.trim()).filter(Boolean);if(!a.map(x=>x.toLowerCase()).includes(w.toLowerCase()))a.push(w);e.value=a.join(', ');save()}
function answered(k){const e=document.querySelector(`[data-key="${k}"]`);if(!e)return false;return e.type==='checkbox'?e.checked:(e.value||'').trim().length>2}
function update(){const keys=['feel','trusted','myself','belief','audience','problem','outcome','samples','voiceNotes','visualFeel','visualRefs','colors','headlineFont','bodyFont','oneLine','pillars'];let pct=Math.round(keys.filter(answered).length/keys.length*100);document.getElementById('progressText').textContent=pct+'% complete';document.getElementById('progressBar').style.width=pct+'%';renderGuide();document.getElementById('voicePrompt').textContent=voiceHelp()}
function toggleHelp(id){document.getElementById(id).classList.toggle('show')}
function voiceHelp(){return `I am trying to understand my natural brand voice. Please study the writing samples below rather than inventing a personality for me.\n\nWRITING SAMPLES\n${v('samples')}\n\nWHAT I NOTICE ABOUT MYSELF\n${v('voiceNotes')}\n\nHOW I WANT PEOPLE TO FEEL\n${v('feel')}\n\nWORDS / PHRASES THAT FEEL NATURAL\n${v('signature')}\n\nWHAT DOES NOT FEEL LIKE ME\n${v('antivoice')}\n\nPlease tell me:\n1. What patterns genuinely repeat in my writing?\n2. How would you describe my natural tone in plain language?\n3. What sentence rhythms, word choices, humor, warmth, directness, or storytelling habits seem like me?\n4. What should an AI writer preserve so I still sound human?\n5. What should it avoid because it would make me sound generic or fake?\n\nDo not add traits that are not supported by my examples. If you are unsure, say so.`}
function guide(){return `MY BRAND GUIDE\n\nNAME / BRAND\n${v('brandName') || 'My Brand'}\n\nWHAT I AM BUILDING\n${v('brandType')}\n\nHOW I WANT PEOPLE TO FEEL\n${v('feel')}\n\nWHAT PEOPLE TRUST ME FOR\n${v('trusted')}\n\nWHEN I FEEL MOST LIKE MYSELF\n${v('myself')}\n\nWHAT I BELIEVE\n${v('belief')}\n\nWHAT I WILL NOT FAKE\n${v('nofake')}\n\nA STORY OR LESSON THAT SHAPED ME\n${v('story')}\n\nTHREE WORDS I WANT ASSOCIATED WITH ME\n${v('threewords')}\n\nWHO I AM HERE FOR\n${v('audience')}\n\nWHAT THEY ARE DEALING WITH\n${v('problem')}\n\nWHAT BETTER LOOKS LIKE\n${v('outcome')}\n\nWHY THEY CAN TRUST ME\n${v('proof')}\n\nWHAT MAKES MY APPROACH DIFFERENT\n${v('difference')}\n\nMY NATURAL VOICE\n${v('voiceNotes')}\n\nWORDS / PHRASES THAT FEEL LIKE ME\n${v('signature')}\n\nWHAT SHOULD NEVER SOUND LIKE ME\n${v('antivoice')}\n\nMY VISUAL FEELING\n${v('visualFeel')}\n\nVISUAL REFERENCES I AM DRAWN TO\n${v('visualRefs')}\n\nWHAT MY BRAND SHOULD NEVER LOOK LIKE\n${v('antistyle')}\n\nCOLORS + HOW I USE THEM\n${v('colors')}\n${v('colorUse')}\n\nFONTS\nHeadline: ${v('headlineFont')}\nBody: ${v('bodyFont')}\n\nMY SIMPLE DESCRIPTION\n${v('oneLine')}\n\nWHAT I WANT TO BE KNOWN FOR\n${v('pillars')}\n\nCLAIMS I CAN SUPPORT\n${v('claims')}\n\nMY BRAND REMINDER\nCreate from what is true. Make people feel ${v('feel') || 'the way I intend'}. Keep the voice human. Use proof for factual claims. Let consistency come from clear choices, not from making everything identical.`}
function renderGuide(){
  const o=document.getElementById('guideOut');if(o)o.textContent=guide();
  const set=(id,val)=>{const e=document.getElementById(id);if(e)e.textContent=val||'—'};
  set('revealName',v('brandName')||'Your Brand');
  set('revealLine',v('oneLine')||'A brand built from what is true about you.');
  set('revealFeel',v('feel'));
  set('revealBelief',v('belief'));
  set('revealVoice',v('voiceNotes')||v('threewords'));
  set('revealVisual',v('visualFeel'));
  set('revealAudience',v('audience'));
  set('revealKnown',v('pillars'));
}
function buildCreationHelp(){const p=`Please help me create: ${v('task')}\n\nHere is my brand guide so the result still sounds and feels like me:\n\n${guide()}\n\nREAL SOURCE MATERIAL TO USE\n${v('source')}\n\nWHERE THIS WILL BE USED\n${v('channel')}\n\nWHAT I WANT THE PERSON TO DO OR FEEL NEXT\n${v('action')}\n\nPlease create a finished draft. Keep the language natural and specific. Do not invent facts, results, customer stories, credentials, or claims. If something important is missing, flag it instead of making it up. Before finalizing, check that the result feels consistent with my voice and the emotional experience I want my brand to create.`;document.getElementById('creationPrompt').textContent=p;document.getElementById('creationHelp').classList.add('show')}
function copyTxt(t){navigator.clipboard?.writeText(t).catch(()=>{});alert('Copied. Paste it into the AI tool you like to use, then keep shaping the answer until it feels like you.')}
function copyVoiceHelp(){copyTxt(voiceHelp())}
function copyCreationHelp(){copyTxt(document.getElementById('creationPrompt').textContent)}
function copyGuide(){copyTxt(guide())}
function safeName(){return (v('brandName')||'My Brand').replace(/[^a-z0-9]+/gi,' ').trim().replace(/\s+/g,'_').slice(0,50)||'My_Brand'}
function sections(type){
  const common=`NAME / BRAND\n${v('brandName')||'My Brand'}\n\nWHAT I AM BUILDING\n${v('brandType')}\n`;
  if(type==='brand') return `${common}\nHOW I WANT PEOPLE TO FEEL\n${v('feel')}\n\nWHAT PEOPLE TRUST ME FOR\n${v('trusted')}\n\nWHEN I FEEL MOST LIKE MYSELF\n${v('myself')}\n\nWHAT I BELIEVE\n${v('belief')}\n\nWHAT I WILL NOT FAKE\n${v('nofake')}\n\nA STORY OR LESSON THAT SHAPED ME\n${v('story')}\n\nWHO I AM HERE FOR\n${v('audience')}\n\nWHAT THEY ARE DEALING WITH\n${v('problem')}\n\nWHAT BETTER LOOKS LIKE\n${v('outcome')}\n\nWHY THEY CAN TRUST ME\n${v('proof')}\n\nWHAT MAKES MY APPROACH DIFFERENT\n${v('difference')}\n\nMY SIMPLE DESCRIPTION\n${v('oneLine')}\n\nWHAT I WANT TO BE KNOWN FOR\n${v('pillars')}\n\nCLAIMS I CAN SUPPORT\n${v('claims')}\n\nBRAND REMINDER\nBuild from what is true. Consistency comes from clear choices—not from becoming a character.`;
  if(type==='voice') return `${common}\nTHE FEELING I WANT TO CREATE\n${v('feel')}\n\nMY NATURAL COMMUNICATION STYLE\n${v('voiceNotes')}\n\nTHREE WORDS THAT FEEL LIKE ME\n${v('threewords')}\n\nWORDS / PHRASES THAT FEEL NATURAL\n${v('signature')}\n\nWHAT SHOULD NEVER SOUND LIKE ME\n${v('antivoice')}\n${v('nevervoice')}\n\nA FEW REAL EXAMPLES OF MY VOICE\n${v('samples')}\n\nMY VOICE RULE\nMy voice can flex by situation, but it should still feel recognizably mine. Warmth, confidence, humor, directness, or detail can change by channel without turning me into a different person.\n\nTHE FRIEND TEST\nBefore publishing, read it out loud and ask: Would I actually say this? Would someone who knows me recognize me in it?`;
  if(type==='canva') return `${common}\nTHE FEELING MY VISUAL BRAND SHOULD CREATE\n${v('visualFeel')}\n\nVISUAL REFERENCES I AM DRAWN TO\n${v('visualRefs')}\n\nWHAT MY BRAND SHOULD NEVER LOOK LIKE\n${v('antistyle')}\n\nMY COLORS\n${v('colors')}\n\nHOW I USE THOSE COLORS\n${v('colorUse')}\n\nMY FONTS\nHeadline: ${v('headlineFont')}\nBody: ${v('bodyFont')}\n\nMY CANVA SETUP\n1. Create a Brand Kit in Canva Pro/Business, or a “My Brand” folder + “My Brand Home” design in Canva Free.\n2. Organize primary, simple, icon, light, and dark logo versions if you have them.\n3. Save exact color codes and give every color a job.\n4. Use one headline font and one readable body font.\n5. Save 6–12 image examples that feel like your world.\n6. Create 3–5 templates you will actually use.\n7. Save one simple brand rules page.\n\nTHE REMOVE-THE-LOGO TEST\nIf the logo disappeared, would the colors, type, imagery, spacing, and voice still feel like you? If yes, you are building a real visual identity.`;
  if(type==='ai') return `${common}\nA NOTE ABOUT AI\nAI is a little like the ocean right now: powerful, wide open, and still being charted. Treat the first answer like a first draft, not a verdict. You are the navigator and creative director.\n\nHOW I WANT PEOPLE TO FEEL\n${v('feel')}\n\nWHAT I BELIEVE\n${v('belief')}\n\nWHO I AM HERE FOR\n${v('audience')}\n\nMY NATURAL VOICE\n${v('voiceNotes')}\n\nWORDS / PHRASES THAT FEEL LIKE ME\n${v('signature')}\n\nWHAT SHOULD NEVER SOUND LIKE ME\n${v('antivoice')}\n\nMY SIMPLE DESCRIPTION\n${v('oneLine')}\n\nWHAT I WANT TO BE KNOWN FOR\n${v('pillars')}\n\nFACTUAL CLAIMS I CAN SUPPORT\n${v('claims')}\n\nWHEN USING AI\nGive it real source material. Tell it the audience, goal, and channel. Ask it not to invent facts. Then read the result out loud. If it does not feel like you, tell it specifically what feels wrong and keep refining.`;
  return `${common}\nWHAT I WANT TO BE KNOWN FOR\n${v('pillars')}\n\nWHAT I BELIEVE\n${v('belief')}\n\nA STORY / LESSON THAT SHAPED ME\n${v('story')}\n\nWHAT MY AUDIENCE IS DEALING WITH\n${v('problem')}\n\nWHAT BETTER LOOKS LIKE FOR THEM\n${v('outcome')}\n\nCONTENT STARTERS\n• Explain why you believe what you believe—and what taught you that.\n• Share a lesson you learned the hard way that could save someone else time.\n• Answer the question your audience is afraid to ask out loud.\n• Show what “better” looks like with a real example.\n• Teach one small part of your approach.\n• Share a before/after in thinking, not only results.\n• Talk about something you refuse to fake or overpromise.\n• Share a behind-the-scenes decision that reflects your values.\n• Challenge a common assumption in your space with warmth and proof.\n• Tell a story that helps people feel the way you want your brand to make them feel.\n\nREPEATABLE CONTENT RHYTHM\nTeach something useful → share a point of view → tell a human story → show proof → invite a conversation. Repeat without needing to reinvent yourself every week.`;
}
const TITLES={brand:'My Brand Guide',voice:'My Brand Voice Guide',canva:'My Canva Brand Plan',ai:'My AI Writing Guide',content:'My Content Starter Map'};
function fileLabel(type){return `${safeName()}_${TITLES[type].replace(/^My /,'').replace(/\s+/g,'_')}`}
function makePDFBlob(type){
  if(!window.jspdf||!window.jspdf.jsPDF) return null;
  const {jsPDF}=window.jspdf; const doc=new jsPDF({unit:'pt',format:'letter'}); const margin=54; const width=504; let y=58;
  doc.setFillColor(143,98,110); doc.roundedRect(42,38,528,74,14,14,'F');
  doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(20); doc.text(TITLES[type],margin,72);
  doc.setFont('helvetica','normal'); doc.setFontSize(10); doc.text(v('brandName')||'My Brand',margin,94);
  y=138; doc.setTextColor(47,59,56);
  const lines=sections(type).split('\n');
  lines.forEach(line=>{
    const t=line.trim();
    if(!t){y+=8; return;}
    const isHead=t.length<55 && t===t.toUpperCase() && /[A-Z]/.test(t);
    if(isHead){y+=7; if(y>730){doc.addPage();y=58;} doc.setFont('helvetica','bold');doc.setFontSize(10);doc.setTextColor(143,98,110);doc.text(t,margin,y);y+=15;return;}
    doc.setFont('helvetica','normal');doc.setFontSize(10.5);doc.setTextColor(55,65,62);
    const wrapped=doc.splitTextToSize(line,width); const need=wrapped.length*14;
    if(y+need>750){doc.addPage();y=58;}
    doc.text(wrapped,margin,y); y+=need+3;
  });
  const pages=doc.getNumberOfPages();
  for(let i=1;i<=pages;i++){doc.setPage(i);doc.setFontSize(8);doc.setTextColor(130,136,133);doc.text(`Created with Find Your Brand • ${i} of ${pages}`,margin,770);}
  return doc.output('blob');
}
function saveBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1200)}
function downloadPDF(type){const blob=makePDFBlob(type);if(blob){saveBlob(blob,fileLabel(type)+'.pdf')}else{saveBlob(new Blob([sections(type)],{type:'text/plain'}),fileLabel(type)+'.txt');alert('Your browser could not create a PDF, so I saved the same guide as a text file instead.') }}
async function downloadEverything(){
  const types=['brand','voice','canva','ai','content'];
  if(window.JSZip){
    const zip=new JSZip();
    for(const type of types){const b=makePDFBlob(type);zip.file(fileLabel(type)+(b?'.pdf':'.txt'),b||sections(type));}
    zip.file('START HERE.txt',`YOUR BRAND KIT\n\nThese files were created from your answers. Start with your Brand Guide, then keep the Voice Guide and AI Writing Guide close when creating content. Use the Canva Plan while building your visual system. Your brand can evolve—come back and update the builder whenever something changes.\n\nRemember: AI is a collaborator, not the authority. If something does not feel like you, it is not finished yet.`);
    const blob=await zip.generateAsync({type:'blob'}); saveBlob(blob,safeName()+'_Brand_Kit.zip');
  }else{
    types.forEach((t,i)=>setTimeout(()=>downloadPDF(t),i*400));
    alert('I downloaded the files individually because the all-in-one download was unavailable in this browser.');
  }
}
function downloadGuide(){downloadPDF('brand')}
load();
