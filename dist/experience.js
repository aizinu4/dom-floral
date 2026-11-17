/* The little studio: mood journey, finishing touches, and a postcard to keep. */
const heroDate = $('#hero-date');
heroDate.textContent = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date());

$('.canvas-toolbar > div').insertAdjacentHTML('afterbegin', '<button id="natural-arrange" class="icon-text" title="Sắp các cành thành một dáng bó tự nhiên">✳ <span>Xếp tự nhiên</span></button>');
$('.wrap-panel fieldset').insertAdjacentHTML('afterend', `<fieldset class="ribbon-field"><legend>02 / Thắt một chiếc nơ</legend><div class="ribbon-options" aria-label="Chọn màu nơ">${Object.entries(RIBBONS).map(([id,ribbon]) => `<button type="button" class="ribbon-swatch" data-ribbon="${id}" style="--ribbon-color:${ribbon.color}" aria-label="Nơ ${ribbon.name.toLowerCase()}" aria-pressed="false"><span></span></button>`).join('')}</div><span class="ribbon-name" id="ribbon-name"></span></fieldset>`);
$('.note-label').textContent = '03 / Một lời nhắn nhỏ';
$('#prepare-order').insertAdjacentHTML('beforebegin', '<button class="button button-green pack-button" id="pack-bouquet">Gói bó này <span>♡</span></button><span class="pack-caption">Đặt tên, viết thiệp & giữ lại một chút thương.</span>');
$('#prepare-order').classList.replace('button-green', 'button-outline');
$('#natural-arrange').addEventListener('click', arrangeNaturally);

function syncFinishingTouches() {
  $$('.ribbon-swatch').forEach(button => button.setAttribute('aria-pressed', button.dataset.ribbon === state.ribbon));
  $('#ribbon-name').textContent = `${RIBBONS[state.ribbon].name} · Đã gồm trong giá gói`;
  $('#pack-bouquet').disabled = !state.stems.length;
  $('#natural-arrange').disabled = !state.stems.length;
}
document.addEventListener('bouquet:updated', syncFinishingTouches);
$$('.ribbon-swatch').forEach(button => button.addEventListener('click', () => { state.ribbon = button.dataset.ribbon; renderBouquet(); persist(); animatePaper(); }));
syncFinishingTouches();

// Three small questions, with a real price ceiling for the suggested stems.
$('#moods .section-heading').insertAdjacentHTML('afterend', '<div class="mood-journey-invite reveal"><div class="mood-journey-doodle" aria-hidden="true">♡<span>✳</span></div><div><span class="eyebrow">LET YOUR FEELINGS PICK THE FLOWERS</span><h3>Chưa biết chọn gì? Kể Đơm nghe.</h3><p>Ba câu hỏi nhỏ. Một bó hoa dành riêng cho cảm xúc của bạn.</p></div><button class="button button-green" data-start-mood>Tìm bó hoa của mình <span>↗</span></button></div>');

