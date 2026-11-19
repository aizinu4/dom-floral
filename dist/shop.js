/* Ready bouquets and genuine feedback have their own pages, using hash links for static hosting. */
const shopPrice=product=>shopBouquetPrice(product,FLOWERS,WRAP_STYLES);
const shopProduct=id=>SHOP_BOUQUETS.find(product=>product.id===id);
const shopStemCount=product=>Object.values(product.recipe).reduce((sum,count)=>sum+count,0);
const shopDefaultTitle='Đơm. floral — Đơm những điều đẹp đẽ.';
let shopFavorites=[];
try{const saved=JSON.parse(localStorage.getItem('dom-floral-shop-favorites') || '[]');shopFavorites=Array.isArray(saved)?saved.filter(id=>shopProduct(id)):[];}catch{}
const shopFilters={query:'',mood:'all',price:'all',sort:'featured',favoritesOnly:false};
const feedbackFilters={product:'all',photosOnly:false,sort:'newest'};
let showFeedbackExamples=false,activeShopProduct=null,shopPreviousDraft=null;
let shopPhotos=[],shopPhotoIndex=0,shopPhotoLabel='';
const genuineFeedback=()=>SHOP_FEEDBACK.filter(review=>review && !review.isExample && typeof review.text==='string' && review.text.trim());
const feedbackPhotos=review=>(Array.isArray(review.photos)?review.photos:[]).filter(url=>typeof url==='string' && /^(assets\/|https:\/\/)/.test(url));
const feedbackForProduct=id=>genuineFeedback().filter(review=>review.productId===id);

$('#bouquets-view').innerHTML=`<div class="shop-page-breadcrumb"><a href="#" data-home>Đơm.</a><span>/</span><span>Bó hoa của Đơm</span></div><div class="shop-page-hero"><div><span class="eyebrow">THE BOUQUET COLLECTION / 01</span><h1 id="shop-title">Những bó hoa<br><em>của Đơm.</em></h1><p>Có những điều đẹp đẽ, đã được gói ghém sẵn.<br>Bạn chỉ cần chọn điều gần với lòng mình.</p></div><div class="shop-hero-note"><span class="shop-hero-star" aria-hidden="true">✳</span><p>một bó hoa,<br>một lời chưa nói.</p><span>ARRANGED WITH CARE.<br>CHOSEN WITH FEELING.</span></div></div><div class="shop-concept-notice"><span>◦</span><p>Bộ sưu tập minh họa · Ảnh concept, giá tham khảo. Hoa và lịch nhận cần được tiệm xác nhận.</p></div><div class="shop-controls"><label class="shop-search" for="shop-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><input id="shop-search" type="search" maxlength="100" placeholder="Tìm tên bó hoặc tên hoa…"></label><label class="shop-select" for="shop-price"><span>Khoảng giá</span><select id="shop-price"><option value="all">Tất cả mức giá</option><option value="under150">Dưới 150.000đ</option><option value="150to300">150.000–300.000đ</option><option value="over300">Trên 300.000đ</option></select></label><label class="shop-select" for="shop-sort"><span>Sắp xếp</span><select id="shop-sort"><option value="featured">Theo bộ sưu tập</option><option value="price-asc">Giá thấp đến cao</option><option value="price-desc">Giá cao đến thấp</option><option value="name">Theo tên bó hoa</option></select></label></div><div class="shop-mood-row"><div class="shop-mood-filters" role="group" aria-label="Lọc theo cảm xúc">${Object.entries(SHOP_MOODS).map(([id,name])=>`<button data-shop-mood="${id}" aria-pressed="${id==='all'}">${name}</button>`).join('')}</div><label class="shop-favorites-toggle"><input id="shop-only-favorites" type="checkbox"><span>♡ Chỉ những bó đã thương</span></label></div><div class="shop-result-row"><span id="shop-result-count" role="status" aria-live="polite"></span><button class="text-link" id="shop-clear-filters">Bỏ bộ lọc <span>↺</span></button></div><div class="shop-product-grid" id="shop-product-grid"></div><div id="shop-empty" class="shop-empty" hidden><span aria-hidden="true">✳</span><h2>Đổi một chút,<br><em>gặp một bó hoa khác.</em></h2><p>Chưa có mẫu phù hợp với các lựa chọn này.</p><button class="button button-outline" data-clear-shop>Bỏ bộ lọc <span>↗</span></button></div><div class="shop-studio-invite"><span>Muốn một bó hoa mang dấu ấn riêng?</span><button class="text-link" data-open-studio>Ghé bàn tự đơm hoa <span>↗</span></button></div>`;

