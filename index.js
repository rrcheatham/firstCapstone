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
  return `
    <div class='js-id-result'>
      <h2>${result.title}</h2>
      <button type='button' class='js-id-button' id=${result.id}>Get Recommendations</button>
    </div>
  `;
}

function displayIDSearch(data) {
  const results = data.results.map((item, index) => renderIdResults(item));
  $('.js-mainBox').html(results);
  watchForTitleClick();
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
  return `
    <div class='js-rec-result'>
      <h2>${result.title}</h2>
      <button type='button' class='js-rec-button' id='${result.title}'>Get Info</button>
    </div>
  `;
}

function displayRecommendations(data) {
  const results = data.results.map((item, index) => renderRecResults(item));
  $('.js-mainBox').html(results);
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
      q: `${title}`,
      key: 'AIzaSyDrZQIOJs7kdA1lIk1aExpN01EGDfNeBh8',
      part: 'snippet',
    },
    dataType: 'json',
    type: 'GET',
    success: callback,
  };
  $.ajax(settings);
}

function renderFilmInfo(result) {
  return `
    <div class="film-info">
      <h2>${result.Title}</h2>
      <img src=${result.Poster}>
      <h4>${result.Rated}</h4>
      <h4>Metascore: ${result.Metascore}</h4>
      <h4>${result.Actors}</h4>
      <p>${result.Plot}</p>
    </div>
  `;
}

function renderFilmClips(result) {
  return `
    <div class="film-clips">
      <a href='http://www.youtube.com/watch?v=${result.id.videoId}'><img src='${result.snippet.thumbnails.default.url}' alt="video thumbnail"></a>
      <h4> ${result.snippet.title} </h4>
    </div>
  `
}

function displayFilmInfo(data) {
  const results = `
    <button type="button" class="js-return">Return To Results</button>
    <div class="film-info">
      <h2>${data.Title}</h2>
      <img src=${data.Poster}>
      <h4>${data.Rated}</h4>
      <h4>Metascore: ${data.Metascore}</h4>
      <h4>${data.Actors}</h4>
      <p>${data.Plot}</p>
    </div>
    <div class="js-film-clips">
    </div>
    <iframe frameborder="0" src="http://www.canistream.it/external/imdb/${data.imdbID}?l=mini-bar" width="100%" height="140" scrolling="no"></iframe>
  `;
  $('.js-mainBox').html(results);
}

function displayFilmClips(data) {
  const results = data.items.map((item, index) => renderFilmClips(item));
  $('.js-film-clips').html(results);
}

function createStreamIframe(title) {
  /* creates iFrame linked to where to stream website passing film name to href in the rendered
  HTML code, inserts into HTML in "mainBox" div */
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
  /* enable user to return to list of results
  function must save results data and rerender */
}

function runListeners() {
  watchForSubmit();
  watchForTitleClick();
}

$(runListeners);
