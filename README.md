# Verse Vibe: <a target="_blank" href="https://danielle-higgins.github.io/verse-vibe/index.html">Visit Here</a>

<p>
  <img width="400" src="https://github.com/Danielle-Higgins/verse-vibe/blob/main/img/search-preview.png">
  <img width="400" src="https://github.com/Danielle-Higgins/verse-vibe/blob/main/img/lyrics-preview.png">
</p>

Welcome to Verse Vibe! Enter in the name of the artist or the song to get a list of options to choose from. Then click on said song to get the lyrics.

## Tech Used

<p>
  <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white">
  <img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white">
  <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E">
</p>

This project has two pages, the search page and the lyrics page. The search page allows the user to search for the song based on the name of the artist and the name of the song. Then 15 of the top songs will appear. Once the user clicks on the song they want the lyrics to, the user will be redirected to the lyrics page where the lyrics will be displayed. This is done with the help of an API that responds with an array of results for the list of songs, and an object that gives you the lyrics. In my JS, I have code specific to the search page (index.html), and code specific to the lyrics page (lyrics.html). For the search page, when the user submits the form, the page will check to make sure one of the two inputs were populated. If one of them are populated, a function will be called to search for the song based on what the user types in. Inside of the searchSong function, the first API I use will give me an array of objects that match the input values. It will then call the displayTracks function where I pass in the array. I have a ul in the HTML which will hold the neccessary information for the songs. Inside the displayTracks function, I loop through the array passed in, and dynamically create elements. How many of the elements get created will depend on how many elements are in the array. I create a list item to append to the ul. Inside the list item, an anchor tag which will hold the name of the artist, the name of the song, the album cover, and the title of the album in attributes. Inside the anchor tag, an image which is the album cover, a paragraph which holds the name of the song, and a span which holds the artist name. When the ul is click on (listens for click events on the ul), it will check where the user clicked specifically. It will make sure that whatever the user clicks on, it will grab the corresponding list item. It will search for the anchor tag inside of the list item where it will get the data attributes, then call on the getLyrics function where the artist, song title, album cover url, and album name are passed in. It will call on another API which will respond with an object containing the lyrics to the song. We store everything in localStorage and redirect the user to the lyrics page. I grab everything from localStorage, then display the lyrics along with the album cover, the name of the album, the song title, and the artist name on the page.

Here is a link to the API I used: <a target="_blank" href="https://lyricsovh.docs.apiary.io/#">Lyrics.ovh</a>

## Optimizations

If/when I improve this project, I would like to research if I can integrate the corresponding YouTube video/audio that goes with the song the user wants the lyrics to. Using the YouTube Data API may be beneficial.

## Lessons Learned:

I learned how create code specific to a certain page. How to set attributes to elements using the setAttribute method. How to get the parent element of an element using the parentElement property. How to get an attribute from an element using the getAttribute method. And how to use localStorage to transfer data between pages. Separation of concerns.
