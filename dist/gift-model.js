/* Shared gift configuration, validation and illustrative prices. No DOM access. */
const WRAP_STYLES = {
  classic: { name:'Chữ V', description:'Nếp gấp dịu dàng, gọn gàng.', price:25000 },
  fan: { name:'Quạt Hàn', description:'Xòe rộng, nếp giấy mềm.', price:35000 },
  petal: { name:'Cánh hoa', description:'Nhiều lớp như một bông hoa.', price:45000 },
  cone: { name:'Ống tối giản', description:'Thanh mảnh, khoe dáng cành.', price:20000 },
  newsprint: { name:'Giấy báo', description:'Những dòng chữ nhỏ của Đơm.', price:30000 },
  sheer: { name:'Voan trong', description:'Lớp voan nhẹ, thấy sắc hoa.', price:40000 },
  none: { name:'Chỉ thắt nơ', description:'Giữ những cành hoa tự nhiên.', price:10000 },
};
const GREETING_TYPES = {
  none: { name:'Không kèm thiệp', price:0, ratio:1.4 },
  mini: { name:'Thiệp mini', price:10000, ratio:1.4 },
  botanical: { name:'Vườn nhỏ', price:20000, ratio:1.4 },
  polaroid: { name:'Polaroid', price:25000, ratio:1.15 },
  heart: { name:'Trái tim', price:15000, ratio:1 },
  arch: { name:'Thiệp vòm', price:20000, ratio:1.15 },
};
const GIFT_DECOR = {
  daisy: { kind:'sticker', name:'Cúc nhỏ', price:5000 },
  heart: { kind:'sticker', name:'Một chút yêu', price:5000 },
  love: { kind:'sticker', name:'With love', price:5000 },
  smile: { kind:'sticker', name:'Nụ cười', price:3000 },
  sparkle: { kind:'sticker', name:'Lấp lánh', price:5000 },
  dom: { kind:'sticker', name:'Dấu Đơm', price:5000 },
  pearl: { kind:'charm', name:'Ngọc trai', price:25000 },
  goldheart: { kind:'charm', name:'Tim ánh kim', price:30000 },
  goldstar: { kind:'charm', name:'Sao nhỏ', price:25000 },
  butterfly: { kind:'charm', name:'Cánh bướm', price:35000 },
};
const GIFT_LIMIT = 6;
function giftClamp(value,fallback,min,max) { return Number.isFinite(value) ? Math.min(max,Math.max(min,value)) : fallback; }
function giftString(value,limit) { return typeof value === 'string' ? value.slice(0,limit) : ''; }
function normalizeGiftState(saved = {}) {
  const config = saved && typeof saved === 'object' ? saved : {};
  const greeting = config.greeting && typeof config.greeting === 'object' ? config.greeting : {};
  return {
    wrapStyle: Object.hasOwn(WRAP_STYLES,config.wrapStyle) ? config.wrapStyle : 'classic',
    showWrap: typeof config.showWrap === 'boolean' ? config.showWrap : true,
    greeting: {
      type: Object.hasOwn(GREETING_TYPES,greeting.type) ? greeting.type : 'none',
      to:giftString(greeting.to,45), from:giftString(greeting.from,45), message:giftString(greeting.message,300),
      writing:greeting.writing === 'print' ? 'print' : 'hand',
      x:giftClamp(greeting.x,68,12,88), y:giftClamp(greeting.y,64,12,88),
      rotation:giftClamp(greeting.rotation,10,-180,180), scale:giftClamp(greeting.scale,1,.7,1.5),
    },
    addOns:Array.isArray(config.addOns) ? config.addOns.filter(piece=>piece && Object.hasOwn(GIFT_DECOR,piece.id)).slice(0,GIFT_LIMIT).map(piece=>({
      uid:crypto.randomUUID(), id:piece.id,
      x:giftClamp(piece.x,45,8,92), y:giftClamp(piece.y,70,8,92),
      rotation:giftClamp(piece.rotation,0,-180,180), scale:giftClamp(piece.scale,1,.7,1.5),
    })) : [],
  };
}
function getGiftPrices(config) {
  const wrapping = WRAP_STYLES[config.wrapStyle]?.price ?? WRAP_STYLES.classic.price;
  const greeting = GREETING_TYPES[config.greeting?.type]?.price ?? 0;
  let stickers=0, charms=0;
  for(const piece of (config.addOns || []).slice(0,GIFT_LIMIT)) {
    const item=GIFT_DECOR[piece.id];
    if(item?.kind==='sticker')stickers+=item.price;
    if(item?.kind==='charm')charms+=item.price;
  }
  return {wrapping,greeting,stickers,charms,total:wrapping+greeting+stickers+charms};
}
function giftOrderInfo(config) {
  const totals=getGiftPrices(config);
  const counts=new Map();
  for(const piece of (config.addOns || []).slice(0,GIFT_LIMIT)) {
    const item=GIFT_DECOR[piece.id]; if(!item)continue;
    const group=counts.get(piece.id) || {id:piece.id,name:item.name,kind:item.kind,quantity:0,unitPrice:item.price};
    group.quantity++; counts.set(piece.id,group);
  }
  return {
    wrapStyle:config.wrapStyle, wrapName:WRAP_STYLES[config.wrapStyle].name,
    greeting:config.greeting.type === 'none' ? null : {
      type:config.greeting.type,name:GREETING_TYPES[config.greeting.type].name,
      to:config.greeting.to,from:config.greeting.from,message:config.greeting.message,
      writing:config.greeting.writing === 'hand' ? 'Chữ nghiêng' : 'Chữ in',price:totals.greeting,
    },
    addOns:[...counts.values()], prices:totals,
  };
}
