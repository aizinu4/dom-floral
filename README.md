# Đơm. floral

## Bàn gói quà

- Sáu kiểu gói: chữ V, quạt Hàn, cánh hoa nhiều lớp, ống tối giản, giấy báo và voan trong; thêm lựa chọn chỉ thắt nơ.
- Công tắc “Hiện giấy gói” chỉ tác động đến bàn sắp xếp. Cấu hình đặt hoa và ảnh thành phẩm vẫn giữ kiểu gói đã chọn. Muốn không dùng giấy thật, chọn “Chỉ thắt nơ”.
- Năm mẫu thiệp đính kèm, có tùy chọn không thiệp. Viết người nhận, người gửi, nội dung đến 300 ký tự; chọn chữ nghiêng/chữ in, xem hai mặt, thêm lời nhắn gợi ý và tải thiết kế hai mặt PNG 2400 × 1100.
- Sáu sticker và bốn charm vẽ bằng SVG. Thêm tối đa sáu món, kể cả lặp mẫu; kéo, xoay, đổi cỡ hoặc gỡ trên bó. Thiệp cũng có thể di chuyển và xoay.
- Giá tạm tính tách hoa, giấy/nơ, thiệp, sticker và charm. Phiếu nháp lưu đủ lựa chọn và nguyên văn nội dung thiệp. Gợi ý mood tính cả chi phí hoàn thiện hiện tại; báo rõ khi phần quà khiến ngân sách không đủ.
- Bản phối cũ được chuyển đổi an toàn, giữ giá chữ V ban đầu 25k và không tự thêm thiệp/phụ kiện. Thiệp tắt đi vẫn giữ nội dung để có thể chọn lại.

Model và giá minh họa ở [gift-model.js](./dist/gift-model.js), hình gói/thiệp/phụ kiện dùng chung cho preview và PNG ở [gift-renderer.js](./dist/gift-renderer.js), giao diện ở [gift-studio.js](./dist/gift-studio.js) và [gift-studio.css](./dist/gift-studio.css). Tất cả hình gói, thiệp và phụ kiện là vector dựng trong mã, chưa phải ảnh hàng thật của tiệm. Chạy `npm test` để kiểm tra tính giá, chuyển đổi bản lưu cũ và dữ liệu phiếu.

## Artbook no. 01

Trang chủ được thiết kế lại như một cuốn artbook thực vật: chữ serif lớn, bố cục bất đối xứng, hoa nghệ thuật tách nền, nét khoanh đỏ viết tay và khoảng trống có chủ đích. Các chương được đánh số, danh sách hoa là bộ mẫu thực vật lệch nhịp, lời mời sáng tạo dùng đỏ rượu và xanh lá non, mood là một mục lục tương tác, còn câu chuyện có poster minh họa nét vẽ riêng.

Theme trình bày ở [art-direction.css](./dist/art-direction.css) và [art-direction.js](./dist/art-direction.js). Bàn phối hoa, gợi ý ngân sách, bưu thiếp và phiếu nháp tiếp tục dùng logic trước đó. Tác phẩm calla–hồng–tulip ở bìa được ghi là ảnh concept, không phải hàng tồn kho.

## Bản nâng cấp: một studio nhỏ có nắng

- Trang đầu dạng editorial: slogan lớn, ảnh bó hoa vòm, ảnh tay gói hoa kiểu polaroid, giấy dán, chữ nghiêng và chuyển động nhẹ theo chuột.
- Bàn hoa có animation khi thêm cành, nút xếp tự nhiên, giấy gói mở nhẹ khi đổi màu và ba màu nơ. Các node hoa được giữ lại khi cập nhật để thao tác không giật mất trạng thái.
- Hành trình ba câu hỏi: người nhận → cảm xúc → ngân sách. 48 tổ hợp đều được kiểm tra để tổng tiền hoa + giấy gói nằm trong mức 150k / 250k / 400k được chọn.
- “Gói bó này” mở bưu thiếp PNG 1080 × 1350 có tên bó, người đơm và lời nhắn. Màu giấy, nơ, thứ tự và vị trí cành lấy từ bản phối hiện tại. Chia sẻ qua bảng chia sẻ của thiết bị khi hỗ trợ, hoặc tải ảnh để gửi.
- Nhật ký Đơm có ba trang đọc về tinh thần tiệm, cảm hứng phối hoa và chăm hoa. Ảnh đôi tay là ảnh concept AI, chưa đại diện cho người sáng lập thực tế.
- Chuyển động tôn trọng cài đặt giảm chuyển động; bố cục được kiểm tra ở 320, 390, 768, 1024 và 1440 px.

