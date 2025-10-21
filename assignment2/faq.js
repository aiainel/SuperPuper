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

document.addEventListener('DOMContentLoaded', setupReadMore);
function setupFAQToggles() {
  const questions = document.querySelectorAll(".faq-question");

  questions.forEach(question => {
    question.addEventListener("click", () => {
      question.classList.toggle("active");

      const answer = question.nextElementSibling;

      if (answer.style.display === "block") {
        answer.style.display = "none";
      } else {
        answer.style.display = "block";
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", setupFAQToggles);

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