document.body.insertAdjacentHTML('beforeend', `
<dialog class="journey-dialog" id="journey-dialog" aria-labelledby="journey-title">
  <button class="dialog-close" data-close="journey-dialog" aria-label="Đóng hành trình chọn hoa">×</button>
  <div class="eyebrow">A LITTLE CONVERSATION WITH ĐƠM.</div>
  <div class="journey-progress" aria-label="Tiến trình chọn hoa"><span></span><span></span><span></span></div>
  <span class="journey-counter" id="journey-counter"></span>
  <h2 id="journey-title" tabindex="-1"></h2><p class="journey-description" id="journey-description"></p>
  <div id="journey-choices" class="journey-choices"></div><div id="journey-result" hidden></div>
  <div class="journey-navigation"><button class="text-link" id="journey-back">← Quay lại</button><button class="button button-green" id="journey-next">Tiếp một chút <span>→</span></button></div>
</dialog>
<dialog class="postcard-dialog" id="postcard-dialog" aria-labelledby="postcard-heading">
  <button class="dialog-close" data-close="postcard-dialog" aria-label="Đóng bưu thiếp">×</button>
  <div class="postcard-layout"><div class="postcard-preview-wrap"><div class="postcard-loading" id="postcard-loading" role="status">Đơm đang gói một chút thương…</div><img id="postcard-preview" alt="Bưu thiếp bó hoa bạn vừa tự phối" width="1080" height="1350"><span class="postcard-preview-note">một bản duy nhất, được đơm bởi bạn.</span></div>
  <div class="postcard-editor"><div class="eyebrow">A LITTLE FLOWER. A LITTLE KEEPSAKE.</div><h2 id="postcard-heading">Bó hoa này,<br><em>có một cái tên.</em></h2><p>Giữ lại cảm xúc hôm nay bằng một tấm bưu thiếp nhỏ.</p>
    <label for="postcard-title">Bạn gọi bó hoa này là gì?<input id="postcard-title" maxlength="50" placeholder="Một chút thương"></label>
    <label for="postcard-author">Được đơm bởi<input id="postcard-author" maxlength="40" placeholder="Tên hoặc biệt danh của bạn"></label>
    <label for="postcard-message">Một dòng dành cho người nhận<textarea id="postcard-message" rows="3" maxlength="160" placeholder="Mong ngày của bạn dịu dàng như những cành hoa này."></textarea></label>
    <div class="postcard-actions"><button class="button button-green" id="save-postcard" disabled>Tải bưu thiếp <span>↓</span></button><button class="button button-outline" id="share-postcard" disabled>Chia sẻ <span>↗</span></button></div>
    <button class="text-link" id="order-from-postcard">Chuẩn bị phiếu đặt bó này <span>→</span></button><span class="small-note">Bưu thiếp PNG · 1080 × 1350 px<br>Bạn đang lưu một ý tưởng. Đơn hoa cần được tiệm xác nhận.</span>
  </div></div>
</dialog>
<dialog class="journal-dialog" id="journal-dialog" aria-labelledby="journal-title"><button class="dialog-close" data-close="journal-dialog" aria-label="Đóng trang nhật ký">×</button><div class="eyebrow" id="journal-category"></div><h2 id="journal-title"></h2><div class="journal-article" id="journal-article"></div><span class="story-signature">Với thương mến, Đơm.</span></dialog>`);

