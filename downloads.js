window.downloadEverything = async function(){
  const files=[
    ['brand','01_My_Brand_Guide'],
    ['voice','02_My_Brand_Voice_Guide'],
    ['canva','03_My_Canva_Brand_Plan'],
    ['ai','04_My_AI_Writing_Guide'],
    ['content','05_My_Content_Starter_Map']
  ];

  if(window.JSZip){
    const zip=new JSZip();
    const brand=v('brandName')||'My Brand';
    const startHere=`WELCOME TO YOUR BRAND KIT\n\nThis package was created from the answers you gave in YourBrand. Nothing here is a generic workbook. It is a working set of references you can keep using as your brand grows.\n\nWHAT IS INSIDE\n\n01 · MY BRAND GUIDE\nYour brand foundation: who you are here for, what you believe, what you want to be known for, your message, and the core decisions that keep the brand consistent.\nUse it when writing your website, briefing a designer or marketer, or deciding whether something feels on-brand.\n\n02 · MY BRAND VOICE GUIDE\nHow you naturally communicate, language that sounds like you, and styles you want to avoid.\nUse it when writing emails, social posts, presentations, website copy, or when someone else is writing for you.\n\n03 · MY CANVA BRAND PLAN\nYour visual direction, colors, fonts, image style, Canva setup, and practical next steps.\nUse it while creating your Canva Brand Kit or Brand Home, mood board, and reusable templates.\n\n04 · MY AI WRITING GUIDE\nYour brand context organized for AI tools.\nUse it with ChatGPT, Claude, Gemini, or another AI assistant. Give the AI this guide as context, then keep shaping the result until it feels like you.\n\n05 · MY CONTENT STARTER MAP\nPersonalized directions for what you can teach, share, explain, challenge, and talk about.\nUse it whenever you are unsure what to post, write, teach, or create next.\n\nHOW TO USE THIS KIT\nStart with your Brand Guide. Keep your Voice Guide and AI Writing Guide close whenever you create. Use your Canva Plan when you design. Pull from your Content Starter Map when you need ideas.\n\nYour brand is allowed to evolve. Come back to YourBrand and build a fresh version whenever something meaningful changes.\n\nA NOTE ABOUT AI\nAI is a collaborator, not the authority. Review facts, claims, originality, tone, and suitability before you publish anything. If something does not feel like you, it is not finished yet.\n\nBrand: ${brand}\nCreated with YourBrand by EZ Enablement.`;

    zip.file('00_START_HERE.txt',startHere);

    for(const [type,name] of files){
      const blob=makePDFBlob(type);
      zip.file(name+(blob?'.pdf':'.txt'),blob||sections(type));
    }

    const blob=await zip.generateAsync({type:'blob'});
    saveBlob(blob,safeName()+'_Complete_Brand_Kit.zip');
  }else{
    files.forEach(([type],i)=>setTimeout(()=>downloadPDF(type),i*400));
    alert('Your browser could not create one ZIP, so your personalized files were downloaded individually instead.');
  }
};
