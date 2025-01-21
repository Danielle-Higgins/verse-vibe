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
class SongSearcher {
  constructor(form, artist, title, trackList) {
    this.form = document.getElementById(form);
    this.artistInput = document.getElementById(artist);
    this.titleInput = document.getElementById(title);
    this.trackList = document.getElementById(trackList);
    this.resultsTitle = document.querySelector(".results-title");

    this.setupEventListners();
  }

  setupEventListners() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    this.trackList.addEventListener("click", (e) => this.selectTrack(e));
  }

  // when form is submitted, search for song
  handleSubmit(e) {
    e.preventDefault();

    // grab values from inputs
    let artistVal = this.artistInput.value.trim();
    let titleVal = this.titleInput.value.trim();

    // check if inputs are empty or not
    if (!artistVal && !titleVal) return;
    else this.searchSong(artistVal, titleVal);

    // reset everything
    this.artistInput.value = "";
    this.titleInput.value = "";

    if (this.trackList.innerHTML) this.trackList.innerHTML = "";
  }

  // searches for the song based on the input
  async searchSong(artist, title) {
    let searchURL = "";

    // check which inputs were populated
    searchURL =
      artist && !title
        ? `${BASEURL}/suggest/${artist}`
        : `${BASEURL}/suggest/${title}`;

    try {
      const response = await fetch(searchURL);

      if (!response.ok) throw new Error("Network response was not ok!");

      const data = await response.json();
      // console.log(data);
      // console.log(data.data);

      // check if both inputs were populated
      if (artist && title) {
        data.data = data.data.filter(
          (item) =>
            artist.toLowerCase() === item.artist.name.toLowerCase() &&
            title.toLowerCase() === item.title.toLowerCase()
        );
      }

      this.displayTracks(data.data);
    } catch (error) {
      console.log("Error:", error);
    }
  }

  // loops through an array of objects and displays the tracks
  displayTracks(array) {
    this.resultsTitle.style.display = "block";

    // create our elements
    array.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.classList.add("result-item");
      this.trackList.appendChild(listItem);

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
  selectTrack(e) {
    // console.log(e.target);
    let target = e.target;

    // find the closest 'li' ancestor if the clicked element is not an 'li'
    // no matter where you click, it will find the elements corresponding 'li'
    while (target && target.tagName !== "LI") {
      target = target.parentElement;
    }
    // console.log(target);

    // If a valid <li> is found
    if (target) {
      // Get the anchor within the <li>
      const link = target.querySelector(".lyric-link");

      // If the anchor exists
      if (link) {
        const artist = link.getAttribute("data-artist");
        const title = link.getAttribute("data-title");
        const albumImg = link.getAttribute("data-img");
        const album = link.getAttribute("data-album-name");

        this.getLyrics(artist, title, albumImg, album);
      }
    }
  }

  // get the lyrics
  async getLyrics(artist, title, img, album) {
    const lyricURL = `${BASEURL}/v1/${artist}/${title}`;

    try {
      const response = await fetch(lyricURL);

      if (!response.ok) throw new Error("Network response was not ok!");

      const data = await response.json();
      // console.log(data);

      // store the lyrics and song info in localStorage for data transfer across pages
      localStorage.setItem("lyrics", data.lyrics);
      localStorage.setItem("artist", artist);
      localStorage.setItem("title", title);
      localStorage.setItem("albumImg", img);
      localStorage.setItem("albumName", album);

      // redirect to lyrics page
      window.location.href = "./lyrics.html";
    } catch (error) {
      console.log("Error:", error);
    }
  }
}

// code specific to the search page (index.html)
if (document.getElementById("search-page")) {
  const search = new SongSearcher("form", "artist", "title", "results");
}

// code specific to the lyrics page (lyrics.html)
class GetSongLyrics {
  constructor() {
    this.displayLyrics();
  }

  displayLyrics() {
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
}

// code specific to the lyrics page (lyrics.html)
if (document.getElementById("lyrics-page")) {
  const lyrics = new GetSongLyrics();
}