Phần mới nằm trong [experience.js](./dist/experience.js) và [experience.css](./dist/experience.css), dùng chung state và bộ xuất ảnh với [app.js](./dist/app.js). Các giới hạn về giá minh họa và phiếu nháp bên dưới vẫn áp dụng.

Bản thiết kế tương tác đầu tiên cho tiệm hoa Đơm. floral.

## Ý tưởng

**Một khu vườn nhỏ, được đơm bằng tay.** Dịu dàng theo tinh thần studio Hàn Quốc, có nét riêng qua chữ serif, dấu chấm xanh, hoa thị, ảnh hoa dưới nắng và lời dẫn gần gũi.

- Slogan chính: **Đơm những điều đẹp đẽ.**
- Câu dẫn trang chủ: **Một chút hoa, một ngày dịu lại.**
- Gợi ý khác: “Từ một cành hoa, đơm một niềm vui.” / “Đơm hoa, gửi thương.”
- Màu: kem `#f8f7f2`, xanh trầm `#354e3f`, hồng phấn, xanh sage, tím nhạt.
- Font: Playfair Display cho tiêu đề và Be Vietnam Pro cho nội dung, có font hệ thống dự phòng.

## Các trải nghiệm đã dựng

1. Trang chủ: giới thiệu, hoa hôm nay, bàn đơm hoa, bốn tâm trạng, câu chuyện hai người xây tiệm và câu hỏi thường gặp.
2. Hoa hôm nay: sáu cành hoa/lá minh họa tách nền, lọc nhóm, đánh dấu yêu thích và thêm cành vào bó.
3. Bàn đơm hoa: thêm tối đa 18 cành, kéo thả, di chuyển bằng phím mũi tên, xoay, đổi lớp, xóa cành, chọn bốn giấy gói, nhập lời nhắn và xem giá tạm tính.
4. Gợi ý mood: dịu dàng, thương một người, hôm nay thật vui và tặng mình. Có xác nhận ngay trong nút trước khi thay bó đã chọn.
5. Lưu ảnh bó hoa PNG, tự lưu bản phối trên trình duyệt và phiếu đặt hoa nháp có thể tải/sao chép.
6. Giao diện đáp ứng: cột hoa cuộn ngang trên điện thoại, menu thu gọn, dialog và form dùng được với bàn phím.

## Chạy tại máy

Yêu cầu Node.js, không có dependency cần cài đặt.

```sh
npm run dev
```

Mở `http://127.0.0.1:4173`. Kiểm tra cú pháp bằng `npm run check`.

Trang tĩnh ở [dist/](./dist/), tương tác trong [app.js](./dist/app.js), giao diện trong [styles.css](./dist/styles.css).

## Giới hạn hiện tại

- Đây là bản thiết kế và prototype, chưa có nhận đơn thật, thanh toán hoặc tồn kho trực tuyến.
- Tên hoa, giá, cách bó và số lượng sẵn có là dữ liệu minh họa, chưa đại diện cho hàng thật của tiệm.
- Phiếu nháp lưu trên thiết bị. Không gửi thông tin khách hàng đến server hay tiệm. Tiệm chưa nhận hoặc xác nhận đơn.
- Bản phối là hình dung ý tưởng; hoa thật có khác biệt về dáng và độ nở. Phí giao chưa được tính.
- Giấy gói dựng bằng CSS; ảnh tải về tái dựng bố cục hoa, màu giấy và nhãn bằng canvas.
- Ảnh AI cần được thay bằng ảnh thật của tiệm trước khi bán hàng. Cành hoa dùng atlas trong suốt, không có nền trắng.

## Thông tin cần chốt để vận hành

- Thành phố/khu vực giao, địa chỉ nhận tại tiệm, giờ mở cửa và thời gian chuẩn bị.
- Khoảng giá mục tiêu, danh sách hoa thực tế mỗi ngày, số cành sẵn và phí giấy gói.
- Kênh nhận đơn: Zalo, Instagram hoặc hệ thống đơn hàng trên web.
- Ảnh hoa tách nền, ảnh bó thật, logo và tài khoản mạng xã hội.
- Chính sách đặt cọc, đổi/hủy, thay thế hoa, giao nhận và quyền riêng tư.

Giai đoạn tiếp theo nên có trang quản trị để tiệm cập nhật hoa hôm nay và đánh dấu hết hàng. Chỉ tích hợp checkout sau khi đã chốt quy trình nhận đơn, xác nhận tồn kho và phí giao.

Nguồn ảnh và prompt ở [ASSETS.md](./ASSETS.md).
