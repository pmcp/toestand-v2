

import Vue from 'vue';
import { swiper, swiperSlide } from 'vue-awesome-swiper'
let moment = require('moment');
import fbUtils from './fbUtils';
import VueObserveVisibility from 'vue-observe-visibility'
import main_utils from './main_utils'

Vue.use(VueObserveVisibility)

const calendar = {}



calendar.full = function(lang, branch) {
  new Vue({
  el: "#calApp",
  data: function () {
    return {
      loading: true,
      firstEventDoc: {},
      lastEventDoc: {},
      lang: lang,
      currentMonth: 0,
      calNavVisible: true,
      months: [],
      months: [],
      eventsinMonths: [],
      events: [],
      calendars: [],
      allCalendars: true,
      activeCal: null,
      topEvent: null,
      'isFixed': true,
    }
  },
  computed: {
    getActiveMonthClass: function (id) {
      if (id === this.activeMonth) {
        return 'activeMonth'
      }
      return;
    },
    monthsSwiper() {
      return this.$refs.monthsSwiper
    },
    calendarSwiper() {
      return this.$refs.calendarSwiper
    },
    eventsWithMonths: function () {
      let events = this.events;
      for (var i = 0, len = events.length; i < len; i++) {
        let month = events[i].month
        if (this.eventsinMonths[month] === true) {
          events[i].firstOfMonth = false;
        } else {
          events[i].firstOfMonth = true;
          this.eventsinMonths[month] = true;
        }
      }
      return events;
    }
  },
  methods: {
    loadEvents(isVisible, direction, doc, activeCal) {
      
      let vm = this;
      // console.log(isVisible, direction, doc, vm.loading)
      if(vm.loading === true) return;
      if(isVisible === false) return;
      vm.loading = true;
      
      if(vm.events.length > 0) {
      
        fbUtils.getMoreEvents(branch, direction, doc, vm.activeCal).then(function(result) {
          console.log('test')
          let oldEvents = vm.events;
          let newEventsList = [];
          if(direction === 'desc') {
            vm.firstEventDoc = result.doc;
            newEventsList = [...result.events, ...oldEvents];
          } else {
            vm.lastEventDoc = result.doc;
            newEventsList = [...oldEvents, ...result.events];
          }
          
          
          vm.events = newEventsList;
          vm.loading = false;
        })
      }
    },
    searchEvents(){
      console.log('search')
    },

    setTopEvent(isVisible, event) {
      if(isVisible) {
        this.topEvent = event.startDateToCompare
      }
    },

    loadEventsOfMonth(month) {
      let vm = this;
      vm.loading = true;
      
      const start = moment().add(vm.months.indexOf(month), 'months').format('YYYYMM') + '01'
      fbUtils.getEventsByStartDate(branch, start, vm.activeCal).then(function(value){
        vm.currentMonth = month;
        vm.lastEventDoc = value.lastDoc;
        vm.firstEventDoc = value.firstDoc;
        vm.events = [...value.events]
        vm.loading = false;
      })
    },
    localizeDate(date) {
      return moment(date).format('ddd DD.MM.YY');
    },
    checkActiveCalendar(calId) {
      for (let i = 0; i < this.calendars.length; i++) {
        if (this.calendars[i].url === calId && this.calendars[i].active === true) {
          return true;
        }
      }
      return false
    },
    visibilityChanged(isVisible, entry, month) {
      if (isVisible) { this.currentMonth = month - 1; }
    },
    pinCalNav(isVisible) {
      this.calNavVisible = isVisible
    },
    checkActiveMonth(month) {
      if(month === moment().month(this.currentMonth).format('MMMM')) return 'toestand-calendar__month--active'
    },
    getEventsByCalendar(cal){
      let vm = this;
      vm.loading = true;
      vm.activeCal = cal.url
      
      // const start = moment().add(vm.months.indexOf(month), 'months').format('YYYYMM') + '01'
      let start = moment().subtract().format('YYYYMMDD');
      
      if(vm.topEvent !== null) start = vm.topEvent;
      fbUtils.getEventsByStartDate(branch, start, vm.activeCal).then(function(value){
        // console.log(value)
        vm.lastEventDoc = value.lastDoc;
        vm.firstEventDoc = value.firstDoc;
        vm.events = [...value.events]
        vm.loading = false;
      })
    }
    // setActiveCalendars(id) {
    //   // When a calendar gets toggled, set that calendar to not active
    //   // If the "all" button gets pushed, toggle all calendars
    //   if (id === 'all') {
    //     this.allCalendars = !this.allCalendars;
    //     for (let i = 0; i < this.calendars.length; i++) {
    //       this.calendars[i].active = this.allCalendars;
    //     }
    //   } else {
    //     this.calendars[id].active = !this.calendars[id].active;
    //     // When one calendar gets toggled, check if they all are active or non active, so we can update the "all"-button
    //     // Loop through all the calenders (checkAllActive) and check if they are all active.
    //     // If so, then allCalendars is true.
    //     // The moment that one is not active, allCalendars is false.
    //     let checkAllActive = (calendars) => {
    //       let count = 0;
    //       for (let i = 0; i < calendars.length; i++) {
    //         count++
    //         if (count == calendars.length && calendars[i].active == true) {
    //           return true;
    //         }
    //         if (calendars[i].active == false) {
    //           return false;
    //         }
    //       }
    //     };
    //     this.allCalendars = checkAllActive(this.calendars) ? true : false;
    //   }
    // }
  },
  created() {
    const query = window.location.search.substring(1);
    const parameters  = main_utils.parseUrl(query);
    let start;
    
    let vm = this;
    // Set the locale of moment js based on user setting
    moment.locale(lang);
    const todayToCompare = moment().subtract().format('YYYYMMDD');

  

    if(parameters.id) {
      Promise.all([fbUtils.getCalendars(), fbUtils.getOneEvent(branch, parameters.id)]).then(function(values) {
        vm.calendars = values[0];
        vm.events.push(values[1].doc.data())
        vm.firstEventDoc = values[1].doc;
        vm.months = values[1].months;
        vm.loading = false;
        vm.loadEvents(true, 'asc', values[1].doc, this.activeCal)
        
      })
    } else {
      start = todayToCompare    
      Promise.all([fbUtils.getCalendars(), fbUtils.getEvents(branch, start, vm.activeCal)]).then(function(values) {
        vm.months = values[1].months;
        vm.currentMonth = vm.months[0];
        vm.calendars = values[0];
        let loadedEvents = values[1].events;
        vm.lastEventDoc = values[1].lastDoc;
        vm.firstEventDoc = values[1].firstDoc;
        vm.events = [...vm.events, ...loadedEvents]
        vm.loading = false;
      });
    }
    
 
  }
});
}





