const JOURNEY_STEPS = [
  { title: 'Bó hoa này dành cho ai?', copy: 'Một người đặc biệt, hay chính bạn cũng được mà.', key: 'recipient', choices: [ ['self','✳','Cho chính mình','Hôm nay mình chọn mình.'], ['love','♡','Người mình thương','Gửi một điều chưa kịp nói.'], ['friend','☼','Một người bạn','Có bạn, ngày vui hơn.'], ['family','⌂','Người trong nhà','Một chút thương quen thuộc.'] ] },
  { title: 'Bạn muốn gửi cảm giác gì?', copy: 'Cứ chọn điều gần với lòng mình nhất.', key: 'feeling', choices: [ ['gentle','☁','Một cái ôm nhỏ','Dịu dàng và được vỗ về.'], ['love','♡','Thương, thật nhiều','Ấm áp, gần gũi, chân thành.'], ['happy','☼','Một túi nắng','Vui tươi, trong trẻo, rạng rỡ.'], ['self','✳','Một khởi đầu mới','Tự do và đầy hy vọng.'] ] },
  { title: 'Mình dành bao nhiêu cho chút thương này?', copy: 'Đơm sẽ chọn hoa trong mức bạn muốn, gồm kiểu gói, thiệp và phụ kiện đang chọn.', key: 'budget', choices: [ ['150000','01','Đến 150.000đ','Một bó nhỏ, đủ làm vui.'], ['250000','02','Đến 250.000đ','Thêm một chút đầy đặn.'], ['400000','03','Đến 400.000đ','Gói ghém thật nhiều thương.'] ] },
];
let journey = { step: 0, recipient: null, feeling: null, budget: null, replacementConfirmed: false };
let recommendation = null;
function startJourney() { journey = { step: 0, recipient: null, feeling: null, budget: null, replacementConfirmed: false }; recommendation = null; renderJourney(); $('#journey-dialog').showModal(); }
function renderJourney() {
  const result = journey.step === 3;
  $('#journey-counter').textContent = result ? 'DÀNH RIÊNG CHO CẢM XÚC CỦA BẠN' : `CÂU HỎI 0${journey.step + 1} / 03`;
  $$('.journey-progress span').forEach((el,i) => el.classList.toggle('complete', result || i <= journey.step));
  $('#journey-choices').hidden = result;
  $('#journey-result').hidden = !result;
  $('#journey-back').hidden = journey.step === 0;
  $('#journey-next').disabled = !result && !journey[JOURNEY_STEPS[journey.step].key];
  $('#journey-next').innerHTML = result ? 'Đơm thử bó này <span>↗</span>' : journey.step === 2 ? 'Gặp bó hoa của mình <span>↗</span>' : 'Tiếp một chút <span>→</span>';
  if (result) { renderRecommendation(); return; }
  const step = JOURNEY_STEPS[journey.step];
  $('#journey-title').textContent = step.title; $('#journey-description').textContent = step.copy;
  $('#journey-choices').innerHTML = step.choices.map(([value,symbol,title,copy]) => `<button class="journey-choice" data-journey-choice="${value}" aria-pressed="${journey[step.key] === value}"><span>${symbol}</span><strong>${title}</strong><small>${copy}</small><i>✓</i></button>`).join('');
}
function makeRecommendation() {
  const mood = MOODS[journey.feeling];
  const ceiling = Number(journey.budget);
  const stems = [...mood.flowers];
  const finishing=getGiftPrices(state).total;
  let total = stems.reduce((sum,id) => sum + findFlower(id).price,finishing);
  while (total > ceiling && stems.length > 1) {
    const duplicates = stems.findIndex((id,i) => stems.indexOf(id) !== i);
    const index = duplicates >= 0 ? duplicates : stems.length - 1;
    total -= findFlower(stems[index]).price; stems.splice(index,1);
  }
  const extras = journey.recipient === 'love' ? ['rose','lisianthus','daisy'] : [...new Set(mood.flowers)];
  for (let round=0;round<18;round++) {
    const extra = extras[round % extras.length];
    if (stems.length < 12 && total + findFlower(extra).price <= ceiling) { stems.push(extra); total += findFlower(extra).price; }
  }
  const names = { gentle: 'Một cái ôm nhỏ', love: 'Thương, thật nhiều', happy: 'Một túi nắng', self: 'Ngày mới đang đơm' };
  return { stems, total, finishing, canAfford:total<=ceiling, paper: mood.paper, title: journey.recipient === 'self' ? 'Hôm nay, chọn mình' : names[journey.feeling], copy: mood.copy };
}
function renderRecommendation() {
  recommendation = makeRecommendation();
  $('#journey-title').textContent = recommendation.title;
  $('#journey-description').textContent = recommendation.copy;
  $('#journey-next').disabled=!recommendation.canAfford;
  const ids = [...new Set(recommendation.stems)];
  $('#journey-result').innerHTML = `<div class="recommendation-art" style="--rec-paper:${PAPERS[recommendation.paper].color}">${ids.map((id,i) => `<span class="sprite sprite-${findFlower(id).sprite}" style="--rec-angle:${(i-(ids.length-1)/2)*15}deg;z-index:${i+1}"></span>`).join('')}<span class="recommendation-wrap"></span><span class="recommendation-brand">đơm.</span></div><div class="recommendation-palette"><span style="background:#e9c3bf"></span><span style="background:#f0e5d2"></span><span style="background:#c1b5d2"></span><span style="background:#819570"></span></div><p class="recommendation-stems">${ids.map(id => `${recommendation.stems.filter(f => f === id).length} ${findFlower(id).name.toLowerCase()}`).join(' · ')}</p><strong class="recommendation-total">${money(recommendation.total)} <small>/ ${recommendation.stems.length} cành + hoàn thiện bó</small></strong><span class="small-note">${recommendation.canAfford?`Trong mức ${money(Number(journey.budget))} bạn chọn.`:`Kiểu gói, thiệp và phụ kiện đang chọn là ${money(recommendation.finishing)}. Bạn tăng ngân sách hoặc bớt phụ kiện để dành chỗ cho hoa nhé.`} Giá minh họa, chưa gồm phí giao.</span>`;
}
$('#journey-choices').addEventListener('click', event => {
  const button = event.target.closest('[data-journey-choice]'); if (!button) return;
  const step = JOURNEY_STEPS[journey.step];
  if (!step.choices.some(choice => choice[0] === button.dataset.journeyChoice)) return;
  journey[step.key] = button.dataset.journeyChoice; journey.replacementConfirmed = false; renderJourney();
  $(`[data-journey-choice="${button.dataset.journeyChoice}"]`).focus();
});
$('#journey-back').addEventListener('click', () => { journey.step = Math.max(0,journey.step-1); journey.replacementConfirmed = false; renderJourney(); $('#journey-title').focus(); });
$('#journey-next').addEventListener('click', () => {
  if (journey.step < 3) { journey.step++; renderJourney(); $('#journey-title').focus(); return; }
  if(!recommendation?.canAfford)return;
  if (state.stems.length && !journey.replacementConfirmed) { journey.replacementConfirmed = true; $('#journey-next').textContent = 'Thay bản phối hiện tại bằng bó này?'; return; }
  state.stems = recommendation.stems.map((id,i) => makeStem(id,i)); state.paper = recommendation.paper; state.title = recommendation.title; selected = null;
  arrangeNaturally(); $('#journey-dialog').close(); openStudio(); animatePaper();
});

