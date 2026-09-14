(function(){
  function clean(s){return (s||'').toString().trim();}
  function safePdfText(s){
    return clean(s)
      .replace(/\u2192/g,' - ')
      .replace(/\u2022/g,'- ')
      .replace(/[“”]/g,'"')
      .replace(/[‘’]/g,"'")
      .replace(/[–—]/g,'-')
      .replace(/\u00a0/g,' ');
  }
  function initials(name){
    const p=clean(name).split(/\s+/).filter(Boolean).slice(0,2);
    return (p.map(x=>x[0]).join('')||'YB').toUpperCase();
  }
  function hexToRgb(hex){
    const h=hex.replace('#','').trim();
    if(!/^[0-9a-fA-F]{6}$/.test(h))return null;
    return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];
  }
  const NAMED_COLORS={
    black:'#1F2322',white:'#FFFFFF',cream:'#FFF5E6',ivory:'#FFFFF0',beige:'#D8C7B2',tan:'#C6A477',brown:'#7A5745',
    gray:'#7C8582',grey:'#7C8582',charcoal:'#36413F',navy:'#243B5A',blue:'#4E79A7',teal:'#3C8585',turquoise:'#49A9A4',
    green:'#5E8264',sage:'#809A88',olive:'#7A7B4F',mint:'#A7CDB5',red:'#B85457',burgundy:'#7A3444',maroon:'#713642',
    pink:'#D88F9A',rose:'#C97578',purple:'#74586F',plum:'#74586F',lavender:'#A98FB8',orange:'#D77B45',yellow:'#D7B84B',gold:'#C79C5B'
  };
  function colorEntries(){
    const raw=clean(v('colors'));
    const entries=[];
    const seen=new Set();
    [...raw.matchAll(/#([0-9a-fA-F]{6})\b/g)].forEach(m=>{
      const hex=`#${m[1].toUpperCase()}`;
      if(!seen.has(hex)){entries.push({hex,label:hex});seen.add(hex);}
    });
    const lower=raw.toLowerCase();
    Object.entries(NAMED_COLORS).forEach(([name,hex])=>{
      if(entries.length>=5)return;
      const re=new RegExp(`\\b${name}\\b`,'i');
      if(re.test(lower) && !seen.has(hex.toUpperCase())){
        entries.push({hex,label:name.charAt(0).toUpperCase()+name.slice(1)});
        seen.add(hex.toUpperCase());
      }
    });
    const fallback=[
      {hex:'#8F626E',label:'Rose'},
      {hex:'#74586F',label:'Plum'},
      {hex:'#809A88',label:'Sage'},
      {hex:'#FFF8EF',label:'Cream'},
      {hex:'#263238',label:'Ink'}
    ];
    fallback.forEach(item=>{if(entries.length<5 && !seen.has(item.hex)){entries.push(item);seen.add(item.hex);}});
    return entries.slice(0,5);
  }
  function userPalette(){return colorEntries().map(x=>x.hex);}
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
  function wrap(doc,text,width){return doc.splitTextToSize(safePdfText(text),width);}
  function newContentPage(doc,palette,title,brand){
    doc.addPage();
    setFill(doc,'#FFFDF9'); doc.rect(0,0,612,792,'F');
    setFill(doc,palette[0]); doc.rect(0,0,612,10,'F');
    setText(doc,'#74586F'); doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.text('YOURBRAND BY EZ ENABLEMENT',54,36);
    setText(doc,'#263238'); doc.setFontSize(17); doc.text(safePdfText(title),54,62);
    doc.setFont('helvetica','normal'); doc.setFontSize(9); setText(doc,'#66736F'); doc.text(safePdfText(brand),54,79);
    setFill(doc,lightTint(palette[2],.75)); doc.roundedRect(505,31,53,24,12,12,'F');
    setText(doc,palette[2]); doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.text(initials(brand),531.5,46,{align:'center'});
    return 108;
  }
  function coverPage(doc,type,palette){
    const brand=clean(v('brandName'))||'My Personal Brand';
    const descriptor=clean(v('oneLine'))||'A personal brand built from what is true about you.';
    setFill(doc,'#FFF9F3'); doc.rect(0,0,612,792,'F');

    setFill(doc,lightTint(palette[0],.76)); doc.circle(540,82,102,'F');
    setFill(doc,lightTint(palette[2],.72)); doc.circle(69,720,92,'F');
    setFill(doc,palette[0]); doc.circle(518,94,34,'F');
    setFill(doc,palette[2]); doc.circle(92,690,22,'F');

    setText(doc,'#74586F'); doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.text('YOURBRAND',54,66);
    doc.setFont('helvetica','normal'); doc.setFontSize(8); setText(doc,'#66736F'); doc.text('A guided personal-brand experience by EZ Enablement',54,81);

    setFill(doc,palette[0]); doc.roundedRect(54,124,76,76,22,22,'F');
    setText(doc,contrastText(palette[0])); doc.setFont('helvetica','bold'); doc.setFontSize(25); doc.text(initials(brand),92,171,{align:'center'});

    setText(doc,'#263238'); doc.setFont('helvetica','bold'); doc.setFontSize(30);
    const titleLines=wrap(doc,TITLES[type],460); doc.text(titleLines,54,248);
    const afterTitle=248+(titleLines.length*34);
    setText(doc,palette[0]); doc.setFontSize(18);
    const brandLines=wrap(doc,brand,450).slice(0,2); doc.text(brandLines,54,afterTitle+16);
    const brandHeight=brandLines.length*21;
    doc.setFont('helvetica','normal'); doc.setFontSize(12); setText(doc,'#66736F');
    const descLines=wrap(doc,descriptor,450).slice(0,4); doc.text(descLines,54,afterTitle+25+brandHeight);

    const swatchY=afterTitle+75+brandHeight+(descLines.length*12);
    const swatches=palette.slice(0,4); let x=54;
    swatches.forEach(c=>{setFill(doc,c);doc.roundedRect(x,swatchY,62,14,7,7,'F');x+=72;});

    const boxY=Math.min(swatchY+49,610);
    setFill(doc,'#FFFFFF'); doc.roundedRect(54,boxY,504,108,18,18,'F');
    setText(doc,'#74586F'); doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.text('YOUR PERSONAL BRAND AT A GLANCE',74,boxY+26);
    doc.setFont('helvetica','normal'); doc.setFontSize(10.5); setText(doc,'#3D4946');
    const feel=clean(v('feel'))||'Still taking shape';
    const known=clean(v('pillars'))||'Still taking shape';
    doc.text(wrap(doc,`IMPRESSION: ${feel}`,460).slice(0,2),74,boxY+50);
    doc.text(wrap(doc,`KNOWN FOR: ${known}`,460).slice(0,2),74,boxY+78);

    doc.setFontSize(8); setText(doc,'#8A908D');
    doc.text('PERSONALIZED BRAND KIT - CREATED FROM YOUR ANSWERS',54,752);
  }
  function drawSwatchesPage(doc,palette,brand){
    let y=newContentPage(doc,palette,'Visual Direction Snapshot',brand);
    setText(doc,'#66736F');doc.setFont('helvetica','normal');doc.setFontSize(10.5);
    doc.text(wrap(doc,'A quick visual reference for the direction you described. Use it beside Canva, Google Slides, PowerPoint, a designer, or anyone helping you create.',500),54,y);
    y+=48;
    doc.setFont('helvetica','bold');doc.setFontSize(10);setText(doc,'#74586F');doc.text('YOUR COLORS',54,y);y+=20;
    const entries=colorEntries();
    entries.forEach((entry,i)=>{
      const col=i%3,row=Math.floor(i/3); const x=54+col*168, yy=y+row*94;
      setFill(doc,entry.hex);doc.roundedRect(x,yy,145,48,10,10,'F');
      setText(doc,contrastText(entry.hex));doc.setFont('helvetica','bold');doc.setFontSize(9);doc.text(safePdfText(entry.label),x+12,yy+20);
      doc.setFont('helvetica','normal');doc.setFontSize(7.5);doc.text(entry.hex.toUpperCase(),x+12,yy+35);
    });
    y+=Math.ceil(entries.length/3)*94+18;
    setText(doc,'#74586F');doc.setFont('helvetica','bold');doc.setFontSize(10);doc.text('TYPE DIRECTION',54,y);y+=22;
    setFill(doc,'#FFFFFF');doc.roundedRect(54,y,242,104,14,14,'F');
    setFill(doc,'#FFFFFF');doc.roundedRect(316,y,242,104,14,14,'F');
    setText(doc,'#263238');doc.setFont('helvetica','bold');doc.setFontSize(10);doc.text('HEADLINE FONT',70,y+26);
    doc.setFontSize(14);doc.text(wrap(doc,clean(v('headlineFont'))||'Not chosen yet',205).slice(0,2),70,y+49);
    setText(doc,'#263238');doc.setFont('helvetica','bold');doc.setFontSize(10);doc.text('BODY FONT',332,y+26);
    doc.setFontSize(14);doc.text(wrap(doc,clean(v('bodyFont'))||'Not chosen yet',205).slice(0,2),332,y+49);
    doc.setFont('helvetica','normal');doc.setFontSize(7.5);setText(doc,'#66736F');
    doc.text('PDF preview uses a standard font.',70,y+86);
    doc.text('Apply your selected font in your design tool.',332,y+86);
    y+=132;
    setText(doc,'#74586F');doc.setFont('helvetica','bold');doc.setFontSize(10);doc.text('VISUAL DIRECTION',54,y);y+=18;
    setText(doc,'#3D4946');doc.setFont('helvetica','normal');doc.setFontSize(11);
    doc.text(wrap(doc,clean(v('visualFeel'))||'Still taking shape',500),54,y);
    y+=48;
    setText(doc,'#74586F');doc.setFont('helvetica','bold');doc.setFontSize(10);doc.text('IMAGE / MOOD REFERENCES',54,y);y+=18;
    setText(doc,'#3D4946');doc.setFont('helvetica','normal');doc.setFontSize(10.5);
    doc.text(wrap(doc,clean(v('visualRefs'))||'Add your visual references as your brand evolves.',500),54,y);
  }
  function writeContent(doc,type,palette){
    const brand=clean(v('brandName'))||'My Personal Brand';
    let y=newContentPage(doc,palette,TITLES[type],brand);
    const margin=54,width=504;
    const lines=sections(type).split('\n');
    lines.forEach(line=>{
      const t=safePdfText(line);
      if(!t){y+=7;return;}
      const isHead=t.length<62 && t===t.toUpperCase() && /[A-Z]/.test(t);
      if(isHead){
        if(y>710)y=newContentPage(doc,palette,TITLES[type],brand);
        y+=8; setFill(doc,lightTint(palette[0],.88)); doc.roundedRect(margin,y-13,width,25,7,7,'F');
        setText(doc,palette[0]);doc.setFont('helvetica','bold');doc.setFontSize(9);doc.text(t,margin+12,y+3);y+=26;return;
      }
      doc.setFont('helvetica','normal');doc.setFontSize(10.5);setText(doc,'#3D4946');
      const wrapped=wrap(doc,t,width-12);const need=wrapped.length*14+4;
      if(y+need>740)y=newContentPage(doc,palette,TITLES[type],brand);
      doc.text(wrapped,margin+4,y);y+=need;
    });
    if(type==='canva')drawSwatchesPage(doc,palette,brand);
    else{
      y=newContentPage(doc,palette,'Personal Brand Snapshot',brand);
      setFill(doc,lightTint(palette[0],.9));doc.roundedRect(54,y,504,86,16,16,'F');
      setText(doc,palette[0]);doc.setFont('helvetica','bold');doc.setFontSize(9);doc.text('THE IMPRESSION I WANT TO CREATE',72,y+27);
      setText(doc,'#263238');doc.setFont('times','bold');doc.setFontSize(18);doc.text(wrap(doc,clean(v('feel'))||'Still taking shape',450).slice(0,2),72,y+54);
      y+=108;
      const cards=[['BELIEF',v('belief')],['AUDIENCE',v('audience')],['VOICE',v('voiceNotes')||v('threewords')],['KNOWN FOR',v('pillars')]];
      cards.forEach((pair,i)=>{
        const col=i%2,row=Math.floor(i/2),x=54+col*254,yy=y+row*126;
        setFill(doc,'#FFFFFF');doc.roundedRect(x,yy,238,110,14,14,'F');
        setText(doc,palette[(i+1)%3]);doc.setFont('helvetica','bold');doc.setFontSize(8);doc.text(pair[0],x+16,yy+24);
        setText(doc,'#3D4946');doc.setFont('helvetica','normal');doc.setFontSize(10);
        const txt=wrap(doc,clean(pair[1])||'Still taking shape',202).slice(0,5);doc.text(txt,x+16,yy+45);
      });
    }
  }
  function footerAllPages(doc,type,palette){
    const total=doc.getNumberOfPages();
    for(let i=1;i<=total;i++){
      doc.setPage(i);
      if(i>1){setFill(doc,palette[0]);doc.rect(54,763,28,2,'F');}
      doc.setFont('helvetica','normal');doc.setFontSize(7.5);setText(doc,'#8A908D');
      doc.text(`YourBrand by EZ Enablement - ${safePdfText(TITLES[type])}`,54,777);
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
