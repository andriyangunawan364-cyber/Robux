// ===============================
// ROBUX.ID - KONFIGURASI TOKO
// ===============================
          // Opsional: URL/path gambar QRIS, contoh "qris.png"
// GANTI nomor WhatsApp ini dengan nomor penjual.
// Format internasional tanpa +, contoh Indonesia: 6281234567890
const SELLER_WHATSAPP = "6285782329752";

// Edit nominal dan harga sesuai toko kamu.
const PACKAGES = [
  { robux: 100, price: 9000 },
  { robux: 200, price: 19000 },
  { robux: 300, price: 29000 },
  { robux: 400, price: 39000 },
  { robux: 500, price: 49000 },
  { robux: 600, price: 59000 },
  { robux: 700, price: 69000 },
  { robux: 800, price: 79000 },
  { robux: 900, price: 89000 },
  { robux: 1000, price: 97000, tag: "POPULER"},
  { robux: 1500, price: 147000 },
  { robux: 2000, price: 196000 }
];

const packageContainer = document.getElementById("packages");
const totalEl = document.getElementById("total");
const toast = document.getElementById("toast");
let selectedPackage = PACKAGES[2];

function rupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
}

function renderPackages() {
  packageContainer.innerHTML = PACKAGES.map((item, index) => `
    <label class="package ${index === 2 ? "selected" : ""}" data-index="${index}">
      <input type="radio" name="robux" value="${index}" ${index === 2 ? "checked" : ""}>
      ${item.tag ? `<span class="tag">${item.tag}</span>` : ""}
      <div class="robux">${item.robux.toLocaleString("id-ID")} R$</div>
      <div class="price">${rupiah(item.price)}</div>
    </label>
  `).join("");

  document.querySelectorAll(".package").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".package").forEach(x => x.classList.remove("selected"));
      card.classList.add("selected");
      const index = Number(card.dataset.index);
      selectedPackage = PACKAGES[index];
      totalEl.textContent = rupiah(selectedPackage.price);
    });
  });

  totalEl.textContent = rupiah(selectedPackage.price);
}

function setError(id, message) {
  const el = document.getElementById(id);
  el.textContent = message || "";
}

function normalizePhone(phone) {
  return phone.replace(/[^\d]/g, "").replace(/^0/, "62");
}

function validGamepassUrl(value) {
  try {
    const url = new URL(value);
    return /(^|\.)roblox\.com$/i.test(url.hostname) || /roblox\.com$/i.test(url.hostname);
  } catch {
    return false;
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

document.getElementById("orderForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phoneRaw = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const gamepass = document.getElementById("gamepass").value.trim();
  const payment = document.querySelector('input[name="payment"]:checked')?.value || "";

  setError("nameError", "");
  setError("phoneError", "");
  setError("emailError", "");
  setError("gamepassError", "");
  setError("paymentError", "");

  let valid = true;

  if (name.length < 2) {
    setError("nameError", "Nama minimal 2 karakter.");
    valid = false;
  }

  const phone = normalizePhone(phoneRaw);
  if (phone.length < 10 || phone.length > 15) {
    setError("phoneError", "Masukkan nomor WhatsApp yang valid.");
    valid = false;
  }

  if (!/^[^\s@]+@gmail\.com$/i.test(email)) {
    setError("emailError", "Gunakan alamat Gmail yang valid.");
    valid = false;
  }

  if (!validGamepassUrl(gamepass)) {
    setError("gamepassError", "Masukkan link Game Pass Roblox yang valid.");
    valid = false;
  }

  if (!payment) {
    setError("paymentError", "Pilih salah satu metode pembayaran.");
    valid = false;
  }

  if (!valid) {
    showToast("Periksa kembali data pesananmu.");
    return;
  }

  const message =
`Halo Admin ROBUX.ID 👋

Saya ingin order Robux.

🛒 DETAIL ORDER
• Nominal: ${selectedPackage.robux.toLocaleString("id-ID")} Robux
• Total: ${rupiah(selectedPackage.price)}

👤 DATA PEMBELI
• Nama: ${name}
• WhatsApp: ${phoneRaw}
• Gmail: ${email}

🎟️ GAME PASS
${gamepass}

💳 PEMBAYARAN
• Metode: ${payment}

Mohon kirim instruksi pembayaran dan konfirmasi proses order. Terima kasih!`;

  const waUrl = `https://wa.me/${SELLER_WHATSAPP}?text=${encodeURIComponent(message)}`;

  if (SELLER_WHATSAPP === "6285782329752") {
    showToast("Ganti nomor SELLER_WHATSAPP di script.js terlebih dahulu.");
    return;
  }

  window.open(waUrl, "_blank", "noopener,noreferrer");
});

renderPackages();
