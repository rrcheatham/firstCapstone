const ID_URL = "https://api.themoviedb.org/3/search/movie";
const REC_URL = "https://api.themoviedb.org/3/movie/";
const INFO_URL = "https://www.omdbapi.com";
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

//get film ID from the movieDB database to confirm intial search
function getFilmID(title, callback) {
  const settings = {
    url: ID_URL,
    data: {
      query: `${title}`,
      api_key: '04dff062429d9d77bb8beaafb0576a0d',
      page: 1,
    },
    dataType: 'json',
    type: 'GET',
    success: callback,
  };
  $.ajax(settings);
}

// rendering for each result of ID search with title and release year
function renderIdResults(result) {
  var releaseYear = result.release_date.slice(0, 4);
  return `
    <div class='js-id-result'>
      <h2>${result.title} (${releaseYear})</h2>
      <button type='button' class='js-id-button' id=${result.id}>Get Recommendations</button>
    </div>
    `;
}

//render error message of return of no results
function renderErrMsg() {
  return `
    <p>Sorry we could not find that title, check your spelling or try a different film.</p>
  `;
}

function renderRecErr() {
  return `
    <p>Sorry there are no recommendations for this film, please try another title.</p>
  `;
}

//if movieDB returns results pass them to the render function to create array and insert in DOM
//if movieDB returns 0 results render error message and insert in DOM
function displayIDSearch(data) {
  if (data.total_results !== 0) {
    const results = data.results.map((item, index) => renderIdResults(item));
    $('.js-resultsBox').html(results);
    watchForTitleClick();
  } else {
    $('.js-resultsBox').html(renderErrMsg);
  }
}

//clear search field on click
function clearSearchField() {
  $('.js-query').on('click focus', event => {
      $('.js-query').val('');
    });
}

//intial submit event listener that calls movieDB API and passes it the title entered
//scrolls down to results on submit
function watchForSubmit() {
  $('.js-title-search').submit(event => {
      event.preventDefault();
      const queryTarget = $(event.currentTarget).find('.js-query');
      const query = queryTarget.val();
      queryTarget.val('');
      getFilmID(query, displayIDSearch);
      $('html, body').animate({
        scrollTop: $('.js-resultsBox').offset().top,
      }, 1000);
    });
}

//call to movieDB for list of recommendations based on filmID
function callRecommendationAPI(filmID, callback) {
  const settings = {
    url: `https://api.themoviedb.org/3/movie/${filmID}/recommendations`,
    data: {
      api_key: '04dff062429d9d77bb8beaafb0576a0d',
    },
    dataType: 'json',
    type: 'GET',
    success: callback,
  };
  $.ajax(settings);
}

//render recommendation results
function renderRecResults(result) {
  var releaseYear = result.release_date.slice(0, 4);
  return `
    <div class='js-rec-result'>
      <h2>${result.title} (${releaseYear})</h2>
      <button type='button' class='js-rec-button' id='${result.title}'>Get Info</button>
    </div>
  `;
}

//create of array of data returned by API call and passed to render function, insert in DOM
function displayRecommendations(data) {
  if (data.results.length !== 0) {
    const results = data.results.map((item, index) => renderRecResults(item));
    $('.js-resultsBox').html(results);
    watchForResultClick();
  } else {
    $('.js-resultsBox').html(renderRecErr);
  }
}

//event listener for click on get recommendations button for each title
function watchForTitleClick() {
  $('button.js-id-button').click(event => {
      event.preventDefault();
      const filmID = event.currentTarget.id;
      callRecommendationAPI(filmID, displayRecommendations);
    });
}

//call to open movie DB for info on recommended film
function callFilmInfoAPI(title, callback) {
  const settings = {
    url: INFO_URL,
    data: {
      apikey: 'ed1d6ed2',
      t: title,
      plot: 'full',
      type: 'movie',
    },
    dataType: 'json',
    type: 'GET',
    success: callback,
  };
  $.ajax(settings);
}

//call to YouTube api for Movieclips results of selected recommendation
function callClipsAPI(title, callback) {
  const settings = {
    url: YOUTUBE_SEARCH_URL,
    data: {
      q: `${title} Movieclips`,
      key: 'AIzaSyDrZQIOJs7kdA1lIk1aExpN01EGDfNeBh8',
      part: 'snippet',
    },
    dataType: 'json',
    type: 'GET',
    success: callback,
  };
  $.ajax(settings);
}

