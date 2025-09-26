// Alan Donati
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
    "x-rapidapi-key": token,
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
