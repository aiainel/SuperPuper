$(document).ready(function() {
   // ============================
  // Email Validation
  // ============================
    function validateEmail(email, errorElement) {
      
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        const value = email.value.trim();
          errorElement.textContent = "";

          if (!value) {
            errorElement.textContent = "Email is required.";
            email.classList.add("is-invalid");
            return false;
          } else if (!emailPattern.test(value)) {
            errorElement.textContent = "Please enter a valid email address.";
            email.classList.add("is-invalid");
            return false;
          }
          email.classList.remove("is-invalid");
          return true;
    }
  // ============================
  // Password Validation
  // ============================
    function validatePassword(password, errorElement) {
        errorElement.textContent = "";
        const value = password.value.trim();
        
        if (!value) {
            errorElement.textContent = "Password is required.";
            password.classList.add("is-invalid");
            return false;
        } else if (value.length < 8) {
            errorElement.textContent = "Password must be at least 8 characters.";
            password.classList.add("is-invalid");
            return false;
        }
        password.classList.remove("is-invalid");
        return true;
    }


  // ============================
  // Login Form
  // ============================
  const loginForm = $("#loginForm");

  if (loginForm.length) {
    loginForm.on("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("email");
      const password = document.getElementById("password");
      const emailError = document.getElementById("emailError");
      const passwordError = document.getElementById("passwordError");
      const button = $("#submitBtn");

      
      const okEmail = validateEmail(email, emailError);
      const okPass = validatePassword(password, passwordError);

      if (!(okEmail && okPass)) return;

     
      button.prop("disabled", true);
      button.html('<span class="spinner"></span> Please wait...');

      
      setTimeout(function () {
        button.prop("disabled", false);
        button.html("Submit");

        
        loginForm[0].reset();

        showNotification("✅ You have successfully logged in!");
      }, 2000);
    });
  }

function showNotification(message) {
  const notification = $("#notification");
  notification.text(message).addClass("show");

  setTimeout(() => {
    notification.removeClass("show");
  }, 4000);
}

// ============================
  // Lazy Load Images
  // ============================
function loadImage(elem){
    let url = $(elem).data("src");
    if (!url) return;
    let newImg = new Image();
    newImg.onload = function(){
      $(elem).attr("src", url);
      $(elem).removeClass("lazy");
      console.log("Loaded:", url);
    };
    newImg.onerror = function(){
      console.warn("Failed to load:", url);
    };
    newImg.src = url;
  }

 
  $('#carouselControls .carousel-item.active img.lazy').each(function(){
    loadImage(this);
  });

  
  $('#carouselControls').on('slide.bs.carousel', function(e){
    $(e.relatedTarget).find('img.lazy').each(function(){
      loadImage(this);
    });
  });
// ============================
  // Registration Form (Multi-step)
  // ============================
  const registerForm = document.getElementById("registerForm");
  const tabs = document.getElementsByClassName("tab");

  if (registerForm && tabs.length > 0) {
    let currentTab = 0;
    showTab(currentTab);

    document.getElementById("nextBtn")?.addEventListener("click", () => nextPrev(1, showTab));
    document.getElementById("prevBtn")?.addEventListener("click", () => nextPrev(-1, showTab));

    function showTab(n) {
      if (!tabs[n]) return;
      Array.from(tabs).forEach((tab, index) => {
        tab.classList.toggle("d-none", index !== n);
      });

      const prevBtn = document.getElementById("prevBtn");
      const nextBtn = document.getElementById("nextBtn");

      prevBtn.style.display = n === 0 ? "none" : "inline-block";
      nextBtn.innerHTML = n === tabs.length - 1 ? "Submit" : "Next";

      fixStepIndicator(n);
    }

    function nextPrev(n, callback) {
      if (n === 1 && !validateForm(currentTab)) return false;
      if (n === 1) document.getElementsByClassName("step")[currentTab].classList.add("finish");

      tabs[currentTab].classList.add("d-none");
      currentTab += n;

      if (currentTab >= tabs.length) {
        registerForm.submit();
        return false;
      }

      callback(currentTab);
    }

    function validateForm(tabIndex) {
      const tab = tabs[tabIndex];
      const inputs = tab.getElementsByTagName("input");
      let valid = true;

      for (let input of inputs) {
        const fieldLabel = input.getAttribute("data-label");
        const errorEl = document.getElementById(input.id + "Error");
        if (errorEl) errorEl.textContent = "";

        if (input.value.trim() === "") {
          if (errorEl) errorEl.textContent = `${fieldLabel || "This field"} is required.`;
          input.classList.add("is-invalid");
          valid = false;
          continue;
        } else {
          input.classList.remove("is-invalid");
        }

        if (input.id === "registerEmail") {
          valid = validateEmail(input, errorEl);
        }

        if (input.id === "registerPassword") {
          valid = validatePassword(input, errorEl);
        }

        if (input.id === "registerConfirmPassword") {
          const password = document.getElementById("registerPassword").value.trim();
          if (input.value.trim() !== password) {
            if (errorEl) errorEl.textContent = "Passwords do not match.";
            input.classList.add("is-invalid");
            valid = false;
          }
        }

        if (input.id === "phoneNumber") {
          const phonePattern = /^[0-9]{6,15}$/;
          if (!phonePattern.test(input.value.trim())) {
            if (errorEl) errorEl.textContent = "Enter a 6–15 digit phone number (0–9 only).";
            input.classList.add("is-invalid");
            valid = false;
          }
        }
      }

      return valid;
    }

    function fixStepIndicator(n) {
      const steps = document.getElementsByClassName("step");
      for (let step of steps) step.classList.remove("active");
      if (steps[n]) steps[n].classList.add("active");
    }

    registerForm?.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("✅ You have successfully registered!");
      registerForm.reset();
      currentTab = 0;
      showTab(currentTab);
    });
  }