$('#feedback-view').innerHTML=`<div class="shop-page-breadcrumb"><a href="#" data-home>Đơm.</a><span>/</span><span>Lời thương · Feedback</span></div><div class="shop-page-hero feedback-page-hero"><div><span class="eyebrow">LOVE NOTES, WHEN THEY ARRIVE.</span><h1 id="feedback-title">Những lời thương<br><em>ghé lại Đơm.</em></h1><p>Một góc nhỏ giữ ảnh bó hoa và những lời khách gửi.<br>Đẹp hơn khi đó là những điều thật.</p></div><div class="feedback-envelope" aria-hidden="true"><span>to: Đơm.</span><i>♡</i><b>with a little love.</b></div></div><div id="feedback-statistics" class="feedback-statistics" hidden></div><div class="feedback-toolbar" id="feedback-toolbar" hidden><label class="shop-select" for="feedback-product"><span>Bó hoa</span><select id="feedback-product"><option value="all">Tất cả bó hoa</option>${SHOP_BOUQUETS.map(product=>`<option value="${product.id}">${product.name}</option>`).join('')}</select></label><label class="shop-favorites-toggle"><input id="feedback-photos" type="checkbox"><span>Chỉ lời nhắn có ảnh</span></label><label class="shop-select" for="feedback-sort"><span>Sắp xếp</span><select id="feedback-sort"><option value="newest">Mới nhất</option><option value="rating">Đánh giá cao trước</option></select></label></div><div class="feedback-example-banner" id="feedback-example-banner" hidden><strong>ĐANG XEM BỐ CỤC MINH HỌA</strong><p>Các nội dung và ảnh bên dưới chỉ mô tả cách trình bày. Đây chưa phải feedback hay ảnh khách hàng.</p></div><div id="feedback-grid" class="feedback-grid"></div><div id="feedback-empty" class="feedback-empty"><div class="feedback-empty-art" aria-hidden="true"><span>♡</span><span>một chỗ nhỏ,<br>chờ lời thương.</span></div><div><span class="eyebrow">A LITTLE SPACE FOR REAL STORIES</span><h2 id="feedback-empty-title">Lời thương đầu tiên,<br><em>Đơm đang chờ.</em></h2><p id="feedback-empty-copy">Hiện chưa có feedback thật được đăng. Khi khách cho phép chia sẻ lời nhắn và ảnh, tụi mình sẽ giữ những điều đó ở đây.</p><a class="text-link" href="#bouquets">Dạo xem các bó hoa <span>↗</span></a></div></div><div id="feedback-demo-controls" class="feedback-demo-controls"><span>Dành cho việc duyệt giao diện</span><button class="text-link" id="toggle-feedback-examples" aria-pressed="false">Xem bố cục minh họa <span>↗</span></button></div><div class="feedback-shop-link"><p>Một chút hoa, một ngày dịu lại.</p><a class="button button-green" href="#bouquets">Chọn một bó hoa <span>↗</span></a></div>`;

document.body.insertAdjacentHTML('beforeend',`<dialog class="shop-product-dialog" id="shop-product-dialog" aria-labelledby="product-title"><button class="dialog-close" data-close="shop-product-dialog" aria-label="Đóng chi tiết bó hoa">×</button><div id="shop-product-detail"></div></dialog><dialog class="shop-photo-dialog" id="shop-photo-dialog" aria-label="Xem ảnh lớn"><button class="dialog-close" data-close="shop-photo-dialog" aria-label="Đóng ảnh">×</button><div class="shop-lightbox-stage"><button id="shop-photo-prev" class="shop-lightbox-arrow" aria-label="Ảnh trước">←</button><img id="shop-photo-image" alt="" width="1024" height="1536"><button id="shop-photo-next" class="shop-lightbox-arrow" aria-label="Ảnh sau">→</button></div><p id="shop-photo-caption"></p></dialog>`);