// A small journal, with concept imagery identified as such.
const JOURNAL = [
  { category: '01 / TINH THẦN CỦA ĐƠM', title: 'Điều đẹp đẽ, đâu vội mà thành.', paragraphs: ['Đơm, trong “đơm hoa, kết trái”. Một cái tên nhắc tụi mình rằng những điều đẹp đẽ cần thời gian, sự chăm sóc và cả kiên nhẫn để lớn lên.', 'Tiệm bắt đầu từ hai người cùng muốn xây một điều nhỏ có ý nghĩa. Từ cái tên, sắc giấy, đến cách đặt một cành hoa cạnh cành khác — mỗi lựa chọn đều có thể là một chút quan tâm.', 'Đơm muốn dành chỗ cho những điều bình thường: một ngày bạn thấy vui, một lời cảm ơn chưa nói, hay một bó hoa bạn chọn cho chính mình. Không cần vội. Cứ để những điều đẹp đẽ có thời gian đơm.'] },
  { category: '02 / MỘT CHÚT CẢM HỨNG', title: 'Một cành cũng đủ làm ngày khác đi.', paragraphs: ['Đôi khi, một chiếc bình nhỏ và một cành hoa bạn thích đã đủ khiến góc bàn trở nên đáng yêu.', 'Bắt đầu bằng một màu bạn thấy dễ chịu. Thêm một cành có dáng vươn cao để tạo đường nét, rồi một chút lá hoặc hoa điểm để bó hoa có khoảng thở.', 'Không cần mọi bông đều nhìn thẳng về phía trước. Một chút nghiêng, một chút cao thấp làm hoa có vẻ tự nhiên. Nếu chưa biết bắt đầu từ đâu, thử nút “Xếp tự nhiên” ở bàn đơm, rồi chỉnh cho tới khi bạn thấy thích.'] },
  { category: '03 / CHĂM MỘT CHÚT THƯƠNG', title: 'Để những ngày có hoa dài thêm.', paragraphs: ['Bình sạch và nước sạch là một khởi đầu tốt. Bỏ phần lá có thể ngập nước, rồi cắt chéo một đoạn ngắn ở gốc trước khi cắm.', 'Thay nước mỗi ngày, lấy những lá hoặc cánh đã héo ra khỏi bình. Để hoa ở nơi mát, tránh nắng trực tiếp, trái cây chín và luồng gió điều hòa thổi thẳng.', 'Mỗi loại hoa có cách nở và thời gian tươi khác nhau. Khi tiệm đi vào hoạt động, Đơm sẽ gửi hướng dẫn phù hợp với những cành trong bó của bạn.'] },
];
$('#story').insertAdjacentHTML('afterend', `<section class="journal-section page-width section" id="journal" aria-labelledby="journal-heading"><div class="section-heading reveal"><div><span class="eyebrow">NOTES FROM OUR LITTLE STUDIO</span><h2 id="journal-heading">Nhật ký Đơm<span class="heading-flower">✳</span></h2><p>Vài trang nhỏ về hoa, về những điều đang lớn lên.</p></div><span class="handwritten">slow days, little stories.</span></div><div class="journal-grid"><button class="journal-feature reveal" data-journal="0"><div class="journal-photo"><img src="assets/florist-hands.png" width="1536" height="1024" loading="lazy" alt="Ảnh concept đôi tay gói hoa dưới nắng"><span>ẢNH CONCEPT</span></div><div class="journal-card-copy"><span class="eyebrow">${JOURNAL[0].category}</span><h3>${JOURNAL[0].title}</h3><span class="journal-read">Lật một trang nhỏ <i>↗</i></span></div></button><div class="journal-side"><button class="journal-note reveal" data-journal="1"><span class="notebook-line"></span><span class="eyebrow">${JOURNAL[1].category}</span><h3>Một cành cũng đủ<br>làm ngày <em>khác đi.</em></h3><span class="journal-daisy" aria-hidden="true">✳</span><span class="journal-read">Đọc một chút <i>↗</i></span></button><button class="journal-botanical reveal" data-journal="2"><span class="sprite sprite-3" aria-hidden="true"></span><div><span class="eyebrow">${JOURNAL[2].category}</span><h3>Để những ngày có hoa<br><em>dài thêm.</em></h3><span class="journal-read">Chăm hoa cùng Đơm <i>↗</i></span></div></button></div></div></section>`);
function openJournal(index) {
  const entry = JOURNAL[index]; if (!entry) return;
  $('#journal-category').textContent = entry.category; $('#journal-title').textContent = entry.title;
  $('#journal-article').replaceChildren(...entry.paragraphs.map(text => { const p=document.createElement('p'); p.textContent=text; return p; }));
  $('#journal-dialog').showModal();
}

