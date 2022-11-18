//DOM VARIABLES
const displayGenres = document.getElementById('genresDisplay');
const moviesResults = document.getElementById('resultsMovies');
const mainContainer = document.getElementById('mainContainer');
const movieDetailsShow = document.getElementById('movieDetails');
const castMovie = document.getElementById('castMovie');
const btnSearch = document.getElementById('btnSearch');

/**
 * API Endpoints
 * DOCUMENTATION: https://developers.themoviedb.org/3/getting-started/introduction
 */
const baseURL = 'https://api.themoviedb.org/3';
const key = '?api_key=7f65f07a5ffa52563f8a6b45d629f577';
const imageURL = 'https://image.tmdb.org/t/p/w500/';

/* It's listening for the DOM to load, and when it does, it calls the getGenres, carouselUpcoming, and
getMovies functions. */
document.addEventListener('DOMContentLoaded', () => {
    getGenres();
    carouselUpcoming();
    getMovies();
})

/**
 * It fetches the genres from the API and displays them in the navbar.
 */
const getGenres = async () => {
    const navGenreSection = document.getElementById('navGenreSection')
    try {
        const response = await fetch(`${baseURL}/genre/movie/list${key}`);
        if (response.status === 200) {
            const data = await response.json();
            data.genres.forEach(genre => {
                var genreDisplay = document.createElement('li');
                genreDisplay.innerHTML = `
                <a class="dropdown-item text-info" href="#" onclick="filterByGenre(${genre.id})">${genre.name}</a>
                `;
                navGenreSection.append(genreDisplay);
            });
        }
    } catch (error) {
        console.log(error);
    }
}

const carouselUpcoming = async () => {
    const mainCarousel = document.querySelector('#carouselUpcoming')
    try {
        const response = await fetch(`${baseURL}/movie/upcoming${key}`)
        //verify the response status
        if (response.status === 200) {
            const data = await response.json();
            data.results.forEach(movie => {
                const carouselMoviesUpcoming = document.createElement('div')
                carouselMoviesUpcoming.classList.add('carousel-item')
                carouselMoviesUpcoming.innerHTML = `
                    <img src="${imageURL}${movie.poster_path}" class="d-block w-100" alt="...">
                `
                mainCarousel.appendChild(carouselMoviesUpcoming);
            });
        } else if (response.status == 401) {
            clearMainSection();
            const errorMessage = document.createElement('div')
            errorMessage.classList.add('container')
            errorMessage.innerHTML = `
                <div class="row">
                    <div class="col-12">
                        <p class="fs-1 pt-5 text-danger text-center fw-bolder">Error: ${response.status}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <p class="fs-1 pt-5 text-white text-center fw-bolder">Something went wrong. API Key invalid</p>
                    </div>
                </div>
            `
            mainContainer.appendChild(errorMessage)
        } else if (response.status == 404) {
            clearMainSection();
            const errorMessage = document.createElement('div')
            errorMessage.classList.add('container')
            errorMessage.innerHTML = `
                <div class="row">
                    <div class="col-12">
                        <p class="fs-1 pt-5 text-danger text-center fw-bolder">Error: ${response.status}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <p class="fs-1 pt-5 text-white text-center fw-bolder">Something went wrong. Results were not found</p>
                    </div>
                </div>
            `
            mainContainer.appendChild(errorMessage)
        } else {

        }

    } catch (error) {
        console.log(error)
    }

}

/**
 * The function getMovies() is a function that fetches the data from the API and then shows the movies.
 */
function getMovies() {
    fetch(`${baseURL}/movie/top_rated${key}&sort_by=popularity.desc`)
        .then(response => response.json())
        .then(data => {
            showMovies(data.results)
        })
}

/**
 * The function is called showMovies and it takes in data as a parameter. The function then loops
 * through the data and displays the first 18 movies in the data.
 * @param data - the data that is returned from the API
 */
function showMovies(data){
    let movies = ''
    let i = 0;
    clearShowMovies();
    data.forEach(movie => {
        if (i < 18) {
            movies += `
            
        <div class='col mb-3' onclick = 'movieDetails(${movie.id})'>
            <div class="card bg-black flex-row border border-danger  border-3">
                <div class="w-50">
                    <a href="" id="movieInfo"><img class='img-fluid' src= '${imageURL}${movie.poster_path}'></a>
                </div>
                <div class="card-body">
                    <a href="#" id="movieInfo movieTitle" class="bg-info text-center fs-4"><p class='title text-info'>${movie.title}</p></a>
                    <p class="text-transparent text-center fs-5"> . </p>
                    <p class="text-white text-center fs-5">Vote average:</p>
                    <p class="text-center text-danger fs-2">${movie.vote_average}</p>
                </div>
                
            </div> 
        </div>
        `
            moviesResults.innerHTML = movies
            i++
        }
    })
}

