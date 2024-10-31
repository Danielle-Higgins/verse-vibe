// Variables
const form = document.getElementById("form");
const artistInput = document.getElementById("artist");
const titleInput = document.getElementById("title");
const trackList = document.getElementById("results");

const BASEURL = "https://api.lyrics.ovh";

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let artistVal = artistInput.value.trim();
  let titleVal = titleInput.value.trim();

  if (!artistVal && !titleVal) alert("Nothing To Search");
  else searchSong(artistVal, titleVal);

  artistInput.value = "";
  titleInput.value = "";

  if (trackList.innerHTML) trackList.innerHTML = "";
});

function searchSong(artist, title) {
  let searchURL = "";
  if (artist && !title) {
    searchURL = `${BASEURL}/suggest/${artist}`;
  } else if (!artist && title) {
    searchURL = `${BASEURL}/suggest/${title}`;
  } else {
    searchURL = `${BASEURL}/suggest/${title}`;
  }

  fetch(searchURL)
    .then((res) => res.json())
    .then((data) => {
      //   console.log(data);
      console.log(data.data);

      displayTracks(data);
    })
    .catch((error) => console.log(`${error}`));
}

function displayTracks(data) {
  data.data.forEach((item) => {
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
