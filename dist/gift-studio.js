/* Finishing table: wrapping, a physical greeting card, and movable little keepsakes. */
const giftPanel=$('.wrap-panel');
giftPanel.classList.add('gift-panel');
const giftColorField=$('fieldset',giftPanel), giftRibbonField=$('.ribbon-field',giftPanel);
const giftNoteLabel=$('.note-label',giftPanel), giftNoteInput=$('#bouquet-note');
const giftPriceBox=$('.price-breakdown',giftPanel), giftPackButton=$('#pack-bouquet'), giftPackCaption=$('.pack-caption',giftPanel), giftOrderButton=$('#prepare-order');
giftColorField.classList.add('gift-color-field');
$('legend',giftColorField).textContent='Màu giấy';
$('legend',giftRibbonField).textContent='Màu nơ';
giftNoteLabel.textContent='Ghi chú cho tiệm';
giftNoteInput.placeholder='Ví dụ: bó nhỏ gọn, nơ buộc dài…';
giftPriceBox.innerHTML='<div><span>Hoa đã chọn</span><span id="flower-subtotal"></span></div><div><span id="gift-wrap-label">Giấy gói & nơ</span><span id="gift-wrap-price"></span></div><div id="gift-card-charge"><span>Thiệp đính kèm</span><span id="gift-card-price"></span></div><div id="gift-sticker-charge"><span>Sticker</span><span id="gift-sticker-price"></span></div><div id="gift-charm-charge"><span>Charm</span><span id="gift-charm-price"></span></div><div class="total"><span>Tạm tính</span><strong id="bouquet-total"></strong></div>';
giftPanel.innerHTML=`<span class="eyebrow">THE FINISHING TABLE</span><h3>Gói một chút thương.</h3><div class="gift-tabs" role="tablist" aria-label="Hoàn thiện bó hoa"><button id="gift-tab-wrap" role="tab" aria-controls="gift-panel-wrap" aria-selected="true" tabindex="0" data-gift-tab="wrap">01 / Giấy gói</button><button id="gift-tab-card" role="tab" aria-controls="gift-panel-card" aria-selected="false" tabindex="-1" data-gift-tab="card">02 / Thiệp</button><button id="gift-tab-decor" role="tab" aria-controls="gift-panel-decor" aria-selected="false" tabindex="-1" data-gift-tab="decor">03 / Trang trí</button></div><div class="gift-tab-content"><section id="gift-panel-wrap" role="tabpanel" aria-labelledby="gift-tab-wrap"><p class="gift-panel-intro">Một dáng gói, một nét riêng.</p><div class="gift-wrap-choices" aria-label="Chọn kiểu gói">${Object.entries(WRAP_STYLES).map(([id,item])=>`<button class="gift-wrap-choice ${id==='none'?'gift-wrap-none':''}" data-wrap-style="${id}" aria-pressed="false" title="${item.description}"><span class="gift-wrap-thumbnail" data-wrap-thumbnail="${id}"></span><strong>${item.name}</strong><small>${money(item.price)}</small><i>✓</i></button>`).join('')}</div><div id="gift-colors-slot"></div><div id="gift-ribbon-slot"></div></section><section id="gift-panel-card" role="tabpanel" aria-labelledby="gift-tab-card" hidden><p class="gift-panel-intro">Thêm một lời thương, bằng một tấm thiệp.</p><div class="gift-card-choices">${Object.entries(GREETING_TYPES).map(([id,item])=>`<button class="gift-card-choice" data-card-type="${id}" aria-pressed="false"><span>${giftCardSVG({type:id,to:'',from:'',message:'',writing:'hand'})}</span><strong>${item.name}</strong><small>${item.price?money(item.price):'0đ'}</small><i>✓</i></button>`).join('')}</div><div class="gift-card-summary" id="gift-card-summary"></div><button id="edit-greeting" class="button button-outline gift-edit-greeting">Viết & xem thiệp <span>↗</span></button><p class="gift-help">Thiệp này đi cùng bó hoa. Nội dung được giữ riêng với lời nhắn trên bưu thiếp ảnh.</p></section><section id="gift-panel-decor" role="tabpanel" aria-labelledby="gift-tab-decor" hidden><p class="gift-panel-intro">Những món nhỏ, làm bó hoa rất bạn.</p><h4 class="gift-collection-heading">Sticker <span>nhỏ mà có võ</span></h4><div class="gift-decoration-grid">${Object.entries(GIFT_DECOR).filter(([,item])=>item.kind==='sticker').map(([id,item])=>giftItemButton(id,item)).join('')}</div><h4 class="gift-collection-heading">Charm <span>giữ lại một chút xinh</span></h4><div class="gift-decoration-grid">${Object.entries(GIFT_DECOR).filter(([,item])=>item.kind==='charm').map(([id,item])=>giftItemButton(id,item)).join('')}</div><p class="gift-help" id="gift-limit-note"></p><div id="gift-selected-pieces" class="gift-selected-pieces"></div></section></div><details class="gift-shop-note"><summary>Ghi chú riêng cho tiệm <span>+</span></summary><div id="gift-note-slot"></div></details><div id="gift-price-slot"></div><div id="gift-actions-slot"></div><p class="small-note gift-price-note">Giá minh họa, chưa gồm phí giao.<br>Đơm sẽ xác nhận hoa và phụ kiện trước khi nhận đơn.</p>`;
$('#gift-colors-slot').append(giftColorField); $('#gift-ribbon-slot').append(giftRibbonField);
$('#gift-note-slot').append(giftNoteLabel,giftNoteInput); $('#gift-price-slot').append(giftPriceBox);
giftPackCaption.textContent='Xuất bưu thiếp ảnh với kiểu gói và phụ kiện của bạn.';
$('#gift-actions-slot').append(giftPackButton,giftPackCaption,giftOrderButton);
$('.canvas-toolbar').insertAdjacentHTML('afterend','<div class="gift-visibility-bar"><label class="gift-visibility-switch"><input id="show-wrap" type="checkbox" role="switch" checked><span class="gift-switch-track"></span><span>Hiện giấy gói</span></label><span id="gift-visibility-hint">Ẩn giấy để dễ xếp hoa.</span></div>');
$('#bouquet-canvas').insertAdjacentHTML('beforeend','<div id="gift-piece-layer"></div>');
$('#stem-controls').insertAdjacentHTML('afterend','<div id="gift-piece-controls" class="stem-controls gift-piece-controls" hidden><span id="gift-piece-label"></span><div><button data-piece-action="rotate-left" aria-label="Xoay phụ kiện sang trái" title="Xoay trái">↶</button><button data-piece-action="rotate-right" aria-label="Xoay phụ kiện sang phải" title="Xoay phải">↷</button><button data-piece-action="smaller" aria-label="Thu nhỏ phụ kiện" title="Thu nhỏ">−</button><button data-piece-action="larger" aria-label="Phóng to phụ kiện" title="Phóng to">+</button><button data-piece-action="remove" aria-label="Gỡ phụ kiện đã chọn" title="Gỡ món này">×</button></div></div>');
$('.canvas-help').textContent='Chạm đúng bông hoặc cành để kéo · Chọn cành để bỏ lá, cắt ngắn · Chỉnh bằng phím mũi tên.';
$('.faq-list details:last-child p').textContent='Giá minh họa gồm các cành hoa, kiểu gói và nơ, thiệp cùng sticker hoặc charm bạn chọn. Bảng tạm tính tách riêng từng khoản, chưa gồm phí giao. Tiệm sẽ xác nhận giá và tình trạng hoa, phụ kiện trước khi bạn thanh toán.';
document.body.insertAdjacentHTML('beforeend',`<dialog id="greeting-dialog" class="greeting-dialog" aria-labelledby="greeting-title"><button class="dialog-close" data-close="greeting-dialog" aria-label="Đóng trình viết thiệp">×</button><div class="greeting-layout"><div class="greeting-art-side"><span class="eyebrow">A FEW WORDS, A LOT OF LOVE.</span><div class="greeting-face-tabs" role="group" aria-label="Mặt thiệp"><button data-card-face="front" aria-pressed="false">Mặt trước</button><button data-card-face="back" aria-pressed="true">Mặt sau</button></div><div id="greeting-preview" class="greeting-preview"></div><span class="greeting-preview-caption" id="greeting-preview-caption"></span></div><div class="greeting-editor"><div class="eyebrow">MỘT TẤM THIỆP ĐI CÙNG BÓ HOA</div><h2 id="greeting-title">Có điều gì<br><em>bạn muốn nói?</em></h2><label for="greeting-type-select">Loại thiệp<select id="greeting-type-select">${Object.entries(GREETING_TYPES).filter(([id])=>id!=='none').map(([id,item])=>`<option value="${id}">${item.name} · ${money(item.price)}</option>`).join('')}</select></label><div class="greeting-people"><label for="greeting-to">Gửi đến<input id="greeting-to" maxlength="45" placeholder="Tên người nhận (tùy chọn)"></label><label for="greeting-from">Từ<input id="greeting-from" maxlength="45" placeholder="Tên bạn hoặc để trống"></label></div><label for="greeting-message">Lời nhắn trên thiệp<textarea id="greeting-message" maxlength="300" rows="5" placeholder="Một lời thương, một lời cảm ơn, hay chỉ là: nhớ bạn."></textarea></label><div class="greeting-message-meta"><span>Tự xuống dòng theo ý bạn.</span><span id="greeting-count">0 / 300</span></div><div class="greeting-writing" role="group" aria-label="Chọn kiểu chữ"><button data-card-writing="hand" aria-pressed="true"><i>Thương,</i> Chữ nghiêng</button><button data-card-writing="print" aria-pressed="false"><b>Thương,</b> Chữ in</button></div><div class="greeting-prompts"><span>Thêm một câu gợi ý</span><button data-greeting-prompt="love">Thương một người</button><button data-greeting-prompt="thanks">Cảm ơn</button><button data-greeting-prompt="birthday">Sinh nhật</button><button data-greeting-prompt="self">Cho mình</button></div><button id="finish-greeting" class="button button-green">Xong, đính kèm thiệp <span>♡</span></button><button id="download-greeting" class="text-link">Tải thiết kế hai mặt <span>↓</span></button><p class="small-note">Nội dung tự lưu trên thiết bị này. Bản xem trước giúp tiệm hiểu cách bạn muốn viết thiệp.</p></div></div></dialog>`);