/**
 * It takes a genreID as an argument, clears the showMovies() function, fetches the data from the API,
 * and then shows the movies.
 * @param genreID - the id of the genre you want to filter by
 */
async function filterByGenre(genreID) {
    clearShowMovies()
    const response = await fetch(`${baseURL}/discover/movie${key}&with_genres=${genreID}`)
    const data = await response.json()
    showMovies(data.results)
}

/**
 * It's a function that takes in a movieId, fetches the movie details from the API, and then prints the
 * movie details to the DOM.
 * @param movieId - the id of the movie you want to get the details of
 */
async function movieDetails(movieId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}${key}`)
        console.log(response)
        if (response.status === 200) {
            const data = await response.json();
            clearShowMovies();
            const printDOM = document.createElement('div')
            printDOM.classList.add('row', 'text-white')
            printDOM.innerHTML = `
            <div class="col-4">
                    <img src="${imageURL}${data.poster_path}" alt="">
                </div>
                <div class="col-8">
                    <div class="row">
                        <div class="col">
                            <h1 class="m-2 text-center pt-3">${data.title}</h1>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <p class="m-2 pt-5">${data.overview}</p>
                        </div>
                    </div>
                    <div class="row">
                        <button class="btn btn-outline-danger mt-5" id="similarMovies" type="button" onclick="getSimilarMovies(${data.id})">Similar movies</button>
                    </div>
                </div
                
            `
            movieDetailsShow.append(printDOM)
        }
        castMovies(movieId)

    } catch (error) {
        console.log(error)
    }

}

/**
 * It takes the movieId from the movie that was clicked on and uses it to fetch the cast of that movie.
 * @param movieId - the id of the movie you want to get the cast for
 */
async function castMovies(movieId) {  
    try {
        const response = await fetch(`${baseURL}/movie/${movieId}/credits${key}`)
        if (response.status === 200) {
            const data = await response.json();
            data.cast.forEach(actor => {
                const showCast = document.createElement('div')
                showCast.classList.add('col', 'text-white', 'pt-5')
                showCast.innerHTML = `
               <img src="${imageURL}${actor.profile_path}" alt="${actor.character}">
                <h5 class="text-center pt-2">${actor.name}</h5>
                `
                castMovie.append(showCast)
            })
        }
    } catch (error) {
        console.log(error)
    }
}

/**
 * The function filterMovies() takes in a searchMovie parameter, and then uses that parameter to make a
 * fetch request to the API, and then if the response is successful, it will log the data to the
 * console.
 * @param searchMovie - the movie the user is searching for
 */
async function filterMovies(searchMovie) {
    const response = await fetch(`${baseURL}/search/movie${key}&query=${searchMovie}`)
    if (response.status === 200) {
        const data = response.json()
    }
}

/**
 * It fetches the data from the API, and if the response is successful, it will show the movies.
 * @param id - the id of the movie you want to get similar movies for
 */
async function getSimilarMovies(id){
    const response = await fetch(`${baseURL}/movie/${id}/similar${key}&language=en-US&page=1`)
    console.log(response)
    if(response.status === 200){
        const data = await response.json()
        showMovies(data.results)
    }
}

/* It's listening for a click event on the btnSearch button. When the button is clicked, it gets the
value of the input field and passes it to the searchByName function. */
btnSearch.addEventListener('click', () => {
    const dataQuery = document.getElementById('movieInput').value;
    searchByName(dataQuery)
})

/**
 * It takes a query, makes a request to the API, and if the response is successful, it parses the
 * response and passes the data to the showMovies function.
 * @param query - the search term
 */
async function searchByName(query){
    const response = await fetch(`${baseURL}/search/movie${key}&query=${query}`);
    console.log(response)
    if(response.status === 200){
        const data = await response.json()
        console.log(data)
        showMovies(data.results)
    }
}

/**
 * It clears the innerHTML of the moviesResults, movieDetailsShow, and castMovie divs.
 */
function clearShowMovies() {
    moviesResults.innerHTML = ''
    movieDetailsShow.innerHTML = ''
    castMovie.innerHTML = ''
}

/**
 * It clears the main section of the page.
 */
function clearMainSection() {
    mainContainer.innerHTML = ''
}