$('.art-manifesto').insertAdjacentHTML('afterend',`<section class="shop-home-collection page-width section" aria-labelledby="home-bouquets-title"><div class="section-heading"><div><span class="eyebrow">THE BOUQUET COLLECTION</span><h2 id="home-bouquets-title">Đã gói ghém,<br><em>chờ bạn chọn thương.</em></h2><p>Ghé xem những mẫu bó sẵn, hoặc đơm tiếp theo ý mình.</p></div><a class="text-link" href="#bouquets">Xem các bó hoa <span>↗</span></a></div><div class="shop-product-grid shop-home-product-grid" id="shop-home-products"></div></section>`);
$('.faq-section').insertAdjacentHTML('beforebegin',`<section class="shop-home-feedback page-width" aria-labelledby="home-feedback-title"><div class="shop-feedback-doodle" aria-hidden="true">♡<span>a little note<br>means a lot.</span></div><div><span class="eyebrow">LOVE NOTES / FEEDBACK</span><h2 id="home-feedback-title">Những lời thương,<br><em>mình giữ ở đây.</em></h2><p id="home-feedback-copy"></p><a class="text-link" href="#feedback">Ghé góc feedback <span>↗</span></a></div></section>`);
$('.footer-main').insertAdjacentHTML('afterend','<nav class="shop-footer-links page-width" aria-label="Khám phá Đơm"><a href="#bouquets">Bó hoa của Đơm ↗</a><a href="#feedback">Lời thương · Feedback ↗</a><button data-open-studio>Tự đơm một bó ↗</button></nav>');
$('.studio-heading').insertAdjacentHTML('afterend','<div class="shop-draft-undo" id="shop-draft-undo" hidden><span>Một mẫu bó của Đơm đã được mở trên bàn.</span><button id="restore-shop-draft">Khôi phục bản phối trước ↶</button></div>');

function renderShopProductCard(product,index){
  const isFavorite=shopFavorites.includes(product.id);
  return `<article class="shop-product-card"><div class="shop-product-photo"><a href="#bouquets/${product.id}" aria-label="Xem bó ${product.name}"><img src="${product.image}" style="object-position:${product.imagePosition}" alt="Ảnh concept bó ${product.name}" width="1024" height="1536" loading="lazy"><span class="shop-photo-open">Gặp bó hoa này <i>↗</i></span></a><span class="shop-product-number">BOUQUET / ${String(SHOP_BOUQUETS.indexOf(product)+1).padStart(2,'0')}</span><span class="shop-concept-badge">ẢNH CONCEPT</span><button class="shop-favorite-button" data-bouquet-favorite="${product.id}" aria-label="Yêu thích bó ${product.name}" aria-pressed="${isFavorite}">${isFavorite?'♥':'♡'}</button></div><div class="shop-product-card-copy"><div><a href="#bouquets/${product.id}"><h2>${product.name}</h2></a><p>${product.subtitle}</p></div><span class="shop-card-price">${money(shopPrice(product))}<small>Giá tham khảo</small></span></div><div class="shop-card-meta"><span>${shopStemCount(product)} cành · ${product.tone}</span><a href="#bouquets/${product.id}" aria-label="Chi tiết ${product.name}">↗</a></div></article>`;
}
function renderShopProducts(){
  const products=shopFilterBouquets(SHOP_BOUQUETS,{...shopFilters,favorites:shopFavorites},FLOWERS,WRAP_STYLES);
  $('#shop-product-grid').innerHTML=products.map(renderShopProductCard).join('');
  $('#shop-empty').hidden=products.length>0;
  $('#shop-result-count').textContent=`${products.length} / ${SHOP_BOUQUETS.length} mẫu bó · Giá tham khảo, chưa gồm phí giao`;
  $$('[data-shop-mood]').forEach(button=>button.setAttribute('aria-pressed',button.dataset.shopMood===shopFilters.mood));
}
function clearShopFilters(){Object.assign(shopFilters,{query:'',mood:'all',price:'all',sort:'featured',favoritesOnly:false});$('#shop-search').value='';$('#shop-price').value='all';$('#shop-sort').value='featured';$('#shop-only-favorites').checked=false;renderShopProducts();}
$('#shop-search').addEventListener('input',event=>{shopFilters.query=event.target.value;renderShopProducts();});
$('#shop-price').addEventListener('change',event=>{shopFilters.price=event.target.value;renderShopProducts();});
$('#shop-sort').addEventListener('change',event=>{shopFilters.sort=event.target.value;renderShopProducts();});
$('#shop-only-favorites').addEventListener('change',event=>{shopFilters.favoritesOnly=event.target.checked;renderShopProducts();});
$('#shop-clear-filters').addEventListener('click',clearShopFilters);
function toggleShopFavorite(id){if(!shopProduct(id))return;shopFavorites=shopFavorites.includes(id)?shopFavorites.filter(x=>x!==id):[...shopFavorites,id];try{localStorage.setItem('dom-floral-shop-favorites',JSON.stringify(shopFavorites));}catch{}$$('[data-bouquet-favorite]').filter(button=>button.dataset.bouquetFavorite===id).forEach(button=>{const active=shopFavorites.includes(id);button.textContent=active?'♥':'♡';button.setAttribute('aria-pressed',active);});if(shopFilters.favoritesOnly)renderShopProducts();toast(shopFavorites.includes(id)?'Đã giữ lại một bó bạn thương ♡':'Đã bỏ khỏi những bó yêu thích.');}

