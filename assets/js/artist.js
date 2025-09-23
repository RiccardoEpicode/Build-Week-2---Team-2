document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  const artistId = params.get("id");
  const artistName = params.get("name");

  const artistHeader = document.querySelector(".artist-header");
  const songsList = document.getElementById("songs-list");
  const resultsContainer = document.getElementById("results-container");

  // NAVBAR SEARCH
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

  // Headers RapidAPI
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "72fb2f1cfbmshaeff93baf3ca7cfp1a0e82jsn021d2e76112e",
      "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
    },
  };

  // === LOGICA ===
  if (artistName && !artistId) {
    // Modalità SEARCH → lista artisti
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
      .catch((err) => console.error("❌ Errore search:", err));
  } else if (artistId) {
    // Modalità ARTIST → dettaglio + top songs
    loadArtist(artistId, options);
  }

  // FUNZIONE → renderizza lista di artisti
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

  // FUNZIONE → carica artista stile Spotify mockup
  function loadArtist(artistId, options) {
    fetch(
      `https://deezerdevs-deezer.p.rapidapi.com/artist/${artistId}`,
      options
    )
      .then((res) => res.json())
      .then((data) => {
        // HEADER ARTISTA
        artistHeader.innerHTML = `
  <div class="artist-hero position-relative text-white mb-4"
       style="background: url('${data.picture_xl}') center/cover no-repeat; 
              height: 450px; border-radius: 8px;">
    <div class="artist-overlay position-absolute top-0 start-0 w-100 h-100"
         style="background: rgba(0,0,0,0.5); border-radius: 8px;"></div>
<div class="position-absolute bottom-0 start-0" style="padding-bottom:1rem; padding-left:0;">
      
      <div class="d-flex align-items-center gap-2 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="34" height="34">
          <title>Verified account</title>
          <path fill="#4CB3FF" d="M10.814.5a1.66 1.66 0 0 1 2.372 0l2.512 2.572 
            3.595-.043a1.66 1.66 0 0 1 1.678 1.678l-.043 3.595 
            2.572 2.512c.667.65.667 1.722 0 2.372l-2.572 2.512 
            .043 3.595a1.66 1.66 0 0 1-1.678 1.678l-3.595-.043 
            -2.512 2.572a1.66 1.66 0 0 1-2.372 0l-2.512-2.572 
            -3.595.043a1.66 1.66 0 0 1-1.678-1.678l.043-3.595 
            L.5 13.186a1.66 1.66 0 0 1 0-2.372l2.572-2.512 
            -.043-3.595a1.66 1.66 0 0 1 1.678-1.678l3.595.043z"/>
          <path fill="#ffffff" d="M17.398 9.62a1 1 0 0 0-1.414-1.413 
            l-6.011 6.01-1.894-1.893a1 1 0 0 0-1.414 1.414l3.308 3.308z"/>
        </svg>
        <h6 class="m-0">Verified Artist</h6>
      </div>

      <h1 class="fw-bold m-0">${data.name}</h1>
      <p class="fs-6 m-0">${data.nb_fan.toLocaleString()} monthly listeners</p>
    </div>
  </div>
`;

        // carico top songs passando anche il nome
        loadTopSongs(artistId, data.name, options);
      })
      .catch((err) => console.error("❌ Errore artista:", err));
  }

  // FUNZIONE → top songs
  function loadTopSongs(artistId, artistName, options) {
    fetch(
      `https://deezerdevs-deezer.p.rapidapi.com/artist/${artistId}/top?limit=15`,
      options
    )
      .then((res) => res.json())
      .then((data) => {
        songsList.innerHTML = "";

        if (!data.data || data.data.length === 0) {
          console.warn(
            "⚠️ Nessuna top song dall'endpoint artist/top → uso fallback search"
          );

          // fallback: cerca per nome artista
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
              renderSongs(searchData.data.slice(0, 15));
            });
        }

        renderSongs(data.data);
      })
      .catch((err) => console.error("❌ Errore top songs:", err));
  }

  // Funzione di rendering canzoni
  function renderSongs(tracks) {
    songsList.innerHTML = "";

    // 👇 titolo aggiunto dinamicamente sopra la lista
    const title = document.createElement("h4");
    title.classList.add("mb-3");
    title.textContent = "Popular";
    songsList.appendChild(title);

    tracks.forEach((track, i) => {
      const row = document.createElement("div");
      row.classList.add(
        "d-flex",
        "justify-content-between",
        "align-items-center",
        "mb-2"
      );

      row.innerHTML = `
      <div class="d-flex align-items-center">
        <span class="me-3 fw-bold">${i + 1}</span>
        <img src="${track.album.cover_small}" 
             class="me-3 rounded" width="50" alt="${track.title}">
        <div>
          <h6 class="mb-0">${track.title}</h6>
          <small class="text-muted">${track.album.title}</small>
        </div>
      </div>
      <span class="text-muted">
        ${Math.floor(track.duration / 60)}:${String(
        track.duration % 60
      ).padStart(2, "0")}
      </span>
    `;

      songsList.appendChild(row);
    });
  }
});
