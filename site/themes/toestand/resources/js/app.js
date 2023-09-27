import calendar from './calendar';
import MultiVue from 'vue-multivue';
import { swiper, swiperSlide } from 'vue-awesome-swiper'
const branch = 'eventsLive';

// Main Calendar App. Should only be loaded on the route for the calendar
let calendarAppDiv = document.getElementById("calApp");
if (calendarAppDiv) {
  const lang = calendarAppDiv.dataset.lang;
  calendar.full(lang, branch)
}

// Calendar app per project. Should only be loaded on the projectpages.
let weeklyCal = document.getElementById("weeklyCalVueApp");
if (weeklyCal) {
  const lang = weeklyCal.dataset.lang;
  const cal = weeklyCal.dataset.cal;
  calendar.weekly(lang, branch, cal)
}

new MultiVue('.vue-carouselApp', {
  components: {
    swiper,
    swiperSlide,
  },
  data: function () {
    return {
      image: null,
      showImage: false,
      swiperOptionMission: {
        preloadImages: false,
        lazy: true,
        watchSlidesVisibility: true,
        speed: 400,
        mousewheel: {
          forceToAxis: true,
          invert: true,
        },
        slidesPerView: 'auto',
        freeMode: false,
        draggable: true,
        grabCursor: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        scrollbar: {
          el: '.swiper-scrollbar',
          hide: false
        }
      },
      swiperOption: {
        speed: 400,
        mousewheel: {
          forceToAxis: true,
          invert: true,
        },
        slidesPerView: 'auto',
        freeMode: true,
        draggable: true,
        grabCursor: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        scrollbar: {
          el: '.swiper-scrollbar',
          hide: false
        }
      },
    }
  },
  
  methods: {
    clickText(text) {
      alert(text)      
    },
    clickImage(val) {
      this.showImage = true;
      this.image = val;
    },
    closePopup() {
      this.showImage = false;
      this.image = null;
    }
  },
});