calendar.weekly = function(lang, branch, cal) {
  
  new Vue({
    el: "#weeklyCalVueApp",
    components: {
      swiper,
      swiperSlide
    },
    data: function () {
      return {
        lang: lang,
        activeCal: null,
        loading: true,
        firstEventDoc: {},
        lastEventDoc: {},
        lang: lang,
        events: [],
        calendars: [],
        swiperOption: {
          preloadImages: false,
          lazy: false,
          watchSlidesVisibility: true,
          speed: 400,
          mousewheel: {
            forceToAxis: true,
            invert: true,
          },
          slidesPerView: 'auto',
          freeMode: true,
          draggable: true,
          freeMode: true,
          grabCursor: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          scrollbar: {
            el: '.swiper-scrollbar',
            hide: false
          }
        }
      }
    },
    methods: {
      localizeDate(date) {
        return moment(date).format('ddd DD.MM.YY');
      },
      loadEvents(isVisible, direction, doc) {
        let vm = this;
        if(vm.loading === true) return;
        if(isVisible === false) return;
        vm.loading = true;
        if(vm.events.length > 0) {
          
          fbUtils.getMoreEvents(branch, direction, doc, vm.activeCal).then(function(result) {
            if(direction === 'desc') {
              vm.firstEventDoc = result.doc;
              vm.events = [...result.events, ...vm.events];
            } else {
              vm.lastEventDoc = result.doc;
              vm.events = [...vm.events, ...result.events];
            }
            vm.loading = false;
          })
        }
      }
    },
    created() {
      let vm = this;
      if (cal === "") {
        vm.activeCal = null;
      } else {
        vm.activeCal = cal;
      }
      
      moment.locale(lang);
      const today = moment();
      const todayToCompare = moment().subtract().format('YYYYMMDD');
      const currentMonth = today.month();
      vm.currentMonth = currentMonth;
      fbUtils.getEvents(branch, todayToCompare, cal)
      .then(function(value) {
        let loadedEvents = value.events;
        vm.lastEventDoc = value.lastDoc;
        vm.firstEventDoc = value.firstDoc;
        vm.events = [...vm.events, ...loadedEvents]
        vm.loading = false;
      });
    }
  });
}

export default calendar;