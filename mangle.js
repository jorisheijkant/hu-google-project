// This is the main script that changes the search results
// See comments for more info on how it works

// this function fetches the filters from the VPS
let fetchFilters = async function() {
    let response = await fetch('https://api.jorisheijkant.nl/data/hu/legacy-filters.json');

    if (response.ok) {
        let json = await response.json();
        console.log('fetched filters!', json);
        return json;
    } else {
        console.log("HTTP-Error: " + response.status);
    }
}

// Set filters to a variable
let filters = fetchFilters();



// The main function that's mangling the results
// Conditionally fired at the bottom of this script
let mangleResults = () => {
    console.log('Now mangling the results');

    // Set some variables
    let resultsWrapper;
    let resultsContainer;
    let results = [];
    let resultsArray = [];

    // Check if we can access the DOM and from there pull the results Google gives us
    if (document) {
        resultsWrapper = document.querySelector('#search');
        if (resultsWrapper) {
            resultsContainer = resultsWrapper.querySelector('#rso')
        }
    }

    // If there's a results container fetch these results and list them
    if(resultsContainer) {
        results = resultsContainer.querySelectorAll('.g');

        results.forEach(result => {
            let link = result.getElementsByTagName('a')[0];
            let idWrapper = result.getElementsByTagName('div')[0];
            let id = idWrapper ? idWrapper.getAttribute('data-hveid') : '';
            let isNews = false;

            if(link && link.href) {
                // Check whether this is a link to a legacy news site
                filters.forEach(medium => {
                    isNews = link.href.includes(medium.url);

                    // If it's news, color the thing red
                    if(isNews) {
                        console.log('News result!', medium.name);
                        idWrapper.style.background = "#CCCCCC";
                    }
                });
            }

            resultsArray.push({
                id: id,
                link: link,
                news: isNews
            });
        })
    }
}

// First check if we're on a Google page
let isGoogle;

if(window && window.location && window.location.href) {
    isGoogle = window.location.href.includes('google') && window.location.href.includes('search');
}

if(isGoogle) {
    console.log('User navigating Google search page');
    mangleResults();
} else {
    console.log('User not on a Google search page');
}