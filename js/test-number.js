import { data } from "./data.js";

// -----------------------------
// Utility: shuffle array
// -----------------------------
function shuffle(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

// -----------------------------
// Extract slide number
// -----------------------------
function getSlideNumber(name) {
  return name.split(" - ")[0].trim();
}

// -----------------------------
// Build question pool
// -----------------------------
function generateQuestions(slides) {
  const questions = [];

  slides.forEach(slide => {
    const slideNumber = getSlideNumber(slide.name);

    slide.image.forEach(imageUrl => {
      questions.push({
        image: imageUrl,
        correctAnswer: slideNumber
      });
    });
  });

  return questions;
}

// -----------------------------
// Generate NUMBER options
// -----------------------------
function generateOptions(correctAnswer, allSlides) {
  const allNumbers = allSlides.map(s => getSlideNumber(s.name));
  const wrong = allNumbers.filter(n => n !== correctAnswer);

  const options = shuffle(wrong).slice(0, 3);
  options.push(correctAnswer);

  return shuffle(options);
}

// -----------------------------
// Render test
// -----------------------------
function renderTest(questions) {
  const container = document.querySelector(".test-container");
  container.innerHTML = "";

  questions.forEach((q, index) => {
    const card = document.createElement("div");
    card.className = "question-card";
    card.dataset.correct = q.correctAnswer;

    const questionText = document.createElement("h3");
    questionText.textContent = `Q${index + 1}. Identify the slide`;

    const img = document.createElement("img");
    img.src = q.image;
    img.alt = "Slide image";

    const options = generateOptions(q.correctAnswer, data.slides);
    const optionsContainer = document.createElement("div");
    optionsContainer.className = "options";

    options.forEach(option => {
      const label = document.createElement("label");
      label.className = "option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `question-${index}`;
      input.value = option;

      const span = document.createElement("span");
      span.textContent = option;

      label.appendChild(input);
      label.appendChild(span);
      optionsContainer.appendChild(label);
    });

    card.appendChild(questionText);
    card.appendChild(img);
    card.appendChild(optionsContainer);
    container.appendChild(card);
  });
}

// -----------------------------
// Scoring logic
// -----------------------------
function calculateScore() {
  const cards = document.querySelectorAll(".question-card");
  let score = 0;

  cards.forEach(card => {
    const correct = card.dataset.correct;
    const selected = card.querySelector("input:checked");

    const options = card.querySelectorAll(".option");

    options.forEach(opt => {
      const input = opt.querySelector("input");

      if (input.value === correct) {
        opt.classList.add("correct");
      }

      if (selected && input === selected && input.value !== correct) {
        opt.classList.add("wrong");
      }

      input.disabled = true;
    });

    if (selected && selected.value === correct) {
      score++;
    }
  });

  showScore(score, cards.length);
}

// -----------------------------
// Show score summary
// -----------------------------
function showScore(score, total) {
  const footer = document.querySelector(".test-footer");

  const result = document.createElement("div");
  result.className = "score-summary";
  result.textContent = `Score: ${score} / ${total}`;

  footer.prepend(result);
}

// -----------------------------
// Init
// -----------------------------
const questions = generateQuestions(data.slides);
renderTest(questions);

// -----------------------------
// Submit handler
// -----------------------------
document.getElementById("submitTest").addEventListener("click", (e) => {
  e.preventDefault();
  e.target.disabled = true;
  e.target.style.display = "none";
  calculateScore();
});
