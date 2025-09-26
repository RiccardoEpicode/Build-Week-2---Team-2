// Alan Donati
const getParams = new URLSearchParams(window.location.search);
const albumId = getParams.get("albumId");
const playlistId = getParams.get("playlistId");

const testId = "103248";
const testId2 = "556294552";

const URL = "https://deezerdevs-deezer.p.rapidapi.com/album/";
const URLPlaylist = "https://deezerdevs-deezer.p.rapidapi.com/playlist/";

const generalDiv = document.getElementById("album");
// console.log(generalDiv);
const albumPic = generalDiv.querySelector("img");
// console.log(albumPic);
const albumTitle = generalDiv.querySelector("h2");

const artistPic = document.getElementById("artistPic");

const albumInfo = document.getElementById("albumInfo");
const trackListOl = document.getElementById("tracklistOl");

const songInfo = document.getElementById("songInfo");
const playerImg = songInfo.querySelector("img");
const playerTitle = songInfo.querySelector("h6");
const playerName = songInfo.querySelector("small");

const PlayPause = document.getElementById("play");

const progressBar = document.querySelector(".progress-bar");
const currentTimeDisplay = document.querySelector(".me-2");
const totalTimeDisplay = document.querySelector(".ms-2");

const volumeBar = document.querySelector(".progress-bar-volume .progress-bar");
const volumeContainer = document.querySelector(".progress-bar-volume");

console.log(PlayPause);