// ============================
  // Navigation Bar Keyboard Accessibility
  // ============================
  const navItems = document.querySelectorAll(".nav-item");
  const links = document.querySelectorAll(".nav-item a");
  let currentIndex = 0;

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      currentIndex = (currentIndex + 1) % navItems.length;
      links[currentIndex].focus();
    } else if (event.key === "ArrowLeft") {
      currentIndex = (currentIndex - 1 + navItems.length) % navItems.length;
      links[currentIndex].focus();
    } else if (event.key === "Enter") {
      
      links[currentIndex].click();
    }

    links.forEach((link) => link.classList.remove("active"));
    links[currentIndex].classList.add("active");
  });

const backToTop = document.getElementById("backToTop");

backToTop?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

const tours = document.querySelectorAll(".classic_tour, .deluxe_tour, .vip_tour");

tours?.forEach(tour => {
  tour.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";

  tour.addEventListener("mouseenter", () => {
    tour.style.cursor = "pointer";
    tour.style.transform = "scale(1.05)";
    tour.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)";
  });

  tour.addEventListener("mouseleave", () => {
    tour.style.transform = "scale(1)";
    tour.style.boxShadow = "none";
  });
});


// ============================
  // Background Color Changer
  // ============================
    const button = document.getElementById("colorButton");
  const colors = [
    "#FDE2E4",
    "#FFC8DD",
    "#CDB4DB",
    "#BDE0FE",
    "#A2D2FF",
    "#C7B7E8",
    "#FFFFFF"
  ];

  button?.addEventListener("click", function () {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = randomColor;
  });

// ============================
  // Date and Time Display
  // ============================
  function updateDateTime() {
    const now = new Date();
    const options = { 
      year: 'numeric', month: 'long', day: 'numeric', 
      hour: 'numeric', minute: '2-digit', second: '2-digit' 
    };
    document.getElementById('datetime').textContent = now.toLocaleString('en-US', options);
  }

  updateDateTime();
  setInterval(updateDateTime, 1000);

// ============================
  // Tour Booking System
  // ============================

  let selectedTour = null; 
  const Tours = {
  classic: {
    name: "Classic Tour",
    price: 299,
    duration: "3–4 hours",
    book() {
      alert(`You booked ${this.name} for $${this.price} (${this.duration})!`);
    }
  },
  deluxe: {
    name: "Deluxe Tour",
    price: 599,
    duration: "5–6 hours",
    book() {
      alert(`You booked ${this.name} for $${this.price} (${this.duration})!`);
    }
  },
  vip: {
    name: "VIP Tour",
    price: 799,
    duration: "Full day",
    book() {
      alert(`You booked ${this.name} for $${this.price} (${this.duration})!`);
    }
  }
};

