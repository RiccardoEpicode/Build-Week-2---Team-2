const apiUrl = "https://deezerdevs-deezer.p.rapidapi.com/search?q=";
const apiOptions = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "c485a2ac9bmsh363ec30d5006119p1be212jsn4f4f27d566e5",
    "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  },
};


/*  */

async function searchApi(endpoint) {
    try {
        const response = await fetch(apiUrl + endpoint, apiOptions);
        const result = await response.json();
        console.log(result);
        
    } catch (error) {
        console.log(error);
    }
   
}

searchApi("snoop dogg");