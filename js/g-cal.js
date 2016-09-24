function addToGoogleCalendar(el,term,year,course,start,end) {
  console.log('Google Calendar Requested!');
  var room = el.parentNode.getElementsByClassName('room')[0].nextElementSibling;
  var data = {
    'term': term,
    'year':year,
    'course':course,
    'start':start,
    'end':end,
    'location':room.textContent
  };
  console.log(data);
}
