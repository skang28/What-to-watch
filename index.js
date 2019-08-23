const mbdApiKey = 'c925ed2e2ec6bdab063211233d710e91';
const omdbApiKey = '4b3bd4be';
const maxResults = 3;



function getGenres(callback) {
    fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=c925ed2e2ec6bdab063211233d710e91&language=en-US')
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => {
        console.log(responseJson)
        callback(responseJson)
    })
    .catch(err => {
        $('.errorMessage').text(`Uh oh. Something went wrong: ${err.message}`)
    });
}

function getMovieResults(genreList) {
    console.log(genreList);
    // can't find genre
    let genreID = genreList.find(genre => genre.name === selectGenre).id;
    console.log(genreID);
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${mdbApiKey}&language=en-US&include_adult=true&with_genres=${genreID}&include_video=false`)
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error(response.statusText); 
    })
    .then(responseJson => {
        displayMovieResults(responseJson);
        getImdbResults(responseJson);
    })
    .catch(err => {
        $('.errorMessage').text(`Uh oh. Something went wrong: ${err.message}`)
    });
}

function getImdbResults(movieTitle) {
    // need to extract movietitle from movieresults and add it here
    fetch(`http://www.omdbapi.com/?t=${movieTitle}&apikey=${omdbApiKey}`)
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error(response.statusText); 
    })
    .then(responseJson => {
        displayMovieResults(responseJson)
    })
    .catch(err => {
        $('.errorMessage').text(`Uh oh. Something went wrong: ${err.message}`)
    });
}

// movies[Math.random()*(movies.length-1))]

function getTVResults(genreList) {
    let genreID = genreList.find(genre => genre.genres.name === $('option').val().id);
    fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${mdbApiKey}&language=en-US&with_genres=${genreID}`)
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error(response.statusText); 
    })
    .then(responseJson => displayTVResults(responseJson))
    .catch(err => {
        $('.errorMessage').text(`Uh oh. Something went wrong: ${err.message}`)
    });  
}

function displayMovieResults(responseJson) {
    $('main').html(`
        <div class="poster"><img src="https://image.tmdb.org/t/p/w185_and_h278_bestv2${responseJson.results.poster_path}" alt="Poster of movie">
        <h2>${responseJson.results.title}</h2>
        <h2>${responseJson.results.release_date}</h2>
        <p>${responseJson.results.overview}</p>
        <div class="castInfo">
        <div class="imdbContainer">
        <div class="rottenTomatoescontainer">
        `)
}

function displayTVResults() {
    $('main').html(`
        <div class="poster"><img src="https://image.tmdb.org/t/p/w185_and_h278_bestv2${responseJson.results.poster_path}" alt="Poster of movie">
        <h2>${responseJson.results.title}</h2>
        <h2>${responseJson.results.release_date}</h2>
        <p>${responseJson.results.overview}</p>
        <div class="castInfo">
        <div class="imdbContainer">
        <div class="rottenTomatoescontainer">
        `)
}

function searchPage() {
    $('header').html(`
        <h1>Welcome Message!</h1>`);
    $('main').html(`
        <form class='mainForm'>
            <fieldset>
                <label>Select Genre</label>
                <select id='genreList'>
                    <option value='Action'>Action</option>
                    <option value='Adventure'>Adventure</option>
                    <option value='Animation'>Animation</option>
                    <option value='Comedy'>Comedy</option>
                    <option value='Crime'>Crime</option>
                    <option value='Documentary'>Documentary</option>
                    <option value='Drama'>Drama</option>
                    <option value='Family'>Family</option>
                    <option value='Fantasy'>Fantasy</option>
                    <option value='History'>History</option>
                    <option value='Horror'>Horror</option>
                    <option value='Music'>Music</option>
                    <option value='Mystery'>Mystery</option>
                    <option value='Romance'>Romance</option>
                    <option value='Science Fiction'>Science Fiction</option>
                    <option value='TV Movie'>TV Movie</option>
                    <option value='Thriller'>Thriller</option>
                    <option value='War'>War</option>
                    <option value='Western'>Western</option>
                </select>
                <br><br>
                <label class='selectMovieOrTV'><input type='radio' value='Movie' required>Movie</label>
                <label class='selectMovieOrTV'><input type='radio' value='TV Show' required>TV Show</label>
                <br><br>
                <input type="submit" value="What should I watch?">
            </fieldset>
        </form>`);
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();    
        let selectType = $('input:checked').val();  
        if (selectType === 'TV Show') {
            getGenres(getTVResults);
        }
        else {
            getGenres(getMovieResults);
        }
    });
}

$(searchPage);
$(watchForm);

