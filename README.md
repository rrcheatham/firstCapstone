# firstCapstone - The Movie Machine

A webapp that allows users to submit the title of one of their favorite films and returns a list of recommendations for other films
based on that title. The app uses the following APIs:

For film IDs & recommendations: The Movie Database (tMDB)
For film summary, rating, cast, and other info: The Open Movie Database (OMDb)
For film clips: YouTube

The app starts with a search box inviting a user to enter the title of a film he or she enjoyed. A call is made to
the tMDB API and returns a list of films based on the search term entered by the user which allows the user 
to confirm the film he or she is entering. This not only avoids issues with spelling or incomplete names, 
but allows the web app to pull the film ID from The Movie Database API, a crucial piece of information for recommendations. 
Each result in the first list has a button allowing the user to get recommendations for that title. If no films are found based
on the search term, the user is altered to check spelling or try another film.

When the user clicks on the cget recommendations button, the filmID is passed back to the tMDB API and returns a list of 
recommendation based on that title. The results list is similar to the first, except each recommendation has a button the user
can click to find out more info on the film. If no recommendations are returned, the user is altered to try a different title. 

When the user clicks the "more info" button, a call is made to the OMDb database to pull in the info for the film. This information
(movie poster, a metascore, rating, cast list, a synopsis) is displayed in the DOM. Another call is made to YouTube passing it the
film title along with the term Moveclips, to return clips from the film itself. Clickable thumbnails of these YouTube results are 
also rendered in the DOM. The last section rendered on a click of "more info" is external links to search results based on the film
title for Amazon prime, netflix (using a third part nexflix search site), hulu, and Justwatch (a website that aggregates where to 
stream, download, or purchase a film). If no info is found on the OMDb site, the user is informed but the other sections are still
rendered. Users are able to return to results from the info page and resubmit searches.
