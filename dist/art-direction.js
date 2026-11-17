/* Artbook edition: presentation only; the studio and checkout keep their existing state. */
$('.values-strip').outerHTML = `<section class="art-manifesto page-width" aria-labelledby="manifesto-title"><div class="art-section-index"><span>01 / MỘT CHÚT TINH THẦN</span><span>FLOWERS ARE OUR LOVE LANGUAGE.</span></div><p id="manifesto-title">Hoa là cách tụi mình<br>viết những điều <span class="manifesto-flower sprite sprite-0" aria-hidden="true"></span><br><em>chưa thành lời.</em></p><div class="manifesto-foot"><span>Không cần dịp đặc biệt.<br>Cũng chẳng cần một lý do.</span><span>Chỉ cần bạn thấy<br>lòng mình muốn có hoa.</span><span class="manifesto-mark" aria-hidden="true">✳</span></div></section>`;

$('#today .eyebrow').textContent = '02 / NHỮNG CÀNH HOA HÔM NAY';
$('#today-title').innerHTML = 'Một khu vườn.<br><em>Nhiều điều muốn nói.</em>';
$('#today .section-heading p').textContent = 'Chọn một cành như chọn một màu để vẽ nên ngày của bạn.';

$('.invitation-copy .eyebrow').textContent = '03 / MỘT CHÚT SÁNG TẠO';
$('.invitation-copy h2').innerHTML = 'Một bó hoa.<br>Vô vàn cách<br><em>là bạn.</em>';
$('.invitation-copy p').textContent = 'Xem những cành hoa như màu vẽ. Đặt một chút ngẫu hứng, thêm một chút dịu dàng — rồi đơm nên điều chỉ riêng bạn có.';
$('.invitation-art').insertAdjacentHTML('afterbegin','<span class="art-work-label">A SMALL EXPERIMENT<br>IN EVERYDAY BEAUTY.</span><span class="art-work-number">03</span>');

$('#moods .eyebrow').textContent = '04 / BẢNG MÀU CẢM XÚC';
$('#moods-title').innerHTML = 'Mỗi cảm xúc,<br><em>một sắc hoa.</em>';
$$('.mood-card').forEach((card,index)=>card.insertAdjacentHTML('beforeend',`<span class="mood-specimen sprite sprite-${[2,0,3,1][index]}" aria-hidden="true"></span>`));

$('#story .eyebrow').textContent = '05 / NHỮNG ĐIỀU ĐANG LỚN';
$('.story-mark').innerHTML = `<div class="art-story-print"><span class="art-print-edition">ĐƠM. / STUDIES IN PATIENCE</span><svg class="art-print-drawing" viewBox="0 0 330 360" aria-hidden="true"><path d="M103 327c28-61 55-120 37-195-8-36-8-56 5-73m26 273c-4-60 21-112 44-154m-97 106c-55-6-69-38-58-60 33 3 51 28 58 60Zm34-64c45-1 76-27 67-54-40-4-56 20-67 54ZM145 59C102 74 97 31 119 20c35-18 56 6 26 39Zm70 119c-4-44 16-88 49-86 24 21 2 66-49 86Z"/><path class="art-print-red" d="M64 95c63-31 150-26 214 20M85 300c62 29 114 29 169 4"/></svg><p>Rồi cũng sẽ<br><em>đơm hoa.</em></p><span class="art-print-caption">TỪ HAI NGƯỜI, VÀ MỘT ĐIỀU CHUNG.</span><span class="art-print-stamp">ĐƠM<br>WITH LOVE</span></div>`;

$('#journal .section-heading .eyebrow').textContent = '06 / NHẬT KÝ MỘT TIỆM HOA';
$('#journal-heading').innerHTML = 'Nhặt nhạnh<br><em>những điều nhỏ xinh.</em>';
$('.footer-main > p').innerHTML = 'Cứ chậm rãi.<br><em>Rồi điều đẹp đẽ sẽ đơm.</em>';

// A slow entrance for the artbook notes, without concealing content from reduced-motion visitors.
if('IntersectionObserver' in window && !reducedMotion.matches){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.1});
  $$('.art-manifesto,.art-story-print').forEach(el=>{el.classList.add('reveal');observer.observe(el);});
  reducedMotion.addEventListener('change',event=>{if(event.matches){$$('.art-manifesto,.art-story-print').forEach(el=>el.classList.add('is-visible'));observer.disconnect();}});
}
