UCR Schedule Visualizer
=======================

The raw class list from [GROWL](https://ucribm.ucr.edu/Paws/PAWS.html) is pretty ugly. We're here to fix that.

This project is a website written in HTML, CSS, and JavaScript that generates an
hour by hour view of your schedule as well as provide links to each class location
from the schedule you get from GROWL. Your security and privacy is maintained because
all of the schedule interpreting and viewing is done client side. No personal schedule
related information is sent over the web with the exception of the "Add to Google
Calendar" option, should you choose to use it.<sup><a name="g-cal-disclaim">1</a></sup>.

<sub>[1](g-cal-disclaim).  Only upon clicking the "Add to Google Calendar"
button and authorizing this application to access your calendar, your course
information will be sent to Google using their official APIs in order to add
your courses to your calendar for the given quarter. This app will only create
new events for the course schedule you provide. Your calendar is otherwise
not read/written to in any way.</sub>
[GitHub Pages](https://bradleycai.github.io/ucr-schedule-visualizer/)
--------------------------------------------------------

This project is hosted on GitHub pages. You can check out the current stable release
of our website using the link above.

Because the GitHub pages branch is the equivalent of a master branch, the gh-pages
branch is our master branch.

We are using the [Akari Link Shortener](https://waa.ai/) to create a short URL: [https://waa.ai/ucrsv](https://waa.ai/ucrsv). The
first three characters "ucr" referring to our school's name, and the last 2 characters "sv" being short for "schedule visualizer". We also have [a QR code](http://bradleycai.github.io/ucr-schedule-visualizer/img/waaai-qr.png).

Issues
------

If you want to be a nice pal, suggest a feature in the [issues section](https://github.com/BradleyCai/ucr-schedule-visualizer/issues)! If you want to be a super pal, you can fork us and make a change that we can merge into our source. If you want to be a super super pal, donate to the Free Software Foundation. They help protect our freedoms!

Credits
-------

<ul>
  <li>Lots of inspiration from <a href="https://github.com/nokonoko/Pomf">pomf</a></li>
  <li><a href="https://jquery.com/">jQuery</a></li>
  <li><a href="http://getbootstrap.com/">Bootstrap</a></li>
  <li><a href="https://github.com/eligrey/FileSaver.js/">FileSaver.js</a></li>
  <li><a href="https://github.com/eligrey/canvas-toBlob.js">Canvas-toBlob.js</a></li>
  <li><a href="https://github.com/eligrey/Blob.js">Blob.js</a></li>
  <li><a href="https://necolas.github.io/normalize.css/">normalize.css</a></li>
  <li><a href="https://github.com/js-cookie/js-cookie">js-cookie</a></li>
</ul>

Coded with love by [Bradley Cai](https://github.com/BradleyCai) and [Ammon](https://github.com/ammongit).

Contact us! We have a [Twitter account](https://twitter.com/UCR_Visualizer), or you can email us at [bradleycai24@gmail.com](mailto:bradleycai24@gmail.com) (Bradley) or [ammon.i.smith@gmail.com](mailto:ammon.i.smith@gmail.com) (Ammon) if it's something more detailed. Our public keys are located in the `etc` directory of this repo.

License
-------

[The MIT License](https://github.com/BradleyCai/ucr-schedule-visualizer/blob/gh-pages/LICENSE.md): Do what ever you want with our code so long as you give attribution :heart:. This project is intended for public use and for personal learning and enjoyment.

We also have a few dependencies that make this project work. They're all free software,
and their licenses are listed inside the files themselves.
