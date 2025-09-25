/* API configuration */
const api = "https://deezerdevs-deezer.p.rapidapi.com/playlist/";
const apiOptionsSidebar = {
  method: "GET",
  headers: {
    "x-rapidapi-key": token,
    "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  },
};

/* function fetch playlist */
async function fetchPlaylist(id) {
  try {
    const response = await fetch(api + id, apiOptionsSidebar);
    const result = await response.json();
    /* console.log(result); */
    return result;
  } catch (error) {
    console.error("Error fetching data from Deezer API:", error);
    return null;
  }
}

// function load playlist
async function loadPlaylists() {
    const playlistIds = [122, 244, 129,160, 144, 351, 3444, 66,4555, 4233,4235]; 
    const playlist = document.getElementById("playlist");
    const spinner = document.getElementById("spinner");

    for (let id of playlistIds) {
        const data = await fetchPlaylist(id);
        if (!data) continue;
    
        const div = document.createElement("div");
        div.classList.add("d-flex", "align-items-center", "gap-3", "ps-2", "mb-2");
    
        div.innerHTML = `
          <img src="${data.picture_small}" class="rounded-1" width="48" height="48" alt="${data.title}" title="playlist">
          <div>
            <h6 class="m-0">${data.title}</h6>
            <p class="grey-light m-0">Playlist • <span>${data.tracks.data.length || 0}</span> brani</p>
          </div>
        `;
    
        playlist.appendChild(div);
      }
    
      if (spinner) {
        spinner.style.display = "none";
      }
    }
    
  // load playlist
  loadPlaylists();