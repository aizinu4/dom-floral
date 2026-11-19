import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';

function catalogue(){
  const context=vm.createContext({crypto:webcrypto});
  const source=readFileSync(new URL('../dist/gift-model.js',import.meta.url),'utf8')+'\n'+readFileSync(new URL('../dist/app.js',import.meta.url),'utf8').split('const PAPERS')[0]+'\n'+readFileSync(new URL('../dist/shop-data.js',import.meta.url),'utf8');
  vm.runInContext(source,context);
  return expression=>JSON.parse(vm.runInContext(`JSON.stringify(${expression})`,context));
}
test('catalogue recipes use supported stems and wrapping, within the studio capacity',()=>{
  const run=catalogue();
  const valid=run('SHOP_BOUQUETS.every(p=>Object.hasOwn(WRAP_STYLES,p.wrapStyle)&&Object.entries(p.recipe).every(([id,n])=>FLOWERS.some(f=>f.id===id)&&Number.isInteger(n)&&n>0)&&Object.values(p.recipe).reduce((a,b)=>a+b,0)<=18)');
  assert.equal(valid,true);
  assert.equal(new Set(run('SHOP_BOUQUETS.map(p=>p.id)')).size,run('SHOP_BOUQUETS.length'));
});
test('bouquet quotes include their exact flower quantities and selected wrapping',()=>{
  const run=catalogue();
  assert.deepEqual(run('SHOP_BOUQUETS.map(p=>shopBouquetPrice(p,FLOWERS,WRAP_STYLES))'),[325000,305000,280000,115000]);
});
test('search accepts Vietnamese names without accents, including flower ingredients',()=>{
  const run=catalogue();
  assert.deepEqual(run('shopFilterBouquets(SHOP_BOUQUETS,{query:"NGAY DIU LAI"},FLOWERS,WRAP_STYLES).map(p=>p.id)'),['ngay-diu-lai']);
  assert.equal(run('shopFilterBouquets(SHOP_BOUQUETS,{query:"cat tuong"},FLOWERS,WRAP_STYLES).length'),3);
});
test('price, mood and favorites filters combine without mutating the source order',()=>{
  const run=catalogue();
  assert.deepEqual(run('shopFilterBouquets(SHOP_BOUQUETS,{price:"under150",mood:"happy",favoritesOnly:true,favorites:["vui-tu-dieu-nho"]},FLOWERS,WRAP_STYLES).map(p=>p.id)'),['vui-tu-dieu-nho']);
  assert.equal(run('shopFilterBouquets(SHOP_BOUQUETS,{favoritesOnly:true,favorites:[]},FLOWERS,WRAP_STYLES).length'),0);
  assert.deepEqual(run('shopFilterBouquets(SHOP_BOUQUETS,{sort:"price-asc"},FLOWERS,WRAP_STYLES).map(p=>shopBouquetPrice(p,FLOWERS,WRAP_STYLES))'),[115000,280000,305000,325000]);
  assert.equal(run('SHOP_BOUQUETS[0].id'),'mot-chut-thuong');
});
test('price bands separate the sample catalogue correctly',()=>{
  const run=catalogue();
  assert.deepEqual(run('["under150","150to300","over300"].map(price=>shopFilterBouquets(SHOP_BOUQUETS,{price},FLOWERS,WRAP_STYLES).length)'),[1,1,2]);
});
test('no customer feedback or ratings are invented; examples stay explicitly separate',()=>{
  const run=catalogue();
  assert.deepEqual(run('SHOP_FEEDBACK'),[]);
  assert.equal(run('SHOP_FEEDBACK_EXAMPLES.every(review=>review.isExample===true&&review.rating===null)'),true);
});
