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
  // Footer subscription
  // ============================
const newsletter = $("#newsletter"); 
const newsletterError = $("#newsletterError"); 

newsletter.on("submit", function(e) {
    e.preventDefault();

  
    const newsletter_email = $("#newsletter-email")[0]; 

   
    if (!validateEmail(newsletter_email, newsletterError[0])) return; 

    alert("Subscribed successfully: " + newsletter_email.value);
    newsletter[0].reset();
});

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
  // Item Filtering & API Currency Conversion
  // ============================
  $("#priceFilter").on("change", filterItems);

  const productNames = [
    "Rahat 80% Cocoa Cube 275g",
    "Rahat 65% Cocoa Cube 275g",
    "Rahat 70% Cocoa Cube 275g",
    "Rahat Bar 100g",
    "Rahat 80% Bar 100g",
    "Rahat Chocolate Box",
    "Rahat Caramel"
  ];

  const suggestions = $("#suggestions");

  $("#searchInput").on("keyup", function () {
    const value = $(this).val().toLowerCase();
    suggestions.empty();

    if(value) {
      const matches = productNames.filter(name => name.toLowerCase().includes(value));
      matches.forEach(name => {
        suggestions.append(`<li class="list-group-item suggestion-item">${name}</li>`);
      });
    }

    filterItems();
  });

  $(document).on("click", ".suggestion-item", function() {
    $("#searchInput").val($(this).text());
    suggestions.empty();
    filterItems();
  });


let currentCurrency = "KZT";
let exchangeRate = 0;

const fetchRate = async () => {
  const primaryUrl = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json";
  const fallbackUrl = "https://latest.currency-api.pages.dev/v1/currencies/usd.json";

  try {
    let response = await fetch(primaryUrl);
    if (!response.ok) throw new Error("Primary failed");
    let data = await response.json();
    exchangeRate = data.usd.kzt;
  } catch {
    let response = await fetch(fallbackUrl);
    let data = await response.json();
    exchangeRate = data.usd.kzt;
  }
};


document.querySelectorAll('.card-text').forEach(el => {
  el.dataset.kzt = parseFloat(el.textContent.replace(/\s|₸|\/ pcs/g,'')); 
});

const togglePrices = () => {
  if(exchangeRate === 0) return; 

  document.querySelectorAll('.card-text').forEach(el => {
    const kzt = parseFloat(el.dataset.kzt);
    if(currentCurrency === "KZT") {
      const usd = (kzt / exchangeRate).toFixed(2);
      el.textContent = `$${usd} / pcs`;
    } else {
      el.textContent = `${kzt.toLocaleString()} ₸ / pcs`;
    }
  });

  currentCurrency = currentCurrency === "KZT" ? "USD" : "KZT";
};


fetchRate();
document.getElementById("toggleCurrency")?.addEventListener("click", togglePrices);

