// create 4 global variables for each API endpoint and Streaming results

function callRecommendationAPI(title, callback) {
  /* calls API used for movie reccomendations, passes to it the Title
  aubmitted by the user and callback function, API returns list of recommended
  movies that are then passed through the callback function */
}

function renderRecResults() {
  /* creates HTML code for each item returned as a reccomendation, will
  include title, date, and small image of movie poster */
}

function displayRecommendations(data) {
  /* used as callback function for API call, passes each result item to the
  render function and creates array of results HTML assigned to variable results,
  inserts HTML into main div in the html document */
}

function watchForSubmit() {
  /* event listener that watches for user submission of title,
  then invokes function calling api data and passes to it the title
  entered in the form field */
}

function callFilmInfoAPI(title, callback) {
  /* calls API used for film info to pull summary, ratings, cast info, review rating for
  title, data passed through callback function */
}

function callClipsAPI(title, callback) {
  /* calls API used for video clips to pull results based on title as a query, data
  passed through callback */
}

function renderFilmInfo(info) {
  /* creates HTML code for info returned by film info API, Title, review rating, plot
  summary, cast info, rating, and runtime in a div within the "mainBox" div */
}

function renderFilmClips(clips) {
  /* creates HTML code for results returned from film clips API, 5 clips placed in div
  along side info, child of "mainBox" div */
}

function displayFilmInfo(data) {
  /* used as callback in callFilmInfoAPI passes info to the renderFilmInfo function and
  inserts into "mainBox" html */
}

function displayFilmClips(data) {
  /* used as callback for callFilmInfoAPI, creates array of results from renderFilmClips and
  displays in "mainBox" div */
}

function createStreamIframe(title) {
  /* creates iFrame linked to where to stream website passing film name to href in the rendered
  HTML code, inserts into HTML in "mainBox" div */
}

function watchForResultClick() {
  /* event listener that watches for a user to click on one of the reccomendation
  results, invokes function calling the film info API, film clips(youtube) API, and
  the "where to strem" iframe and passes each the title of the film selected */
}