function renderProductDetail(product){
  const reviews=feedbackForProduct(product.id);
  $('#shop-product-detail').innerHTML=`<div class="shop-detail-layout"><div class="shop-detail-image"><button data-product-photo="${product.id}" aria-label="Phóng to ảnh bó ${product.name}"><img src="${product.image}" alt="Ảnh concept bó ${product.name}" width="1024" height="1536"><span>Phóng to ảnh ↗</span></button><span class="shop-detail-image-label">ẢNH CONCEPT / KHÔNG PHẢI ẢNH HÀNG THẬT</span></div><div class="shop-detail-copy"><span class="eyebrow">ĐƠM. / BOUQUET NO. ${String(SHOP_BOUQUETS.indexOf(product)+1).padStart(2,'0')}</span><h2 id="product-title">${product.name}</h2><p class="shop-detail-subtitle">${product.subtitle}</p><strong class="shop-detail-price">${money(shopPrice(product))}<small>Giá tham khảo</small></strong><p class="shop-detail-description">${product.description}</p><div class="shop-detail-tabs" role="tablist" aria-label="Thông tin bó hoa"><button data-product-tab="flowers" role="tab" id="product-tab-flowers" aria-selected="true" aria-controls="product-content-flowers">Trong bó có gì?</button><button data-product-tab="reviews" role="tab" id="product-tab-reviews" aria-selected="false" aria-controls="product-content-reviews" tabindex="-1">Feedback ${reviews.length?`(${reviews.length})`:''}</button></div><div id="product-content-flowers" class="shop-detail-content" role="tabpanel" aria-labelledby="product-tab-flowers"><ul>${Object.entries(product.recipe).map(([id,count])=>`<li><span>${findFlower(id).name}</span><span>${count} cành</span></li>`).join('')}</ul><p>Gói ${WRAP_STYLES[product.wrapStyle].name.toLowerCase()} · ${PAPERS[product.paper].name.toLowerCase()} · Nơ ${RIBBONS[product.ribbon].name.toLowerCase()}</p></div><div id="product-content-reviews" class="shop-detail-content shop-product-feedback" role="tabpanel" aria-labelledby="product-tab-reviews" hidden>${reviews.length?reviews.slice(0,2).map(review=>`<p class="shop-mini-review">“${escapeHTML(review.text)}”<span>— ${escapeHTML(review.author || 'Khách của Đơm')}</span></p>`).join(''):'<p>Mẫu này chưa có feedback thật được đăng. Khi có lời nhắn từ khách, Đơm sẽ giữ ở đây.</p>'}<button class="text-link" data-feedback-product="${product.id}">Ghé góc feedback <span>↗</span></button></div><p class="shop-detail-note">${product.note}</p><button class="button button-green shop-order-product" data-order-product="${product.id}">Chuẩn bị đặt bó này <span>↗</span></button><button class="button button-outline shop-customize-product" id="shop-customize-product" data-customize-product="${product.id}">Tự chỉnh từ mẫu này <span>✳</span></button><p class="shop-detail-disclaimer">Giá gồm hoa, giấy gói và nơ, chưa gồm phí giao. Có thể thêm thiệp, sticker và charm ở bàn phối. Hoa tự nhiên có khác biệt; tiệm cần xác nhận hoa và lịch nhận trước khi nhận đơn.</p></div></div>`;
  activeShopProduct=product.id;
  document.title=`${product.name} — Đơm. floral`;
}
function showProduct(id){const product=shopProduct(id);if(!product)return;renderProductDetail(product);if(!$('#shop-product-dialog').open)$('#shop-product-dialog').showModal();}
function makeShopConfiguration(product){
  const config={stems:[],paper:product.paper,ribbon:product.ribbon,note:'',title:product.name,author:'',cardMessage:'',...normalizeGiftState()};
  config.wrapStyle=product.wrapStyle;
  Object.entries(product.recipe).forEach(([id,count])=>{for(let i=0;i<count;i++)config.stems.push(makeStem(id,config.stems.length));});
  return config;
}
function orderShopProduct(id){const product=shopProduct(id);if(!product)return;$('#shop-product-dialog').close();prepareOrder(makeShopConfiguration(product),{productId:id});}
function customizeShopProduct(id,button){
  const product=shopProduct(id);if(!product)return;
  if(state.stems.length && button.dataset.confirmProduct!==id){button.dataset.confirmProduct=id;button.innerHTML=`Thay bản phối ${state.stems.length} cành hiện tại? <span>↗</span>`;return;}
  shopPreviousDraft=structuredClone(state);state=makeShopConfiguration(product);selected=null;arrangeNaturally();persist();switchGiftTab('wrap');$('#shop-product-dialog').close();$('#shop-draft-undo').hidden=false;openStudio();toast(`Đã mở “${product.name}” để bạn đơm tiếp.`);
}
$('#restore-shop-draft').addEventListener('click',()=>{if(!shopPreviousDraft)return;state=shopPreviousDraft;shopPreviousDraft=null;selected=null;renderBouquet();persist();$('#shop-draft-undo').hidden=true;toast('Đã khôi phục bản phối trước.');});
$('#shop-product-dialog').addEventListener('close',()=>{activeShopProduct=null;if(location.hash.startsWith('#bouquets/'))history.replaceState(null,'','#bouquets');document.title=location.hash==='#bouquets'?'Bó hoa của Đơm — Đơm. floral':document.title;});

