/* API configuration */
const apiBaseUrl = "https://deezerdevs-deezer.p.rapidapi.com";
const options = {
  method: "GET",
  headers: {
   'x-rapidapi-key': 'c485a2ac9bmsh363ec30d5006119p1be212jsn4f4f27d566e5',
		'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
  }
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
    ? item.contributors.slice(0, 3).map(a => a.name).join(", ")
    : item.artist
      ? item.artist.name
      : "";

  const image = item.picture_medium || item.album?.cover_medium || "./assets/imgs/default.jpg";

  card.innerHTML = `
    <img src="${image}" alt="${item.title}" class="w-100">
    <div class="p-2">
      <h6>${item.title}</h6>
      <p>${artists}</p>
    </div>
    <button class="play-btn">▶</button>
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

  const searchHits = await fetchFromDeezer("/search?q=top&limit=10");

  if (searchHits && searchHits.data) {
    mixContainer.innerHTML = "";
    searchHits.data.forEach(item => {
      const card = createMixCard(item);
      mixContainer.appendChild(card);
    });
  } else {
    mixContainer.innerHTML = "<p class='text-center w-100'>Impossibile caricare i mix preferiti</p>";
  }
}

/* Load recommended content (using search query "hit") */
async function loadRecommendedContent() {
  const recommendedContainer = document.getElementById("recommended");
  if (!recommendedContainer) return;

  recommendedContainer.innerHTML = `<div class="text-center w-100 my-5">
    <div class="spinner-border text-light" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>`;

  const tracksData = await fetchFromDeezer("/search?q=recommend&limit=10");

  if (tracksData && tracksData.data) {
    recommendedContainer.innerHTML = "";
    tracksData.data.forEach(track => {
      const card = createMixCard(track);
      recommendedContainer.appendChild(card);
    });
  } else {
    recommendedContainer.innerHTML = "<p class='text-center w-100'>Impossibile caricare i contenuti consigliati</p>";
  }
}

/* scroll card on sections  with arrows */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".scroll-wrapper").forEach(wrapper => {
    const container = wrapper.querySelector(".scroll-row");
    const leftBtn = wrapper.querySelector(".scroll-btn.left");
    const rightBtn = wrapper.querySelector(".scroll-btn.right");

    const scrollAmount = 300; // quanto scrollare

    leftBtn.addEventListener("click", () => {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    rightBtn.addEventListener("click", () => {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
  });
});


/* Initialize */
document.addEventListener("DOMContentLoaded", () => {
  loadFavoriteMixes();
  loadRecommendedContent();
});
