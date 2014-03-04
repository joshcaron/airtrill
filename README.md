Airtrill is a web application designed for those looking to discover new music.
It allows the audience to contribute to a playlist.

Use case #1: host wants to get input on what to play from his or her guests.
Now, even the less vocal ones have a say. By simply giving his guests the number,
guests can text the songs they want to hear. No downloads required, and even
users without smartphones can contribute.

Use case #2: user wants to listen to music. Instead of flicking on the radio,
they can tune in to a airtrill channel and enjoy crowdsourced music. They
don't have to worry about choosing new songs and the songs are guaranteed to be
things people want to hear.

Technical specifications:
* Bootstrap.JS and Angular.JS Front End
* SoundCloud API for music
* Twilio API for processing text messages
* Node.JS server-side implementation

Room for improvement:
* Allow songs to get "bumped up" based on the number of requests
* Allow hosts to enter songs into the playlists manually
* Create multiple sessions
* Change API to one that has better formatted song information
* Clear songs that have finished playing from the queue
* Allow emailing songs - free even for those who don't have texting
* Ensure songs keep playing even when users have not submitted
  anything - perhaps, by inference, so the service is never "dead"

Airtrill was made over the span of 24 hours during McHacks, a hackathon at McGill university in Canada. 
There is built-in support for having multiple "parties", i.e. different playlist/number combinations, however, 
we were not able to get it to integrate with the frontend in time. 

The site is live at http://airtrill.com/.

If you have any questions about this, please contact me for more info. All the code is available on 
Github at https://github.com/joshcaron/airtrill. 
