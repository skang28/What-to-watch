const mbdApiKey = 'c925ed2e2ec6bdab063211233d710e91';
const omdbApiKey = '4b3bd4be';
const genreStore = {};



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
    let genreID = genreList.genres.find(genre => genre.name === genreStore.selectGenre).id;
    console.log(genreID);
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${mbdApiKey}&language=en-US&include_adult=true&with_genres=${genreID}&include_video=false`)
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error(response.statusText); 
    })
    .then(responseJson => {
       getImdbResults(processResults(responseJson));
    })
    .catch(err => {
        $('.errorMessage').text(`Uh oh. Something went wrong: ${err.message}`)
    });
}

function processResults(object) {
    let random_object = object.results[Math.floor(Math.random()*(object.results.length-1))];
    if(random_object.first_air_date) {
        random_object.release_date=random_object.first_air_date;
    }
    if(random_object.name) {
        random_object.title=random_object.name;
    }
    return random_object;
}

function getImdbResults(movieObjects) {
    // need to extract movietitle from movieresults and add it here
    // use encodeURI component
    console.log(movieObjects);
    fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(movieObjects.title)}&apikey=${omdbApiKey}`)
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error(response.statusText); 
    })
    .then(responseJson => {
        displayResults(movieObjects,responseJson)
    })
    .catch(err => {
        $('.errorMessage').text(`Uh oh. Something went wrong: ${err.message}`)
    });
}

function getTVResults(genreList) {
    let genreID = genreList.genres.find(genre => genre.name === genreStore.selectGenre).id;    
    fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${mbdApiKey}&language=en-US&with_genres=${genreID}`)
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error(response.statusText); 
    })
    .then(responseJson => {
        getImdbResults(processResults(responseJson));
     })    
     .catch(err => {
        $('.errorMessage').text(`Uh oh. Something went wrong: ${err.message}`)
    });  
}

function displayResults(movieObjects,imdbResults) {
    console.log(imdbResults);
    let rottenTitle = movieObjects.title.replace(new RegExp(/ |-/, 'g'), '_').replace(new RegExp(/:|!|\/|\.|/,'g'),'').replace(new RegExp(/&/,'g'),'and').replace(new RegExp(/_+/,'g'),'_').toLowerCase();
    console.log(rottenTitle);
    $('main').html(`
        <div class="poster"><img src="https://image.tmdb.org/t/p/w185_and_h278_bestv2${movieObjects.poster_path}" alt="Poster of movie"></div>
        <h2>${movieObjects.title}</h2>
        <h2>${movieObjects.release_date}</h2>
        <p>${movieObjects.overview}</p>
        <div class="castInfo">${imdbResults.Actors}</div>
        <div class="imdbContainer">
            <p>${imdbResults.imdbRating}</p>
            <a href="http://www.imdb.com/title/${imdbResults.imdbID}" target="_blank">IMDb</a>
        </div>
        <div class="rottenTomatoescontainer">
            <a href="http:www.rottentomatoes.com/m/${rottenTitle}" target="_blank">RottenTomatoes</a>
        </div>
        `)
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault(); 
        let selectGenre = $('select').val();
        genreStore.selectGenre = selectGenre;   
        let selectType = $('input:checked').val();  
        if (selectType === 'TV Show') {
            getGenres(getTVResults);
        }
        else {
            getGenres(getMovieResults);
        }
    });
}

$(watchForm);