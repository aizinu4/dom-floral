// Pure geometry shared by the live editor and its regression tests.
const STEM_CELL_SIZE = 512;
const STEM_MASK_SIZE = 256;
const STEM_MAX_TRIM = 40;

function normalizeStemFinish(value = {}, flower = {}) {
  return {
    leaves: flower.foliageOnly ? true : value.leaves !== false,
    trim: Number.isFinite(value.trim) ? Math.round(Math.max(0, Math.min(STEM_MAX_TRIM, value.trim))) : 0,
  };
}

function stemAlphaBounds(alpha, width, height, threshold = 32) {
  let left = width, top = height, right = 0, bottom = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (alpha[y * width + x] < threshold) continue;
    left = Math.min(left, x); top = Math.min(top, y);
    right = Math.max(right, x + 1); bottom = Math.max(bottom, y + 1);
  }
  return right > left ? { x: left, y: top, width: right - left, height: bottom - top, bottom } : { x: 0, y: 0, width: 0, height: 0, bottom: 0 };
}

function stemCropBottom(bounds, trim) {
  const amount = normalizeStemFinish({ trim }).trim;
  return Math.ceil(bounds.bottom - bounds.height * amount / 100);
}

// Opaque runs, including a small grab tolerance. Empty image padding and the
// removed end of a cut stem never become pointer targets.
function stemHitRects(alpha, width, height, bottom = height, radius = 2) {
  const end = Math.max(0, Math.min(height, Math.ceil(bottom)));
  const mask = new Uint8Array(width * height);
  for (let y = 0; y < end; y++) for (let x = 0; x < width; x++) {
    if (alpha[y * width + x] < 32) continue;
    for (let yy = Math.max(0, y - radius); yy < Math.min(end, y + radius + 1); yy++) {
      mask.fill(1, yy * width + Math.max(0, x - radius), yy * width + Math.min(width, x + radius + 1));
    }
  }
  const rectangles = [];
  let previous = new Map();
  for (let y = 0; y < end; y++) {
    const next = new Map();
    for (let x = 0; x < width;) {
      if (!mask[y * width + x]) { x++; continue; }
      const start = x;
      while (x < width && mask[y * width + x]) x++;
      const key = `${start}:${x - start}`;
      const rectangle = previous.get(key) || { x: start, y, width: x - start, height: 0 };
      if (!previous.has(key)) rectangles.push(rectangle);
      rectangle.height++; next.set(key, rectangle);
    }
    previous = next;
  }
  return rectangles;
}

function stemClipPath(rectangles, size, maskSize = STEM_MASK_SIZE) {
  if (!rectangles.length || !size) return 'inset(50%)';
  const unit = value => +(value * size / maskSize).toFixed(3);
  const path = rectangles.map(r => `M${unit(r.x)} ${unit(r.y)}h${unit(r.width)}v${unit(r.height)}h-${unit(r.width)}Z`).join('');
  return `path("${path}")`;
}

function stemFinishGroups(stems, flowers) {
  const groups = new Map();
  for (const stem of stems) {
    const flower = flowers.find(f => f.id === stem.flower);
    if (!flower) continue;
    const finish = normalizeStemFinish(stem, flower);
    const key = `${flower.id}:${finish.leaves}:${finish.trim}`;
    if (!groups.has(key)) groups.set(key, { flower: flower.id, name: flower.name, ...finish, quantity: 0 });
    groups.get(key).quantity++;
  }
  return [...groups.values()];
}

function stemFinishLabel(finish) {
  return `${finish.quantity} × ${finish.name} · ${finish.leaves ? 'giữ lá' : 'không lá'} · ${finish.trim ? `cắt bớt ${finish.trim}% chiều dài` : 'giữ nguyên cành'}`;
}
