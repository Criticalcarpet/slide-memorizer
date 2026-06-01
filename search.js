import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js@7.4.0/dist/fuse.mjs";
import slideList from './slide.json' with { type: 'json' }
const grossContainer = document.getElementById('moving-gross')

const inputItem = document.getElementById('search-input')
const slideContainer = document.getElementById('moving-slides')
inputItem.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const fuse = new Fuse(slideList, {
            keys: ['name', 'number']
          })
        
          const results = fuse.search(e.target.value)
          console.log(results)
          slideContainer.innerHTML= ''
          results.forEach(element => {
            const imageArrayString = JSON.stringify(element.item.src);
  const showArrows = element.item.src.length > 1;

  // 1. Generate the dots HTML dynamically based on how many images exist
  let dotsHTML = '';
  if (showArrows) {
    dotsHTML = `<div class="slider-dots">` + 
      element.item.src.map((_, index) => `<span class="dot ${index === 0 ? 'active' : ''}"></span>`).join('') + 
    `</div>`;
  }

  let template = `          <div class="slides">
            <div class="ribbon-slide-marker">
              <i class="ti ti-star"></i>
              <i class="ti ti-info-circle"></i>
              <i class="ti ti-square-rounded-check"></i>
            </div>
            <div class="slide-image">
            ${showArrows ? `<button class="slider-btn prev-btn">❮</button>` : ''}
              <img
                src="${element.item.src[0]}"
                data-images='${imageArrayString}' 
                data-index="0"
              />
              ${showArrows ? `<button class="slider-btn next-btn">❯</button>` : ''}
              ${dotsHTML}
            </div>
            <span class="slide-name">${element.item.number}. ${element.item.name}</span>
          </div>`
  slideContainer.insertAdjacentHTML('beforeend', template )
          });
    }
})

// 3. Extracted handler to keep things DRY (Don't Repeat Yourself)
const handleSliderClick = (e) => {
  const btn = e.target;
  
  if (!btn.classList.contains('slider-btn')) return;

  const slideImgContainer = btn.closest('.slide-image');
  const img = slideImgContainer.querySelector('img');

  if (!img._images) {
    img._images = JSON.parse(img.getAttribute('data-images'));
    img._index = parseInt(img.getAttribute('data-index'), 10) || 0;
  }

  const totalImages = img._images.length;
  if (btn.classList.contains('next-btn')) {
    img._index = (img._index + 1) % totalImages;
  } else {
    img._index = (img._index - 1 + totalImages) % totalImages;
  }

  img.src = img._images[img._index];

  // 4. Update the active dot class visually within this specific card
  const dots = slideImgContainer.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === img._index);
  });
};

// 5. Attach listener to slide container and conditionally to gross container
document.getElementById('moving-slides').addEventListener('click', handleSliderClick);

if (grossContainer) {
  grossContainer.addEventListener('click', handleSliderClick);
}