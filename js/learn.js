import { data } from './data.js';

const featureGrid = document.querySelector(".feature-grid");

// -----------------------------
// Load image - network first, fallback to IndexedDB
// -----------------------------
async function loadImage(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network fetch failed");
    const blob = await response.blob();
    await storeImage(url, blob); // store in IndexedDB
    return URL.createObjectURL(blob);
  } catch (err) {
    const blob = await getImage(url);
    if (blob) return URL.createObjectURL(blob);
    return 'images/placeholder.png'; // fallback
  }
}

// -----------------------------
// Render slides
// -----------------------------
data.slides.forEach(async (slide) => {
  const featureCard = document.createElement("div");
  featureCard.classList.add("feature-card");

  const featureImage = document.createElement("div");
  featureImage.classList.add("feature-image");

  const slider = document.createElement("div");
  slider.classList.add("slider");

  const list = document.createElement("div");
  list.classList.add("list");

  for (const url of slide.image) {
    const item = document.createElement("div");
    item.classList.add("item");

    const img = document.createElement("img");
    img.alt = "Slide image";
    img.src = await loadImage(url);

    item.appendChild(img);
    list.appendChild(item);
  }

  slider.appendChild(list);

  // Buttons
  const buttons = document.createElement("div");
  buttons.classList.add("buttons");

  const prev = document.createElement("button");
  prev.classList.add("prev");
  prev.textContent = "<";

  const next = document.createElement("button");
  next.classList.add("next");
  next.textContent = ">";

  buttons.appendChild(prev);
  buttons.appendChild(next);
  slider.appendChild(buttons);

  // Dots
  const dots = document.createElement("ul");
  dots.classList.add("dots");
  slide.image.forEach((_, index) => {
    const dot = document.createElement("li");
    if (index === 0) dot.classList.add("active");
    dots.appendChild(dot);
  });
  slider.appendChild(dots);

  featureImage.appendChild(slider);

  if (slide.image.length <= 1) {
    buttons.style.display = "none";
    dots.style.display = "none";
  }

  const title = document.createElement("h3");
  title.classList.add("feature-title");
  title.textContent = slide.name;

  featureCard.appendChild(featureImage);
  featureCard.appendChild(title);
  featureGrid.appendChild(featureCard);

  if (slide.image.length > 1) initSlider(slider);
});

// -----------------------------
// Slider function
// -----------------------------
function initSlider(slider) {
  const list = slider.querySelector(".list");
  const items = Array.from(slider.querySelectorAll(".item"));
  const dots = Array.from(slider.querySelectorAll(".dots li"));
  const prev = slider.querySelector(".prev");
  const next = slider.querySelector(".next");

  let active = 0;
  const max = items.length - 1;

  function reload() {
    const left = items[active].offsetLeft;
    list.style.left = -left + "px";
    slider.querySelector(".dots li.active")?.classList.remove("active");
    dots[active].classList.add("active");
  }

  next.addEventListener("click", () => {
    active = active >= max ? 0 : active + 1;
    reload();
  });

  prev.addEventListener("click", () => {
    active = active <= 0 ? max : active - 1;
    reload();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      active = index;
      reload();
    });
  });

  window.addEventListener("resize", reload);
  setTimeout(reload, 200);
}


// ============================================
// IMAGE ENLARGER
// ============================================
const imageEnlarger = document.querySelector(".image-enlarger");
const enlargedImage = document.querySelector(".enlarged-image");
const closeBtn = document.querySelector(".close-btn");

document.querySelectorAll(".feature-image img").forEach((img) => {
  img.addEventListener("click", () => {
    enlargedImage.src = img.src;
    imageEnlarger.style.display = "flex";
  });
});

closeBtn.addEventListener("click", () => {
  imageEnlarger.style.display = "none";
  enlargedImage.src = "";
});

imageEnlarger.addEventListener("click", (e) => {
  if (e.target === imageEnlarger) {
    imageEnlarger.style.display = "none";
    enlargedImage.src = "";
  }
});


// -----------------------------
// IndexedDB helpers
// -----------------------------
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SlideMemorizerDB', 1);
    request.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function storeImage(key, blob) {
  return openDB().then(db => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction('images', 'readwrite');
      tx.objectStore('images').put(blob, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  });
}

function getImage(key) {
  return openDB().then(db => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction('images', 'readonly');
      const request = tx.objectStore('images').get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  });
}