// Postcard generation stays entirely on this device; no upload is needed.
let cardBlob = null, cardURL = null, cardVersion = 0, cardTimer;
function wrapCanvasText(ctx,text,x,y,maxWidth,lineHeight,maxLines) {
  const words=String(text).trim().split(/\s+/); const lines=[]; let line='';
  words.forEach(word => {
    if (ctx.measureText(line ? `${line} ${word}` : word).width > maxWidth && line) { lines.push(line); line=word; }
    else line=line ? `${line} ${word}` : word;
  });
  if (line) lines.push(line);
  const shown=lines.slice(0,maxLines);
  shown.forEach((value,index) => {
    let fitted=value;
    if (index === maxLines-1 && lines.length>maxLines) fitted+='…';
    while (ctx.measureText(fitted).width > maxWidth && fitted.length>1) fitted=fitted.slice(0,-2)+'…';
    ctx.fillText(fitted,x,y+index*lineHeight);
  });
  return shown.length;
}
async function makePostcard() {
  await Promise.all([ensureAtlasReady(), Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 1500))])]);
  const canvas=document.createElement('canvas'); canvas.width=1080; canvas.height=1350;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#f6f2e9'; ctx.fillRect(0,0,1080,1350);
  ctx.fillStyle='#9b967f';
  for(let y=0;y<1350;y+=7) for(let x=0;x<1080;x+=7) { ctx.globalAlpha=((x*13+y*7)%17)/1200; ctx.fillRect(x,y,1,1); }
  ctx.globalAlpha=1;
  ctx.strokeStyle='#c8cebb'; ctx.lineWidth=1.5; ctx.strokeRect(28,28,1024,1294);
  ctx.fillStyle='#354e3f'; ctx.font='58px "Playfair Display", Georgia'; ctx.textAlign='left'; ctx.fillText('đơm.',75,117);
  ctx.font='12px "Be Vietnam Pro", sans-serif'; ctx.fillStyle='#7c886d'; ctx.fillText('FLORAL / A LITTLE KEEPSAKE',78,145);
  ctx.strokeStyle='#97a487'; ctx.setLineDash([5,5]); ctx.strokeRect(886,65,112,125); ctx.setLineDash([]);
  ctx.font='50px Georgia'; ctx.textAlign='center'; ctx.fillText('✳',942,140);
  ctx.font='9px sans-serif'; ctx.fillText('MADE BY YOU',942,172);
  ctx.font='italic 20px "Playfair Display", Georgia'; ctx.fillStyle='#8b957d'; ctx.fillText('fresh flowers & soft feelings',540,226);
  await drawBouquet(ctx,{x:110,y:233,width:860,height:760});
  ctx.strokeStyle='#c8cebb'; ctx.beginPath(); ctx.moveTo(100,1013); ctx.lineTo(980,1013); ctx.stroke();
  ctx.textAlign='center'; ctx.font='43px "Playfair Display", Georgia'; ctx.fillStyle='#354e3f';
  const titleLines=wrapCanvasText(ctx,state.title || 'Một chút thương',540,1070,860,53,2);
  const messageTop=titleLines>1 ? 1200 : 1150;
  ctx.font='20px "Be Vietnam Pro", sans-serif'; ctx.fillStyle='#77816c';
  wrapCanvasText(ctx,state.cardMessage || (state.greeting.type!=='none'?state.greeting.message:'') || state.note || 'Mong ngày của bạn dịu dàng như những cành hoa này.',540,messageTop,820,32,titleLines>1?2:3);
  ctx.font='italic 20px "Playfair Display", Georgia'; ctx.fillStyle='#68785b'; ctx.fillText(state.author ? `Được đơm bởi ${state.author}` : 'Một bản duy nhất, được đơm bởi bạn.',540,1290);
  return canvas;
}
async function updatePostcard() {
  const version=++cardVersion;
  $('#save-postcard').disabled=true; $('#share-postcard').disabled=true;
  $('#postcard-loading').hidden=false;
  try {
    const canvas=await makePostcard();
    const blob=canvasToPNGBlob(canvas);
    if (version!==cardVersion || !blob) return;
    if (cardURL) URL.revokeObjectURL(cardURL);
    cardBlob=blob; cardURL=URL.createObjectURL(blob); $('#postcard-preview').src=cardURL;
    $('#save-postcard').disabled=false; $('#share-postcard').disabled=false;
  } catch { toast('Chưa tạo được bưu thiếp. Bạn thử lại sau một chút nhé.'); }
  finally { if(version===cardVersion) $('#postcard-loading').hidden=true; }
}
function packBouquet() {
  if(!state.stems.length) { toast('Chọn một vài cành hoa trước nhé ♡'); return; }
  selected=null; renderSelection(); animatePaper();
  $('#postcard-title').value=state.title;
  $('#postcard-author').value=state.author;
  $('#postcard-message').value=state.cardMessage || state.note.slice(0,160);
  $('#postcard-dialog').showModal(); updatePostcard();
}
$('#pack-bouquet').addEventListener('click',packBouquet);
[['postcard-title','title'],['postcard-author','author'],['postcard-message','cardMessage']].forEach(([id,key]) => {
  $('#'+id).addEventListener('input',event=>{state[key]=event.target.value;persist();cardVersion++;$('#save-postcard').disabled=true;$('#share-postcard').disabled=true;clearTimeout(cardTimer);cardTimer=setTimeout(updatePostcard,250);});
});
$('#save-postcard').addEventListener('click',()=>{if(cardBlob){downloadBlob(cardBlob,'buu-thiep-tu-dom.png');toast('Một chút thương đã sẵn sàng để giữ lại ♡');}});
$('#share-postcard').addEventListener('click',async()=>{
  if(!cardBlob)return;
  const file=new File([cardBlob],'buu-thiep-tu-dom.png',{type:'image/png'});
  if(navigator.canShare?.({files:[file]})) {
    try{await navigator.share({files:[file],title:state.title || 'Bưu thiếp từ Đơm',text:'Một bó hoa, được đơm bằng tay và một chút thương.'});}
    catch(error){if(error.name!=='AbortError')toast('Bạn có thể dùng nút tải bưu thiếp để chia sẻ nhé.');}
  }else{downloadBlob(cardBlob,'buu-thiep-tu-dom.png');toast('Đã chuẩn bị ảnh bưu thiếp để bạn tải và chia sẻ.');}
});
$('#order-from-postcard').addEventListener('click',()=>{$('#postcard-dialog').close();prepareOrder();});
$('#postcard-dialog').addEventListener('close',()=>{clearTimeout(cardTimer);cardVersion++;if(cardURL){URL.revokeObjectURL(cardURL);cardURL=null;}cardBlob=null;$('#postcard-preview').removeAttribute('src');});

