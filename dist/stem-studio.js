$('#stem-controls').insertAdjacentHTML('afterend', `
  <section class="stem-finish" id="stem-finish" aria-label="Chỉnh lá và chiều dài cành" hidden>
    <div class="stem-finish-heading"><span>CHĂM CHÚT TỪNG CÀNH</span><button id="reset-stem-finish" type="button">Khôi phục cành</button></div>
    <div class="stem-finish-options">
      <div><span class="stem-field-label" id="stem-leaf-label">Lá trên cành</span><div class="stem-leaf-options" role="group" aria-labelledby="stem-leaf-label"><button type="button" data-stem-leaves="true" aria-pressed="true">Có lá <span>↟</span></button><button type="button" data-stem-leaves="false" aria-pressed="false">Không lá <span>╱</span></button></div><small id="stem-leaf-hint">Một dáng thanh hơn, nếu bạn thích.</small></div>
      <div class="stem-trim-field"><label class="stem-field-label" for="stem-trim">Cắt bớt cành <output id="stem-trim-output" for="stem-trim">Giữ nguyên</output></label><input id="stem-trim" type="range" min="0" max="40" step="1" value="0" aria-describedby="stem-trim-hint"><div class="stem-trim-presets" role="group" aria-label="Cắt nhanh"><button type="button" data-stem-trim="0">Nguyên cành</button><button type="button" data-stem-trim="15">−15%</button><button type="button" data-stem-trim="30">−30%</button></div><small id="stem-trim-hint">Chỉ cắt phần dưới, giữ nguyên kích thước bông.</small></div>
    </div>
  </section>`);

function renderStemFinish() {
  const stem = state.stems.find(item => item.uid === selected);
  $('#stem-finish').hidden = !stem;
  if (!stem) return;
  const flower = findFlower(stem.flower), finish = normalizeStemFinish(stem, flower);
  $$('[data-stem-leaves]').forEach(button => {
    button.disabled = !!flower.foliageOnly;
    button.setAttribute('aria-pressed', (button.dataset.stemLeaves === 'true') === finish.leaves);
  });
  $('#stem-leaf-hint').textContent = flower.foliageOnly ? 'Cành lá trang trí được giữ nguyên tán lá.' : 'Một dáng thanh hơn, nếu bạn thích.';
  $('#stem-trim').value = finish.trim;
  $('#stem-trim').setAttribute('aria-valuetext', finish.trim ? `Cắt bớt ${finish.trim}% chiều dài cành` : 'Giữ nguyên chiều dài cành');
  $('#stem-trim-output').textContent = finish.trim ? `−${finish.trim}%` : 'Giữ nguyên';
  $$('[data-stem-trim]').forEach(button => button.setAttribute('aria-pressed', Number(button.dataset.stemTrim) === finish.trim));
  $('#reset-stem-finish').disabled = finish.leaves && !finish.trim;
}

function changeStemFinish(change) {
  const stem = state.stems.find(item => item.uid === selected);
  if (!stem) return;
  Object.assign(stem, normalizeStemFinish({ ...stem, ...change }, findFlower(stem.flower)));
  renderBouquet(); persist();
}

$('#stem-finish').addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.hasAttribute('data-stem-leaves')) changeStemFinish({ leaves: button.dataset.stemLeaves === 'true' });
  if (button.hasAttribute('data-stem-trim')) changeStemFinish({ trim: Number(button.dataset.stemTrim) });
});
$('#stem-trim').addEventListener('input', event => changeStemFinish({ trim: Number(event.target.value) }));
$('#reset-stem-finish').addEventListener('click', () => changeStemFinish({ leaves: true, trim: 0 }));
document.addEventListener('bouquet:selection', renderStemFinish);
document.addEventListener('bouquet:updated', renderStemFinish);
renderStemFinish();
