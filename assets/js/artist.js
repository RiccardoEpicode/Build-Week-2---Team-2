// ====== EVENTO PRINCIPALE DOPO IL CARICAMENTO DEL DOM =========

document.addEventListener("DOMContentLoaded", () => {
  // ============= PARAMETRI URL ===================================

  const params = new URLSearchParams(window.location.search);
  const artistId = params.get("id");
  const artistName = params.get("name");

  // =========== ELEMENTI DOM PRINCIPALI ========================

  const artistHeader = document.querySelector(".artist-header");
  const songsList = document.getElementById("songs-list");
  const resultsContainer = document.getElementById("results-container");

  // =============== NAVBAR SEARCH ==============================

  const searchForm = document.querySelector("form[role='search']");
  const searchInput = searchForm?.querySelector("input[type='search']");

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (!query) return;
      window.location.href = `artist.html?name=${encodeURIComponent(query)}`;
    });
  }

  // ================== RAPID API HEADERS ======================

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "72fb2f1cfbmshaeff93baf3ca7cfp1a0e82jsn021d2e76112e",
      "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
    },
  };

  // ======== LOGICA PRINCIPALE (SEARCH O CARICAMENTO ARTISTA) ============

  if (artistName && !artistId) {
    // MODALITA' SEARCH
    fetch(
      `https://deezerdevs-deezer.p.rapidapi.com/search?q=${artistName}`,
      options
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.length > 0) {
          renderArtistList(data.data);
        } else {
          resultsContainer.innerHTML = "<p>Nessun artista trovato</p>";
        }
      })
      .catch((err) => console.error("❌ ERRORE SEARCH:", err));
  } else if (artistId) {
    loadArtist(artistId, options);
  }

  // ======== FUNZIONE RENDER LISTA ARTISTI =====================

  function renderArtistList(results) {
    resultsContainer.innerHTML = "";
    artistHeader.innerHTML = "";
    songsList.innerHTML = "";

    const uniqueArtists = new Map();

    results.forEach((item) => {
      if (item.artist && !uniqueArtists.has(item.artist.id)) {
        uniqueArtists.set(item.artist.id, item.artist);
      }
    });

    uniqueArtists.forEach((artist) => {
      const card = document.createElement("div");
      card.classList.add("text-center", "m-3");
      card.style.width = "150px";
      card.style.cursor = "pointer";

      card.innerHTML = `
        <img src="${artist.picture_medium}" 
             alt="${artist.name}" 
             class="rounded-circle mb-2" width="120" height="120">
        <h6>${artist.name}</h6>
      `;

      card.addEventListener("click", () => {
        window.location.href = `artist.html?id=${artist.id}`;
      });

      resultsContainer.appendChild(card);
    });
  }

  // ========== FUNZIONE CARICAMENTO ARTISTA =====================

  function loadArtist(artistId, options) {
    fetch(
      `https://deezerdevs-deezer.p.rapidapi.com/artist/${artistId}`,
      options
    )
      .then((res) => res.json())
      .then((data) => {
        //==================== HEADER ARTISTA ====================
        artistHeader.innerHTML = `
          <div class="artist-hero position-relative text-white mb-4"
               style="background: url('${
                 data.picture_xl
               }') center/cover no-repeat; 
               height: 450px; border-radius: 8px;">
            
            <!-- OVERLAY SCURO -->
            <div class="artist-overlay position-absolute top-0 start-0 w-100 h-100" 
                 style="background: rgba(0,0,0,0.5); border-radius: 8px;">
            </div>
            
            <!-- CONTENUTO IN BASSO -->
            <div class="position-absolute bottom-0 start-0 m-3 pb-4 ps-0">
              <div class="artist-info">
                
                <!-- VERIFIED BADGE -->
                <div class="d-flex align-items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="34" height="34">
                    <title>Verified account</title>
                    <path fill="#4CB3FF" d="M10.814.5a1.66 1.66 0 0 1 2.372 0 l2.512 2.572 3.595-.043 a1.66 1.66 0 0 1 1.678 1.678 l-.043 3.595 2.572 2.512 c.667.65.667 1.722 0 2.372 l-2.572 2.512 .043 3.595 a1.66 1.66 0 0 1-1.678 1.678 l-3.595-.043 -2.512 2.572 a1.66 1.66 0 0 1-2.372 0 l-2.512-2.572 -3.595.043 a1.66 1.66 0 0 1-1.678-1.678 l.043-3.595 L.5 13.186 a1.66 1.66 0 0 1 0-2.372 l2.572-2.512 -.043-3.595 a1.66 1.66 0 0 1 1.678-1.678 l3.595.043z"/>
                    <path fill="#ffffff" d="M17.398 9.62 a1 1 0 0 0-1.414-1.413 l-6.011 6.01-1.894-1.893 a1 1 0 0 0-1.414 1.414 l3.308 3.308z"/>
                  </svg>
                  <h6 class="m-0">Verified Artist</h6>
                </div>

                <!-- NOME ARTISTA -->
                <h1 class="fw-bold m-0">${data.name}</h1> 

                <!-- LISTENERS -->
                <p class="m-0">${data.nb_fan.toLocaleString()} monthly listeners</p> 
              </div>
            </div>
          </div>

          <!-- BOTTONI AZIONE -->
          <div class="d-flex align-items-center gap-3 mb-4">
            <button class="btn rounded-circle p-3" style="background-color: #1ED760;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" viewBox="0 0 16 16">
                <path d="M10.804 8 5 4.633v6.734z" transform="scale(1.5) translate(-2,-2)"/>
              </svg>
            </button>
            <!-- Album -->
            <a href="album.html?artistId=${
              data.id
            }"class="btn btn-success rounded-pill px-4 fw-bold">Album</a>
            <button class="btn btn-outline-light rounded-pill px-4">Follow</button>
            <button class="btn p-2">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                <path d="M4.5 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m15 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m-7.5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
              </svg>
            </button>
          </div>
        `;

        loadTopSongs(artistId, data.name, options);
      })
      .catch((err) => console.error("❌ ERRORE ARTISTA:", err));
  }

  // ============= FUNZIONE TOP SONGS =====================

  function loadTopSongs(artistId, artistName, options) {
    fetch(
      `https://deezerdevs-deezer.p.rapidapi.com/artist/${artistId}/top?limit=15`,
      options
    )
      .then((res) => res.json())
      .then((data) => {
        songsList.innerHTML = "";

        if (!data.data || data.data.length === 0) {
          console.warn("⚠️ NESSUNA TOP SONG - USO FALLBACK SEARCH");

          //================ FALLBACK: CERCA NOME ARTISTA ==============

          return fetch(
            `https://deezerdevs-deezer.p.rapidapi.com/search?q=${artistName}`,
            options
          )
            .then((res) => res.json())
            .then((searchData) => {
              if (!searchData.data || searchData.data.length === 0) {
                songsList.innerHTML = "<p>Nessuna canzone trovata</p>";
                return;
              }
              renderSongs(searchData.data.slice(0, 5));
            });
        }

        renderSongs(data.data);
      })
      .catch((err) => console.error("❌ ERRORE TOP SONGS:", err));
  }

  // =========== FUNZIONE RENDER SONGS ====================
  function renderSongs(tracks) {
    songsList.innerHTML = "";

    // ======== TITOLO SEZIONE =========
    const title = document.createElement("h4");
    title.classList.add("mb-3");
    title.textContent = "Popular";
    songsList.appendChild(title);

    // ======== AUDIO PLAYER E PULSANTE =========
    const audio = document.getElementById("audio-player");
    const playButton = document.getElementById("playSong");
    const currentTimeEl = document.getElementById("current-time");
    const totalTimeEl = document.getElementById("total-time");
    const progressBar = document.getElementById("progress-bar");

    let currentTrackDuration = 0;

    // ======== LOOP CANZONI =========
    tracks.forEach((track, i) => {
      const row = document.createElement("div");
      row.classList.add(
        "d-flex",
        "justify-content-between",
        "align-items-center",
        "mb-2",
        "song-row"
      );

      row.style.cursor = "pointer";

      row.innerHTML = `
      <div class="d-flex align-items-center">
        <p class="me-4 fw-bold">${i + 1}</p>
        <img src="${track.album.cover_small}" 
             class="me-3 rounded" width="50" alt="${track.title}">
        <div>
          <h6 class="mb-0">${track.title}</h6>
          <small class="text-muted">${track.artist.name}</small>
        </div>
      </div>
      <span class="text-muted">
        ${Math.floor(track.duration / 60)}:${String(
        track.duration % 60
      ).padStart(2, "0")}
      </span>
    `;

      // ======== CLICK SU UNA CANZONE =========
      row.addEventListener("click", () => {
        // Aggiorna UI nel footer
        document.getElementById("player-cover").src = track.album.cover_small;
        document.getElementById("player-title").textContent = track.title;
        document.getElementById("player-artist").textContent =
          track.artist.name;

        // Carica la preview nell'audio player (ma NON la riproduce subito)
        audio.src = track.preview;
        audio.pause();

        // Aggiorna durata totale
        currentTrackDuration = track.duration;
        totalTimeEl.textContent = formatTime(track.duration);
        currentTimeEl.textContent = "0:00";
        progressBar.style.width = "0%";

        // Reset bottone a "Play"
        playButton.innerHTML = `
        <svg width="16" fill="#000" viewBox="0 0 16 16">
          <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288z"/>
        </svg>
      `;
      });

      songsList.appendChild(row);
    });

    // ======== CLICK SU PLAY/PAUSE =========
    playButton.addEventListener("click", () => {
      if (!audio.src) return; // nessuna canzone selezionata
      if (audio.paused) {
        audio.play();
        // Icona pausa
        playButton.innerHTML = `
        <svg width="16" fill="#000" viewBox="0 0 16 16">
          <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7z"/>
        </svg>
      `;
      } else {
        audio.pause();
        // Icona play
        playButton.innerHTML = `
        <svg width="16" fill="#000" viewBox="0 0 16 16">
          <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288z"/>
        </svg>
      `;
      }
    });

    // ======== AGGIORNA TEMPO E PROGRESS =========
    audio.addEventListener("timeupdate", () => {
      currentTimeEl.textContent = formatTime(audio.currentTime);
      if (audio.duration > 0) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
      }
    });

    // ======== AGGIORNA MINUTI TOTALI IN BASE ALLA CANZONE =========
    function formatTime(seconds) {
      const min = Math.floor(seconds / 60);
      const sec = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");
      return `${min}:${sec}`;
    }
  }
});
