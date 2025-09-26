/* API configuration */
const apiBaseUrl = "https://deezerdevs-deezer.p.rapidapi.com";
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": token,
    "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  },
};

/* Function to fetch data from Deezer API */
async function fetchFromDeezer(endpoint) {
  try {
    const response = await fetch(`${apiBaseUrl}${endpoint}`, options);
    return await response.json();
  } catch (error) {
    console.error("Error fetching data from Deezer API:", error);
    return null;
  }
}



/* Function to create a card */
function createMixCard(item) {
  const card = document.createElement("div");
  card.className = "home-card";

  const artists = item.contributors
    ? item.contributors
        .slice(0, 3)
        .map((a) => a.name)
        .join(", ")
    : item.artist
    ? item.artist.name
    : "";

  const image = item.picture_medium || item.album?.cover_medium;

  card.innerHTML = `
    <div class="home-image-container">
    <img src="${image}" alt="${item.title}" class="w-100">
    <a href="#" class="play-btn"> <svg data-encore-id="icon" role="img" width="20" fill="#000" aria-hidden="true" class="e-91000-icon e-91000-baseline" viewBox="0 0 24 24"><path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path></svg></a>
    </div>
    <div class="p-2">
      <p>${item.title}</p>
      <p>${artists}</p>
    </div>
  `;

  return card;
}



/* Load favorite mixes (using search query) */
async function loadFavoriteMixes() {
  const mixContainer = document.getElementById("favorite-mixes");
  if (!mixContainer) return;

  mixContainer.innerHTML = `<div class="text-center w-100 my-5">
    <div class="spinner-border text-light" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>`;

  const searchHits = await fetchFromDeezer("/search?q=techno&limit=10");

  if (searchHits && searchHits.data) {
    mixContainer.innerHTML = "";
    searchHits.data.forEach((item) => {
      const card = createMixCard(item);
      mixContainer.appendChild(card);
      /* passare playlist id al click della card */
      card.addEventListener("click", () => {
        const playlistId = item.id;
        window.location.href = `album.html?playlistId=${playlistId}`;

      });
    });
  } else {
    mixContainer.innerHTML =
      "<p class='text-center w-100'>Impossibile caricare i mix preferiti</p>";
  }
}

/* recommend section (using search query "hit") */
async function loadRecommendedContent() {
  const recommendedContainer = document.getElementById("recommended");
  if (!recommendedContainer) return;

  recommendedContainer.innerHTML = `<div class="text-center w-100 my-5">
    <div class="spinner-border text-light" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>`;

  const tracksData = await fetchFromDeezer("/search?q=bustarhymes&limit=10");

  if (tracksData && tracksData.data) {
    recommendedContainer.innerHTML = "";
    tracksData.data.forEach((track) => {
      const card = createMixCard(track);
      recommendedContainer.appendChild(card);
      /* passare playlist id al click della card */
      card.addEventListener("click", () => {
        const playlistId = track.id;
        window.location.href = `album.html?playlistId=${playlistId}`;
  
      });
    });
  } else {
    recommendedContainer.innerHTML =
      "<p class='text-center w-100'>Impossibile caricare i contenuti consigliati</p>";
  }
}

/* scroll card on sections  with arrows */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".scroll-wrapper").forEach((wrapper) => {
    const container = wrapper.querySelector(".scroll-row");
    const leftBtn = wrapper.querySelector(".scroll-btn.left");
    const rightBtn = wrapper.querySelector(".scroll-btn.right");

    const scrollAmount = 300;

    leftBtn.addEventListener("click", () => {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    rightBtn.addEventListener("click", () => {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
  });
});

/* dom */
document.addEventListener("DOMContentLoaded", () => {
  loadFavoriteMixes();
  loadRecommendedContent();
});