function giftItemButton(id,item){return `<button class="gift-decoration-item" data-add-decoration="${id}" aria-label="Thêm ${item.kind==='sticker'?'sticker':'charm'} ${item.name}"><span class="gift-item-art">${giftIconSVG(id)}</span><strong>${item.name}</strong><small>${money(item.price)}</small><span class="gift-item-plus">+</span><span class="gift-item-qty" data-gift-count="${id}" hidden></span></button>`;}
let selectedGiftPiece=null, giftDrag=null, greetingFace='back';
let giftLastSize={width:500,height:565};
function giftStageSize(){const stage=$('#bouquet-canvas');if(stage.clientWidth && stage.clientHeight)giftLastSize={width:stage.clientWidth,height:stage.clientHeight};return giftLastSize;}
function giftPieceById(uid){return uid==='greeting' && state.greeting.type!=='none'?state.greeting:state.addOns.find(piece=>piece.uid===uid);}
function giftPieceName(uid){return uid==='greeting'?GREETING_TYPES[state.greeting.type].name:GIFT_DECOR[giftPieceById(uid)?.id]?.name || '';}
function setGiftPieceStyle(element,piece,isCard){const size=giftPieceSize(piece,isCard,giftStageSize().width);element.style.width=size.width+'px';element.style.height=size.height+'px';element.style.left=piece.x+'%';element.style.top=piece.y+'%';element.style.transform=`translate(-50%,-50%) rotate(${piece.rotation}deg)`;}
function renderGiftSelection(){
  if(!giftPieceById(selectedGiftPiece))selectedGiftPiece=null;
  $$('.gift-piece').forEach(el=>{const active=el.dataset.giftPiece===selectedGiftPiece;el.classList.toggle('active',active);el.setAttribute('aria-pressed',active);});
  $('#gift-piece-controls').hidden=!selectedGiftPiece; $('#stem-controls').hidden=!!selectedGiftPiece;
  if(selectedGiftPiece){const piece=giftPieceById(selectedGiftPiece);$('#gift-piece-label').textContent=`${giftPieceName(selectedGiftPiece)} · ${piece.rotation}° · ${Math.round(piece.scale*100)}%`;}
}
function selectGiftPiece(uid){selected=null;renderSelection();selectedGiftPiece=uid;renderGiftSelection();}
function renderGiftPieces(){
  const layer=$('#gift-piece-layer'),pieces=state.stems.length?[...state.addOns]:[];
  if(state.stems.length && state.greeting.type!=='none')pieces.push({...state.greeting,uid:'greeting'});
  const ids=new Set(pieces.map(p=>p.uid)); const existing=new Map([...layer.children].map(el=>[el.dataset.giftPiece,el]));
  existing.forEach((el,uid)=>{if(!ids.has(uid))el.remove();});
  pieces.forEach((piece,i)=>{const isCard=piece.uid==='greeting';const el=existing.get(piece.uid) || document.createElement('button');el.className='gift-piece '+(isCard?'gift-attached-card':'gift-attached-'+GIFT_DECOR[piece.id].kind);el.dataset.giftPiece=piece.uid;el.setAttribute('aria-label',`${giftPieceName(piece.uid)}. Kéo hoặc dùng phím mũi tên để di chuyển.`);el.style.zIndex=i+1;const svg=isCard?giftCardSVG(piece):giftIconSVG(piece.id);if(el.giftArtwork!==svg){el.innerHTML=svg;el.giftArtwork=svg;}setGiftPieceStyle(el,piece,isCard);layer.append(el);});
  renderGiftSelection();
}
function renderGiftStudio(){
  const size=giftStageSize();
  $('#paper-back').innerHTML=buildPackagingSVG(state,'back',size.width,size.height,{hidePaper:!state.showWrap});
  $('#paper-front').innerHTML=buildPackagingSVG(state,'front',size.width,size.height,{hidePaper:!state.showWrap});
  $('#bouquet-canvas').dataset.wrapStyle=state.wrapStyle;
  $('#show-wrap').checked=state.showWrap;$('#show-wrap').disabled=state.wrapStyle==='none';
  $('#gift-visibility-hint').textContent=state.wrapStyle==='none'?'Chỉ thắt nơ, không dùng giấy.':state.showWrap?'Ẩn giấy để dễ xếp hoa.':'Chỉ ẩn trên bàn. Đơn và ảnh vẫn giữ giấy.';
  giftColorField.disabled=state.wrapStyle==='none';
  $$('button[data-wrap-style]').forEach(button=>{button.setAttribute('aria-pressed',button.dataset.wrapStyle===state.wrapStyle);const thumbnail=$('.gift-wrap-thumbnail',button);const config={...state,wrapStyle:button.dataset.wrapStyle};const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="70 160 860 820" aria-hidden="true">${giftWrapMarkup(config,'back')}${giftWrapMarkup(config,'front')}</svg>`;if(thumbnail.giftArtwork!==svg){thumbnail.innerHTML=svg;thumbnail.giftArtwork=svg;}});
  $$('[data-card-type]').forEach(button=>button.setAttribute('aria-pressed',button.dataset.cardType===state.greeting.type));
  $('#edit-greeting').disabled=state.greeting.type==='none';
  $('#gift-card-summary').textContent=state.greeting.type==='none'?'Bạn có thể gửi thương bằng một tấm thiệp nhỏ.':`${GREETING_TYPES[state.greeting.type].name} · ${state.greeting.message.length?state.greeting.message.length+' ký tự đã viết':'Chưa viết lời nhắn'}`;
  const limitReached=state.addOns.length>=GIFT_LIMIT;
  $$('[data-add-decoration]').forEach(button=>{button.disabled=limitReached || !state.stems.length;const count=state.addOns.filter(p=>p.id===button.dataset.addDecoration).length;const badge=$('[data-gift-count]',button);badge.hidden=!count;badge.textContent=count;});
  $('#gift-limit-note').textContent=!state.stems.length?'Chọn vài cành hoa trước để gắn phụ kiện nhé.':`${state.addOns.length} / ${GIFT_LIMIT} món · Kéo, xoay hoặc đổi cỡ trực tiếp trên bó.`;
  $('#gift-selected-pieces').innerHTML=state.addOns.map(piece=>`<div class="gift-selected-piece"><button data-select-piece="${piece.uid}"><span>${giftIconSVG(piece.id)}</span>${GIFT_DECOR[piece.id].name}</button><button data-remove-piece="${piece.uid}" aria-label="Gỡ ${GIFT_DECOR[piece.id].name}">×</button></div>`).join('');
  const price=getGiftPrices(state);
  $('#gift-wrap-label').textContent=state.wrapStyle==='none'?'Nơ':WRAP_STYLES[state.wrapStyle].name+' & nơ';
  $('#gift-wrap-price').textContent=money(price.wrapping);$('#gift-card-price').textContent=money(price.greeting);$('#gift-sticker-price').textContent=money(price.stickers);$('#gift-charm-price').textContent=money(price.charms);
  $('#gift-card-charge').hidden=!price.greeting;$('#gift-sticker-charge').hidden=!price.stickers;$('#gift-charm-charge').hidden=!price.charms;
  $('#flower-subtotal').textContent=money(flowerTotal());$('#bouquet-total').textContent=money(flowerTotal()+price.total);
  renderGiftPieces();
  if($('#greeting-dialog').open)renderGreetingEditor();
}
function switchGiftTab(tab){$$('[data-gift-tab]').forEach(button=>{const active=button.dataset.giftTab===tab;button.setAttribute('aria-selected',active);button.tabIndex=active?0:-1;$('#gift-panel-'+button.dataset.giftTab).hidden=!active;});}
$$('[data-gift-tab]').forEach((button,index)=>button.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const buttons=$$('[data-gift-tab]');const next=event.key==='Home'?0:event.key==='End'?2:(index+(event.key==='ArrowRight'?1:2))%3;switchGiftTab(buttons[next].dataset.giftTab);buttons[next].focus();}));
function changeGiftConfig(){renderBouquet();persist();}
function addGiftDecoration(id){
  if(!GIFT_DECOR[id] || !state.stems.length)return;
  if(state.addOns.length>=GIFT_LIMIT){toast('Tối đa 6 món trang trí. Gỡ một món để thử món mới nhé.');return;}
  const i=state.addOns.length,kind=GIFT_DECOR[id].kind;
  const piece={uid:crypto.randomUUID(),id,x:kind==='charm'?49+(i%3-1)*8:43+(i%3-1)*10,y:kind==='charm'?82+(i%2)*5:65+Math.floor(i/3)*9,rotation:kind==='charm'?-5:((i%3)-1)*12,scale:1};
  state.addOns.push(piece);changeGiftConfig();selectGiftPiece(piece.uid);toast(`Đã gắn ${GIFT_DECOR[id].name.toLowerCase()} ♡`);
}
function removeGiftPiece(uid){if(uid==='greeting')state.greeting.type='none';else state.addOns=state.addOns.filter(p=>p.uid!==uid);if(selectedGiftPiece===uid)selectedGiftPiece=null;changeGiftConfig();}
document.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.giftTab)switchGiftTab(button.dataset.giftTab);
  if(button.dataset.wrapStyle && WRAP_STYLES[button.dataset.wrapStyle]){state.wrapStyle=button.dataset.wrapStyle;state.showWrap=true;changeGiftConfig();animatePaper();}
  if(button.dataset.cardType && GREETING_TYPES[button.dataset.cardType]){state.greeting.type=button.dataset.cardType;if(state.greeting.type==='none' && selectedGiftPiece==='greeting')selectedGiftPiece=null;changeGiftConfig();}
  if(button.dataset.addDecoration)addGiftDecoration(button.dataset.addDecoration);
  if(button.dataset.selectPiece)selectGiftPiece(button.dataset.selectPiece);
  if(button.dataset.removePiece)removeGiftPiece(button.dataset.removePiece);
  if(button.dataset.pieceAction){const piece=giftPieceById(selectedGiftPiece);if(!piece)return;const action=button.dataset.pieceAction;if(action==='remove'){removeGiftPiece(selectedGiftPiece);return;}if(action==='rotate-left')piece.rotation=piece.rotation<=-180?170:piece.rotation-10;if(action==='rotate-right')piece.rotation=piece.rotation>=180?-170:piece.rotation+10;if(action==='smaller')piece.scale=Math.max(.7,Math.round((piece.scale-.1)*10)/10);if(action==='larger')piece.scale=Math.min(1.5,Math.round((piece.scale+.1)*10)/10);changeGiftConfig();}
});
$('#show-wrap').addEventListener('change',event=>{state.showWrap=event.target.checked;changeGiftConfig();});
document.addEventListener('bouquet:updated',renderGiftStudio);
document.addEventListener('bouquet:selection',event=>{if(event.detail.uid){selectedGiftPiece=null;renderGiftSelection();}});

const giftPieceLayer=$('#gift-piece-layer');
giftPieceLayer.addEventListener('pointerdown',event=>{const el=event.target.closest('[data-gift-piece]');if(!el || event.button!==0)return;const piece=giftPieceById(el.dataset.giftPiece);const rect=$('#bouquet-canvas').getBoundingClientRect();selectGiftPiece(el.dataset.giftPiece);el.focus({preventScroll:true});giftDrag={el,piece,x:piece.x,y:piece.y,startX:event.clientX,startY:event.clientY,rect};el.setPointerCapture(event.pointerId);el.classList.add('dragging');event.preventDefault();});
giftPieceLayer.addEventListener('pointermove',event=>{if(!giftDrag)return;const {piece,rect}=giftDrag;piece.x=clamp(giftDrag.x+(event.clientX-giftDrag.startX)/rect.width*100,8,92);piece.y=clamp(giftDrag.y+(event.clientY-giftDrag.startY)/rect.height*100,8,92);setGiftPieceStyle(giftDrag.el,piece,giftDrag.el.dataset.giftPiece==='greeting');});
function finishGiftDrag(){if(!giftDrag)return;giftDrag.el.classList.remove('dragging');giftDrag=null;persist();}
giftPieceLayer.addEventListener('pointerup',finishGiftDrag);giftPieceLayer.addEventListener('pointercancel',finishGiftDrag);giftPieceLayer.addEventListener('lostpointercapture',finishGiftDrag);
giftPieceLayer.addEventListener('keydown',event=>{const el=event.target.closest('[data-gift-piece]');if(!el)return;const piece=giftPieceById(el.dataset.giftPiece);selectGiftPiece(el.dataset.giftPiece);const step=event.shiftKey?3:1;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){event.preventDefault();if(event.key==='ArrowLeft')piece.x=clamp(piece.x-step,8,92);if(event.key==='ArrowRight')piece.x=clamp(piece.x+step,8,92);if(event.key==='ArrowUp')piece.y=clamp(piece.y-step,8,92);if(event.key==='ArrowDown')piece.y=clamp(piece.y+step,8,92);setGiftPieceStyle(el,piece,el.dataset.giftPiece==='greeting');persist();}if(event.key==='Delete' || event.key==='Backspace'){event.preventDefault();removeGiftPiece(el.dataset.giftPiece);$('#bouquet-canvas').focus();}if(event.key==='Enter' && el.dataset.giftPiece==='greeting'){event.preventDefault();openGreetingEditor();}});
giftPieceLayer.addEventListener('dblclick',event=>{if(event.target.closest('[data-gift-piece="greeting"]'))openGreetingEditor();});

function renderGreetingEditor(){
  $('#greeting-preview').innerHTML=giftCardSVG(state.greeting,greetingFace);
  $('#greeting-preview-caption').textContent=`${GREETING_TYPES[state.greeting.type].name} · ${money(GREETING_TYPES[state.greeting.type].price)} · ${greetingFace==='front'?'Mặt trước':'Mặt sau'}`;
  $('#greeting-count').textContent=state.greeting.message.length+' / 300';
  $$('[data-card-face]').forEach(button=>button.setAttribute('aria-pressed',button.dataset.cardFace===greetingFace));
  $$('[data-card-writing]').forEach(button=>button.setAttribute('aria-pressed',button.dataset.cardWriting===state.greeting.writing));
}
function openGreetingEditor(){if(state.greeting.type==='none')return;$('#greeting-type-select').value=state.greeting.type;$('#greeting-to').value=state.greeting.to;$('#greeting-from').value=state.greeting.from;$('#greeting-message').value=state.greeting.message;greetingFace='back';renderGreetingEditor();$('#greeting-dialog').showModal();}
$('#edit-greeting').addEventListener('click',openGreetingEditor);
[['greeting-to','to'],['greeting-from','from'],['greeting-message','message']].forEach(([id,key])=>$('#'+id).addEventListener('input',event=>{state.greeting[key]=event.target.value;changeGiftConfig();}));
$('#greeting-type-select').addEventListener('change',event=>{state.greeting.type=event.target.value;changeGiftConfig();});
const GIFT_MESSAGES={love:'Có những điều mình muốn nói bằng một bó hoa. Thương bạn, thật nhiều.',thanks:'Cảm ơn vì những điều nhỏ xinh bạn đã mang đến. Mong ngày của bạn thật dịu dàng.',birthday:'Chúc bạn một tuổi mới nhiều niềm vui, bình yên và những điều đẹp đẽ đang đơm.',self:'Tặng mình một chút dịu dàng. Cứ chậm rãi, rồi những điều đẹp đẽ sẽ đơm.'};
document.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;if(button.dataset.cardFace){greetingFace=button.dataset.cardFace;renderGreetingEditor();}if(button.dataset.cardWriting){state.greeting.writing=button.dataset.cardWriting;changeGiftConfig();}if(button.dataset.greetingPrompt){const text=GIFT_MESSAGES[button.dataset.greetingPrompt];if(!text)return;const next=state.greeting.message.trim()?state.greeting.message+'\n'+text:text;if(next.length>300){toast('Thiệp chưa đủ chỗ cho câu gợi ý. Bạn rút ngắn một chút nhé.');return;}state.greeting.message=next;$('#greeting-message').value=next;greetingFace='back';changeGiftConfig();}});
$('#finish-greeting').addEventListener('click',()=>{$('#greeting-dialog').close();if(state.stems.length)selectGiftPiece('greeting');toast('Đã đính kèm một tấm thiệp nhỏ ♡');});
$('#greeting-dialog').addEventListener('click',event=>{if(event.target!==event.currentTarget)return;const r=event.currentTarget.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)event.currentTarget.close();});
async function createGreetingCanvas(){
  const config=structuredClone(state.greeting);if(config.type==='none')throw new Error('No greeting selected');
  const canvas=document.createElement('canvas');canvas.width=2400;canvas.height=1100;const ctx=canvas.getContext('2d');ctx.fillStyle='#f3efe5';ctx.fillRect(0,0,2400,1100);
  const ratio=GREETING_TYPES[config.type].ratio,width=Math.min(980,890*ratio),height=width/ratio;
  for(const [index,face] of ['front','back'].entries()){const image=await giftSVGImage(giftCardSVG(config,face));ctx.drawImage(image,index*1200+(1200-width)/2,130+(890-height)/2,width,height);ctx.textAlign='center';ctx.font='20px Arial';ctx.fillStyle='#7f8c6b';ctx.fillText(face==='front'?'ĐƠM. / MẶT TRƯỚC':'ĐƠM. / MẶT SAU',index*1200+600,75);}
  return canvas;
}
$('#download-greeting').addEventListener('click',async()=>{try{const canvas=await createGreetingCanvas();downloadBlob(canvasToPNGBlob(canvas),'thiep-dinh-kem-dom.png');toast('Đã chuẩn bị thiết kế hai mặt thiệp để tải về.');}catch{toast('Chưa xuất được thiệp, bạn thử lại một chút nữa nhé.');}});
let giftResizeFrame;
new ResizeObserver(()=>{cancelAnimationFrame(giftResizeFrame);giftResizeFrame=requestAnimationFrame(()=>renderGiftStudio());}).observe($('#bouquet-canvas'));
renderGiftStudio();