function reviewDate(value){const date=new Date(value);return Number.isNaN(date.getTime())?'':new Intl.DateTimeFormat('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'}).format(date);}
function renderReviewCard(review){
  const photos=feedbackPhotos(review),product=shopProduct(review.productId);
  const rating=Number.isInteger(review.rating)&&review.rating>=1&&review.rating<=5?review.rating:null;
  return `<article class="feedback-card ${review.isExample?'feedback-card-example':''}">${photos.length?`<button class="feedback-card-photo" data-feedback-photo="${escapeHTML(review.id)}" aria-label="Xem ảnh ${review.isExample?'minh họa':`từ ${escapeHTML(review.author || 'khách')}`}"><img src="${escapeHTML(photos[0])}" alt="${review.isExample?'Ảnh concept minh họa bố cục feedback':'Ảnh bó hoa khách cho phép chia sẻ'}" width="1024" height="1536" loading="lazy"><span>${review.isExample?'ẢNH MINH HỌA':`${photos.length} ảnh · Phóng to ↗`}</span></button>`:''}<div class="feedback-card-copy">${review.isExample?'<span class="feedback-sample-label">NỘI DUNG MINH HỌA / KHÔNG PHẢI FEEDBACK THẬT</span>':''}<div class="feedback-card-header"><strong>${escapeHTML(review.author || 'Khách của Đơm')}</strong><span>${reviewDate(review.date)}</span></div>${rating?`<span class="feedback-stars" aria-label="${rating} trên 5 sao">${'★'.repeat(rating)}${'☆'.repeat(5-rating)}</span>`:''}<p>${escapeHTML(review.text)}</p>${product?`<a class="feedback-product-link" href="#bouquets/${product.id}">${product.name} <span>↗</span></a>`:''}</div></article>`;
}
function renderFeedback(){
  const real=genuineFeedback();
  const examples=showFeedbackExamples && !real.length;
  let reviews=examples?SHOP_FEEDBACK_EXAMPLES:[...real];
  reviews=reviews.filter(review=>(feedbackFilters.product==='all'||review.productId===feedbackFilters.product)&&(!feedbackFilters.photosOnly||feedbackPhotos(review).length));
  reviews.sort((a,b)=>feedbackFilters.sort==='rating'?(b.rating||0)-(a.rating||0):(Date.parse(b.date)||0)-(Date.parse(a.date)||0));
  $('#feedback-grid').innerHTML=reviews.map(renderReviewCard).join('');
  $('#feedback-empty').hidden=reviews.length>0;
  $('#feedback-example-banner').hidden=!examples;
  $('#feedback-toolbar').hidden=!real.length && !examples;
  $('#feedback-demo-controls').hidden=real.length>0;
  $('#toggle-feedback-examples').setAttribute('aria-pressed',examples);
  $('#toggle-feedback-examples').innerHTML=examples?'Đóng phần minh họa <span>↶</span>':'Xem bố cục minh họa <span>↗</span>';
  $('#feedback-empty-title').innerHTML=real.length || examples?'Một chút nữa,<br><em>sẽ gặp lời thương.</em>':'Lời thương đầu tiên,<br><em>Đơm đang chờ.</em>';
  $('#feedback-empty-copy').textContent=real.length || examples?'Chưa có lời nhắn phù hợp với bộ lọc này. Bạn thử chọn tất cả bó hoa hoặc bỏ lọc có ảnh nhé.':'Hiện chưa có feedback thật được đăng. Khi khách cho phép chia sẻ lời nhắn và ảnh, tụi mình sẽ giữ những điều đó ở đây.';
  const rated=real.filter(review=>Number.isInteger(review.rating)&&review.rating>=1&&review.rating<=5);
  $('#feedback-statistics').hidden=!real.length;
  $('#feedback-statistics').innerHTML=real.length?`<span><strong>${real.length}</strong> lời nhắn đã được đăng</span>${rated.length?`<span><strong>${(rated.reduce((sum,review)=>sum+review.rating,0)/rated.length).toFixed(1)}/5</strong> từ ${rated.length} đánh giá</span>`:''}<span>Cảm ơn vì đã để lại một chút thương.</span>`:'';
  $('#home-feedback-copy').textContent=real.length?`Đã có ${real.length} lời nhắn được giữ lại. Ghé xem những bó hoa qua góc nhìn của khách.`:'Một góc chờ những lời nhắn và ảnh thật từ khách của tiệm.';
}
$('#toggle-feedback-examples').addEventListener('click',()=>{showFeedbackExamples=!showFeedbackExamples;renderFeedback();});
$('#feedback-product').addEventListener('change',event=>{feedbackFilters.product=event.target.value;renderFeedback();});
$('#feedback-photos').addEventListener('change',event=>{feedbackFilters.photosOnly=event.target.checked;renderFeedback();});
$('#feedback-sort').addEventListener('change',event=>{feedbackFilters.sort=event.target.value;renderFeedback();});
function showProductFeedback(id){feedbackFilters.product=id;$('#feedback-product').value=id;$('#shop-product-dialog').close();if(location.hash==='#feedback')renderFeedback();else location.hash='feedback';}

