const ID_URL = "https://api.themoviedb.org/3/search/movie";
const REC_URL = "https://api.themoviedb.org/3/movie/";
const INFO_URL = "http://www.omdbapi.com";
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

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

function renderIdResults(result) {
  var releaseYear = result.release_date.slice(0, 4);
  return `
    <div class='js-id-result'>
      <h2>${result.title} (${releaseYear})</h2>
      <button type='button' class='js-id-button' id=${result.id}>Get Recommendations</button>
    </div>
    `;
}

function renderErrMsg() {
  return `
    <p>Sorry we could not find that title, check your spelling or try a different film.</p>
  `;
}

function displayIDSearch(data) {
  if (data.total_results !== 0) {
    const results = data.results.map((item, index) => renderIdResults(item));
    $('.js-resultsBox').html(results);
    watchForTitleClick();
  } else {
    $('.js-resultsBox').html(renderErrMsg);
  }
}

function watchForSubmit() {
  $('.js-title-search').submit(event => {
      event.preventDefault();
      const queryTarget = $(event.currentTarget).find('.js-query');
      const query = queryTarget.val();
      queryTarget.val('');
      getFilmID(query, displayIDSearch);
    });
}

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

function renderRecResults(result) {
  var releaseYear = result.release_date.slice(0, 4);
  return `
    <div class='js-rec-result'>
      <h2>${result.title} (${releaseYear})</h2>
      <button type='button' class='js-rec-button' id='${result.title}'>Get Info</button>
    </div>
  `;
}

function displayRecommendations(data) {
  const results = data.results.map((item, index) => renderRecResults(item));
  $('.js-resultsBox').html(results);
  watchForResultClick();
}

function watchForTitleClick() {
  $('button.js-id-button').click(event => {
      event.preventDefault();
      const filmID = event.currentTarget.id;
      callRecommendationAPI(filmID, displayRecommendations);
    });
}

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

function renderFilmClips(result) {
  return `
    <div class="film-clips">
      <a target="_blank" href='http://www.youtube.com/watch?v=${result.id.videoId}'><img src='${result.snippet.thumbnails.default.url}' alt="clip thumbnail"></a>
      <h5>${result.snippet.title}</h5>
    </div>
  `
}

function displayFilmInfo(data) {
  const results = `
    <button type="button" class="js-return">Return To Results</button>
    <div class="results-container"</div>
      <div class="film-info">
        <h2>${data.Title} (${data.Year})</h2>
        <img src=${data.Poster}>
        <h4>${data.Rated}</h4>
        <h4>Metascore: ${data.Metascore}</h4>
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
            <a target="_blank" href='https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Dprime-instant-video&field-keywords=${data.Title}'><img src="amazon-icon.png"></a>
            <a target="_blank" href='https://flixable.com/?s=${data.Title}'><img src="netflix-icon.png"></a>
            <a target="_blank" href='https://www.hulu.com/search?q=${data.Title}&type=movies'><img src="hulu-icon.png"></a>
            <a target="_blank" href='https://www.justwatch.com/us/search?q=${data.Title}'><img src="JustWatch-logo-small.png" width="180"></a>
          </div>
        </div>
      </div>
    </div>
  `;
  $('.js-infoBox').html(results);
  $('.js-infoBox').removeClass('hidden');
  $('.js-resultsBox').addClass('hidden');
}

function displayFilmClips(data) {
  const results = data.items.map((item, index) => renderFilmClips(item));
  $('.js-film-clips').append(results);
  returnToResults();
}

function watchForResultClick() {
  $('.js-rec-button').click(event => {
    event.preventDefault();
    const filmTitle = event.currentTarget.id;
    callFilmInfoAPI(filmTitle, displayFilmInfo);
    callClipsAPI(filmTitle, displayFilmClips);
  });
}

function returnToResults() {
  $('.js-return').click(event => {
    event.preventDefault();
    $('.js-resultsBox').removeClass('hidden');
    $('.js-infoBox').html('');
  });
}

function runListeners() {
  watchForSubmit();
  watchForTitleClick();
  returnToResults();
}

$(runListeners);
