import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const context = vm.createContext({ Uint8Array });
vm.runInContext(readFileSync(new URL('../dist/stem-model.js', import.meta.url), 'utf8'), context);
const run = expression => JSON.parse(vm.runInContext(`JSON.stringify(${expression})`, context));

test('old drafts retain leaves and full stems; malformed trims cannot exceed the editor limits', () => {
  assert.deepEqual(run('normalizeStemFinish({})'), { leaves: true, trim: 0 });
  assert.deepEqual(run('normalizeStemFinish({leaves:false,trim:999})'), { leaves: false, trim: 40 });
  assert.equal(run('normalizeStemFinish({trim:NaN}).trim'), 0);
  assert.equal(run('normalizeStemFinish({trim:"20"}).trim'), 0);
  assert.equal(run('normalizeStemFinish({trim:-10}).trim'), 0);
  assert.equal(run('normalizeStemFinish({leaves:false},{foliageOnly:true}).leaves'), true);
});

test('trimming uses actual plant length and preserves the flower end', () => {
  const bounds = '{x:40,y:20,width:50,height:460,bottom:480}';
  assert.equal(run(`stemCropBottom(${bounds},0)`), 480);
  assert.equal(run(`stemCropBottom(${bounds},30)`), 342);
  assert.equal(run(`stemCropBottom(${bounds},99)`), 296);
  assert.deepEqual(run('stemAlphaBounds(new Uint8Array(16),4,4)'), { x: 0, y: 0, width: 0, height: 0, bottom: 0 });
});

test('transparent padding and gaps between branches pass pointer events through', () => {
  const rectangles = run('stemHitRects(Uint8Array.from([0,0,255,0,0,0,255,0,0]),9,1,1,0)');
  assert.deepEqual(rectangles, [{ x: 2, y: 0, width: 1, height: 1 }, { x: 6, y: 0, width: 1, height: 1 }]);
  assert.deepEqual(run('stemHitRects(new Uint8Array(100),10,10)'), []);
});

test('thin stems get a small grab tolerance, while the cut end never captures a pointer', () => {
  const rectangles = run('stemHitRects(Uint8Array.from({length:25},(_,i)=>i%5===2?255:0),5,5,3,1)');
  assert.deepEqual(rectangles, [{ x: 1, y: 0, width: 3, height: 3 }]);
  assert.ok(rectangles.every(rect => rect.y + rect.height <= 3));
});

test('hit paths scale with displayed flower size after viewport resize', () => {
  const rectangle = '[{x:2,y:1,width:1,height:3}]';
  assert.equal(run(`stemClipPath(${rectangle},100,10)`), 'path("M20 10h10v30h-10Z")');
  assert.equal(run(`stemClipPath(${rectangle},200,10)`), 'path("M40 20h20v60h-20Z")');
  assert.equal(run('stemClipPath([],100)'), 'inset(50%)');
});

test('order instructions preserve different finishes of the same flower', () => {
  const groups = run('stemFinishGroups([{flower:"rose"},{flower:"rose",leaves:false,trim:20},{flower:"rose",leaves:false,trim:20},{flower:"unknown"}],[{id:"rose",name:"Hồng Ohara"}])');
  assert.equal(groups.length, 2);
  assert.equal(groups[0].quantity, 1);
  assert.equal(groups[1].quantity, 2);
  assert.equal(groups[1].leaves, false);
  assert.equal(groups[1].trim, 20);
  assert.match(run(`stemFinishLabel(${JSON.stringify(groups[1])})`), /2 × Hồng Ohara · không lá · cắt bớt 20%/);
});
