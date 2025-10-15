 document.addEventListener("DOMContentLoaded", function () {
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

    const loginForm = document.getElementById("loginForm");
    loginForm?.addEventListener("submit", function (event) {
      event.preventDefault(); 

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      const emailError = document.getElementById("emailError");
      const passwordError = document.getElementById("passwordError");

      const isEmailValid = validateEmail(email, emailError);
      const isPasswordValid = validatePassword(password, passwordError);

        const isValid = isEmailValid && isPasswordValid;

        if (!isValid) return;
        
        alert("You have successfully logged in!");
        loginForm.reset();
    });



    const registerForm = document.getElementById("registerForm");
    registerForm?.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("registerEmail").value.trim();
      const password = document.getElementById("registerPassword").value.trim();
      const confirmPassword = document.getElementById("registerConfirmPassword").value.trim();
      const phoneNumber = document.getElementById("phoneNumber").value.trim();
      const countryCode = document.getElementById("countryCode").value.trim();

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

const openButton = document.querySelector('[data-modal-target]');
const modal = document.querySelector(openButton.dataset.modalTarget);
const closeButton = document.querySelector('[data-close-button]');
const overlay = document.getElementById('overlay');

openButton?.addEventListener('click', () => openModal(modal));
closeButton?.addEventListener('click', () => closeModal(modal));
overlay?.addEventListener('click', () => closeModal(modal));

function openModal(modal) {
  modal.classList.add('active');
  overlay.classList.add('active');
}

function closeModal(modal) {
  modal.classList.remove('active');
  overlay.classList.remove('active');
}


  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    const nameError = document.getElementById("contactNameError");
    const emailError = document.getElementById("contactEmailError");
    const messageError = document.getElementById("contactMessageError");

    nameError.textContent = "";
    messageError.textContent = "";

    let isValid = validateEmail(email, emailError);

    if (!name) {
      nameError.textContent = "Name is required.";
      isValid = false;
    }

    if (!message) {
      messageError.textContent = "Message is required.";
      isValid = false;
    }

    if (!isValid) return;

    alert('Message sent! Thank you, ' + name);
    contactForm.reset();
    closeModal(document.getElementById('contactModal'));
}); 
// Date and Time Display
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


// Modal Handling
const openButton = document.getElementById('openModal');
const closeButton = document.getElementById('closeModal');
const modal = document.getElementById('myModal');
const overlay = document.getElementById('overlay');

if (!(openButton && closeButton && modal && overlay)) return;

openButton.addEventListener('click', () => openModal(modal, overlay));
closeButton.addEventListener('click', () => closeModal(modal, overlay));
overlay.addEventListener('click', () => closeModal(modal, overlay));

function openModal(modal, overlay) {
  modal.classList.add('active');
  overlay.classList.add('active');
}

function closeModal(modal, overlay) {
  modal.classList.remove('active');
  overlay.classList.remove('active');
}


// Contact Form Handling
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    const nameError = document.getElementById("contactNameError");
    const emailError = document.getElementById("contactEmailError");
    const messageError = document.getElementById("contactMessageError");

    nameError.textContent = "";
    messageError.textContent = "";

    let isValid = validateEmail(email, emailError);

    if (!name) {
      nameError.textContent = "Name is required.";
      isValid = false;
    }

    if (!message) {
      messageError.textContent = "Message is required.";
      isValid = false;
    }

    if (!isValid) return;

    alert('Message sent! Thank you, ' + name);
    contactForm.reset();
    closeModal(modal, overlay);
}); 
});
