import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js@7.4.0/dist/fuse.mjs";
import slideList from './slide.json' with { type: 'json' }

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
            let template = `          <div class="slides">
            <!--<div class="slide-number">${element.item.number}</div>-->
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
            <span class="slide-name">${element.item.number}. ${element.item.name}</span>
          </div>`
  slideContainer.insertAdjacentHTML('beforeend', template )
          });
    }
})
