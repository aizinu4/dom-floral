/* Replace concept photos and illustrative recipes with the shop's confirmed catalogue. */
const SHOP_BOUQUETS=[
  {id:'mot-chut-thuong',name:'Một chút thương',subtitle:'Những điều chưa kịp nói.',moods:['love','gentle'],image:'assets/bouquet-hero.png',imagePosition:'50% 50%',tone:'Hồng phấn · Kem · Tím nhạt',description:'Một bó hồng phấn, chút cát tường trắng và sắc stock tím. Như một lời thương vừa đủ, nhẹ nhàng mà vẫn ở lại thật lâu.',recipe:{rose:4,lisianthus:2,stock:1,daisy:1,eucalyptus:1},wrapStyle:'classic',paper:'cream',ribbon:'wine',note:'Hợp để gửi một lời thương, một lời cảm ơn, hoặc dành cho một ngày bình thường muốn trở nên đặc biệt.'},
  {id:'mot-cai-om-nho',name:'Một cái ôm nhỏ',subtitle:'Dịu dàng, theo một cách rất trong.',moods:['gentle','self'],image:'assets/bouquet-tulip.png',imagePosition:'50% 50%',tone:'Trắng ngà · Xanh lá',description:'Tulip trắng, cát tường và một chút eucalyptus trong lớp voan mỏng. Một khoảng thở trong trẻo cho ngày bạn muốn chậm lại.',recipe:{tulip:5,lisianthus:2,eucalyptus:2},wrapStyle:'sheer',paper:'cream',ribbon:'moss',note:'Một gợi ý để tự thưởng, hỏi thăm một người hoặc gửi một lời động viên dịu dàng.'},
  {id:'ngay-diu-lai',name:'Ngày dịu lại',subtitle:'Một khoảng trời tím thật nhỏ.',moods:['gentle','love'],image:'assets/bouquet-lilac.png',imagePosition:'50% 50%',tone:'Tím lilac · Trắng · Xanh',description:'Những cành stock tím vươn cao bên cát tường trắng. Giấy quạt xòe mềm và chiếc nơ trầm, như một bản nhạc nhỏ cho buổi chiều.',recipe:{stock:5,lisianthus:3,eucalyptus:2},wrapStyle:'fan',paper:'lilac',ribbon:'wine',note:'Cho người thích sắc tím, những dáng hoa tự nhiên và một chút mộng mơ.'},
  {id:'vui-tu-dieu-nho',name:'Vui từ điều nhỏ',subtitle:'Gói một chút nắng mang về.',moods:['happy','self'],image:'assets/bouquet-daisy.png',imagePosition:'50% 50%',tone:'Trắng · Vàng nhụy · Xanh',description:'Một bó cúc tana nhỏ trong giấy gói ống tối giản. Đáng yêu như một lời chào, vừa vặn để mang niềm vui vào một góc bàn.',recipe:{daisy:4,eucalyptus:1},wrapStyle:'cone',paper:'cream',ribbon:'moss',note:'Một bó nhỏ để tặng bạn, tặng mình hoặc làm ngày thường dễ thương hơn.'},
];
// Only publish genuine, permission-cleared feedback here. No ratings are fabricated.
// Schema: {id, author, date:'YYYY-MM-DD', rating:1..5, text, productId, photos:[relative URLs]}.
const SHOP_FEEDBACK=[];
const SHOP_FEEDBACK_EXAMPLES=[
  {id:'example-01',isExample:true,author:'Ví dụ bố cục 01',date:'',rating:null,productId:'mot-chut-thuong',text:'Đây là vị trí lời nhận xét của khách về bó hoa. Khi có feedback thật, Đơm sẽ thay nội dung và ảnh đã được khách cho phép đăng.',photos:['assets/bouquet-hero.png']},
  {id:'example-02',isExample:true,author:'Ví dụ bố cục 02',date:'',rating:null,productId:'mot-cai-om-nho',text:'Một phản hồi có ảnh sẽ được trình bày như thế này. Ảnh đang dùng chỉ là ảnh concept, không phải ảnh khách gửi.',photos:['assets/bouquet-tulip.png']},
  {id:'example-03',isExample:true,author:'Ví dụ bố cục 03',date:'',rating:null,productId:'vui-tu-dieu-nho',text:'Feedback không có ảnh vẫn có một chỗ riêng. Đây là nội dung mô tả bố cục, chưa phải lời nhận xét của khách hàng.',photos:[]},
];
const SHOP_MOODS={all:'Tất cả',gentle:'Dịu dàng',love:'Thương một người',happy:'Một chút vui',self:'Tặng mình'};
function shopSearchText(value){return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().trim();}
function shopBouquetPrice(product,flowers,wraps){
  const flowerPrice=Object.entries(product.recipe).reduce((sum,[id,count])=>{const flower=flowers.find(f=>f.id===id);if(!flower)throw new Error(`Unknown flower: ${id}`);return sum+flower.price*count;},0);
  return flowerPrice+wraps[product.wrapStyle].price;
}
function shopFilterBouquets(products,filters,flowers,wraps){
  const query=shopSearchText(filters.query || '');
  const items=products.filter(product=>{
    const price=shopBouquetPrice(product,flowers,wraps);
    const searchable=shopSearchText([product.name,product.tone,product.description,...Object.keys(product.recipe).map(id=>flowers.find(f=>f.id===id)?.name || '')].join(' '));
    return (!query || searchable.includes(query)) && (!filters.mood || filters.mood==='all' || product.moods.includes(filters.mood)) && (filters.price!=='under150' || price<150000) && (filters.price!=='150to300' || (price>=150000&&price<=300000)) && (filters.price!=='over300' || price>300000) && (!filters.favoritesOnly || (filters.favorites || []).includes(product.id));
  });
  return items.sort((a,b)=>filters.sort==='price-asc'?shopBouquetPrice(a,flowers,wraps)-shopBouquetPrice(b,flowers,wraps):filters.sort==='price-desc'?shopBouquetPrice(b,flowers,wraps)-shopBouquetPrice(a,flowers,wraps):filters.sort==='name'?a.name.localeCompare(b.name,'vi'):products.indexOf(a)-products.indexOf(b));
}
