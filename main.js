// Variables
const form = document.getElementById("form");
const artistInput = document.getElementById("artist");
const titleInput = document.getElementById("title");
const trackList = document.getElementById("results");

const BASEURL = "https://api.lyrics.ovh";

// when form is submitted
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // grab values from inputs
  let artistVal = artistInput.value.trim();
  let titleVal = titleInput.value.trim();

  // if inputs are empty
  if (!artistVal && !titleVal) alert("Nothing To Search");
  else searchSong(artistVal, titleVal);

  artistInput.value = "";
  titleInput.value = "";

  if (trackList.innerHTML) trackList.innerHTML = "";
});

// searches for the song based on the input
function searchSong(artist, title) {
  let searchURL = "";

  // check which inputs were populated
  if (artist && !title) {
    searchURL = `${BASEURL}/suggest/${artist}`;
  } else {
    searchURL = `${BASEURL}/suggest/${title}`;
  }

  fetch(searchURL)
    .then((res) => res.json())
    .then((data) => {
      //   console.log(data);
      console.log(data.data);

      // if if both inputs were populated
      if (artist && title) {
        data.data = data.data.filter(
          (item) =>
            artist.toLowerCase() === item.artist.name.toLowerCase() &&
            title.toLowerCase() === item.title.toLowerCase()
        );
      }

      displayTracks(data.data);
    })
    .catch((error) => console.log(`${error}`));
}

// loops through an array of objects and displays the tracks
function displayTracks(array) {
  document.querySelector(".results-title").style.display = "block";

  // create our elements
  array.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.classList.add("result-item");

    trackList.appendChild(listItem);

    const link = document.createElement("a");
    link.classList.add("lyric-link");
    link.href = "#"; // TODO
    listItem.appendChild(link);

    const image = document.createElement("img");
    image.classList.add("album-cover");
    image.src = item.album.cover;
    link.appendChild(image);

    const div = document.createElement("div");
    const para = document.createElement("p");
    para.classList.add("song-title");
    para.textContent = item.title;
    div.appendChild(para);

    const span = document.createElement("span");
    span.classList.add("artist-name");
    span.textContent = item.artist.name;
    div.appendChild(span);

    link.appendChild(div);
  });
}