const globalAudioPlayer = new Audio();
globalAudioPlayer.volume = 0.25;
document.documentElement.style.setProperty("--volume-width", "25%");
volumeBar.classList.add("volume-active");
// Crea li per tracklist Album
const createTracksLi = (tracklist) => {
  tracklist.forEach((track, index) => {
    const trackNumber = index + 1;

    const duration = track.duration;

    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    const li = document.createElement("li");
    li.className =
      "d-flex justify-content-between align-items-start py-2 px-2 rounded";
    const liDiv = document.createElement("div");
    liDiv.className = "d-flex align-items-start";
    const spanNum = document.createElement("span");
    spanNum.className = "text-muted me-3";
    spanNum.style = "min-width: 20px";
    spanNum.innerText = trackNumber;
    const divInCont = document.createElement("div");
    const divTitle = document.createElement("div");
    divTitle.className = "fw-bold";
    divTitle.innerText = track.title;
    const icon = document.createElement("div");
    icon.className = "text-muted small";
    icon.innerHTML = `   <svg
    data-encore-id="icon"
    role="img"
    aria-hidden="true"
    class="e-91000-icon e-91000-baseline me-1"
    viewBox="0 0 16 16"
    style="
    --encore-icon-height: var(
        --encore-graphic-size-decorative-smaller
        );
        --encore-icon-width: var(
            --encore-graphic-size-decorative-smaller
            );
            width: 14px;
            height: 14px;
            vertical-align: text-top;
            fill: #6c757d;
            "
            >
            <path
            d="M1.75 2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25zM0 2.75C0 1.784.784 1 1.75 1h12.5c.967 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25z"
            ></path>
            <path d="m6 5 5.196 3L6 11z"></path></svg
            >Music by • ${track.artist.name}`;
    const timeSpan = document.createElement("span");
    timeSpan.className = "text-muted";
    timeSpan.innerText = `${minutes}:${seconds}`;

    divInCont.append(divTitle, icon);
    liDiv.append(spanNum, divInCont);
    li.append(liDiv, timeSpan);
    trackListOl.appendChild(li);

    // Gestione Player
    li.addEventListener("click", function () {
      playerImg.src = track.album.cover_medium;
      playerTitle.innerText = track.title;
      playerName.innerText = track.artist.name;
      globalAudioPlayer.pause();
      globalAudioPlayer.currentTime = 0;

      globalAudioPlayer.src = track.preview;
      globalAudioPlayer.play();
      PlayPause.innerHTML = `<svg data-encore-id="icon"        width="16"
                fill="#000" role="img" aria-hidden="true" class="e-91000-icon e-91000-baseline" viewBox="0 0 16 16" style="--encore-icon-height: var(--encore-graphic-size-decorative-smaller); --encore-icon-width: var(--encore-graphic-size-decorative-smaller);"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7z"></path></svg>`;
    });

    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
    // Aggiornamento progress bar
    globalAudioPlayer.addEventListener("timeupdate", function () {
      if (globalAudioPlayer.duration) {
        const progress =
          (globalAudioPlayer.currentTime / globalAudioPlayer.duration) * 100;
        progressBar.style.width = progress + "%";
        currentTimeDisplay.textContent = formatTime(
          globalAudioPlayer.currentTime
        );
      }
    });

    // Aggiornamento barra volume
    volumeContainer.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;

      globalAudioPlayer.volume = percent;

      document.documentElement.style.setProperty(
        "--volume-width",
        percent * 100 + "%"
      );
      volumeBar.classList.add("volume-active");
    });
    globalAudioPlayer.addEventListener("loadedmetadata", function () {
      totalTimeDisplay.textContent = formatTime(globalAudioPlayer.duration);
      progressBar.style.width = "0%";
    });

    document
      .querySelector(".progress-bar-song")
      .addEventListener("click", function (e) {
        if (globalAudioPlayer.duration) {
          const rect = this.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          globalAudioPlayer.currentTime = percent * globalAudioPlayer.duration;
        }
      });

    PlayPause.addEventListener("click", function () {
      globalAudioPlayer.pause();
      globalAudioPlayer.currentTime = 0;
      PlayPause.innerHTML = `<svg
                data-encore-id="icon"
                width="16"
                fill="#000"
                role="img"
                aria-hidden="true"
                class="e-91000-icon e-91000-baseline"
                viewBox="0 0 16 16"
                style="
                  --encore-icon-height: var(
                    --encore-graphic-size-decorative-smaller
                  );
                  --encore-icon-width: var(
                    --encore-graphic-size-decorative-smaller
                  );
                "
              >
                <path
                  d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288z"
                ></path>
              </svg>`;
    });
    // Gestione Hoover
    li.addEventListener("mouseenter", function () {
      this.style.background = "#6867674f";
      this.style.cursor = "pointer";
      spanNum.innerHTML = `<svg
                      data-encore-id="icon"
                      width="16"
                      fill="#636363ff"
                      role="img"
                      aria-hidden="true"
                      class="e-91000-icon e-91000-baseline"
                      viewBox="0 0 16 16"
                      style="
                        --encore-icon-height: var(
                          --encore-graphic-size-decorative-smaller
                        );
                        --encore-icon-width: var(
                          --encore-graphic-size-decorative-smaller
                        );
                      "
                    >
                      <path
                        d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288z"
                      ></path>
                    </svg>`;
    });

    li.addEventListener("mouseleave", function () {
      this.style.background = "";
      spanNum.innerHTML = "";
      spanNum.innerText = trackNumber;
    });
  });
};
// Media dei colori
const averageColor = function (imgElement, callback) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = 100;
  canvas.height = 100;

  context.drawImage(imgElement, 0, 0, 50, 50);

  const imageData = context.getImageData(0, 0, 50, 50);
  const data = imageData.data;

  console.log(data);

  let r = 0;
  let g = 0;
  let b = 0;

  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }

  const pixelCount = data.length / 4;
  r = Math.floor(r / pixelCount);
  g = Math.floor(g / pixelCount);
  b = Math.floor(b / pixelCount);

  callback(`rgb(${r}, ${g}, ${b})`);
};
// Playlist Fetch
if (playlistId) {
  fetch(URLPlaylist + playlistId, {
    method: "GET",
    headers: {
      "x-rapidapi-key": token,
      "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Errore nel caricamento della playlist");
      }
      return response.json();
    })
    .then((playlist) => {
      console.log("Playlist:", playlist);

      albumPic.crossOrigin = "anonymous";
      albumPic.onload = function () {
        averageColor(albumPic, (color) => {
          document.documentElement.style.setProperty("--album-color", color);
          const backgroundDiv = document.querySelector(".background-center");
          backgroundDiv.style.background = `linear-gradient(180deg, ${color} 0%, #121212 100%)`;
        });
      };

      albumPic.src = playlist.picture_xl;
      albumTitle.innerText = playlist.title;
      artistPic.src = playlist.picture_small;

      const duration = playlist.duration;
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;

      artistPic.style.cursor = "pointer";
      albumInfo.innerHTML = `${
        playlist.creator.name
      } <span>• ${playlist.creation_date.slice(0, 4)}</span> <span>• ${
        playlist.nb_tracks
      } brani,</span> <span>${minutes} min ${seconds} sec</span>`;

      createTracksLi(playlist.tracks.data);
    })
    .catch((error) => {
      console.error("Errore:", error);
    });
} else if (albumId) {
  fetch(URL + albumId, {
    method: "GET",
    headers: {
      "x-rapidapi-key": token,
      "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Errore nel caricamento dell'album");
      }
      return response.json();
    })
    .then((album) => {
      console.log("Album:", album);

      albumPic.crossOrigin = "anonymous";
      albumPic.onload = function () {
        averageColor(albumPic, (color) => {
          document.documentElement.style.setProperty("--album-color", color);
          const backgroundDiv = document.querySelector(".background-center");
          backgroundDiv.style.background = `linear-gradient(180deg, ${color} 0%, #121212 100%)`;
        });
      };

      albumPic.src = album.cover_xl;
      albumTitle.innerText = album.title;
      artistPic.src = album.artist.picture_small;

      const duration = album.duration;
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;

      artistPic.style.cursor = "pointer";
      albumInfo.innerHTML = `${
        album.artist.name
      } <span>• ${album.release_date.slice(0, 4)}</span> <span>• ${
        album.nb_tracks
      } brani,</span> <span>${minutes} min ${seconds} sec</span>`;

      createTracksLi(album.tracks.data);

      albumInfo.addEventListener("click", function () {
        const artistId = album.artist.id;
        window.location.href = `artist.html?artistId=${artistId}`;
      });

      artistPic.addEventListener("click", function () {
        const artistId = album.artist.id;
        window.location.href = `artist.html?artistId=${artistId}`;
      });
    })
    .catch((error) => {
      console.error("Errore:", error);
    });
}
