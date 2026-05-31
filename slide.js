import slideList from './slide.json' with { type: 'json' }
import grossList from './gross.json' with {type: 'json'}

const slideContainer = document.getElementById('moving-slides')

slideList.forEach((e) => {
  const imageArrayString = JSON.stringify(e.src);
  const showArrows = e.src.length > 1;

  // 1. Generate the dots HTML dynamically based on how many images exist
  let dotsHTML = '';
  if (showArrows) {
    dotsHTML = `<div class="slider-dots">` + 
      e.src.map((_, index) => `<span class="dot ${index === 0 ? 'active' : ''}"></span>`).join('') + 
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
                src="${e.src[0]}"
                data-images='${imageArrayString}' 
                data-index="0"
              />
              ${showArrows ? `<button class="slider-btn next-btn">❯</button>` : ''}
              ${dotsHTML}
            </div>
            <span class="slide-name">${e.number}. ${e.name}</span>
          </div>`
  slideContainer.insertAdjacentHTML('beforeend', template )
})

const grossContainer = document.getElementById('moving-gross')

grossList.forEach((e) => {
  let template = `          <div class="slides">
            <div class="ribbon-slide-marker">
              <i class="ti ti-star"></i>
              <i class="ti ti-info-circle"></i>
              <i class="ti ti-square-rounded-check"></i>
            </div>
            <div class="slide-image">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png"
              />
            </div>
            <span class="slide-name">${e.number}. ${e.name}</span>
          </div>`
  grossContainer.insertAdjacentHTML('beforeend', template )
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