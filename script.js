/**
 * =========================================================================
 * 💖 JAVASCRIPT: PHIÊN BẢN TRÁI TIM & HOA HỒNG (20/10 SPECIAL EDITION)
 * Hiệu ứng chuyển cảnh 4 màn hình, Mưa trái tim tương tác chạm nổ pháo hoa hạt,
 * Xếp trái tim pha lê 3D với thông điệp nguyện ước bí mật, Âm thanh piano lãng mạn.
 * =========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {

  // 1. BIẾN TRẠNG THÁI & DOM ELEMENTS
  let currentPasscode = "";
  const PASSCODE_LENGTH = 6;
  let rainInterval = null;
  let isRainingActive = false;

  const scenePasscode = document.getElementById("scene-passcode");
  const sceneRoses = document.getElementById("scene-roses");
  const sceneRain = document.getElementById("scene-rain");
  const sceneHeart = document.getElementById("scene-heart");

  const pinBoxes = document.querySelectorAll(".pin-box");
  const hiddenPinInput = document.getElementById("hidden-pin-input");
  const passcodeError = document.getElementById("passcode-error");
  const numericKeypad = document.getElementById("numeric-keypad");

  // Wish Modal Elements
  const wishModal = document.getElementById("wish-modal");
  const wishMessageText = document.getElementById("wish-message-text");
  const wishCloseBtn = document.getElementById("wish-close-btn");
  const wishOkBtn = document.getElementById("wish-ok-btn");
  const wishModalBackdrop = document.querySelector(".wish-modal-backdrop");

  // Music Elements
  const musicToggle = document.getElementById("music-toggle");
  let audioContext = null;
  let isMusicPlaying = false;
  let musicTimer = null;


  // =========================================================================
  // 🎵 HỆ THỐNG ÂM THANH: YOUTUBE PLAYER + WEB AUDIO SYNTHESIS DỰ PHÒNG
  // =========================================================================
  function extractYouTubeId(url) {
    if (!url || typeof url !== "string") return null;
    const cleanUrl = url.trim();
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = cleanUrl.match(regExp);
    return match ? match[1] : (cleanUrl.length === 11 ? cleanUrl : null);
  }

  const ytVideoId = extractYouTubeId(CONFIG.youtubeUrl);
  let ytPlayer = null;
  let isYTReady = false;

  if (ytVideoId) {
    const ytScript = document.createElement("script");
    ytScript.src = "https://www.youtube.com/iframe_api";
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode.insertBefore(ytScript, firstScript);

    window.onYouTubeIframeAPIReady = function () {
      ytPlayer = new YT.Player("yt-player", {
        height: "200",
        width: "200",
        videoId: ytVideoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          playlist: ytVideoId,
          playsinline: 1,
          modestbranding: 1
        },
        events: {
          onReady: function (event) {
            isYTReady = true;
            try {
              event.target.unMute();
              event.target.playVideo();
            } catch (e) { }
            if (isMusicPlaying) {
              stopChimeLoop();
            }
          },
          onStateChange: function (event) {
            if (event.data === YT.PlayerState.PLAYING) {
              isMusicPlaying = true;
              musicToggle.classList.add("playing");
              stopChimeLoop();
            } else if (event.data === YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          },
          onError: function () {
            ytPlayer = null;
            if (isMusicPlaying) startChimeLoop();
          }
        }
      });
    };
  }

  // Web Audio Synth piano chords
  function initAudio() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
      }
    }
    if (audioContext && audioContext.state === "suspended") {
      audioContext.resume();
    }
  }

  function playGentleChime(freq = 523.25, duration = 0.5) {
    try {
      initAudio();
      if (!audioContext) return;

      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, audioContext.currentTime);

      gain.gain.setValueAtTime(0.001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, audioContext.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start();
      osc.stop(audioContext.currentTime + duration);
    } catch (e) { }
  }

  // Chuỗi giai điệu piano êm dịu
  const melodyNotes = [
    523.25, 659.25, 783.99, 1046.50,
    587.33, 698.46, 880.00, 1174.66,
    659.25, 783.99, 987.77, 1318.51,
    523.25, 659.25, 880.00, 1046.50
  ];
  let currentNoteIdx = 0;

  function startChimeLoop() {
    stopChimeLoop();
    musicTimer = setInterval(() => {
      if (!isMusicPlaying) return;
      playGentleChime(melodyNotes[currentNoteIdx], 1.2);
      currentNoteIdx = (currentNoteIdx + 1) % melodyNotes.length;
    }, 1800);
  }

  function stopChimeLoop() {
    if (musicTimer) {
      clearInterval(musicTimer);
      musicTimer = null;
    }
  }

  function playMusic() {
    isMusicPlaying = true;
    musicToggle.classList.add("playing");
    initAudio();

    if (ytPlayer && isYTReady && typeof ytPlayer.playVideo === "function") {
      try {
        ytPlayer.unMute();
        ytPlayer.playVideo();
      } catch (e) { }
      setTimeout(() => {
        if (isMusicPlaying && ytPlayer) {
          const state = typeof ytPlayer.getPlayerState === "function" ? ytPlayer.getPlayerState() : -1;
          if (state !== 1 && state !== 3) {
            startChimeLoop();
          }
        }
      }, 1200);
    } else {
      startChimeLoop();
    }
  }

  function pauseMusic() {
    isMusicPlaying = false;
    musicToggle.classList.remove("playing");
    if (ytPlayer && isYTReady && typeof ytPlayer.pauseVideo === "function") {
      try {
        ytPlayer.pauseVideo();
      } catch (e) { }
    }
    stopChimeLoop();
  }

  function toggleMusic() {
    if (isMusicPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }

  musicToggle.addEventListener("click", toggleMusic);

  const startMusicOnFirstTouch = () => {
    initAudio();
    if (!isMusicPlaying) playMusic();
    window.removeEventListener("pointerdown", startMusicOnFirstTouch);
    window.removeEventListener("click", startMusicOnFirstTouch);
    window.removeEventListener("keydown", startMusicOnFirstTouch);
  };
  window.addEventListener("pointerdown", startMusicOnFirstTouch, { passive: true });
  window.addEventListener("click", startMusicOnFirstTouch);
  window.addEventListener("keydown", startMusicOnFirstTouch);


  // =========================================================================
  // 🌟 HIỆU ỨNG HẠT NỀN LUNG LINH (CANVAS PARTICLES)
  // =========================================================================
  const canvas = document.getElementById("ambient-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.8 + 0.8;
      this.speedY = -(Math.random() * 0.45 + 0.15);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.color = Math.random() > 0.4 ? "#ff758f" : "#ffd166";
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.opacity += Math.sin(Date.now() * this.pulseSpeed) * 0.01;
      if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
        this.reset();
        this.y = canvas.height + 10;
      }
    }
    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = Math.max(0.1, Math.min(1, this.opacity));
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 45; i++) {
    particles.push(new Particle());
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();


  // =========================================================================
  // 🔄 CHUYỂN CẢNH MƯỢT MÀ
  // =========================================================================
  function switchScene(targetScene) {
    [scenePasscode, sceneRoses, sceneRain, sceneHeart].forEach(s => {
      s.classList.remove("active");
    });
    setTimeout(() => {
      targetScene.classList.add("active");
      if (targetScene === sceneRoses) initSceneRoses();
      if (targetScene === sceneRain) startRainOfHearts();
      if (targetScene === sceneHeart) initSceneHeart();
    }, 350);
  }


  // =========================================================================
  // 🔒 SCENE 1: NHẬP MẬT MÃ BÍ MẬT (6 CHỮ SỐ)
  // =========================================================================
  function updatePinBoxes() {
    pinBoxes.forEach((box, i) => {
      if (i < currentPasscode.length) {
        box.classList.add("filled");
        box.classList.remove("active");
      } else if (i === currentPasscode.length) {
        box.classList.remove("filled");
        box.classList.add("active");
      } else {
        box.classList.remove("filled", "active");
      }
    });
  }

  function handleDigitInput(digit) {
    if (currentPasscode.length < PASSCODE_LENGTH) {
      currentPasscode += digit;
      updatePinBoxes();
      passcodeError.textContent = "";
      playGentleChime(420 + currentPasscode.length * 60, 0.15);
      if (currentPasscode.length === PASSCODE_LENGTH) {
        setTimeout(verifyPasscode, 250);
      }
    }
  }

  function handleBackspace() {
    if (currentPasscode.length > 0) {
      currentPasscode = currentPasscode.slice(0, -1);
      passcodeError.textContent = "";
      updatePinBoxes();
    }
  }

  function handleClear() {
    currentPasscode = "";
    passcodeError.textContent = "";
    updatePinBoxes();
  }

  function verifyPasscode() {
    const expected = CONFIG.passcode || "201024";
    if (currentPasscode === expected) {
      passcodeError.style.color = "#52b788";
      passcodeError.textContent = "Mật mã chính xác! Đang mở quà... 🌹";
      playGentleChime(659.25, 0.4);
      setTimeout(() => playGentleChime(783.99, 0.5), 150);

      playMusic();

      setTimeout(() => {
        switchScene(sceneRoses);
      }, 700);
    } else {
      passcodeError.style.color = "#ff4d6d";
      passcodeError.textContent = "Mật khẩu chưa chính xác! Thử lại nhé 🌸";
      const card = document.querySelector(".passcode-card");
      card.classList.add("shake-anim");
      setTimeout(() => card.classList.remove("shake-anim"), 500);
      setTimeout(handleClear, 900);
    }
  }

  numericKeypad.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    if (btn.dataset.key) handleDigitInput(btn.dataset.key);
    else if (btn.dataset.action === "backspace") handleBackspace();
    else if (btn.dataset.action === "clear") handleClear();
  });

  window.addEventListener("keydown", (e) => {
    if (!scenePasscode.classList.contains("active")) return;
    if (e.key >= "0" && e.key <= "9") handleDigitInput(e.key);
    else if (e.key === "Backspace") handleBackspace();
    else if (e.key === "Escape") handleClear();
  });

  const pinDisplayWrapper = document.getElementById("pin-boxes");
  pinDisplayWrapper.addEventListener("click", () => hiddenPinInput.focus());
  hiddenPinInput.addEventListener("input", () => {
    const val = hiddenPinInput.value.replace(/\D/g, "");
    currentPasscode = val.slice(0, PASSCODE_LENGTH);
    updatePinBoxes();
    if (currentPasscode.length === PASSCODE_LENGTH) {
      setTimeout(verifyPasscode, 200);
    }
  });


  // =========================================================================
  // 🌹 SCENE 2: HOA HỒNG NỞ RỘ & LỜI CHÚC
  // =========================================================================
  function initSceneRoses() {
    const badgeEl = document.getElementById("greeting-badge");
    const titleEl = document.getElementById("rose-greeting-title");
    const contentEl = document.getElementById("rose-greeting-content");
    const promptPrefixEl = document.getElementById("prompt-prefix");
    const recipientNameEl = document.getElementById("recipient-name");
    const promptSuffixEl = document.getElementById("prompt-suffix");

    if (CONFIG.roseGreeting) {
      if (badgeEl && CONFIG.roseGreeting.badge) badgeEl.textContent = CONFIG.roseGreeting.badge;
      if (titleEl && CONFIG.roseGreeting.title) titleEl.textContent = CONFIG.roseGreeting.title;
      if (contentEl && CONFIG.roseGreeting.content) contentEl.textContent = CONFIG.roseGreeting.content;
      if (promptPrefixEl && typeof CONFIG.roseGreeting.giftPromptPrefix === "string") {
        promptPrefixEl.textContent = CONFIG.roseGreeting.giftPromptPrefix;
      }
      if (promptSuffixEl && typeof CONFIG.roseGreeting.giftPromptSuffix === "string") {
        promptSuffixEl.textContent = CONFIG.roseGreeting.giftPromptSuffix;
      }
    }

    if (recipientNameEl && CONFIG.recipientName) {
      recipientNameEl.textContent = CONFIG.recipientName;
    }

    createFallingRosePetals();
  }

  function createFallingRosePetals() {
    const container = document.getElementById("rose-petals-container");
    container.innerHTML = "";
    for (let i = 0; i < 20; i++) {
      const petal = document.createElement("div");
      petal.className = "falling-petal";
      const size = Math.random() * 16 + 14;
      petal.style.width = `${size}px`;
      petal.style.height = `${size * 1.25}px`;
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.animationDuration = `${Math.random() * 4 + 4}s`;
      petal.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(petal);
    }
  }

  const btnNextToRain = document.getElementById("btn-next-to-rain");
  btnNextToRain.addEventListener("click", () => switchScene(sceneRain));


  // =========================================================================
  // 💖 SCENE 3: CƠN MƯA TRÁI TIM & HOA HỒNG LUNG LINH
  // =========================================================================
  const rainStage = document.getElementById("rain-stage");
  const secretQuestionText = document.getElementById("secret-question-text");
  const btnYesText = document.getElementById("btn-yes-text");
  const btnNoText = document.getElementById("btn-no-text");
  const btnGiftYes = document.getElementById("btn-gift-yes");
  const btnGiftNo = document.getElementById("btn-gift-no");

  if (CONFIG.secretQuestion) secretQuestionText.textContent = CONFIG.secretQuestion;
  if (CONFIG.btnYesText) btnYesText.textContent = CONFIG.btnYesText;
  if (CONFIG.btnNoText) btnNoText.textContent = CONFIG.btnNoText;

  // Danh sách các icon trái tim & hoa nghệ thuật
  const heartIcons = [
    "fa-solid fa-heart",
    "fa-solid fa-heart-pulse",
    "fa-solid fa-heart-circle-check",
    "fa-solid fa-gem",
    "fa-solid fa-spa",
    "fa-solid fa-star"
  ];

  // Màu sắc gradient cho trái tim
  const heartColorSchemes = [
    "linear-gradient(135deg, #ff758f, #ff4d6d 60%, #c9184a)",
    "linear-gradient(135deg, #ff9ebb, #ff4d6d 60%, #800f2f)",
    "linear-gradient(135deg, #ffd166, #ff758f 60%, #c9184a)",
    "linear-gradient(135deg, #f72585, #b5179e 60%, #7209b7)",
    "linear-gradient(135deg, #ffccd5, #ff4d6d 70%, #590d22)"
  ];

  function spawnFallingHeart() {
    if (!isRainingActive) return;

    const isFlower = Math.random() > 0.7;
    const card = document.createElement("div");

    const leftPos = Math.random() * 88 + 4; // 4% đến 92%
    const fallDuration = Math.random() * 3 + 4.2; // 4.2s đến 7.2s
    const rotateDeg = (Math.random() - 0.5) * 45;
    const swayAmount = (Math.random() - 0.5) * 80;

    card.style.left = `${leftPos}%`;

    if (isFlower) {
      card.className = "rain-flower-card";
      card.innerHTML = "🌸";
      card.style.fontSize = `${Math.random() * 1.4 + 1.8}rem`;
    } else {
      card.className = "rain-heart-card";
      const iconClass = heartIcons[Math.floor(Math.random() * heartIcons.length)];
      const gradient = heartColorSchemes[Math.floor(Math.random() * heartColorSchemes.length)];
      const sizeRem = (Math.random() * 1.2 + 2.0).toFixed(2);

      const icon = document.createElement("i");
      icon.className = `${iconClass} heart-glow-icon`;
      icon.style.fontSize = `${sizeRem}rem`;
      icon.style.background = gradient;
      icon.style.webkitBackgroundClip = "text";
      icon.style.webkitTextFillColor = "transparent";
      card.appendChild(icon);
    }

    rainStage.appendChild(card);

    const anim = card.animate([
      { transform: `translate3d(0, -140px, 0) rotate(${rotateDeg}deg) scale(0.8)`, opacity: 0 },
      { opacity: 1, offset: 0.1 },
      { opacity: 1, offset: 0.85 },
      { transform: `translate3d(${swayAmount}px, calc(100vh + 160px), 0) rotate(${rotateDeg + 25}deg) scale(1)`, opacity: 0 }
    ], {
      duration: fallDuration * 1000,
      easing: "linear"
    });

    anim.onfinish = () => {
      if (card.parentNode) card.parentNode.removeChild(card);
    };

    // Khi người dùng bấm/chạm vào trái tim đang rơi -> NỔ PHÁO HOA HẠT LẤP LÁNH!
    const explodeHeart = (e) => {
      e.stopPropagation();
      const rect = card.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;

      // Nổ 12 hạt sao lấp lánh tỏa tròn
      createSparkleBurst(originX, originY);
      playGentleChime(784 + Math.random() * 300, 0.3);

      if (card.parentNode) card.parentNode.removeChild(card);
    };

    card.addEventListener("pointerdown", explodeHeart);
    card.addEventListener("click", explodeHeart);
  }

  function createSparkleBurst(x, y) {
    const burstCount = 14;
    const icons = ["✨", "💖", "🌸", "⭐", "💕"];

    for (let i = 0; i < burstCount; i++) {
      const p = document.createElement("div");
      p.className = "sparkle-particle";
      p.textContent = icons[Math.floor(Math.random() * icons.length)];
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;

      const angle = (i / burstCount) * 2 * Math.PI + (Math.random() - 0.5);
      const dist = Math.random() * 80 + 50;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;

      p.style.setProperty("--tx", `${tx}px`);
      p.style.setProperty("--ty", `${ty}px`);

      document.body.appendChild(p);
      setTimeout(() => {
        if (p.parentNode) p.parentNode.removeChild(p);
      }, 800);
    }
  }

  function startRainOfHearts() {
    isRainingActive = true;
    rainStage.innerHTML = "";

    // Thả ngay 5 trái tim ban đầu
    for (let i = 0; i < 5; i++) {
      setTimeout(spawnFallingHeart, i * 350);
    }

    // Tiếp tục rơi đều đặn mỗi 800ms
    if (rainInterval) clearInterval(rainInterval);
    rainInterval = setInterval(spawnFallingHeart, 800);
  }

  function stopRainOfHearts() {
    isRainingActive = false;
    if (rainInterval) clearInterval(rainInterval);
    rainStage.innerHTML = "";
  }

  // Nút "Không" tinh nghịch né tránh
  let noClickCount = 0;
  const funnyTexts = [
    "Ơ đừng mà 🥺",
    "Thật sự không muốn sao? 🙈",
    "Bấm 'Có' đi nà! ✨",
    "Suy nghĩ lại đi nè! 💖",
    "Hết cơ hội từ chối rồi nha 💕"
  ];

  function dodgeNoButton(e) {
    if (e) e.preventDefault();
    noClickCount++;
    playGentleChime(320, 0.12);

    btnNoText.textContent = funnyTexts[noClickCount % funnyTexts.length];
    const offsetX = (Math.random() - 0.5) * 80;
    const offsetY = (Math.random() - 0.5) * 60;
    btnGiftNo.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

    const currentScale = 1 + Math.min(noClickCount * 0.08, 0.35);
    btnGiftYes.style.transform = `scale(${currentScale})`;
  }

  btnGiftNo.addEventListener("mouseenter", dodgeNoButton);
  btnGiftNo.addEventListener("pointerdown", dodgeNoButton);
  btnGiftNo.addEventListener("click", dodgeNoButton);

  btnGiftYes.addEventListener("click", () => {
    playGentleChime(659.25, 0.3);
    setTimeout(() => playGentleChime(880, 0.4), 180);
    stopRainOfHearts();
    switchScene(sceneHeart);
  });


  // =========================================================================
  // 💖 SCENE 4: TRÁI TIM PHA LÊ KHỔNG LỒ & TÂM THƯ CUỐI CÙNG
  // =========================================================================
  function initSceneHeart() {
    const gemsContainer = document.getElementById("heart-gems-container");
    const letterBody = document.getElementById("final-letter-lines");
    gemsContainer.innerHTML = "";
    letterBody.innerHTML = "";

    // Nạp tâm thư
    if (CONFIG.finalLetter && Array.isArray(CONFIG.finalLetter)) {
      CONFIG.finalLetter.forEach(line => {
        const p = document.createElement("p");
        p.className = "letter-line";
        p.textContent = line;
        letterBody.appendChild(p);
      });
    }

    // Phương trình toán học hình trái tim:
    // x = 16 * sin^3(t)
    // y = -(13 * cos(t) - 5 * cos(2t) - 2 * cos(3t) - cos(4t))
    const totalGems = 32; // Số lượng viên ngọc trái tim viền quanh
    const isMobile = window.innerWidth <= 600;
    const radiusX = isMobile ? 120 : 165;
    const radiusY = isMobile ? 105 : 145;

    const wishes = CONFIG.heartWishes || [
      "Luôn rạng rỡ và hạnh phúc 🌸",
      "Vạn sự như ý, bình an may mắn 💖",
      "Nụ cười của bạn là tuyệt nhất ✨"
    ];

    for (let i = 0; i < totalGems; i++) {
      const t = (i / totalGems) * 2 * Math.PI - Math.PI / 2;

      const xMath = 16 * Math.pow(Math.sin(t), 3);
      const yMath = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

      const leftPercent = 50 + (xMath / 16) * (radiusX / (isMobile ? 2.5 : 3.2));
      const topPercent = 46 + (yMath / 16) * (radiusY / (isMobile ? 2.5 : 3.2));

      const gem = document.createElement("button");
      gem.type = "button";
      gem.className = "heart-gem-item";
      gem.style.left = `${leftPercent}%`;
      gem.style.top = `${topPercent}%`;
      gem.style.transform = "translate(-50%, -50%) scale(0)";
      gem.setAttribute("aria-label", `Viên ngọc trái tim ${i + 1}`);

      // Icon trái tim hoặc hoa xen kẽ
      const icon = document.createElement("i");
      icon.className = i % 4 === 0 ? "fa-solid fa-spa" : "fa-solid fa-heart";
      gem.appendChild(icon);

      // Hiệu ứng xuất hiện tuần tự tạo thành đường cong trái tim hoàn mỹ
      setTimeout(() => {
        gem.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
        gem.style.transform = "translate(-50%, -50%) scale(1)";
        if (i % 6 === 0) playGentleChime(500 + i * 20, 0.1);
      }, i * 50);

      // Khi chạm vào viên ngọc trái tim -> Mở Hộp điều ước bí mật!
      gem.addEventListener("click", () => {
        const wish = wishes[i % wishes.length];
        openWishModal(wish);
      });

      gemsContainer.appendChild(gem);
    }
  }

  // Popup hộp điều ước
  function openWishModal(message) {
    wishMessageText.textContent = `"${message}"`;
    wishModal.classList.add("active");
    playGentleChime(659.25, 0.25);
    setTimeout(() => playGentleChime(880, 0.35), 120);
  }

  function closeWishModal() {
    wishModal.classList.remove("active");
  }

  wishCloseBtn.addEventListener("click", closeWishModal);
  wishOkBtn.addEventListener("click", closeWishModal);
  wishModalBackdrop.addEventListener("click", closeWishModal);

  // Nút xem lại từ đầu
  const btnRestart = document.getElementById("btn-restart");
  btnRestart.addEventListener("click", () => {
    currentPasscode = "";
    updatePinBoxes();
    switchScene(scenePasscode);
  });

});