document.addEventListener('click',event=>{
  const start=event.target.closest('[data-start-mood]'); if(start)startJourney();
  const journal=event.target.closest('[data-journal]'); if(journal)openJournal(Number(journal.dataset.journal));
});
$$('#journey-dialog, #postcard-dialog, #journal-dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}));

// Motion follows the visitor, and stays still when reduced motion is requested.
const collage=$('.editorial-collage');
let driftFrame;
collage.addEventListener('pointermove',event=>{
  if(reducedMotion.matches || event.pointerType!=='mouse')return;
  const r=collage.getBoundingClientRect(); const x=(event.clientX-r.left)/r.width-.5; const y=(event.clientY-r.top)/r.height-.5;
  cancelAnimationFrame(driftFrame);driftFrame=requestAnimationFrame(()=>{collage.style.setProperty('--drift-x',`${x*10}px`);collage.style.setProperty('--drift-y',`${y*8}px`);});
});
collage.addEventListener('pointerleave',()=>{cancelAnimationFrame(driftFrame);collage.style.setProperty('--drift-x','0px');collage.style.setProperty('--drift-y','0px');});
const reveals=$$('.studio-invitation, .journal-section .reveal, .mood-journey-invite, #story .story-copy, .mood-card');
if('IntersectionObserver' in window && !reducedMotion.matches){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.08});
  reveals.forEach((el,index)=>{el.classList.add('reveal');el.style.setProperty('--reveal-delay',`${index%4*65}ms`);observer.observe(el);});
  reducedMotion.addEventListener('change',event=>{if(event.matches){reveals.forEach(el=>el.classList.add('is-visible'));observer.disconnect();}});
}
