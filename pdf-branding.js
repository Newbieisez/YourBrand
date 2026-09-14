(function(){
  function clean(s){return (s||'').toString().trim();}
  function initials(name){
    const p=clean(name).split(/\s+/).filter(Boolean).slice(0,2);
    return (p.map(x=>x[0]).join('')||'YB').toUpperCase();
  }
  function hexToRgb(hex){
    const h=hex.replace('#','').trim();
    if(!/^[0-9a-fA-F]{6}$/.test(h))return null;
    return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];
  }
  function userPalette(){
    const raw=clean(v('colors'));
    const matches=[...raw.matchAll(/#([0-9a-fA-F]{6})\b/g)].map(m=>`#${m[1]}`);
    const unique=[...new Set(matches.map(x=>x.toUpperCase()))].slice(0,5);
    const fallback=['#8F626E','#74586F','#809A88','#FFF8EF','#263238'];
    const chosen=unique.length?unique:fallback;
    while(chosen.length<5) chosen.push(fallback[chosen.length]);
    return chosen.slice(0,5);
  }
  function setFill(doc,hex){const rgb=hexToRgb(hex)||[143,98,110];doc.setFillColor(...rgb);}
  function setText(doc,hex){const rgb=hexToRgb(hex)||[38,50,56];doc.setTextColor(...rgb);}
  function contrastText(hex){
    const [r,g,b]=hexToRgb(hex)||[143,98,110];
    const y=(r*299+g*587+b*114)/1000;
    return y>165?'#263238':'#FFFFFF';
  }
  function lightTint(hex,amount=.88){
    const [r,g,b]=hexToRgb(hex)||[143,98,110];
    return '#'+[r,g,b].map(c=>Math.round(c+(255-c)*amount).toString(16).padStart(2,'0')).join('');
  }
  function newContentPage(doc,palette,title,brand){
    doc.addPage();
    setFill(doc,'#FFFDF9'); doc.rect(0,0,612,792,'F');
    setFill(doc,palette[0]); doc.rect(0,0,612,10,'F');
    setText(doc,'#74586F'); doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.text('YOURBRAND BY EZ ENABLEMENT',54,36);
    setText(doc,'#263238'); doc.setFontSize(17); doc.text(title,54,62);
    doc.setFont('helvetica','normal'); doc.setFontSize(9); setText(doc,'#66736F'); doc.text(brand,54,79);
    setFill(doc,lightTint(palette[2],.75)); doc.roundedRect(505,31,53,24,12,12,'F');
    setText(doc,palette[2]); doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.text(initials(brand),531.5,46,{align:'center'});
    return 108;
  }
  function coverPage(doc,type,palette){
    const brand=clean(v('brandName'))||'My Brand';
    const descriptor=clean(v('oneLine'))||'A brand built from what is true about you.';
    setFill(doc,'#FFF9F3'); doc.rect(0,0,612,792,'F');

    setFill(doc,lightTint(palette[0],.76)); doc.circle(540,82,102,'F');
    setFill(doc,lightTint(palette[2],.72)); doc.circle(69,720,92,'F');
    setFill(doc,palette[0]); doc.circle(518,94,34,'F');
    setFill(doc,palette[2]); doc.circle(92,690,22,'F');

    setText(doc,'#74586F'); doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.text('YOURBRAND',54,66);
    doc.setFont('helvetica','normal'); doc.setFontSize(8); setText(doc,'#66736F'); doc.text('A guided brand-building experience by EZ Enablement',54,81);

    setFill(doc,palette[0]); doc.roundedRect(54,124,76,76,22,22,'F');
    setText(doc,contrastText(palette[0])); doc.setFont('helvetica','bold'); doc.setFontSize(25); doc.text(initials(brand),92,171,{align:'center'});

    setText(doc,'#263238'); doc.setFont('helvetica','bold'); doc.setFontSize(30);
    const titleLines=doc.splitTextToSize(TITLES[type],460); doc.text(titleLines,54,248);
    const afterTitle=248+(titleLines.length*34);
    setText(doc,palette[0]); doc.setFontSize(18); doc.text(brand,54,afterTitle+16);
    doc.setFont('helvetica','normal'); doc.setFontSize(12); setText(doc,'#66736F');
    const descLines=doc.splitTextToSize(descriptor,450); doc.text(descLines,54,afterTitle+47);

    const swatches=palette.slice(0,4); let x=54;
    swatches.forEach(c=>{setFill(doc,c);doc.roundedRect(x,afterTitle+98,62,14,7,7,'F');x+=72;});

    setFill(doc,'#FFFFFF'); doc.roundedRect(54,afterTitle+147,504,108,18,18,'F');
    setText(doc,'#74586F'); doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.text('YOUR BRAND AT A GLANCE',74,afterTitle+173);
    doc.setFont('helvetica','normal'); doc.setFontSize(10.5); setText(doc,'#3D4946');
    const feel=clean(v('feel'))||'Still taking shape';
    const known=clean(v('pillars'))||'Still taking shape';
    doc.text(doc.splitTextToSize(`FEEL: ${feel}`,460),74,afterTitle+195);
    doc.text(doc.splitTextToSize(`KNOWN FOR: ${known}`,460),74,afterTitle+220);

    doc.setFontSize(8); setText(doc,'#8A908D');
    doc.text('PERSONALIZED BRAND KIT  •  CREATED FROM YOUR ANSWERS',54,752);
  }
  function drawSwatchesPage(doc,palette,brand){
    let y=newContentPage(doc,palette,'Visual Brand Snapshot',brand);
    setText(doc,'#66736F');doc.setFont('helvetica','normal');doc.setFontSize(10.5);
    doc.text(doc.splitTextToSize('A quick visual reference for the brand direction you described. Use it beside Canva, a designer, or anyone helping you create.',500),54,y);
    y+=42;
    doc.setFont('helvetica','bold');doc.setFontSize(10);setText(doc,'#74586F');doc.text('YOUR COLORS',54,y);y+=20;
    const swatches=userPalette();
    swatches.forEach((c,i)=>{
      const col=i%3,row=Math.floor(i/3); const x=54+col*168, yy=y+row*94;
      setFill(doc,c);doc.roundedRect(x,yy,145,48,10,10,'F');
      setText(doc,contrastText(c));doc.setFont('helvetica','bold');doc.setFontSize(9);doc.text(c,x+12,yy+29);
    });
    y+=Math.ceil(swatches.length/3)*94+18;
    setText(doc,'#74586F');doc.setFont('helvetica','bold');doc.setFontSize(10);doc.text('TYPE DIRECTION',54,y);y+=22;
    setFill(doc,'#FFFFFF');doc.roundedRect(54,y,242,92,14,14,'F');
    setFill(doc,'#FFFFFF');doc.roundedRect(316,y,242,92,14,14,'F');
    setText(doc,'#263238');doc.setFont('times','bold');doc.setFontSize(20);doc.text(clean(v('headlineFont'))||'Headline font',70,y+35);
    doc.setFont('helvetica','normal');doc.setFontSize(8);setText(doc,'#66736F');doc.text('HEADLINE',70,y+58);
    setText(doc,'#263238');doc.setFont('helvetica','normal');doc.setFontSize(15);doc.text(clean(v('bodyFont'))||'Body font',332,y+35);
    doc.setFontSize(8);setText(doc,'#66736F');doc.text('BODY COPY',332,y+58);
    y+=120;
    setText(doc,'#74586F');doc.setFont('helvetica','bold');doc.setFontSize(10);doc.text('VISUAL FEEL',54,y);y+=18;
    setText(doc,'#3D4946');doc.setFont('helvetica','normal');doc.setFontSize(11);
    doc.text(doc.splitTextToSize(clean(v('visualFeel'))||'Still taking shape',500),54,y);
    y+=48;
    setText(doc,'#74586F');doc.setFont('helvetica','bold');doc.setFontSize(10);doc.text('IMAGE / MOOD REFERENCES',54,y);y+=18;
    setText(doc,'#3D4946');doc.setFont('helvetica','normal');doc.setFontSize(10.5);
    doc.text(doc.splitTextToSize(clean(v('visualRefs'))||'Add your visual references as your brand evolves.',500),54,y);
  }
  function writeContent(doc,type,palette){
    const brand=clean(v('brandName'))||'My Brand';
    let y=newContentPage(doc,palette,TITLES[type],brand);
    const margin=54,width=504;
    const lines=sections(type).split('\n');
    lines.forEach(line=>{
      const t=line.trim();
      if(!t){y+=7;return;}
      const isHead=t.length<62 && t===t.toUpperCase() && /[A-Z]/.test(t);
      if(isHead){
        if(y>710)y=newContentPage(doc,palette,TITLES[type],brand);
        y+=8; setFill(doc,lightTint(palette[0],.88)); doc.roundedRect(margin,y-13,width,25,7,7,'F');
        setText(doc,palette[0]);doc.setFont('helvetica','bold');doc.setFontSize(9);doc.text(t,margin+12,y+3);y+=26;return;
      }
      doc.setFont('helvetica','normal');doc.setFontSize(10.5);setText(doc,'#3D4946');
      const wrapped=doc.splitTextToSize(line,width-8);const need=wrapped.length*14+4;
      if(y+need>740)y=newContentPage(doc,palette,TITLES[type],brand);
      doc.text(wrapped,margin+4,y);y+=need;
    });
    if(type==='canva')drawSwatchesPage(doc,palette,brand);
    else{
      y=newContentPage(doc,palette,'Brand Snapshot',brand);
      setFill(doc,lightTint(palette[0],.9));doc.roundedRect(54,y,504,86,16,16,'F');
      setText(doc,palette[0]);doc.setFont('helvetica','bold');doc.setFontSize(9);doc.text('WHAT SHOULD PEOPLE FEEL?',72,y+27);
      setText(doc,'#263238');doc.setFont('times','bold');doc.setFontSize(18);doc.text(doc.splitTextToSize(clean(v('feel'))||'Still taking shape',450),72,y+54);
      y+=108;
      const cards=[['BELIEF',v('belief')],['AUDIENCE',v('audience')],['VOICE',v('voiceNotes')||v('threewords')],['KNOWN FOR',v('pillars')]];
      cards.forEach((pair,i)=>{
        const col=i%2,row=Math.floor(i/2),x=54+col*254,yy=y+row*126;
        setFill(doc,'#FFFFFF');doc.roundedRect(x,yy,238,110,14,14,'F');
        setText(doc,palette[(i+1)%3]);doc.setFont('helvetica','bold');doc.setFontSize(8);doc.text(pair[0],x+16,yy+24);
        setText(doc,'#3D4946');doc.setFont('helvetica','normal');doc.setFontSize(10);
        const txt=doc.splitTextToSize(clean(pair[1])||'Still taking shape',202).slice(0,5);doc.text(txt,x+16,yy+45);
      });
    }
  }
  function footerAllPages(doc,type,palette){
    const total=doc.getNumberOfPages();
    for(let i=1;i<=total;i++){
      doc.setPage(i);
      if(i>1){setFill(doc,palette[0]);doc.rect(54,763,28,2,'F');}
      doc.setFont('helvetica','normal');doc.setFontSize(7.5);setText(doc,'#8A908D');
      doc.text(`YourBrand by EZ Enablement  •  ${TITLES[type]}`,54,777);
      doc.text(`${i} / ${total}`,558,777,{align:'right'});
    }
  }

  window.makePDFBlob=function(type){
    if(!window.jspdf||!window.jspdf.jsPDF)return null;
    const {jsPDF}=window.jspdf;
    const doc=new jsPDF({unit:'pt',format:'letter'});
    const palette=userPalette();
    coverPage(doc,type,palette);
    writeContent(doc,type,palette);
    footerAllPages(doc,type,palette);
    return doc.output('blob');
  };
})();
