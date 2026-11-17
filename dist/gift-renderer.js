/* The same SVG geometry drives the worktable, thumbnails and exported PNGs. */
function giftXML(value) { return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c])); }
function giftTint(hex,amount) {
  const rgb=hex.replace('#','').match(/../g).map(x=>parseInt(x,16));
  return '#'+rgb.map(n=>Math.round(n+(amount>=0?255-n:n)*amount).toString(16).padStart(2,'0')).join('');
}
function giftWrapShapes(style,layer) {
  const back={
    classic:[['M166 294 344 220 507 327 678 220 841 300 607 890 422 890Z',.08,.84]],
    fan:[['M100 410Q170 245 285 225L500 347 705 214Q835 230 905 415L615 911 397 911Z',.13,.91]],
    petal:[['M132 373Q110 197 329 213Q479 246 498 492L430 882Z',.14,.93],['M493 492Q509 214 715 206Q907 219 865 389L599 887Z',-.05,.88],['M297 312Q500 194 727 320L601 901 409 901Z',.28,.7]],
    cone:[['M269 245 779 298 587 933 443 933Z',.1,.93]],
    newsprint:[['M160 286 356 217 507 325 700 208 855 307 607 900 418 900Z',.22,.98]],
    sheer:[['M129 341 352 193 508 333 731 208 892 366 624 904 404 904Z',.65,.42],['M209 301 500 220 794 300 613 908 415 908Z',.85,.22]],
    none:[],
  };
  const front={
    classic:[['M180 470 474 565 551 522 820 470 602 900 417 900Z',.0,.96]],
    fan:[['M124 493Q302 594 500 542Q694 588 879 489L627 927 381 927Z',.08,.98]],
    petal:[['M165 454Q373 452 548 693L504 922 394 898Z',.17,.99],['M833 446Q610 453 451 699L495 923 619 899Z',-.08,.97],['M332 574Q498 487 680 576L586 925 421 925Z',.3,.94]],
    cone:[['M256 470 753 412 581 944 438 944Z',.04,.98]],
    newsprint:[['M165 471 474 571 556 519 835 462 607 906 414 906Z',.15,.99]],
    sheer:[['M157 475Q335 461 500 568Q681 469 845 477L617 924 398 924Z',.8,.53]],
    none:[],
  };
  return (layer==='back'?back:front)[style] || [];
}
function giftWrapMarkup(config,layer,hidePaper=false) {
  const style=WRAP_STYLES[config.wrapStyle]?config.wrapStyle:'classic';
  const paper=PAPERS[config.paper]?.color || PAPERS.cream.color;
  const pattern=`gift-news-${paper.slice(1)}-${layer}`;
  let result=style==='newsprint'?`<defs><pattern id="${pattern}" width="226" height="103" patternUnits="userSpaceOnUse"><text x="10" y="24" font-family="Georgia,serif" font-size="17" fill="#566047" opacity=".4">ĐƠM. / LITTLE NOTES</text><path d="M10 38H210M10 49H169M10 60H208M10 71H199M10 82H150" stroke="#566047" stroke-width="2" opacity=".18"/></pattern></defs>`:'';
  if(!hidePaper) {
    result+=giftWrapShapes(style,layer).map(([d,tint,opacity])=>`<path d="${d}" fill="${giftTint(paper,tint)}" fill-opacity="${opacity}" stroke="${giftTint(paper,.45)}" stroke-opacity=".5" stroke-width="2"/>${style==='newsprint'?`<path d="${d}" fill="url(#${pattern})"/>`:''}`).join('');
    if(layer==='front' && style!=='none') {
      const folds=style==='fan'?'M500 915 216 548M500 915 319 572M500 915 413 570M500 915 592 566M500 915 696 563M500 915 795 529':style==='petal'?'M495 914Q493 711 291 501M504 915Q511 687 728 503':'M493 895 558 541';
      result+=`<path d="${folds}" stroke="#fff" stroke-width="4" stroke-opacity=".35" fill="none"/><text x="500" y="742" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="39" fill="#536149" fill-opacity=".7">đơm.</text>`;
    }
  }
  if(layer==='front') result+=`<path d="M410 790 590 780M500 785C370 680 380 840 500 785C650 690 620 860 500 785L430 880M500 785 560 890" stroke="${RIBBONS[config.ribbon]?.color || RIBBONS.wine.color}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  return result;
}
function giftDecorMarkup(id) {
  const outline='stroke="#fffaf0" stroke-width="5" stroke-linejoin="round"';
  if(id==='daisy')return Array.from({length:8},(_,i)=>`<ellipse cx="50" cy="25" rx="11" ry="21" fill="#fff9e8" stroke="#d5cdb5" stroke-width=".6" transform="rotate(${i*45} 50 50)"/>`).join('')+'<circle cx="50" cy="50" r="15" fill="#c5a65e"/><circle cx="45" cy="45" r="4" fill="#ead9a0" opacity=".5"/>';
  if(id==='heart')return `<path d="M50 88C15 64 2 42 15 24C26 10 43 16 50 30C60 12 78 12 88 27C99 46 78 69 50 88Z" fill="#a65f65" ${outline}/><path d="M24 28Q31 21 39 28" fill="none" stroke="#ddaba9" stroke-width="4" stroke-linecap="round"/>`;
  if(id==='love')return '<rect x="4" y="24" width="92" height="52" rx="4" fill="#f5ead8" stroke="#ab6064" stroke-width="2"/><rect x="10" y="30" width="80" height="40" rx="2" fill="none" stroke="#ab6064" stroke-width=".8" stroke-dasharray="3 3"/><text x="50" y="57" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="19" fill="#8b424b">with love</text>';
  if(id==='smile')return `<circle cx="50" cy="50" r="40" fill="#e4cc77" ${outline}/><path d="M30 59Q50 83 71 57" fill="none" stroke="#68714b" stroke-width="3" stroke-linecap="round"/><ellipse cx="35" cy="40" rx="3" ry="4" fill="#68714b"/><ellipse cx="65" cy="40" rx="3" ry="4" fill="#68714b"/>`;
  if(id==='sparkle')return `<path d="M50 4 62 36 94 50 62 63 50 96 37 63 4 50 37 37Z" fill="#baabc9" ${outline}/><path d="M50 21V78M21 50H78" stroke="#eadff0" stroke-width="1.6"/>`;
  if(id==='dom')return `<circle cx="50" cy="50" r="42" fill="#71815b" ${outline}/><circle cx="50" cy="50" r="34" fill="none" stroke="#e9e5ca" stroke-width="1" stroke-dasharray="2 3"/><text x="50" y="61" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="37" fill="#f9f4df">đ.</text>`;
  const chain='<circle cx="50" cy="9" r="6" fill="none" stroke="#a38b51" stroke-width="3"/><path d="M50 15V29" stroke="#b79b61" stroke-width="3"/>';
  if(id==='pearl')return chain+'<defs><radialGradient id="gift-pearl"><stop stop-color="#fffdf3"/><stop offset=".65" stop-color="#eee7d5"/><stop offset="1" stop-color="#c2b89e"/></radialGradient></defs><circle cx="50" cy="42" r="13" fill="url(#gift-pearl)"/><circle cx="50" cy="73" r="19" fill="url(#gift-pearl)"/><circle cx="45" cy="67" r="4" fill="#fff" opacity=".8"/>';
  if(id==='goldheart')return chain+'<path d="M50 88C17 67 10 47 21 35C31 25 44 30 50 41C57 28 72 27 81 38C93 54 75 75 50 88Z" fill="#c4a76d" stroke="#947944" stroke-width="2"/><path d="M28 40Q35 33 42 41" fill="none" stroke="#e9d7a5" stroke-width="4" stroke-linecap="round"/>';
  if(id==='goldstar')return chain+'<path d="M50 27 61 48 85 52 67 69 71 93 50 82 29 93 33 69 15 52 39 48Z" fill="#cdb47d" stroke="#9c834e" stroke-width="2"/><path d="M50 37 55 53 73 56" fill="none" stroke="#f5e5b7" stroke-width="3"/>';
  if(id==='butterfly')return chain+'<path d="M49 57C13 20 3 36 15 58C-1 85 32 93 49 66C70 96 102 83 85 60C103 30 76 27 51 57Z" fill="#d7b1b4" stroke="#a58d58" stroke-width="2"/><path d="M50 49V82M47 47 41 39M53 47 59 39M42 57 25 48M57 60 74 48" fill="none" stroke="#a58d58" stroke-width="2" stroke-linecap="round"/>';
  return '';
}
function giftIconSVG(id) { return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true">${giftDecorMarkup(id)}</svg>`; }
let giftMeasureContext;
function giftMeasure(text,font) {
  if(!giftMeasureContext && typeof document!=='undefined')giftMeasureContext=document.createElement('canvas').getContext('2d');
  if(giftMeasureContext){giftMeasureContext.font=font;return giftMeasureContext.measureText(text).width;}
  return String(text).length*7;
}
function giftMessageLines(text,width,font) {
  const lines=[];
  for(const paragraph of String(text).trim().split(/\n+/)) {
    let line='';
    for(const word of paragraph.split(/\s+/).filter(Boolean)) {
      if(giftMeasure(word,font)>width) {
        if(line){lines.push(line);line='';}
        for(const letter of Array.from(word)){if(giftMeasure(line+letter,font)>width && line){lines.push(line);line=letter;}else line+=letter;}
      }else if(line && giftMeasure(line+' '+word,font)>width){lines.push(line);line=word;}
      else line=line?line+' '+word:word;
    }
    if(line)lines.push(line);
  }
  return lines;
}
function giftLineFont(text,width,start,family='Georgia,serif',style='italic') {
  let size=start;while(size>5 && giftMeasure(text,`${style} ${size}px ${family}`)>width)size-=.5;return size;
}
function giftCardSVG(greeting,face='front') {
  const type=GREETING_TYPES[greeting.type]?greeting.type:'mini';
  const height=320/GREETING_TYPES[type].ratio;
  const pink=type==='heart', ink=pink?'#904e58':'#566849';
  let shell=type==='heart'?'<path d="M160 299C38 218 5 137 44 74C73 29 134 36 160 84C191 30 248 32 278 80C317 145 248 238 160 299Z" fill="#edd1d2" stroke="#b58287" stroke-width="1.4"/>':type==='arch'?`<path d="M14 ${height-14}V106C14-16 306-16 306 106V${height-14}Z" fill="#dce3cb" stroke="#a2ae8b" stroke-width="1.4"/>`:`<rect x="10" y="10" width="300" height="${height-20}" rx="3" fill="${type==='botanical'?'#e8eadb':'#faf4e5'}" stroke="#c2c8ad" stroke-width="1.4"/>`;
  if(type==='none')return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 ${height}"><path d="M105 70 215 160M215 70 105 160" stroke="#b9c2a9" stroke-width="3"/></svg>`;
  if(face==='front'){
    if(type==='botanical')shell+='<g fill="none" stroke="#8b9e77" stroke-width="1.8"><path d="M35 195Q79 130 47 43M51 132C25 143 20 113 51 132M50 90C80 92 84 64 50 90M49 43C14 34 40 6 49 26C72 7 88 38 49 43M276 192Q252 155 279 125"/></g>';
    if(type==='polaroid')shell+=`<rect x="29" y="27" width="262" height="${height-88}" fill="#e3e7d5"/><g transform="translate(117 53) scale(.9)">${giftDecorMarkup('daisy')}</g>`;
    if(type==='arch')shell+=`<path d="M47 ${height-39}V108C47 27 273 27 273 108V${height-39}" fill="none" stroke="#a1b18a" stroke-width="1"/><g transform="translate(133 80) scale(.55)">${giftDecorMarkup('daisy')}</g>`;
    const y=type==='heart'?149:type==='polaroid'?height-42:type==='arch'?height-80:height*.49;
    shell+=`<text x="160" y="${y}" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="${type==='heart'?25:28}" fill="${ink}">${type==='heart'?'a little love.':type==='polaroid'?'a little moment.':'a little flower,'}</text>`;
    if(type!=='polaroid')shell+=`<text x="160" y="${y+31}" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="23" fill="${ink}">${type==='heart'?'đơm.':'a little love.'}</text>`;
    if(greeting.to){const text='Gửi '+greeting.to;const size=giftLineFont(text,type==='heart'?145:260,10,'Arial,sans-serif','normal');shell+=`<text x="160" y="${type==='heart'?211:type==='polaroid'?height-19:height-30}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${size}" fill="${ink}">${giftXML(text)}</text>`;}
  }else{
    const box=type==='heart'?{x:86,y:111,width:148,height:115}:type==='arch'?{x:40,y:91,width:240,height:height-145}:{x:34,y:62,width:252,height:height-115};
    const family=greeting.writing==='print'?'Arial,sans-serif':'Georgia,serif';
    const style=greeting.writing==='print'?'normal':'italic';
    let size=type==='heart'?11:15;
    const message=greeting.message || 'Viết một chút thương ở đây…';
    let lines=giftMessageLines(message,box.width,`${style} ${size}px ${family}`);
    while(lines.length*size*1.45>box.height && size>4){size-=.5;lines=giftMessageLines(message,box.width,`${style} ${size}px ${family}`);}
    const toY=type==='heart'?93:type==='arch'?71:43;
    const toText=greeting.to?'Gửi '+greeting.to+',':'Gửi người thương,';
    shell+=`<text x="${box.x}" y="${toY}" font-family="Georgia,serif" font-style="italic" font-size="${giftLineFont(toText,box.width,type==='heart'?11:13)}" fill="${ink}">${giftXML(toText)}</text><text font-family="${family}" font-style="${style}" font-size="${size}" fill="${ink}">${lines.map((line,i)=>`<tspan x="${box.x}" y="${box.y+i*size*1.45}">${giftXML(line)}</tspan>`).join('')}</text>`;
    if(greeting.from){const text='Thương, '+greeting.from;shell+=`<text x="${type==='heart'?160:box.x+box.width}" y="${type==='heart'?238:box.y+box.height+17}" text-anchor="${type==='heart'?'middle':'end'}" font-family="Georgia,serif" font-style="italic" font-size="${giftLineFont(text,type==='heart'?114:box.width,type==='heart'?10:12)}" fill="${ink}">${giftXML(text)}</text>`;}
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 ${height}" width="320" height="${height}">${shell}</svg>`;
}
function giftPieceSize(piece,isCard,boardWidth) {
  const width=boardWidth*(isCard ? .23 : .13)*piece.scale;
  return {width,height:isCard?width/GREETING_TYPES[piece.type].ratio:width};
}
function giftPiecesMarkup(config,width,height) {
  let markup='';
  const pieces=[...config.addOns];
  if(config.greeting.type!=='none')pieces.push({...config.greeting,uid:'greeting'});
  for(const piece of pieces){
    const isCard=piece.uid==='greeting'; const size=giftPieceSize(piece,isCard,width);
    const x=piece.x/100*width,y=piece.y/100*height;
    const svg=isCard?giftCardSVG(piece):giftIconSVG(piece.id);
    markup+=`<g transform="translate(${x} ${y}) rotate(${piece.rotation})"><svg x="${-size.width/2}" y="${-size.height/2}" width="${size.width}" height="${size.height}" viewBox="${isCard?`0 0 320 ${320/GREETING_TYPES[piece.type].ratio}`:'0 0 100 100'}">${svg.slice(svg.indexOf('>')+1,svg.lastIndexOf('</svg>'))}</svg></g>`;
  }
  return markup;
}
function buildPackagingSVG(config,layer,width,height,{hidePaper=false,includePieces=false}={}) {
  const viewHeight=1000*height/width;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 ${viewHeight}" width="${width}" height="${height}" preserveAspectRatio="none"><g transform="scale(1 ${height/width})">${giftWrapMarkup(config,layer,hidePaper)}</g>${includePieces?giftPiecesMarkup(config,1000,viewHeight):''}</svg>`;
}
const giftImageCache=new Map();
async function giftSVGImage(svg) {
  if(giftImageCache.has(svg))return giftImageCache.get(svg);
  const pending=new Promise((resolve,reject)=>{
    const image=new Image(); const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}));
    const cleanup=()=>{clearTimeout(timer);URL.revokeObjectURL(url);image.onload=null;image.onerror=null;};
    const timer=setTimeout(()=>{cleanup();reject(new Error('Gift image timed out'));},5000);
    image.onload=()=>{cleanup();resolve(image);}; image.onerror=()=>{cleanup();reject(new Error('Gift image unavailable'));}; image.src=url;
  });
  giftImageCache.set(svg,pending);
  pending.catch(()=>giftImageCache.delete(svg));
  if(giftImageCache.size>24)giftImageCache.delete(giftImageCache.keys().next().value);
  return pending;
}
async function paintGiftLayer(ctx,config,layer,bounds) {
  const svg=buildPackagingSVG(config,layer,bounds.width,bounds.height,{includePieces:layer==='front'});
  const image=await giftSVGImage(svg);ctx.drawImage(image,bounds.x,bounds.y,bounds.width,bounds.height);
}
