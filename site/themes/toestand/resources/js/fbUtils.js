// Get Calendars
// const db  = require('./fb');
import db from './fb';
const fbUtils = {}

let moment = require('moment');


Array.prototype.rotate = (function() {
  var unshift = Array.prototype.unshift,
      splice = Array.prototype.splice;

  return function(count) {
      var len = this.length >>> 0,
          count = count >> 0;

      unshift.apply(this, splice.call(this, count % len, len));
      return this;
  };
})();



// TODO: Change into: get calendars where a specific user is invited for
fbUtils.getCalendars = function() {
  return new Promise(function (resolve, reject){
    db
      .collection("calendars")
      .where("active", "==", true)
      .orderBy('order')
      .get()
      .then(function (querySnapshot) {
        let calendars = []
        querySnapshot.forEach(function (doc) {
          calendars.push(doc.data())
          if(querySnapshot.size === calendars.length) resolve(calendars)
        
        // vm.calendars.push(doc.data());
        });
      })
      .catch(function (error) {
        reject(error)
      });
  });
}

// TODO: combine getEvents and getMoreEvents
fbUtils.getEvents = function(branch, start, cal) {
  return new Promise(function (resolve, reject){
    let events = [];
    let months = [];

    let firstDoc = {};
    let lastDoc = {};
    
    let query = db.collection(branch);
    
    if(cal !== null && cal.length > 0) query = query.where('calendar', '==', cal)
    query.where('live', '==', true )
    // .where('confirmed', '==', true )
    .orderBy('startDateToCompare', 'asc')
    .orderBy('beginTime', 'asc')
    .orderBy('id', 'asc')
    .startAt(start)
    .limit(80)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function(doc) {
        
        if(events.length === 0) {
          firstDoc = doc
          months = moment.months().rotate((doc.data().month)-1)
        }
        events = [...events, doc.data()]
        if(events.length === querySnapshot.size) {
          lastDoc = doc
          resolve({events, firstDoc, lastDoc, months})
        }
      });
    }).catch(function (error) {
      console.log(error)
      reject(error)
    });
  });
}


fbUtils.getMoreEvents = function(branch, direction, refDoc, cal) {
  return new Promise(function (resolve, reject){
    let events = [];
    let query = db.collection(branch);
    if(cal !== null && cal.length > 0) {
      
      query  = query.where('calendar', '==', cal)
    }
    query.where('live', '==', true )
      .where('confirmed', '==', true )
      .orderBy('startDateToCompare', direction)
      .orderBy('beginTime', direction)
      .startAfter(refDoc)
      .limit(10)
      .get()
      .then(function (querySnapshot) {
        

        
        querySnapshot.forEach(function(doc) {
        
          events = [...events, doc.data()]
          
          if(events.length === querySnapshot.size) {
            if(direction === 'desc') {
             events.reverse(); 
            }
            resolve({events, direction, doc})
          }
        });
      })
      .catch(function (error) {
        console.log(error)
        reject(error)
      });
  });
}

 
fbUtils.getOneEvent = function(branch, eventId) {  
  return new Promise(function (resolve, reject){
    db.collection(branch).doc(eventId).get().then( (doc ) => {

      let months = moment.months().rotate((doc.data().month)-1)    
      console.log(months)
      resolve({doc, months})
    }).catch( (error) => { })
  });
}


fbUtils.getEventsByStartDate = function(branch, start, cal) {
  console.log(branch, start, cal, cal !== null && cal.length > 0);
  return new Promise(function (resolve, reject){
    let events = [];
    let months = [];
    let firstDoc = {};
    let lastDoc = {};
    
    
    
    if(cal !== null && cal.length > 0) {
      let query = db.collection(branch)
      .where('calendar', '==', cal)
      .where('live', '==', true )
      .where('confirmed', '==', true )
      .where('startDateToCompare', '>=', start )
      .orderBy('startDateToCompare', 'asc')
      .orderBy('beginTime', 'asc')
      .orderBy('id', 'asc')
      .limit(10)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function(doc) {
          events = [...events, doc.data()]
          if(events.length === querySnapshot.size) {
            lastDoc = doc
            resolve({events, firstDoc, lastDoc})
          }
        });
      }).catch(function (error) {
        console.log(error)
        reject(error)
      });
    } else {
      let   query = db.collection(branch)
      .where('live', '==', true )
      .where('confirmed', '==', true )
      .where('startDateToCompare', '>=', start )
      .orderBy('startDateToCompare', 'asc')
      .orderBy('beginTime', 'asc')
      .orderBy('id', 'asc')
      .limit(10)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function(doc) {
          events = [...events, doc.data()]
          if(events.length === querySnapshot.size) {
            lastDoc = doc
            resolve({events, firstDoc, lastDoc})
          }
        });
      }).catch(function (error) {
        console.log(error)
        reject(error)
      });
    }
    
    

  });
}


export default fbUtils;



