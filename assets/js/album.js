const getParams = new URLSearchParams(window.location.search);
const albumId = getParams.get("id");
const testId = "103248";
const testId2 = "556294552";

const URL = "https://deezerdevs-deezer.p.rapidapi.com/album/";

const generalDiv = document.getElementById("album");
// console.log(generalDiv);
const albumPic = generalDiv.querySelector("img");
// console.log(albumPic);
const albumTitle = generalDiv.querySelector("h2");

const artistPic = document.getElementById("artistPic");

const albumInfo = document.getElementById("albumInfo");
const trackListOl = document.getElementById("tracklistOl");
console.log(albumInfo);

const createTracksLi = (tracklist) => {
  tracklist.forEach((track, index) => {
    const trackNumber = index + 1;

    const duration = track.duration;

    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    const li = document.createElement("li");
    li.className = "d-flex justify-content-between align-items-start py-2";
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
  });
};

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
//Album Fetch
fetch(URL + testId, {
  method: "GET",

  headers: {
    "x-rapidapi-key": "38a13a7d0dmshccf622dd4609bcbp1d0e43jsna16f457d9c68",
    "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  },
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("We got a problem");
    } else {
      return response.json();
    }
  })
  .then((album) => {
    console.log(album);
    albumPic.crossOrigin = "anonymous";
    albumPic.onload = function () {
      averageColor(albumPic, (color) => {
        document.documentElement.style.setProperty("--album-color", color);

        const backgroundDiv = document.querySelector(".background-center");
        backgroundDiv.style.background = `linear-gradient(180deg, ${color} 0%,  #121212 100%)`;
      });
    };
    albumPic.src = album.cover_xl;
    albumTitle.innerText = album.title;
    artistPic.src = album.artist.picture_small;

    const duration = album.duration;

    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    albumInfo.innerHTML = `${
      album.artist.name
    } <span>• ${album.release_date.slice(0, 4)}</span> <span>• ${
      album.nb_tracks
    } brani,</span>
                        <span>${minutes} min ${seconds} sec</span>`;

    createTracksLi(album.tracks.data);
  });

// Right Column Fetch

const rightCont = document.getElementById("rightCont");

const songImg = rightCont.querySelector("img");
const songTitle = rightCont.querySelector(".my-1 a");
const songArtist = rightCont.querySelector(".m-0 a");

const card = document.querySelector(".card");
const cardImg = card.querySelector("img");
const cardName = card.querySelector(".card-body a");
const fansCount = document.getElementById("fans");
const artistDesc = document.getElementById("desc");
const fansText = fansCount.firstElementChild;

console.log(card);

const artistDescriptions = [
  "Artista versatile con uno stile unico che mescola influenze moderne e classiche, conquistando il pubblico con performance coinvolgenti.",
  "Talento emergente nel panorama musicale internazionale, noto per le sue melodie accattivanti e i testi profondi.",
  "Musicista innovativo che sperimenta con diversi generi, creando un sound distintivo che attraversa i confini tradizionali.",
  "Artista carismatico con una voce potente e una presenza scenica magnetica che non lascia mai indifferenti.",
  "Interprete sensibile capace di emozionare con ballate intense e di far ballare con ritmi coinvolgenti.",
  "Songwriter di talento che racconta storie universali attraverso la musica, conquistando fan in tutto il mondo.",
  "Artista poliedrico che spazia tra diversi stili musicali, sempre alla ricerca di nuove forme espressive.",
  "Musicista appassionato con un forte legame con le proprie radici, che riesce a modernizzare suoni tradizionali.",
  "Performer energico e creativo, famoso per i live mozzafiato e l'interazione autentica con il pubblico.",
  "Talento naturale con una sensibilità artistica raffinata, capace di toccare le corde più profonde dell'anima.",
];

const playlistURL =
  "https://deezerdevs-deezer.p.rapidapi.com/playlist/3155776842";

fetch(playlistURL, {
  headers: {
    "x-rapidapi-key": "38a13a7d0dmshccf622dd4609bcbp1d0e43jsna16f457d9c68",
    "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  },
})
  .then((response) => response.json())
  .then((data) => {
    const randomTrack =
      data.tracks.data[Math.floor(Math.random() * data.tracks.data.length)];
    console.log(randomTrack);
    songImg.src = randomTrack.album.cover_xl;
    songTitle.innerText = randomTrack.title;
    songArtist.innerText = randomTrack.artist.name;

    return fetch(
      `https://deezerdevs-deezer.p.rapidapi.com/artist/${randomTrack.artist.id}`,
      {
        headers: {
          "x-rapidapi-key":
            "38a13a7d0dmshccf622dd4609bcbp1d0e43jsna16f457d9c68",
          "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
        },
      }
    );
  })
  .then((response) => response.json())
  .then((artistData) => {
    console.log(artistData);
    cardImg.src = artistData.picture_big;
    cardName.innerText = artistData.name;
    fansText.innerText = artistData.nb_fan;
    const randomDescription =
      artistDescriptions[Math.floor(Math.random() * artistDescriptions.length)];
    artistDesc.textContent = randomDescription;
  });
