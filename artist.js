// Quando la pagina è pronta
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  let artistId = params.get("id");
  const artistName = params.get("name");

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

  // Se arrivo da ?name=cercato → risolvo l'id
  if (!artistId && artistName) {
    fetch(
      `https://deezerdevs-deezer.p.rapidapi.com/search?q=${artistName}`,
      options
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.length > 0) {
          artistId = data.data[0].artist.id;
          window.history.replaceState({}, "", `artist.html?id=${artistId}`);
          loadArtist(artistId, artistName, options);
        } else {
          document.querySelector(".artist-header").innerHTML =
            "<p>❌ Artista non trovato</p>";
        }
      })
      .catch((err) => console.error("❌ Errore search:", err));
  } else if (artistId) {
    loadArtist(artistId, artistName, options);
  }
});

// FUNZIONE → carica artista e top songs
function loadArtist(artistId, artistName, options) {
  const artistHeader = document.querySelector(".artist-header");
  const songsList = document.getElementById("songs-list");

  if (!songsList) {
    console.error("❌ ERRORE: elemento #songs-list non trovato nell'HTML!");
    return;
  }

  // INFO ARTISTA
  fetch(`https://deezerdevs-deezer.p.rapidapi.com/artist/${artistId}`, options)
    .then((res) => res.json())
    .then((data) => {
      console.log("🎤 Artista:", data);
      artistHeader.innerHTML = `
        <img src="${data.picture_big}" alt="${data.name}" 
             class="rounded-circle mb-3" width="150">
        <h2>${data.name}</h2>
        <p>${data.nb_fan.toLocaleString()} followers</p>
      `;

      // Dopo info artista, carico canzoni
      loadTopSongs(artistId, data.name, options, songsList);
    })
    .catch((err) => console.error("❌ Errore artista:", err));
}

// TOP SONGS + fallback
function loadTopSongs(artistId, artistName, options, songsList) {
  fetch(
    `https://deezerdevs-deezer.p.rapidapi.com/artist/${artistId}/top?limit=5`,
    options
  )
    .then((res) => res.json())
    .then((data) => {
      console.log("🎵 Top songs API:", data);

      songsList.innerHTML = ""; // pulisco la lista

      if (!data.data || data.data.length === 0) {
        console.warn("⚠️ Nessuna top song trovata, passo a search...");
        return fallbackSearchSongs(artistName, options, songsList);
      }

      renderSongs(data.data, songsList, "TOP");
    })
    .catch((err) => {
      console.error("❌ Errore top songs:", err);
      fallbackSearchSongs(artistName, options, songsList);
    });
}

// FALLBACK con /search
function fallbackSearchSongs(artistName, options, songsList) {
  fetch(
    `https://deezerdevs-deezer.p.rapidapi.com/search?q=${artistName}`,
    options
  )
    .then((res) => res.json())
    .then((data) => {
      console.log("🔎 Risultati fallback search:", data);

      if (data.data && data.data.length > 0) {
        renderSongs(data.data.slice(0, 5), songsList, "FALLBACK");
      } else {
        songsList.innerHTML = "<p>Nessuna canzone trovata</p>";
      }
    })
    .catch((err) => console.error("❌ Errore fallback search:", err));
}

// RENDER SONGS
function renderSongs(songs, container, source) {
  container.innerHTML = "";
  songs.forEach((track, i) => {
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
          <small class="text-muted">${track.artist.name}</small>
        </div>
      </div>
      <span class="text-muted">
        ${Math.floor(track.duration / 60)}:${String(
      track.duration % 60
    ).padStart(2, "0")}
      </span>
    `;

    container.appendChild(row);
  });

  console.log(`✅ Render completato da: ${source}`);
}