function openShopPhotos(photos,label){if(!photos.length)return;shopPhotos=photos;shopPhotoIndex=0;shopPhotoLabel=label;renderShopPhoto();$('#shop-photo-dialog').showModal();}
function renderShopPhoto(){$('#shop-photo-image').src=shopPhotos[shopPhotoIndex];$('#shop-photo-image').alt=shopPhotoLabel;$('#shop-photo-caption').textContent=`${shopPhotoLabel}${shopPhotos.length>1?` · ${shopPhotoIndex+1} / ${shopPhotos.length}`:''}`;$('#shop-photo-prev').disabled=shopPhotoIndex===0;$('#shop-photo-next').disabled=shopPhotoIndex===shopPhotos.length-1;}
$('#shop-photo-prev').addEventListener('click',()=>{if(shopPhotoIndex>0){shopPhotoIndex--;renderShopPhoto();}});
$('#shop-photo-next').addEventListener('click',()=>{if(shopPhotoIndex<shopPhotos.length-1){shopPhotoIndex++;renderShopPhoto();}});
$('#shop-photo-dialog').addEventListener('keydown',event=>{if(event.key==='ArrowLeft')$('#shop-photo-prev').click();if(event.key==='ArrowRight')$('#shop-photo-next').click();});
$$('#shop-photo-dialog,#shop-product-dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}));

document.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.shopMood){shopFilters.mood=button.dataset.shopMood;renderShopProducts();}
  if(button.hasAttribute('data-clear-shop'))clearShopFilters();
  if(button.dataset.bouquetFavorite)toggleShopFavorite(button.dataset.bouquetFavorite);
  if(button.dataset.orderProduct)orderShopProduct(button.dataset.orderProduct);
  if(button.dataset.customizeProduct)customizeShopProduct(button.dataset.customizeProduct,button);
  if(button.dataset.productTab){$$('[data-product-tab]').forEach(tab=>{const active=tab===button;tab.setAttribute('aria-selected',active);tab.tabIndex=active?0:-1;$('#product-content-'+tab.dataset.productTab).hidden=!active;});}
  if(button.dataset.feedbackProduct)showProductFeedback(button.dataset.feedbackProduct);
  if(button.dataset.productPhoto){const product=shopProduct(button.dataset.productPhoto);if(product)openShopPhotos([product.image],`${product.name} · Ảnh concept`);}
  if(button.dataset.feedbackPhoto){const review=[...genuineFeedback(),...(showFeedbackExamples?SHOP_FEEDBACK_EXAMPLES:[])].find(r=>r.id===button.dataset.feedbackPhoto);if(review)openShopPhotos(feedbackPhotos(review),review.isExample?'Ảnh concept minh họa, không phải ảnh khách':`Ảnh bó hoa từ ${review.author || 'khách của Đơm'}`);}
});
$('#shop-product-dialog').addEventListener('keydown',event=>{if(!event.target.matches('[data-product-tab]')||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const tabs=$$('[data-product-tab]');const next=event.key==='Home'?0:event.key==='End'?1:1-tabs.indexOf(event.target);tabs[next].click();tabs[next].focus();});

function syncShopNavigation(){const page=location.hash.slice(1).split('/')[0];$$('[data-route]').forEach(link=>{if(link.dataset.route===page)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});if(page==='bouquets')document.title='Bó hoa của Đơm — Đơm. floral';else if(page==='feedback')document.title='Lời thương · Feedback — Đơm. floral';else document.title=shopDefaultTitle;}
function syncShopRoute(){
  if($('#shop-photo-dialog').open)$('#shop-photo-dialog').close();
  syncShopNavigation();
  const parts=location.hash.slice(1).split('/');
  if(parts[0]==='bouquets' && parts[1]){const product=shopProduct(parts[1]);if(product){if(!$('#shop-product-dialog').open || activeShopProduct!==product.id)showProduct(product.id);}else{history.replaceState(null,'','#bouquets');toast('Mẫu bó này chưa có trong bộ sưu tập hiện tại.');}}
  else if($('#shop-product-dialog').open)$('#shop-product-dialog').close();
  if(parts[0]==='feedback')renderFeedback();
}
document.addEventListener('site:route',syncShopRoute);
document.addEventListener('site:view',()=>{syncShopNavigation();if(!location.hash.startsWith('#bouquets/') && $('#shop-product-dialog').open)$('#shop-product-dialog').close();});
$('#shop-home-products').innerHTML=[SHOP_BOUQUETS[0],SHOP_BOUQUETS[2]].map(renderShopProductCard).join('');
renderShopProducts();renderFeedback();syncShopRoute();