function openModal() {
  const modal = document.getElementById('myModal');
  const overlay = document.getElementById('overlay');
  if (!modal || !overlay) return; 
  modal.classList.add('active');
  overlay.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('myModal');
  const overlay = document.getElementById('overlay');
  if (!modal || !overlay) return; 
  modal.classList.remove('active');
  overlay.classList.remove('active');
}


document.getElementById('closeModal')?.addEventListener('click', closeModal);
document.getElementById('overlay')?.addEventListener('click', closeModal);

document.querySelectorAll('.tour-button')?.forEach(btn => {
  btn.addEventListener('click', () => {
    const tourType = btn.closest('[data-type]')?.dataset.type;
    selectedTour = tourType;
    openModal();
  });
});

document.getElementById('openModal')?.addEventListener('click', openModal);


// Contact form
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', function (e) {
  e.preventDefault();

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');

  const nameError = document.getElementById("contactNameError");
  const emailError = document.getElementById("contactEmailError");
  const messageError = document.getElementById("contactMessageError");

  nameError.textContent = "";
  messageError.textContent = "";
  emailError.textContent = "";

  let isValid = validateEmail(emailInput, emailError);

  if (!nameInput.value.trim()) {
    nameError.textContent = "Name is required.";
    nameInput.classList.add("is-invalid");
    isValid = false;
  }

  if (!messageInput.value.trim()) {
    messageError.textContent = "Message is required.";
    messageInput.classList.add("is-invalid");
    isValid = false;
  }

  const inputs = [nameInput, emailInput, messageInput];
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('is-invalid'); 
      const errorElement = document.getElementById(input.id + "Error");
      if (errorElement) errorElement.textContent = ""; 
    });
  });

if (!isValid) return;

if (typeof Tours !== "undefined" && selectedTour) {
  switch (selectedTour) {
    case "classic":
      Tours.classic.book();
      break;
    case "deluxe":
      Tours.deluxe.book();
      break;
    case "vip":
      Tours.vip.book();
      break;
    default:
      alert("Please select a tour before submitting!");
  }
}

alert("Thank you for contacting us, " + nameInput.value.trim() + "!");
contactForm.reset();
closeModal();

});

// ========= Тёмная тема =========
(function setupDarkMode() {
  const btn  = document.getElementById("themeToggleBtn");
  const icon = document.getElementById("themeToggleIcon");
  const sfx  = document.getElementById("themeClickSfx");
  if (!(btn && icon)) return;

  const THEME_KEY = "theme";
  const ICON_ON  = "resources/dark_on.png";   
  const ICON_OFF = "resources/dark_off.png";  

  
  function playClick() {
    if (!sfx) return;
    try {
      
      const clone = sfx.cloneNode(true);
      clone.volume = 0.8;        
      clone.currentTime = 0;
      clone.play().catch(() => {});
    } catch (_) {}
  }

  const saved = localStorage.getItem(THEME_KEY);
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
    playClick(); 
    const nextMode = document.body.classList.contains("dark") ? "light" : "dark";
    apply(nextMode);
    localStorage.setItem(THEME_KEY, nextMode);
  });
})();

// ========= Переключатель языков =========
const langButtons = document.querySelectorAll("[data-lang]");

langButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const lang = btn.getAttribute("data-lang");

    const intro = document.getElementById("introText");
    const extra = document.getElementById("extraText");

    if (!intro || !extra) return;

    intro.childNodes[0].textContent = translations.introText[lang] + " ";
    extra.textContent = translations.extraText[lang];
  });
});

document.addEventListener("DOMContentLoaded", () => {
  setupReadMore();

 
  const defaultLang = "en";
  document.getElementById("introText").textContent = translations.introText[defaultLang];
  document.getElementById("extraText").textContent = translations.extraText[defaultLang];
});



