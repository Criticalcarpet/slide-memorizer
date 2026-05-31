const slideDrop = document.getElementById("patho-slide");
const grossDrop = document.getElementById("patho-gross");
const grossContainer = document.getElementById("moving-gross");
const slideContainer = document.getElementById("moving-slides");

grossDrop.addEventListener("click", (e) => {
  slideDrop.classList.remove("selected");
  grossDrop.classList.add("selected");
  slideContainer.classList.add("hidden");
  grossContainer.classList.remove("hidden");
});

slideDrop.addEventListener("click", (e) => {
  grossDrop.classList.remove("selected");
  slideDrop.classList.add("selected");
  slideContainer.classList.remove("hidden");
  grossContainer.classList.add("hidden");
});
