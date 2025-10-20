// =====================
// Willy Wonka – main JS
// =====================
document.addEventListener("DOMContentLoaded", () => {
  // ---------- Helpers ----------
  function validateEmail(email, errorElement) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    errorElement.textContent = "";
    if (!email) {
      errorElement.textContent = "Email is required.";
      return false;
    } else if (!emailPattern.test(email)) {
      errorElement.textContent = "Please enter a valid email address.";
      return false;
    }
    return true;
  }

  function validatePassword(password, errorElement) {
    errorElement.textContent = "";
    if (!password) {
      errorElement.textContent = "Password is required.";
      return false;
    } else if (password.length < 8) {
      errorElement.textContent = "Password must be at least 8 characters.";
      return false;
    }
    return true;
  }

  // ---------- Auth: Login ----------
  const loginForm = document.getElementById("loginForm");
  loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    const okEmail = validateEmail(email, emailError);
    const okPass = validatePassword(password, passwordError);
    if (!(okEmail && okPass)) return;

    alert("You have successfully logged in!");
    loginForm.reset();
  });

  // ---------- Auth: Register ----------
  const registerForm = document.getElementById("registerForm");
  registerForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const confirmPassword = document.getElementById("registerConfirmPassword").value.trim();
    const phoneNumber = document.getElementById("phoneNumber").value.trim();
    const countryCode = document.getElementById("countryCode")?.value.trim(); // not validated, but kept

    const emailError = document.getElementById("registerEmailError");
    const passwordError = document.getElementById("registerPasswordError");
    const confirmPasswordError = document.getElementById("registerConfirmPasswordError");
    const phoneNumberError = document.getElementById("registerPhoneNumberError");

    confirmPasswordError.textContent = "";
    phoneNumberError.textContent = "";

    const phonePattern = /^[0-9]{6,15}$/;

    let isValid = validateEmail(email, emailError);
    isValid = validatePassword(password, passwordError) && isValid;

    if (!phoneNumber) {
      phoneNumberError.textContent = "Phone Number is required.";
      isValid = false;
    } else if (!phonePattern.test(phoneNumber)) {
      phoneNumberError.textContent = "Please enter a 6–15 digit phone number using only numbers (0–9).";
      isValid = false;
    }

    if (password !== confirmPassword) {
      confirmPasswordError.textContent = "Passwords do not match.";
      isValid = false;
    }

    if (!isValid) return;

    alert("You have successfully registered!");
    registerForm.reset();
  });

  // ---------- Random page color (optional demo button) ----------
  const colorButton = document.getElementById("colorButton");
  const colors = ["#FDE2E4","#FFC8DD","#CDB4DB","#BDE0FE","#A2D2FF","#C7B7E8","#FFFFFF"];
  colorButton?.addEventListener("click", () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = randomColor;
  });

  // ---------- Date & Time ----------
  function updateDateTime() {
    const now = new Date();
    const options = {
      year: "numeric", month: "long", day: "numeric",
      hour: "numeric", minute: "2-digit", second: "2-digit"
    };
    const el = document.getElementById("datetime");
    if (el) el.textContent = now.toLocaleString("en-US", options);
  }
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // ---------- Custom Modal ----------
  const openModalBtn = document.getElementById("openModal");
  const closeModalBtn = document.getElementById("closeModal");
  const modal = document.getElementById("myModal");
  const overlay = document.getElementById("overlay");

  function openModal(m) {
    m?.classList.add("active");
    overlay?.classList.add("active");
  }
  function closeModal(m) {
    m?.classList.remove("active");
    overlay?.classList.remove("active");
  }

  openModalBtn?.addEventListener("click", () => openModal(modal));
  closeModalBtn?.addEventListener("click", () => closeModal(modal));
  overlay?.addEventListener("click", () => closeModal(modal));

  // ---------- Contact Form ----------
  const contactForm = document.getElementById("contactForm");
  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    const nameError = document.getElementById("contactNameError");
    const emailError = document.getElementById("contactEmailError");
    const messageError = document.getElementById("contactMessageError");

    nameError.textContent = "";
    messageError.textContent = "";

    let isValid = validateEmail(email, emailError);

    if (!name) { nameError.textContent = "Name is required."; isValid = false; }
    if (!message) { messageError.textContent = "Message is required."; isValid = false; }

    if (!isValid) return;

    alert("Message sent! Thank you, " + name);
    contactForm.reset();
    closeModal(modal);
  });

  // ---------- Dark Mode Toggle ----------
  (function setupDarkMode() {
    const btn = document.getElementById("themeToggleBtn");
    const icon = document.getElementById("themeToggleIcon");
    if (!(btn && icon)) return;

    const THEME_KEY = "theme";
    const ICON_ON  = "resources/dark_on.png";   // тёмная тема включена
    const ICON_OFF = "resources/dark_off.png";  // тёмная тема выключена

    // читаем сохранённое значение или системное предпочтение
    const saved = localStorage.getItem(THEME_KEY); // 'dark' | 'light' | null
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const startMode = saved || (prefersDark ? "dark" : "light");

    function apply(mode) {
      const isDark = mode === "dark";
      document.body.classList.toggle("dark", isDark);
      btn.setAttribute("aria-pressed", String(isDark));
      icon.src = isDark ? ICON_ON : ICON_OFF;
      icon.alt = isDark ? "Disable dark mode" : "Enable dark mode";
      icon.title = icon.alt;
    }

    apply(startMode);

    btn.addEventListener("click", () => {
      const nextMode = document.body.classList.contains("dark") ? "light" : "dark";
      apply(nextMode);
      localStorage.setItem(THEME_KEY, nextMode);
    });
  })();
});