const translations = {
  introText: {
    en: "Willy Wonka’s imagination didn’t just stop at chocolate — it grew into a world of wonder.",
    ru: "Воображение Вилли Вонки не ограничивалось шоколадом — оно выросло в мир чудес.",
    kz: "Вилли Вонканың қиялы тек шоколадта тоқтап қалған жоқ — ол ғажайып әлемге ұласты."
  },
  extraText: {
    en: "His factory was more than a business — it was a dream come true, a place where ideas took shape in sugar and color. Every candy had a story, and every visitor left with a sparkle of inspiration.",
    ru: "Его фабрика была больше, чем бизнес — это была мечта, воплощённая в жизнь, место, где идеи оживали в сахаре и цвете. Каждая конфета имела свою историю, и каждый посетитель уходил с искрой вдохновения.",
    kz: "Оның фабрикасы тек кәсіп қана емес — ол орындалған арман болды, идеялар қант пен түсте қалыптасатын орын. Әр тәттінің өз оқиғасы бар, әр келуші шабыттың жарқылымен кетеді."
  }
};


const showTimeBtn = document.getElementById("showTimeBtn");
const timeDisplay = document.getElementById("timeDisplay");

 
  showTimeBtn?.addEventListener("click", () => {
    const currentTime = new Date().toLocaleTimeString();
    timeDisplay.textContent = "Текущее время: " + currentTime;
  });

 
  document.addEventListener("keydown", (event) => {
    if (event.key && event.key.toLowerCase() === "t") {
      const currentTime = new Date().toLocaleTimeString();
      timeDisplay.textContent = "Вы нажали T! Время: " + currentTime;
    }
  });

  function setupReadMore() {
  const readMoreBtn = document.getElementById('readMoreBtn');
  const extraText = document.getElementById('extraText');

  readMoreBtn.addEventListener('click', function() {
    if (extraText.style.display === 'none') {
      extraText.style.display = 'inline';
      readMoreBtn.textContent = 'Read Less';
    } else {
      extraText.style.display = 'none';
      readMoreBtn.textContent = 'Read More';
    }
  });
}
 
  (function(){
    var $bar = $('#scrollProgress .bar');
    if (!$bar.length) return;
    var vertical = $('#scrollProgress').hasClass('vertical');
    var ticking = false;
    function update() {
      ticking = false;
      var doc = document.documentElement;
      var st = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
      var sh = doc.scrollHeight - doc.clientHeight;
      var p = sh > 0 ? (st / sh) * 100 : 0;
      if (vertical) {
        $bar.css('height', p + '%').attr('aria-valuenow', Math.round(p));
      } else {
        $bar.css('width', p + '%').attr('aria-valuenow', Math.round(p));
      }
    }
    function onScroll(){
      if(!ticking){
        requestAnimationFrame(update);
        ticking = true;
      }
    }
    $(window).on('scroll resize', onScroll);
    update();
  })();

  (function(){
    var $counters = $('.countup');
    if (!$counters.length) return;

    function animateNumber($el){
      if ($el.data('counted')) return;
      $el.data('counted', true);
      var target = parseFloat($el.data('count')) || 0;
      var duration = parseInt($el.data('duration'),10) || 1500;
      var suffix = $el.data('suffix') || '';
      var start = 0;
      var t0 = null;
      function tick(ts){
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = Math.floor(start + (target - start) * eased);
        $el.text(val.toLocaleString() + suffix);
        if (p < 1) requestAnimationFrame(tick);
        else $el.text(Math.round(target).toLocaleString() + suffix);
      }
      requestAnimationFrame(tick);
    }

    if ('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting){
            animateNumber($(entry.target));
            io.unobserve(entry.target);
          }
        });
      }, {threshold: 0.35});
      $counters.each(function(){ io.observe(this); });
    } else {
      function check(){
        var wt = $(window).scrollTop();
        var wb = wt + $(window).height();
        $counters.each(function(){
          var $el = $(this);
          if ($el.data('counted')) return;
          var top = $el.offset().top;
          var bottom = top + $el.outerHeight();
          if (bottom >= wt && top <= wb) animateNumber($el);
        });
      }
      $(window).on('scroll resize load', check);
      check();
    }
  })();

});