function filterItems() {
  const searchText = $("#searchInput").val().toLowerCase();
  const priceOption = $("#priceFilter").val();

  $(".card").each(function() {
    const title = $(this).find(".card-title").text().toLowerCase();
    const kztPrice = parseFloat($(this).find(".card-text")[0].dataset.kzt);

    let min = 0, max = Infinity;
    if(priceOption === "0-1000") { min = 0; max = 1000; }
    else if(priceOption === "1000-3000") { min = 1000; max = 3000; }
    else if(priceOption === "3000+") { min = 3000; max = Infinity; }

    const matchesSearch = title.includes(searchText);
    const matchesPrice = priceOption === "all" || (kztPrice >= min && kztPrice <= max);

    if(matchesSearch && matchesPrice) $(this).parent().show();
    else $(this).parent().hide();
  });
}


  // ============================
  // Search implementation
  // ============================
        $(".faq-question").on("click", function() {
          $(this).toggleClass("active");
          const $answer = $(this).next();

          if ($answer.css("display") === "block") {
            $answer.css("display", "none");
          } else {
            $answer.css("display", "block");
          }
      });
      $("#highlightInput").on("keyup", function () {
        let searchText = $(this).val().toLowerCase();

        $(".faq-question, .faq-answer").each(function () {
          let html = $(this).html();
          html = html.replace(/<span class="highlight">(.*?)<\/span>/g, "$1");
          $(this).html(html);
        });

        if (searchText) {
          $(".faq-question, .faq-answer").each(function () {
            let html = $(this).html();
            let regex = new RegExp(`(${searchText})`, "gi");
            html = html.replace(regex, '<span class="highlight">$1</span>');
            $(this).html(html);
          });
        }
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

// ============================
  // Sound effect
  // ============================
   const sfx  = document.getElementById("themeClickSfx");
  function playClick() {
    if (!sfx) return;
    try {
      const clone = sfx.cloneNode(true);
      clone.volume = 0.8;        
      clone.currentTime = 0;
      clone.play().catch(() => {});
    } catch (_) {}
  }

document.querySelector('.themetoggle')?.addEventListener('click', (e)=>{
  e.preventDefault();
  playClick();

  if(localStorage.getItem('theme') === 'dark'){
    localStorage.removeItem('theme');
  }else{
    localStorage.setItem('theme', 'dark');
  }
  addDarkMode();
});

function addDarkMode(){
  try{
    if(localStorage.getItem('theme') === 'dark'){
      document.querySelector('body').classList.add('dark');
      document.querySelector('.themetoggle span').textContent='dark_mode';
    }else{
    document.querySelector('body').classList.remove('dark');
    document.querySelector('.themetoggle span').textContent='light_mode';
    }
  }catch(err){}
};

addDarkMode();

// ============================
  // Language switcher and Copy button
  // ============================

  $("#MyButton").click(function(){
     $("#MyButton").css("color", "red")
  })

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
const $intro = $("#introText");
const $extra = $("#extraText");
const defaultLang="en";

if ($intro.length && $extra.length) {
  const introTextNode = $intro.contents().filter(function () {
    return this.nodeType === 3;
  })[0];
  if (introTextNode) {
    introTextNode.textContent = translations.introText[defaultLang] + " ";
  }
  $extra.text(translations.extraText[defaultLang]).css("display", "none");
  $("#readMoreBtn").text("Read More");

  $("[data-lang]").on("click", function () {
    const lang = $(this).data("lang");
    const introTextNode = $intro.contents().filter(function () {
      return this.nodeType === 3;
    })[0];
    if (introTextNode) {
      introTextNode.textContent = translations.introText[lang] + " ";
    }
    $extra.text(translations.extraText[lang]).css("display", "none");
    $("#readMoreBtn").text("Read More");
  });

  $("#readMoreBtn").on("click", function () {
    if ($extra.css("display") === "none") {
      $extra.css("display", "inline");
      $(this).text("Read Less");
    } else {
      $extra.css("display", "none");
      $(this).text("Read More");
    }
  });

  $("#copyBtn").on("click", function () {
    let textToCopy = introTextNode.textContent.trim();
    if ($extra.is(":visible")) {
      textToCopy += " " + $extra.text().trim();
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
      $("#tooltip").css("display", "inline");
      $(this).text("✔ Copied!");
      setTimeout(() => {
        $("#tooltip").css("display", "none");
        $(this).text("Copy");
      }, 1500);
    });
  });
}

  // ============================
  //   Scroll Progress Bar
  // ============================
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

// ============================
  // API Movie Info Fetcher
  // ============================
const apiKey = "260f47f"; 
const select = document.getElementById("movieSelect");
const movieInfo = document.getElementById("movieInfo");

async function fetchMovie(title) {
  const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`);
  const data = await response.json();

  if (data.Response === "True") {
    movieInfo.innerHTML = `
<div class="movie-card shadow-sm mb-3">
  <div class="row g-0 d-flex flex-column flex-md-row">
    <div class="col-md-4 d-flex">
      <img src="${data.Poster !== 'N/A' ? data.Poster : 'resources/no-poster.jpg'}"
           class="movie-card-img rounded-start"
           alt="${data.Title}">
    </div>
    <div class="col-md-8 d-flex">
      <div class="flex-grow-1 p-3 d-flex flex-column justify-content-md-center">
        <h5 class="books-card-title">${data.Title} (${data.Year})</h5>
        <p class="books-card-text"><strong>Genre:</strong> ${data.Genre}</p>
        <p class="books-card-text"><strong>Director:</strong> ${data.Director}</p>
        <p class="books-card-text"><strong>Actors:</strong> ${data.Actors}</p>
        <p class="books-card-text"><strong>Plot:</strong> ${data.Plot}</p>
        <p class="books-card-text"><strong>IMDB Rating:</strong> ⭐ ${data.imdbRating}</p>
      </div>
    </div>
  </div>
</div>
    `;
  } else {
    movieInfo.innerHTML = `<p>❌ Movie not found!</p>`;
  }
}


fetchMovie(select?.value);

select?.addEventListener("change", () => fetchMovie(select.value));
});
