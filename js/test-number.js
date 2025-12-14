import { data } from "./data.js";

/* -----------------------------
   Helpers
----------------------------- */

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function extractNumber(slideName) {
  // "07 - Lobar Pneumonia" → "07"
  return slideName.split(" - ")[0];
}

/* -----------------------------
   Question generation
----------------------------- */

const container = document.getElementById("questionContainer");
const slides = shuffle(data.slides); // no repeats, all slides

slides.forEach((slide, index) => {
  const correctNumber = extractNumber(slide.name);

  // get wrong options (numbers from other slides)
  const wrongOptions = shuffle(
    data.slides
      .filter((s) => s.id !== slide.id)
      .map((s) => extractNumber(s.name))
  ).slice(0, 3);

  const options = shuffle([correctNumber, ...wrongOptions]);

  // random image from slide
  const imageUrl = slide.image[Math.floor(Math.random() * slide.image.length)];

  // ---- DOM ----
  const qDiv = document.createElement("div");
  qDiv.className = "question";

  qDiv.innerHTML = `
    <p><strong>Q${index + 1}. Identify the slide number</strong></p>
    <img src="${imageUrl}" alt="Slide image" style="max-width:100%; height:auto;" />

    ${options
      .map(
        (opt) => `
      <label>
        <input type="radio" name="q${index}" value="${opt}" />
        ${opt}
      </label>
      <br/>
    `
      )
      .join("")}
  `;

  // store correct answer
  qDiv.dataset.correct = correctNumber;

  container.appendChild(qDiv);
});

/* -----------------------------
   Submit + scoring
----------------------------- */

document.getElementById("testForm").addEventListener("submit", (e) => {
  e.preventDefault();

  let score = 0;
  const questions = document.querySelectorAll(".question");

  questions.forEach((q, index) => {
    const selected = q.querySelector(`input[name="q${index}"]:checked`);
    if (selected && selected.value === q.dataset.correct) {
      score++;
    }
  });

  document.getElementById(
    "result"
  ).textContent = `Score: ${score} / ${questions.length}`;
});
