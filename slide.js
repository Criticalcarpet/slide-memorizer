import slideList from './slide.json' with { type: 'json' }

const slideContainer = document.getElementById('moving-slides')
/**
 *           <div class="slides">
            <!--<div class="slide-number">Slide 01</div>-->
            <div class="ribbon-slide-marker">
              <i class="ti ti-star"></i>
              <i class="ti ti-info-circle"></i>
              <i class="ti ti-square-rounded-check"></i>
            </div>
            <div class="slide-image">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-6xXO7DsQ747UNVIJvDGOjgLu_w0G5mOPXg&s"
              />
            </div>
            <span class="slide-name">Name of the Slide</span>
          </div>
 */
slideList.forEach((e) => {
  console.log(e)
  let template = `          <div class="slides">
            <!--<div class="slide-number">${e.number}</div>-->
            <div class="ribbon-slide-marker">
              <i class="ti ti-star"></i>
              <i class="ti ti-info-circle"></i>
              <i class="ti ti-square-rounded-check"></i>
            </div>
            <div class="slide-image">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-6xXO7DsQ747UNVIJvDGOjgLu_w0G5mOPXg&s"
              />
            </div>
            <span class="slide-name">${e.number}. ${e.name}</span>
          </div>`
  slideContainer.insertAdjacentHTML('beforeend', template )
})