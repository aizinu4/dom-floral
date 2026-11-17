import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';

const source=readFileSync(new URL('../dist/gift-model.js',import.meta.url),'utf8');
function model(){const context=vm.createContext({crypto:webcrypto});vm.runInContext(source,context);return expression=>JSON.parse(vm.runInContext(`JSON.stringify(${expression})`,context));}

test('existing bouquet drafts retain the original wrapping price and get safe gift defaults',()=>{
  const run=model(),config=run('normalizeGiftState({paper:"pink",note:"Giữ lời nhắn cũ"})');
  assert.equal(config.wrapStyle,'classic');assert.equal(config.showWrap,true);assert.equal(config.greeting.type,'none');assert.deepEqual(config.addOns,[]);
  assert.equal(run('getGiftPrices(normalizeGiftState({})).total'),25000);
});
test('preview visibility does not affect the quoted wrapping price',()=>{
  const run=model();
  assert.equal(run('getGiftPrices(normalizeGiftState({wrapStyle:"petal",showWrap:false})).total'),45000);
  assert.equal(run('getGiftPrices(normalizeGiftState({wrapStyle:"petal",showWrap:true})).total'),45000);
  assert.equal(run('getGiftPrices(normalizeGiftState({wrapStyle:"none"})).total'),10000);
});
test('quotes account for every selected card, sticker and charm, including repeats',()=>{
  const run=model();
  const price=run('getGiftPrices(normalizeGiftState({wrapStyle:"fan",greeting:{type:"botanical"},addOns:[{id:"daisy"},{id:"daisy"},{id:"pearl"},{id:"smile"}]}))');
  assert.deepEqual(price,{wrapping:35000,greeting:20000,stickers:13000,charms:25000,total:93000});
});
test('saved choices reject unknown products and bound oversized decoration data',()=>{
  const run=model();
  const config=run('normalizeGiftState({wrapStyle:"__proto__",showWrap:"false",greeting:{type:"unknown",x:Infinity,y:-10,rotation:999,scale:99,message:"x".repeat(400)},addOns:[{id:"unknown"},...Array.from({length:9},()=>({id:"goldstar",x:-40,y:900,scale:-1}))]})');
  assert.equal(config.wrapStyle,'classic');assert.equal(config.showWrap,true);assert.equal(config.greeting.type,'none');assert.equal(config.greeting.message.length,300);assert.equal(config.greeting.x,68);assert.equal(config.greeting.y,12);assert.equal(config.greeting.scale,1.5);
  assert.equal(config.addOns.length,6);assert.ok(config.addOns.every(item=>item.x===8&&item.y===92&&item.scale===.7));
});
test('order details preserve full card wording and combine repeated keepsakes',()=>{
  const run=model();
  const info=run('giftOrderInfo(normalizeGiftState({wrapStyle:"sheer",greeting:{type:"heart",to:"An",from:"Bình",message:"Cảm ơn bạn.\\nThương nhiều!",writing:"print"},addOns:[{id:"daisy"},{id:"daisy"},{id:"butterfly"}]}))');
  assert.equal(info.wrapName,'Voan trong');assert.equal(info.greeting.message,'Cảm ơn bạn.\nThương nhiều!');assert.equal(info.greeting.writing,'Chữ in');assert.equal(info.addOns[0].quantity,2);assert.equal(info.prices.total,100000);
});
test('showing no attached card retains its words in the saved configuration but does not bill or send it',()=>{
  const run=model();
  assert.equal(run('normalizeGiftState({greeting:{type:"none",message:"Giữ lại cho lần sau"}}).greeting.message'),'Giữ lại cho lần sau');
  const info=run('giftOrderInfo(normalizeGiftState({greeting:{type:"none",message:"Giữ lại cho lần sau"}}))');assert.equal(info.greeting,null);assert.equal(info.prices.greeting,0);
});
