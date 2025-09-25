/* Api url,options,authorization */
const apiUrl = "https://deezerdevs-deezer.p.rapidapi.com/genre/";
const apiOptions = {
  method: "GET",
  headers: {
		'x-rapidapi-key': token,
		'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
	}
};

/* selected genres id by me */
const allCategories = [113, 132, 152, 122, 165, 106, 466, 144, 129, 84, 67, 98, 80, 197, 116, 71];
/* fetch categories by id */
async function fetchCategories(id) {
  try {
    const response = await fetch(apiUrl + id, apiOptions);
    const result = await response.json();
    /* console.log(result); */
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

/* function for creating dynamic card */
const categoriesCard = (category) => {
  // random colors
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const randomColor = `rgb(${r}, ${g}, ${b})`;
  
  const col = document.createElement("div");
  col.className = "col";
  
  // dynamic data
  col.innerHTML = `
    <a href="#" class="text-white text-decoration-none">
      <div class="search-card position-relative rounded-2" style="background-color: ${randomColor}">
        <h2 class="fs-4 fw-bold search-card-title">${category.name}</h2>
        <img src="${category.picture_medium}" class="search-card-img" alt="${category.name}" title="${category.name}">
      </div>
    </a>
  `;
  
  return col;
}

// Function display All Categories
const displayCategories = async () => {
  
  const genresContainer = document.querySelector(".row.row-cols-1.row-cols-lg-2.row-cols-xl-3.row-cols-xxl-4.py-3.gy-4");
  /* if not exist */
  if (!genresContainer) {
    console.error("Container categorie non trovato!");
    return;
  }
  
  // empty container
  genresContainer.innerHTML = "";
  
  // add uploading spinner
  const spinnerContainer = document.createElement("div");
  spinnerContainer.className = "text-center w-100 my-5";
  spinnerContainer.innerHTML = `
    <div class="spinner-border text-light" role="status" style="width: 3rem; height: 3rem;">
      <span class="visually-hidden">Loading...</span>
    </div>
  `;
  genresContainer.appendChild(spinnerContainer);
  
  try {
    // upload all categories
    const promises = allCategories.map(id => fetchCategories(id));
    const categoriesData = await Promise.all(promises);
    
    // remove spinner
    genresContainer.removeChild(spinnerContainer);
    
    // add cards to container
    categoriesData.forEach(categoryData => {
      if (categoryData) {
        const card = categoriesCard(categoryData);
        genresContainer.appendChild(card);
      }
    });
  } catch (error) {
    console.error("Errore nel caricamento delle categorie:", error);
    // if error remove spinner
    if (spinnerContainer.parentNode === genresContainer) {
      genresContainer.removeChild(spinnerContainer);
    }
    // error message
    genresContainer.innerHTML = `<div class="col-12 text-center text-danger">Errore nel caricamento delle categorie</div>`;
  }
}

// Dom content loaded
document.addEventListener("DOMContentLoaded", () => {
  displayCategories();
});