//render for each film result
function renderFilmClips(result) {
  return `
    <div class="film-clips">
      <a target="_blank" href='http://www.youtube.com/watch?v=${result.id.videoId}'><img src='${result.snippet.thumbnails.default.url}' alt="clip thumbnail"></a>
      <h5>${result.snippet.title}</h5>
    </div>
  `;
}

function renderFilmInfo(data) {
  return `
    <button type="button" class="js-return">Return To Results</button>
    <div class="results-container"</div>
      <div class="film-info">
        <h2>${data.Title} (${data.Year})</h2>
        <img src=${data.Poster} alt="movie poster">
        <h3>${data.Rated}</h3>
        <h3>Metascore: ${data.Metascore}</h3>
        <h4>${data.Actors}</h4>
        <p>${data.Plot}</p>
      </div>
      <div class="clips-container">
        <div class="js-film-clips">
        <h3>Watch MovieClips on Youtube:</h3>

        </div>
        <div class="links-container">
          <h4>Find Stream or Download</h4>
          <div class="links">
            <a target="_blank" href='https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Dprime-instant-video&field-keywords=${data.Title}'><img src="amazon-icon.png" alt="amazon"></a>
            <a target="_blank" href='https://flixable.com/?s=${data.Title}'><img src="netflix-icon.png" alt="netflix"></a>
            <a target="_blank" href='https://www.hulu.com/search?q=${data.Title}&type=movies'><img src="hulu-icon.png" alt="hulu"></a>
            <a target="_blank" href='https://www.justwatch.com/us/search?q=${data.Title}'><img src="JustWatch-logo-small.png" width="180" alt="just watch"></a>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderNoFilmInfo(data) {
  return `
    <button type="button" class="js-return">Return To Results</button>
    <div class="results-container"</div>
      <div class="film-info">
        <p>Sorry there is no information availible for this film, but you can still see clips and find it streaming below.</p>
      </div>
      <div class="clips-container">
        <div class="js-film-clips">
        <h3>Watch MovieClips on Youtube:</h3>

        </div>
        <div class="links-container">
          <h4>Find Stream or Download</h4>
          <div class="links">
            <a target="_blank" href='https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Dprime-instant-video&field-keywords=${data.Title}'><img src="amazon-icon.png" alt="amazon"></a>
            <a target="_blank" href='https://flixable.com/?s=${data.Title}'><img src="netflix-icon.png" alt="netflix"></a>
            <a target="_blank" href='https://www.hulu.com/search?q=${data.Title}&type=movies'><img src="hulu-icon.png" alt="hulu"></a>
            <a target="_blank" href='https://www.justwatch.com/us/search?q=${data.Title}'><img src="JustWatch-logo-small.png" width="180" alt="just watch"></a>
          </div>
        </div>
      </div>
    </div>
  `;
}

//render and display film info, no array of results since searching by ID
//added customized links for stream services search based on title
function displayFilmInfo(data) {
  if (data.Response !== 'False') {
    const results = renderFilmInfo(data);
    $('.js-infoBox').html(results);
    $('.js-infoBox').removeClass('hidden');
    $('.js-resultsBox').addClass('hidden');
    $('.js-mainBox').addClass('hidden');
  } else {
    const results = renderNoFilmInfo(data);
    $('.js-infoBox').html(results);
    $('.js-infoBox').removeClass('hidden');
    $('.js-resultsBox').addClass('hidden');
    $('.js-mainBox').addClass('hidden');
  }
}

//pass youTube data to render function and insert array into DOM
function displayFilmClips(data) {
  const results = data.items.map((item, index) => renderFilmClips(item));
  $('.js-film-clips').append(results);
  returnToResults();
}

//event listener for Get Info button click, calls info and youTube APIs
function watchForResultClick() {
  $('.js-rec-button').click(event => {
    event.preventDefault();
    const filmTitle = event.currentTarget.id;
    callFilmInfoAPI(filmTitle, displayFilmInfo);
    callClipsAPI(filmTitle, displayFilmClips);
  });
}

//event listener on return to results button
function returnToResults() {
  $('.js-return').click(event => {
    event.preventDefault();
    $('.js-resultsBox').removeClass('hidden');
    $('.js-mainBox').removeClass('hidden');
    $('.js-infoBox').html('');
    $('html, body').animate({
      scrollTop: $('.js-resultsBox').offset().top,
    }, 1000);
  });
}

//intial listeners for title submit
function runListeners() {
  clearSearchField();
  watchForSubmit();

  //  watchForTitleClick();
  //  returnToResults();
}

$(runListeners);
