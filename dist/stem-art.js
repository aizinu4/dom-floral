const stemImageCache = new Map();
const stemArtworkCache = new Map();
const stemAtlasFiles = {
  original: { leaves: 'assets/flower-stems.png', bare: 'assets/flower-stems-leafless.png', columns: 3, rows: 2 },
  new: { leaves: 'assets/flower-stems-new.png', bare: 'assets/flower-stems-new-leafless.png', columns: 2, rows: 2 },
};

function loadStemImage(url) {
  if (stemImageCache.has(url)) return stemImageCache.get(url);
  const promise = new Promise((resolve, reject) => {
    const img = new Image();
    const timer = setTimeout(() => fail(), 12000);
    const fail = () => { clearTimeout(timer); reject(new Error('Không tải được ảnh cành hoa.')); };
    img.onload = () => { clearTimeout(timer); resolve(img); };
    img.onerror = fail;
    img.src = url;
  });
  stemImageCache.set(url, promise);
  promise.catch(() => stemImageCache.delete(url));
  return promise;
}

function loadStemArtwork(stem) {
  const flower = findFlower(stem.flower);
  const finish = normalizeStemFinish(stem, flower);
  const key = `${flower.id}:${finish.leaves}`;
  if (stemArtworkCache.has(key)) return stemArtworkCache.get(key);
  const promise = (async () => {
    const specification = stemAtlasFiles[flower.sprite < 6 ? 'original' : 'new'];
    const img = await loadStemImage(finish.leaves ? specification.leaves : specification.bare);
    const index = flower.sprite < 6 ? flower.sprite : flower.sprite - 6;
    const cellWidth = img.naturalWidth / specification.columns, cellHeight = img.naturalHeight / specification.rows;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = STEM_CELL_SIZE;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(img, index % specification.columns * cellWidth, Math.floor(index / specification.columns) * cellHeight, cellWidth, cellHeight, 0, 0, STEM_CELL_SIZE, STEM_CELL_SIZE);
    const pixels = context.getImageData(0, 0, STEM_CELL_SIZE, STEM_CELL_SIZE).data;
    const alpha = Uint8Array.from({ length: STEM_CELL_SIZE ** 2 }, (_, i) => pixels[i * 4 + 3]);
    const maskCanvas = document.createElement('canvas'); maskCanvas.width = maskCanvas.height = STEM_MASK_SIZE;
    const maskContext = maskCanvas.getContext('2d', { willReadFrequently: true });
    maskContext.drawImage(canvas, 0, 0, STEM_MASK_SIZE, STEM_MASK_SIZE);
    const maskPixels = maskContext.getImageData(0, 0, STEM_MASK_SIZE, STEM_MASK_SIZE).data;
    return { canvas, bounds: stemAlphaBounds(alpha, STEM_CELL_SIZE, STEM_CELL_SIZE), alpha: Uint8Array.from({ length: STEM_MASK_SIZE ** 2 }, (_, i) => maskPixels[i * 4 + 3]) };
  })();
  stemArtworkCache.set(key, promise);
  promise.catch(() => stemArtworkCache.delete(key));
  return promise;
}

function updateStemHitShape(element) {
  element.style.clipPath = stemClipPath(element.stemHitRectangles || [], element.offsetWidth);
}

const stemSizeObserver = new ResizeObserver(entries => entries.forEach(entry => updateStemHitShape(entry.target)));

async function renderStemArtwork(element, stem) {
  const finish = normalizeStemFinish(stem, findFlower(stem.flower));
  const signature = `${stem.flower}:${finish.leaves}:${finish.trim}`;
  if (element.stemSignature === signature) return;
  element.stemSignature = signature;
  element.style.clipPath = 'inset(50%)';
  try {
    const artwork = await loadStemArtwork(stem);
    if (element.stemSignature !== signature || !element.isConnected) return;
    const bottom = finish.trim ? stemCropBottom(artwork.bounds, finish.trim) : STEM_CELL_SIZE;
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = STEM_CELL_SIZE;
    canvas.className = 'stem-art'; canvas.setAttribute('aria-hidden', 'true');
    canvas.getContext('2d').drawImage(artwork.canvas, 0, 0, STEM_CELL_SIZE, bottom, 0, 0, STEM_CELL_SIZE, bottom);
    element.replaceChildren(canvas);
    element.stemHitRectangles = stemHitRects(artwork.alpha, STEM_MASK_SIZE, STEM_MASK_SIZE, bottom * STEM_MASK_SIZE / STEM_CELL_SIZE);
    updateStemHitShape(element);
    element.removeAttribute('data-art-error');
  } catch {
    element.stemSignature = null;
    element.dataset.artError = 'true';
    toast('Ảnh cành hoa chưa tải được. Bạn thử chọn lại cành nhé.');
  }
}
