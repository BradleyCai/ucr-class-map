var CLIENT_ID = 'CLIENT_ID';
var SCOPES = ["https://www.googleapis.com/auth/calendar"];
var TIME_ZONE = 'America/Los_Angeles';
var courses = [];
var acadTerm = [];


// Get client ID from resources/api.json
function getClientID() {
  xhr = new XMLHttpRequest();

  // Wait till we get a response
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var result = JSON.parse(xhr.response);
      CLIENT_ID = result.client_id;
      return result.client_id;
    }
  }
  xhr.open('GET','resources/api.json',true)
  xhr.send();
}


// Retuns a string for days of the week in RFC5545 RRULE compliant form
function daysToString(days) {
  var daysArr = ['MO','TU','WE','TH','FR','SA'];
  var dayString = '';
  var i;

  for (i = 0; i < days.length; i++) {
    if (days[i] == true) {
      dayString += daysArr[i];
      dayString += ',';
    }

    // remove trailing unnecessary commas that were added (if any)
    if (dayString[dayString.length] == dayString.lastIndexOf(',')) {
      daysString.replace(/,$/,'');
    }
  }

  return dayString;
}

// Reinserts leading and trailing 0's where needed
function fixZeroTimes(data) {
  var i = 0;
  for (; i < data.length; i++) {
    // fix trailing 0's
    data[i].min1 = (data[i].min1 == 0) ? '00' : data[i].min1;
    data[i].min2 = (data[i].min2 == 0) ? '00' : data[i].min2;
    // fix leading 0's
    data[i].hour1 = (data[i].hour1 < 10) ? '0' + data[i].hour1 : data[i].hour1;
    data[i].hour2 = (data[i].hour2 < 10) ? '0' + data[i].hour2 : data[i].hour2;
  }
  /* console.log('Times fixed!'); */
  return data;
}

// Gets a descriptive name for the building from js/UcrBuildings.js
function getRoomInfo(data) {
  if (data.bldg == "ONLINE" && data.room == "COURSE") {
    return 'Online Course';
  }
  else
    return getBuildingDesc(data.bldg) + ' ' + data.room;
}

function addToGCal(data) {
  data = fixZeroTimes(data);
  var i = 0;
  for (; i < data.length; i++) {
    var res = {
    /* course = { */
      'term' : data[i].quarter,
      'year': data[i].year,
      'course': data[i].nameID,
      'desc' : data[i].name,
      'start' : data[i].hour1 + ':' + data[i].min1,
      'end' : data[i].hour2 + ':' + data[i].min2,
      'days' : daysToString(data[i].days),
      'location' : '(' + data[i].bldg + ') ' + getRoomInfo(data[i])
    };

    /* console.log(course); */
    /* console.log(res); */
    /* console.log('\n'); */
    courses.push(res);
  }
  checkGAuth();
}

function getQuarterDates(quarter,year) {
  var api_url = "https://ucr-term-dates.appspot.com/" + quarter + '?year=' +
    year;
  xhr2 = new XMLHttpRequest();

  // Wait till we have the academic term start/end dates
  xhr2.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var result = JSON.parse(xhr2.response);
      /* console.log(xhr2.status); */
      /* console.log(xhr2.response); */
      acadTerm.push(result);
    }
  }
  xhr2.open('GET',api_url,true);
  xhr2.send();
  /* console.log('Sent request: ' + api_url); */
}

/**
 * Check if current user has authorized this application.
 */
function checkGAuth() {
  gapi.auth.authorize(
      {
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': true

      }, handleAuthResult
      );
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  var authModal = $('#g-auth-modal');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    authModal.modal('hide');
    loadCalendarApi();

  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authModal.modal('show');
  }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
  gapi.auth.authorize(
      {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
      handleAuthResult
      );
  return false;
}

/**
 * Load Google Calendar client library. Insert events once client
 * library is loaded.
 */
function loadCalendarApi() {
  if (courses.length > 0)
    gapi.client.load('calendar', 'v3', insertEvent);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function insertEvent() {
  var termDates = acadTerm.pop();
  var numCourses = courses.length;
  console.log(CLIENT_ID);
  var coursesAdded = 0;
  /* console.log("insert event..."); */
// create event
  var REMINDER_MINUTES = 10;
  var Q_DATETIME = 'T000000Z';
  termDates.end += Q_DATETIME;
  console.log(termDates.start);
  console.log(termDates.end);
  console.log(termDates);

  var i;
  for (i = 0; i < numCourses; i++) {
    var course = courses.pop();
    /* console.log(course); */
    coursesAdded++;
    var event = {
      'summary': course.course,
      'location': course.location,
      'description': course.desc,
      'start': {
        'dateTime': termDates.start + 'T' + course.start + ':00',
        'timeZone': TIME_ZONE
      },
      'end': {
        'dateTime': termDates.start + 'T' + course.end + ':00',
        'timeZone': TIME_ZONE
      },
      'recurrence': [
        'RRULE:FREQ=WEEKLY;UNTIL=' + termDates.end.replace(/-/g,'') + 
          ';BYDAY=' + course.days
      ],
      /* 'reminders': { */
      /*   'useDefault': false, */
      /*   'overrides': [ */
      /*   {'method': 'popup', 'minutes': REMINDER_MINUTES} */
      /*   ] */
      /* } */
    };
    console.log(event);

    var request = gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': event

    });

    request.execute(function(event) {
      /* appendPre('Event created: ' + event.htmlLink); */
      console.log('Event created: ' + event.htmlLink);
    });
  }
}
