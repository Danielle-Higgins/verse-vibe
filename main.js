const BASEURL = "https://api.lyrics.ovh";

const hamburgerBtn = document.getElementById("hamburger-btn");
const headerNav = document.querySelector(".header-nav");

hamburgerBtn.addEventListener("click", () => {
  hamburgerBtn.classList.toggle("fa-xmark");
  headerNav.classList.toggle("active");
});

window.onscroll = () => {
  hamburgerBtn.classList.remove("fa-xmark");
  headerNav.classList.remove("active");
};

// code specific to the search page (index.html)
if (document.getElementById("search-page")) {
  // Variables
  const form = document.getElementById("form");
  const artistInput = document.getElementById("artist");
  const titleInput = document.getElementById("title");
  const trackList = document.getElementById("results");

  // when form is submitted, search for song
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // grab values from inputs
    let artistVal = artistInput.value.trim();
    let titleVal = titleInput.value.trim();

    // check if inputs are empty or not
    if (!artistVal && !titleVal) alert("Nothing To Search");
    else searchSong(artistVal, titleVal);

    // reset everything
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
        // console.log(data);
        console.log(data.data);

        // check if both inputs were populated
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
      link.setAttribute("data-artist", item.artist.name);
      link.setAttribute("data-title", item.title);
      link.setAttribute("data-img", item.album.cover_xl);
      link.setAttribute("data-album-name", item.album.title);
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

  // listens for click events on track list element (ul)
  trackList.addEventListener("click", (e) => {
    // console.log(e.target);

    let target = e.target;

    // Find the closest 'li' ancestor if the clicked element is not an 'li'
    while (target && target.tagName !== "LI") {
      target = target.parentElement;
    }

    // console.log(target);

    // If a valid <li> is found
    if (target) {
      // Get the anchor within the <li>
      const link = target.querySelector("a");

      // If the anchor exists
      if (link) {
        const artist = link.getAttribute("data-artist");
        const title = link.getAttribute("data-title");
        const albumImg = link.getAttribute("data-img");
        const album = link.getAttribute("data-album-name");

        getLyrics(artist, title, albumImg, album);
      }
    }
  });

  // get the lyrics
  function getLyrics(artist, title, img, album) {
    const lyricURL = `${BASEURL}/v1/${artist}/${title}`;

    fetch(lyricURL)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);

        // store the lyrics and song info in localStorage for data transfer across pages
        localStorage.setItem("lyrics", data.lyrics);
        localStorage.setItem("artist", artist);
        localStorage.setItem("title", title);
        localStorage.setItem("albumImg", img);
        localStorage.setItem("albumName", album);

        // redirect to lyrics page
        window.location.href = "./lyrics.html";
      })
      .catch((error) => console.log(`${error}`));
  }
}

// code specific to the lyrics page (lyrics.html)
if (document.getElementById("lyrics-page")) {
  function displayLyrics() {
    // get song info and lyrics from localStorage
    const lyrics = localStorage.getItem("lyrics");
    const artist = localStorage.getItem("artist");
    const title = localStorage.getItem("title");
    const albumImg = localStorage.getItem("albumImg");
    const albumName = localStorage.getItem("albumName");

    const img = document.querySelector(".album-pic");
    img.src = albumImg;
    img.alt = `${albumName} album cover`;

    const albumTitle = document.querySelector(".album-name");
    albumTitle.textContent = albumName;

    const trackTitle = document.querySelector(".track-title");
    trackTitle.textContent = title;

    const artistName = document.querySelector(".celeb");
    artistName.textContent = artist;

    const lyricContainer = document.querySelector("#lyrics");

    const description = document.createElement("p");
    description.classList.add("description");
    description.textContent = `Lyrics of ${title} By ${artist}`;
    lyricContainer.appendChild(description);

    const lyricsOfSong = document.createElement("p");
    lyricsOfSong.classList.add("lyrics-of-song");
    lyricsOfSong.innerHTML = lyrics.replace(/(\r\n|\r|\n)/g, "<br>");

    if (lyricsOfSong.textContent === "undefined")
      lyricsOfSong.textContent = "No lyrics found";

    lyricContainer.appendChild(lyricsOfSong);
  }

  // call the function
  displayLyrics();
}
