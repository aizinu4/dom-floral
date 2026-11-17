const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const money = value => `${new Intl.NumberFormat('vi-VN').format(value)}đ`;
const FLOWERS = [
  { id: 'rose', name: 'Hồng Ohara', latin: 'A little romance', price: 45000, type: 'flower', tag: 'ĐƯỢC THƯƠNG NHIỀU', sprite: 0 },
  { id: 'tulip', name: 'Tulip trắng', latin: 'Simply, lovely', price: 35000, type: 'flower', tag: 'DỊU DÀNG', sprite: 1 },
  { id: 'stock', name: 'Stock tím', latin: 'Soft little dreams', price: 25000, type: 'flower', tag: 'MỘT CHÚT MƠ', sprite: 2 },
  { id: 'daisy', name: 'Cúc tana', latin: 'Little happy things', price: 20000, type: 'leaf', tag: 'NHỎ MÀ XINH', sprite: 3 },
  { id: 'lisianthus', name: 'Cát tường trắng', latin: 'A gentle beginning', price: 30000, type: 'flower', tag: 'TRONG TRẺO', sprite: 4 },
  { id: 'eucalyptus', name: 'Lá eucalyptus', latin: 'A breath of green', price: 15000, type: 'leaf', tag: 'MỘT CHÚT XANH', sprite: 5 },
];
const PAPERS = { cream: { name: 'Kem bơ', color: '#e5d9bd' }, pink: { name: 'Hồng phấn', color: '#dfb5b5' }, sage: { name: 'Xanh sage', color: '#aebda1' }, lilac: { name: 'Tím nhạt', color: '#bca9c6' } };
const RIBBONS = { wine: { name: 'Đỏ rượu', color: '#865559' }, moss: { name: 'Xanh rêu', color: '#566b4c' }, ivory: { name: 'Kem sữa', color: '#d9caac' } };
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const MOODS = {
  gentle: { title: 'Một chút dịu dàng', symbol: '☁', copy: 'Trắng trong, tím nhạt và một chút xanh. Một bó hoa nhỏ, như cái ôm dành cho ngày bạn muốn chậm lại.', flowers: ['tulip', 'tulip', 'stock', 'lisianthus', 'eucalyptus'], paper: 'cream' },
  love: { title: 'Thương một người', symbol: '♡', copy: 'Hồng phấn thay một lời thương, cúc nhỏ thay nụ cười. Gửi người ấy một điều đẹp đẽ, rất riêng.', flowers: ['rose', 'rose', 'rose', 'daisy', 'lisianthus', 'eucalyptus'], paper: 'pink' },
  happy: { title: 'Hôm nay thật vui', symbol: '☼', copy: 'Cúc tana trong veo, tulip tươi tắn và chút tím mộng mơ. Giữ lại niềm vui hôm nay bằng một bó hoa.', flowers: ['daisy', 'daisy', 'tulip', 'tulip', 'stock', 'eucalyptus'], paper: 'sage' },
  self: { title: 'Tặng mình thôi', symbol: '✳', copy: 'Một cành hồng, một chút mơ và đủ đầy dịu dàng. Đâu cần một dịp — hôm nay, bạn chọn mình.', flowers: ['rose', 'stock', 'stock', 'lisianthus', 'eucalyptus'], paper: 'lilac' },
};
const findFlower = id => FLOWERS.find(flower => flower.id === id);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const safeNumber = (value, fallback, min, max) => Number.isFinite(value) ? clamp(value, min, max) : fallback;
const escapeHTML = text => String(text).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
let state = { stems: [], paper: 'cream', ribbon: 'wine', note: '', title: '', author: '', cardMessage: '', ...normalizeGiftState() };
let favorites = [];
let selected = null;
let activeMood = null;
let currentOrder = null;
let toastTimer;
let storageAvailable = true;
try {
  const saved = JSON.parse(localStorage.getItem('dom-floral-bouquet') || 'null');
  if (saved && typeof saved === 'object') {
    Object.assign(state, normalizeGiftState(saved));
    state.paper = PAPERS[saved.paper] ? saved.paper : 'cream';
    state.note = typeof saved.note === 'string' ? saved.note.slice(0, 300) : '';
    state.ribbon = RIBBONS[saved.ribbon] ? saved.ribbon : 'wine';
    state.title = typeof saved.title === 'string' ? saved.title.slice(0, 50) : '';
    state.author = typeof saved.author === 'string' ? saved.author.slice(0, 40) : '';
    state.cardMessage = typeof saved.cardMessage === 'string' ? saved.cardMessage.slice(0, 160) : '';
    state.stems = Array.isArray(saved.stems) ? saved.stems.filter(s => s && findFlower(s.flower)).slice(0, 18).map(s => ({ uid: crypto.randomUUID(), flower: s.flower, x: safeNumber(s.x, 50, 8, 92), y: safeNumber(s.y, 42, 15, 75), rotation: safeNumber(s.rotation, 0, -85, 85) })) : [];
  }
  const savedFavorites = JSON.parse(localStorage.getItem('dom-floral-favorites') || '[]');
  favorites = Array.isArray(savedFavorites) ? savedFavorites.filter(id => findFlower(id)) : [];
} catch { storageAvailable = false; }
function toast(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 3200);
}
function persist() {
  try { localStorage.setItem('dom-floral-bouquet', JSON.stringify(state)); }
  catch { storageAvailable = false; $('.studio-autosave').textContent = '◦ Bản phối chỉ giữ trong phiên này'; }
}
function flowerTotal() { return state.stems.reduce((sum, stem) => sum + findFlower(stem.flower).price, 0); }
function renderCatalog(filter = 'all') {
  $('#flower-grid').innerHTML = FLOWERS.filter(f => filter === 'all' || f.type === filter).map(f => `<article class="flower-card"><div class="flower-photo"><span class="flower-tag">${f.tag}</span><button class="favorite-button" aria-label="Yêu thích ${f.name}" aria-pressed="${favorites.includes(f.id)}" data-favorite="${f.id}">${favorites.includes(f.id) ? '♥' : '♡'}</button><div role="img" aria-label="Một cành ${f.name}, tách nền" class="sprite sprite-${f.sprite}"></div></div><div class="flower-details"><h3>${f.name}</h3><span class="flower-latin">${f.latin}</span><span class="flower-price">${money(f.price)} <small>/ cành</small></span><button class="add-flower" data-add="${f.id}" aria-label="Thêm ${f.name} vào bó">+</button></div></article>`).join('');
}
function renderStudioCatalog() {
  $('#studio-catalog').innerHTML = FLOWERS.map(f => `<article class="studio-card"><div class="studio-card-image"><div class="sprite sprite-${f.sprite}" role="img" aria-label="${f.name}"></div></div><h4>${f.name}</h4><span class="studio-card-price">${money(f.price)}</span><button class="studio-add" data-add="${f.id}" aria-label="Thêm ${f.name}">+</button></article>`).join('');
}
function makeStem(flower, index = state.stems.length) {
  const rotations = [-18, 15, -6, 25, -28, 7, -13, 19, 0];
  return { uid: crypto.randomUUID(), flower, x: 50 + ((index % 3) - 1) * 5, y: 40 + (index % 3) * 4, rotation: rotations[index % rotations.length] };
}
function addStem(id) {
  if (state.stems.length >= 18) { toast('Bó nhỏ tối đa 18 cành. Bạn bỏ bớt một cành để thử hoa mới nhé.'); return; }
  const stem = makeStem(id);
  state.stems.push(stem);
  selected = stem.uid;
  renderBouquet(stem.uid);
  persist();
  toast(`Đã thêm một cành ${findFlower(id).name.toLowerCase()} ♡`);
}
function setStemStyle(element, stem) {
  element.style.left = `${stem.x}%`;
  element.style.top = `${stem.y}%`;
  element.style.transform = `translate(-50%, -50%) rotate(${stem.rotation}deg)`;
}
function renderSelection() {
  $$('.placed-stem').forEach(el => el.classList.toggle('active', el.dataset.uid === selected));
  const stem = state.stems.find(s => s.uid === selected);
  $('#selection-label').textContent = stem ? `${findFlower(stem.flower).name} · ${stem.rotation}°` : 'Chọn một cành để chỉnh';
  $$('#stem-controls button').forEach(button => button.disabled = !stem);
  $('#selected-list').innerHTML = state.stems.length ? [...state.stems].reverse().map((s, index) => `<div class="selected-item ${s.uid === selected ? 'chosen' : ''}"><button data-select="${s.uid}" aria-label="Chọn ${findFlower(s.flower).name}, lớp ${state.stems.length - index}"><span class="sprite sprite-${findFlower(s.flower).sprite}"></span>${findFlower(s.flower).name}</button><button data-move="front" data-uid="${s.uid}" aria-label="Đưa ${findFlower(s.flower).name} lên một lớp" ${index === 0 ? 'disabled' : ''}>↑</button><button data-move="back" data-uid="${s.uid}" aria-label="Đưa ${findFlower(s.flower).name} xuống một lớp" ${index === state.stems.length - 1 ? 'disabled' : ''}>↓</button><button data-remove="${s.uid}" aria-label="Bỏ ${findFlower(s.flower).name}">×</button></div>`).join('') : '<p class="empty-selection">Bàn hoa đang chờ bạn chọn cành đầu tiên ♡</p>';
  document.dispatchEvent(new CustomEvent('bouquet:selection',{detail:{uid:selected}}));
}
function renderBouquet(enteringUid = null) {
  const layer = $('#stem-layer');
  const nodes = new Map([...layer.children].map(el => [el.dataset.uid, el]));
  const ids = new Set(state.stems.map(s => s.uid));
  nodes.forEach((node, uid) => { if (!ids.has(uid)) node.remove(); });
  state.stems.forEach((stem, index) => {
    const flower = findFlower(stem.flower);
    const el = nodes.get(stem.uid) || document.createElement('button');
    if (!nodes.has(stem.uid)) {
      el.className = 'placed-stem';
      el.innerHTML = `<span class="sprite sprite-${flower.sprite}"></span>`;
    }
    if (stem.uid === enteringUid) el.classList.add('stem-entering');
    el.dataset.uid = stem.uid;
    el.setAttribute('aria-label', `${flower.name}, lớp ${index + 1}. Dùng phím mũi tên để di chuyển, Delete để bỏ cành.`);
    el.style.zIndex = index + 1;
    setStemStyle(el, stem);
    layer.append(el);
  });
  $('#bouquet-canvas').classList.toggle('has-flowers', state.stems.length > 0);
  $('#canvas-guide').hidden = state.stems.length > 0;
  $('#bouquet-canvas').style.setProperty('--paper', PAPERS[state.paper].color);
  $('#bouquet-canvas').style.setProperty('--ribbon', RIBBONS[state.ribbon].color);
  $('#cart-count').textContent = state.stems.length;
  $('#bag-button').setAttribute('aria-label', `Xem bó hoa đã chọn, ${state.stems.length} cành`);
  $('#selected-count').textContent = state.stems.length;
  $('#flower-subtotal').textContent = money(flowerTotal());
  $('#bouquet-total').textContent = money(flowerTotal() + getGiftPrices(state).total);
  $('#paper-name').textContent = PAPERS[state.paper].name;
  $$('.paper-swatch').forEach(el => { el.classList.toggle('chosen', el.dataset.paper === state.paper); el.setAttribute('aria-pressed', el.dataset.paper === state.paper); });
  $('#bouquet-note').value = state.note;
  $('#download-bouquet').disabled = !state.stems.length;
  $('#clear-bouquet').disabled = !state.stems.length;
  renderSelection();
  document.dispatchEvent(new CustomEvent('bouquet:updated'));
}
function showHome(section) {
  $('#home-view').hidden = false;
  $('#studio-view').hidden = true;
  closeMenu();
  requestAnimationFrame(() => { if (section) document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' }); else window.scrollTo({ top: 0, behavior: 'smooth' }); });
}
function openStudio() {
  if (location.hash !== '#studio') { location.hash = 'studio'; return; }
  $('#home-view').hidden = true;
  $('#studio-view').hidden = false;
  closeMenu();
  window.scrollTo({ top: 0, behavior: 'instant' });
}
function route() { if (location.hash === '#studio') openStudio(); else showHome(location.hash.slice(1)); }
function closeMenu() { $('#mobile-nav').hidden = true; $('#menu-toggle').setAttribute('aria-expanded', 'false'); }
function selectStem(uid) { selected = uid; renderSelection(); }
function removeStem(uid) {
  state.stems = state.stems.filter(s => s.uid !== uid);
  if (selected === uid) selected = null;
  renderBouquet(); persist();
}
function moveLayer(uid, direction) {
  const index = state.stems.findIndex(s => s.uid === uid);
  const next = direction === 'front' ? index + 1 : index - 1;
  if (index < 0 || next < 0 || next >= state.stems.length) return;
  [state.stems[index], state.stems[next]] = [state.stems[next], state.stems[index]];
  selected = uid; renderBouquet(); persist();
}
function rotateStem(delta) {
  const stem = state.stems.find(s => s.uid === selected);
  if (!stem) return;
  stem.rotation = clamp(stem.rotation + delta, -85, 85);
  setStemStyle($(`[data-uid="${stem.uid}"]`, $('#stem-layer')), stem);
  renderSelection(); persist();
}
document.addEventListener('click', event => {
  const button = event.target.closest('button,a');
  if (!button) return;
  if (button.hasAttribute('data-open-studio')) { event.preventDefault(); openStudio(); }
  if (button.hasAttribute('data-home')) { event.preventDefault(); history.pushState(null, '', location.pathname + location.search); showHome(); }
  if (button.dataset.section) { event.preventDefault(); const hash = `#${button.dataset.section}`; if (location.hash === hash) showHome(button.dataset.section); else location.hash = hash; }
  if (button.dataset.add) addStem(button.dataset.add);
  if (button.dataset.favorite) {
    const id = button.dataset.favorite;
    favorites = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    try { localStorage.setItem('dom-floral-favorites', JSON.stringify(favorites)); } catch {}
    button.setAttribute('aria-pressed', favorites.includes(id));
    button.textContent = favorites.includes(id) ? '♥' : '♡';
    toast(favorites.includes(id) ? 'Đã giữ lại một cành bạn thương ♡' : 'Đã bỏ khỏi những cành yêu thích');
  }
  if (button.dataset.filter) {
    $$('#home-filters button').forEach(el => { el.classList.toggle('active', el === button); el.setAttribute('aria-pressed', el === button); });
    renderCatalog(button.dataset.filter);
  }
  if (button.dataset.paper) { state.paper = button.dataset.paper; renderBouquet(); persist(); animatePaper(); }
  if (button.dataset.close) document.getElementById(button.dataset.close).close();
  if (button.dataset.select) selectStem(button.dataset.select);
  if (button.dataset.remove) removeStem(button.dataset.remove);
  if (button.dataset.move) moveLayer(button.dataset.uid, button.dataset.move);
  if (button.dataset.mood) showMood(button.dataset.mood);
});
$('#menu-toggle').addEventListener('click', () => { const open = $('#mobile-nav').hidden; $('#mobile-nav').hidden = !open; $('#menu-toggle').setAttribute('aria-expanded', open); });
$('#back-top').addEventListener('click', event => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
window.addEventListener('hashchange', route);
window.addEventListener('popstate', route);
$('#available-tab').addEventListener('click', () => switchTab(false));
$('#selected-tab').addEventListener('click', () => switchTab(true));
function switchTab(showSelected) {
  $('#studio-catalog').hidden = showSelected;
  $('#selected-list').hidden = !showSelected;
  $('#available-tab').classList.toggle('active', !showSelected);
  $('#selected-tab').classList.toggle('active', showSelected);
  $('#available-tab').setAttribute('aria-selected', !showSelected);
  $('#selected-tab').setAttribute('aria-selected', showSelected);
}
$$('.picker-tabs [role=tab]').forEach((tab, index) => tab.addEventListener('keydown', event => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index; switchTab(next === 1); $$('.picker-tabs [role=tab]')[next].focus(); } }));
$('#rotate-left').addEventListener('click', () => rotateStem(-10));
$('#rotate-right').addEventListener('click', () => rotateStem(10));
$('#layer-front').addEventListener('click', () => moveLayer(selected, 'front'));
$('#layer-back').addEventListener('click', () => moveLayer(selected, 'back'));
$('#delete-stem').addEventListener('click', () => removeStem(selected));
$('#bouquet-note').addEventListener('input', event => { state.note = event.target.value; persist(); });
$('#clear-bouquet').addEventListener('click', () => $('#clear-dialog').showModal());
$('#confirm-clear').addEventListener('click', () => { state.stems = []; selected = null; renderBouquet(); persist(); $('#clear-dialog').close(); toast('Bàn hoa đã sẵn sàng cho một điều mới.'); });
let drag = null;
$('#stem-layer').addEventListener('pointerdown', event => {
  const el = event.target.closest('.placed-stem');
  if (!el || event.button !== 0) return;
  const stem = state.stems.find(s => s.uid === el.dataset.uid);
  const rect = $('#bouquet-canvas').getBoundingClientRect();
  selectStem(stem.uid);
  el.focus({ preventScroll: true });
  drag = { element: el, stem, startX: event.clientX, startY: event.clientY, x: stem.x, y: stem.y, rect };
  el.setPointerCapture(event.pointerId);
  el.classList.add('dragging');
  event.preventDefault();
});
$('#stem-layer').addEventListener('pointermove', event => {
  if (!drag) return;
  drag.stem.x = clamp(drag.x + (event.clientX - drag.startX) / drag.rect.width * 100, 8, 92);
  drag.stem.y = clamp(drag.y + (event.clientY - drag.startY) / drag.rect.height * 100, 15, 75);
  setStemStyle(drag.element, drag.stem);
});
function finishDrag() { if (!drag) return; drag.element.classList.remove('dragging'); drag = null; persist(); }
$('#stem-layer').addEventListener('pointerup', finishDrag);
$('#stem-layer').addEventListener('pointercancel', finishDrag);
$('#stem-layer').addEventListener('lostpointercapture', finishDrag);
$('#stem-layer').addEventListener('keydown', event => {
  const el = event.target.closest('.placed-stem');
  if (!el) return;
  const stem = state.stems.find(s => s.uid === el.dataset.uid);
  selected = stem.uid;
  const step = event.shiftKey ? 3 : 1;
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
    event.preventDefault();
    if (event.key === 'ArrowLeft') stem.x = clamp(stem.x - step, 8, 92);
    if (event.key === 'ArrowRight') stem.x = clamp(stem.x + step, 8, 92);
    if (event.key === 'ArrowUp') stem.y = clamp(stem.y - step, 15, 75);
    if (event.key === 'ArrowDown') stem.y = clamp(stem.y + step, 15, 75);
    setStemStyle(el, stem); renderSelection(); persist();
  }
  if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); removeStem(stem.uid); }
  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectStem(stem.uid); }
});
function showMood(key) {
  activeMood = key;
  const mood = MOODS[key];
  $('#mood-dialog-title').textContent = mood.title;
  $('#mood-dialog-copy').textContent = mood.copy;
  $('#mood-dialog-symbol').textContent = mood.symbol;
  const ids = [...new Set(mood.flowers)];
  $('#mood-preview').innerHTML = ids.map((id, i) => `<div class="sprite sprite-${findFlower(id).sprite}" style="transform:rotate(${(i - (ids.length - 1) / 2) * 18}deg)"></div>`).join('');
  $('#mood-recommendation').textContent = ids.map(id => `${mood.flowers.filter(f => f === id).length} ${findFlower(id).name.toLowerCase()}`).join(' · ');
  $('#mood-price').textContent = `${money(mood.flowers.reduce((total, id) => total + findFlower(id).price, getGiftPrices(state).total))} / bó · Gồm kiểu gói, thiệp và phụ kiện đang chọn`;
  $('#mood-dialog').showModal();
}
$('#apply-mood').addEventListener('click', () => {
  const mood = MOODS[activeMood];
  const apply = () => {
    state.stems = mood.flowers.map((id, i) => makeStem(id, i));
    state.paper = mood.paper;
    state.title = mood.title;
    selected = null; arrangeNaturally(); $('#mood-dialog').close(); openStudio(); animatePaper();
    toast(`Đã đơm gợi ý “${mood.title}”. Bạn chỉnh tiếp theo ý mình nhé.`);
  };
  if (state.stems.length) {
    const button = $('#apply-mood');
    if (button.dataset.confirmMood !== activeMood) { button.dataset.confirmMood = activeMood; button.textContent = 'Thay bó hiện tại bằng gợi ý này?'; return; }
  }
  apply();
});
$('#mood-dialog').addEventListener('close', () => { $('#apply-mood').removeAttribute('data-confirm-mood'); $('#apply-mood').innerHTML = 'Đơm thử bó này <span>↗</span>'; });
$$('dialog').forEach(dialog => dialog.addEventListener('click', event => { if (event.target !== dialog) return; const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); }));
function localDate() { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
function prepareOrder() {
  if (!state.stems.length) { toast('Bạn chọn một vài cành hoa trước nhé ♡'); openStudio(); return; }
  const counts = {};
  state.stems.forEach(s => counts[s.flower] = (counts[s.flower] || 0) + 1);
  const gift=giftOrderInfo(state);
  currentOrder = { flowers: Object.entries(counts).map(([id, quantity]) => ({ name: findFlower(id).name, quantity, price: findFlower(id).price })), paper: PAPERS[state.paper].name, ribbon: RIBBONS[state.ribbon].name, title: state.title, note: state.note, digitalMessage:state.cardMessage, gift, total: flowerTotal() + gift.prices.total };
  const card=gift.greeting;
  $('#order-summary').innerHTML = `${currentOrder.title ? `<p>${escapeHTML(currentOrder.title)}</p>` : ''}<span>${state.stems.length} cành hoa · ${gift.wrapName}${state.wrapStyle==='none'?'':` · Màu ${PAPERS[state.paper].name.toLowerCase()}`} · Nơ ${RIBBONS[state.ribbon].name.toLowerCase()}</span><ul>${currentOrder.flowers.map(f => `<li>${f.quantity} × ${f.name} — ${money(f.quantity*f.price)}</li>`).join('')}</ul><div class="order-gift-lines"><p>${gift.wrapName} & nơ: ${money(gift.prices.wrapping)}</p>${card?`<p>${card.name} · ${card.writing}: ${money(card.price)}</p><p>Gửi ${escapeHTML(card.to || 'người thương')} · Từ ${escapeHTML(card.from || '(không ghi tên)')}</p><blockquote>${escapeHTML(card.message || '(Chưa viết lời nhắn)')}</blockquote>`:''}${gift.addOns.map(item=>`<p>${item.quantity} × ${item.name}: ${money(item.quantity*item.unitPrice)}</p>`).join('')}</div>${currentOrder.note ? `<p>Ghi chú cho tiệm: ${escapeHTML(currentOrder.note)}</p>` : ''}<strong>Tạm tính: ${money(currentOrder.total)} · Chưa gồm phí giao</strong>`;
  $('#delivery-date').min = localDate();
  if (!$('#delivery-date').value || $('#delivery-date').value < localDate()) $('#delivery-date').value = localDate();
  $('#order-form-view').hidden = false;
  $('#order-success').hidden = true;
  $('#order-dialog').showModal();
}
$('#prepare-order').addEventListener('click', prepareOrder);
$('#bag-button').addEventListener('click', prepareOrder);
$('#delivery-method').addEventListener('change', () => { const delivery = $('#delivery-method').value === 'delivery'; $('#address-label').hidden = !delivery; $('#delivery-address').required = delivery; });
$('#order-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.target;
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  if (!data.name.trim() || (data.delivery === 'delivery' && !data.address.trim())) { toast('Bạn điền đầy đủ tên và địa chỉ nhận hoa nhé.'); return; }
  if (data.date < localDate()) { $('#delivery-date').min = localDate(); toast('Bạn chọn ngày hôm nay hoặc một ngày sắp tới nhé.'); return; }
  currentOrder = { ...currentOrder, customer: data, savedAt: new Date().toISOString() };
  try { localStorage.setItem('dom-floral-order-draft', JSON.stringify(currentOrder)); }
  catch { toast('Thiết bị chưa cho phép lưu. Bạn có thể tải phiếu để giữ lại.'); }
  $('#order-form-view').hidden = true;
  $('#order-success').hidden = false;
  $('#download-order').focus();
});
function orderText() {
  const order = currentOrder;
  const customer = order.customer;
  const card=order.gift.greeting;
  return ['ĐƠM. FLORAL — PHIẾU ĐẶT HOA NHÁP', 'Chưa gửi đến tiệm / chưa được xác nhận', '', `Tên: ${customer.name}`, `Điện thoại: ${customer.phone}`, `Ngày nhận mong muốn: ${customer.date}`, `Cách nhận: ${customer.delivery === 'delivery' ? 'Giao hoa' : 'Nhận tại tiệm'}`, customer.delivery === 'delivery' ? `Địa chỉ: ${customer.address}` : '', '', order.title ? `Tên bó hoa: ${order.title}` : '', ...order.flowers.map(f => `${f.quantity} × ${f.name} — ${money(f.quantity * f.price)}`), `${order.gift.wrapName}${order.gift.wrapStyle==='none'?'':` / màu ${order.paper.toLowerCase()}`} & nơ ${order.ribbon.toLowerCase()}: ${money(order.gift.prices.wrapping)}`, ...order.gift.addOns.map(item=>`${item.quantity} × ${item.name}: ${money(item.quantity*item.unitPrice)}`), ...(card?['',`THIỆP ĐÍNH KÈM: ${card.name} — ${money(card.price)}`,`Kiểu chữ: ${card.writing}`,`Gửi: ${card.to || '(Không ghi)'}`,`Từ: ${card.from || '(Không ghi)'}`,`Nội dung thiệp:\n${card.message || '(Chưa viết)'}`]:[]), '',`Ghi chú riêng cho tiệm: ${order.note || '(Không có)'}`, `Tạm tính: ${money(order.total)}. Chưa bao gồm phí giao hàng.`, 'Hoa, phụ kiện và giá cần được tiệm xác nhận trước khi thanh toán.'].filter(line => line !== null).join('\n');
}
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
$('#download-order').addEventListener('click', () => { downloadBlob(new Blob(['\ufeff' + orderText()], { type: 'text/plain;charset=utf-8' }), 'dom-floral-phieu-dat-hoa.txt'); toast('Đã chuẩn bị phiếu hoa để tải về.'); });
$('#copy-order').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(orderText()); toast('Đã sao chép phiếu hoa.'); }
  catch { downloadBlob(new Blob(['\ufeff' + orderText()], { type: 'text/plain;charset=utf-8' }), 'dom-floral-phieu-dat-hoa.txt'); toast('Không thể sao chép ở trình duyệt này, mình đã chuẩn bị bản tải về.'); }
});
const atlas = new Image(); atlas.src = 'assets/flower-stems.png';
async function ensureAtlasReady() {
  if (atlas.complete && atlas.naturalWidth > 0) return;
  await new Promise((resolve,reject) => {
    const done = error => { clearTimeout(timer); atlas.removeEventListener('load',loaded); atlas.removeEventListener('error',failed); error ? reject(error) : resolve(); };
    const loaded = () => done();
    const failed = () => done(new Error('Flower image unavailable'));
    const timer = setTimeout(failed,5000);
    atlas.addEventListener('load',loaded,{once:true}); atlas.addEventListener('error',failed,{once:true});
    if (atlas.complete) atlas.naturalWidth > 0 ? loaded() : failed();
  });
}
function canvasToPNGBlob(canvas) {
  const data=canvas.toDataURL('image/png').split(',')[1];
  return new Blob([Uint8Array.from(atob(data),char=>char.charCodeAt(0))],{type:'image/png'});
}
function polygon(ctx, points, color) { ctx.beginPath(); points.forEach(([x,y], index) => index ? ctx.lineTo(x,y) : ctx.moveTo(x,y)); ctx.closePath(); ctx.fillStyle = color; ctx.fill(); }
function animatePaper() {
  if (reducedMotion.matches || !state.stems.length || !state.showWrap || state.wrapStyle==='none') return;
  $$('.paper').forEach((paper, i) => paper.animate([{ transform: `scaleX(.82) rotate(${i ? -5 : 5}deg)`, opacity: .35 }, { transform: 'scaleX(1) rotate(0deg)', opacity: i ? .96 : .8 }], { duration: 650, easing: 'cubic-bezier(.2,.7,.3,1)' }));
}
function arrangeNaturally() {
  if (!state.stems.length) { toast('Chọn vài cành trước, Đơm sẽ giúp bạn xếp nhé.'); return; }
  const rank = { eucalyptus: 0, stock: 1, tulip: 2, lisianthus: 3, daisy: 4, rose: 5 };
  state.stems.sort((a,b) => rank[a.flower] - rank[b.flower]);
  const total = state.stems.length;
  state.stems.forEach((stem, i) => {
    const row = Math.floor(i / 7), rowSize = Math.min(7, total - row * 7), col = i % 7;
    stem.rotation = rowSize === 1 ? 0 : Math.round(-30 + col / (rowSize - 1) * 60);
    stem.x = 50 + ((i % 3) - 1) * 1.5;
    stem.y = 43 + row * 5 + (rank[stem.flower] > 3 ? 5 : 0);
  });
  selected = null; renderBouquet(); persist();
  toast('Đã xếp một dáng hoa tự nhiên. Bạn cứ chỉnh tiếp theo ý mình ♡');
}
async function drawBouquet(ctx, bounds) {
  const { x: bx, y: by, width, height } = bounds;
  const config=structuredClone(state);
  const stage = $('#bouquet-canvas');
  const element = $('.placed-stem');
  const ratio = element && stage.clientWidth ? element.offsetWidth / stage.clientWidth : .58;
  const size = width * ratio;
  await paintGiftLayer(ctx,config,'back',bounds);
  ctx.save(); ctx.translate(bx, by);
  config.stems.forEach(stem => {
    const sprite = findFlower(stem.flower).sprite;
    ctx.save(); ctx.translate(width * stem.x / 100, height * stem.y / 100 + size * .4); ctx.rotate(stem.rotation * Math.PI/180);
    ctx.drawImage(atlas, (sprite%3)*512, Math.floor(sprite/3)*512, 512,512,-size/2,-size*.9,size,size); ctx.restore();
  });
  ctx.restore();
  await paintGiftLayer(ctx,config,'front',bounds);
}
async function createBouquetCanvas() {
  await ensureAtlasReady();
  const stage = $('#bouquet-canvas');
  const canvas = document.createElement('canvas'); canvas.width = 1000; canvas.height = Math.round(1000 * stage.clientHeight / stage.clientWidth);
  const ctx = canvas.getContext('2d'); ctx.fillStyle = '#f5f1e8'; ctx.fillRect(0,0,canvas.width,canvas.height);
  await drawBouquet(ctx,{x:0,y:0,width:canvas.width,height:canvas.height});
  ctx.fillStyle = '#7d8b70'; ctx.textAlign = 'center'; ctx.font = '16px Georgia'; ctx.fillText('ĐƠM. / YOUR LITTLE CREATION',500,50); ctx.font = 'italic 22px Georgia'; ctx.fillText('made with love, arranged by you',500,canvas.height-35);
  return canvas;
}
$('#download-bouquet').addEventListener('click', async () => {
  if (!state.stems.length) return;
  try {
    const canvas = await createBouquetCanvas();
    downloadBlob(canvasToPNGBlob(canvas), 'mot-bo-hoa-cua-ban-dom-floral.png'); toast('Đã chuẩn bị ảnh bó hoa để tải về ♡');
  } catch { toast('Ảnh hoa đang tải, bạn thử lưu lại sau một chút nhé.'); }
});
$('#copyright-year').textContent = new Date().getFullYear();
if (!storageAvailable) $('.studio-autosave').textContent = '◦ Bản phối chỉ giữ trong phiên này';
renderCatalog(); renderStudioCatalog(); renderBouquet(); route();
