// =========================================================================================
// 💖 CẤU HÌNH PHIÊN BẢN TRÁI TIM & HOA (KHÔNG CẦN DÙNG ẢNH) 🌸
// Bạn có thể tùy chỉnh mật khẩu, người nhận, lời chúc và thông điệp tại đây rất dễ dàng.
// =========================================================================================

const CONFIG = {
  // 1. MẬT KHẨU MỞ KHÓA (Gồm 6 chữ số)
  // 👉 Mặc định là ngày 20/10 hoặc ngày sinh nhật tuỳ thích
  passcode: "201026",

  // 🎵 LINK NHẠC TRÊN YOUTUBE (TÙY CHỌN)
  // 👉 Dán link bài hát YouTube nàng thích vào đây
  // 👉 Nếu để trống "" thì website sẽ tự động phát giai điệu piano lãng mạn có sẵn.
  youtubeUrl: "https://www.youtube.com/watch?v=GczyPW3vbrc&list=RDGczyPW3vbrc&start_radio=1",

  // 2. TÊN NGƯỜI ĐƯỢC TẶNG QUÀ
  recipientName: "Người Phụ Nữ Tuyệt Vời",

  // 3. LỜI CHÚC MỪNG NGÀY 20/10 (Ở màn hình đóa hoa hồng nở rộ)
  roseGreeting: {
    badge: "Happy Vietnamese Women's Day • 20/10",
    title: "Chúc Mừng Ngày Phụ Nữ Việt Nam 20/10 🌹",
    content: "Chúc bạn luôn luôn xinh đẹp, rạng rỡ và ngập tràn hạnh phúc như những đóa hồng tươi thắm nhất. Cảm ơn vì đã luôn mang đến nguồn năng lượng dịu dàng, ấm áp cho cuộc đời này!",
    giftPromptPrefix: "Có 1 món quà đặc biệt dành tặng cho bạn ",
    giftPromptSuffix: ""
  },

  // 4. CÂU HỎI MÓN QUÀ BÍ MẬT (Ở màn hình mưa trái tim rơi)
  secretQuestion: "Có 1 món quà bí mật có muốn nhận không? 🎁",
  btnYesText: "Có! Nhận ngay ✨",
  btnNoText: "Không 🙈",

  // 5. CÁC THÔNG ĐIỆP BÍ MẬT KHI CHẠM VÀO TỪNG TRÁI TIM PHA LÊ
  // 👉 Khi người nhận bấm vào bất kỳ trái tim nào trong vòng tròn trái tim lớn, thông điệp này sẽ hiện ra!
  heartWishes: [
    "Luôn rạng rỡ như ánh ban mai ☀️",
    "Bình an trong tâm hồn và may mắn mỗi ngày 🍀",
    "Nụ cười của bạn là điều ấm áp nhất 🌸",
    "Hạnh phúc trọn vẹn và an yên 💖",
    "Mỗi ngày trôi qua đều là một ngày tuyệt vời 🌷",
    "Luôn tự tin bước đi trên con đường của riêng mình ✨",
    "Vạn sự như ý, tỷ sự như mơ 🌈",
    "Xinh đẹp, đáng yêu và ngập tràn năng lượng tích cực 🌺",
    "Được yêu thương và trân trọng mỗi phút giây 💕",
    "Mãi mãi giữ được nụ cười trong trẻo ấy nhé 💐"
  ],

  // 6. TÂM THƯ NHẮN NHỦ BÊN DƯỚI TRÁI TIM KHỔNG LỒ (Màn hình cuối cùng)
  finalLetter: [
    "✨ Chúc bạn có một ngày 20/10 thật trọn vẹn, ấm áp và đong đầy tình cảm.",
    "🌸 Mong rằng mọi ước mơ dịu dàng của bạn đều sẽ trở thành hiện thực.",
    "💖 Bạn xứng đáng nhận được tất cả những điều ngọt ngào và tốt đẹp nhất trên đời.",
    "🎁 Món quà lớn nhất hôm nay và mãi mãi về sau chính là nụ cười hạnh phúc của bạn!",
    "Luôn rạng ngời và hạnh phúc nhé!"
  ]
};
