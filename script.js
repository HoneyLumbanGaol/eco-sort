const wasteItems = [
  { name: "Cangkang Pisang", type: "organik", info: "Sampah organik bisa dijadikan kompos untuk menyuburkan tanah." },
  { name: "Botol Plastik", type: "plastik", info: "Plastik sebaiknya didaur ulang agar tidak mencemari lingkungan dan laut." },
  { name: "Koran Lama", type: "kertas", info: "Kertas dapat didaur ulang menjadi produk baru dan mengurangi pembalakan pohon." },
  { name: "Botol Kaca", type: "kaca", info: "Kaca dapat didaur ulang berulang kali tanpa kualitas yang turun drastis." },
  { name: "Sisa Makanan", type: "organik", info: "Sisa makanan dapat diolah menjadi kompos atau pakan ternak sesuai kebutuhan." },
  { name: "Kemasan Snack", type: "plastik", info: "Kemasan plastik harus dipisahkan agar proses daur ulang lebih efektif." },
  { name: "Kotak Susu", type: "kertas", info: "Kardus dan kotak bekas bisa didaur ulang menjadi bahan baku kertas baru." },
  { name: "Cermin Pecah", type: "kaca", info: "Kaca pecah harus dibuang ke tempat sampah kaca agar aman dan dapat didaur ulang." },
  { name: "Kain Perca", type: "lainnya", info: "Kain perca biasanya masuk kategori sampah umum karena sulit didaur ulang dengan cara sederhana." },
  { name: "Baterai Bekas", type: "lainnya", info: "Baterai bekas termasuk sampah berbahaya dan harus dibawa ke pusat pengelolaan limbah khusus." },
  { name: "Daun kering", type: "organik", info: "Daun kering bisa dijadikan kompos rumah tangga yang bermanfaat untuk tanaman." },
  { name: "Kaleng Minuman", type: "lainnya", info: "Kaleng logam sering dimasukkan ke sampah non-organik khusus, karena sifatnya berbeda dari plastik atau kertas." },
  { name: "Tutup Botol", type: "plastik", info: "Tutup botol yang terbuat dari plastik perlu dipilah agar tidak mengganggu proses daur ulang utama." },
  { name: "Buku Tua", type: "kertas", info: "Buku bekas bisa dijadikan kertas daur ulang atau disumbangkan jika masih layak pakai." },
  { name: "Gelas Pecah", type: "kaca", info: "Gelas pecah harus dikumpulkan terpisah untuk mencegah kecelakaan dan memudahkan daur ulang." }
];

const elements = {
  scoreValue: document.getElementById("scoreValue"),
  levelValue: document.getElementById("levelValue"),
  timeValue: document.getElementById("timeValue"),
  livesValue: document.getElementById("livesValue"),
  wasteName: document.getElementById("wasteName"),
  feedback: document.getElementById("feedback"),
  infoBox: document.getElementById("infoBox"),
  restartBtn: document.getElementById("restartBtn"),
  bins: document.querySelectorAll(".bin-btn")
};

const state = {
  score: 0,
  level: 1,
  lives: 3,
  timeLeft: 12,
  timer: null,
  currentWaste: null,
  round: 0,
};

function formatTime(value) {
  return Math.max(0, Math.ceil(value));
}

function getRandomWaste() {
  const randomIndex = Math.floor(Math.random() * wasteItems.length);
  return wasteItems[randomIndex];
}

function updateStats() {
  elements.scoreValue.textContent = state.score;
  elements.levelValue.textContent = state.level;
  elements.timeValue.textContent = formatTime(state.timeLeft);
  elements.livesValue.textContent = state.lives;
}

function renderWaste() {
  state.currentWaste = getRandomWaste();
  elements.wasteName.textContent = state.currentWaste.name;
  elements.infoBox.innerHTML = "<h3>Info pengelolaan sampah</h3><p>Jawablah terlebih dahulu untuk melihat tipsnya.</p>";
  elements.feedback.className = "feedback neutral";
  elements.feedback.textContent = "Pilih jenis tempat sampah yang tepat.";
  updateStats();
}

function setLevelByProgress() {
  if (state.score >= 0 && state.score < 20) state.level = 1;
  else if (state.score < 45) state.level = 2;
  else if (state.score < 75) state.level = 3;
  else if (state.score < 110) state.level = 4;
  else state.level = 5;

  state.timeLeft = Math.max(4, 12 - (state.level - 1) * 1.5);
  updateStats();
}

function checkAnswer(selectedType) {
  if (!state.currentWaste) return;

  const isCorrect = selectedType === state.currentWaste.type;

  if (isCorrect) {
    state.score += 10 + state.level * 2;
    elements.feedback.className = "feedback correct";
    elements.feedback.textContent = `Benar! ${state.currentWaste.name} termasuk sampah ${state.currentWaste.type}.`;
    elements.infoBox.innerHTML = `<h3>Info pengelolaan sampah</h3><p>${state.currentWaste.info}</p>`;
  } else {
    state.score = Math.max(0, state.score - 5);
    state.lives -= 1;
    elements.feedback.className = "feedback wrong";
    elements.feedback.textContent = `Salah! ${state.currentWaste.name} seharusnya masuk sampah ${state.currentWaste.type}.`;
    elements.infoBox.innerHTML = `<h3>Info pengelolaan sampah</h3><p>${state.currentWaste.info}</p>`;
  }

  setLevelByProgress();

  if (state.lives <= 0) {
    clearInterval(state.timer);
    elements.feedback.className = "feedback wrong";
    elements.feedback.textContent = `Game selesai! Skor akhir: ${state.score}. Tekan ulangi untuk bermain lagi.`;
    elements.wasteName.textContent = "Permainan Berakhir";
    return;
  }

  setTimeout(() => {
    renderWaste();
  }, 700);
}

function startTimer() {
  clearInterval(state.timer);
  state.timer = setInterval(() => {
    if (state.lives <= 0) {
      clearInterval(state.timer);
      return;
    }

    state.timeLeft -= 1;
    updateStats();

    if (state.timeLeft <= 0) {
      state.lives -= 1;
      elements.feedback.className = "feedback wrong";
      elements.feedback.textContent = "Waktu habis! Kamu kehilangan satu nyawa.";

      if (state.lives <= 0) {
        clearInterval(state.timer);
        elements.feedback.textContent = `Waktu habis! Game selesai. Skor akhir: ${state.score}.`;
        elements.wasteName.textContent = "Permainan Berakhir";
        return;
      }

      state.timeLeft = Math.max(4, 12 - (state.level - 1) * 1.5);
      renderWaste();
    }
  }, 1000);
}

function restartGame() {
  state.score = 0;
  state.level = 1;
  state.lives = 3;
  state.timeLeft = 12;
  state.round = 0;
  clearInterval(state.timer);
  renderWaste();
  startTimer();
}

elements.restartBtn.addEventListener("click", restartGame);
elements.bins.forEach((button) => {
  button.addEventListener("click", () => checkAnswer(button.dataset.bin));
});

restartGame();
