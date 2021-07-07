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

// this function fetches the results from the VPS
let fetchResults = async function() {
    let response = await fetch('https://api.jorisheijkant.nl/data/hu/results.json');

    if (response.ok) {
        let json = await response.json();
        console.log('fetched results!', json);
        return json;
    } else {
        console.log("HTTP-Error: " + response.status);
    }
}

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
            let changeIt = Boolean(Math.round(Math.random()));
            let linkLabel = link.getElementsByTagName('div')[0];
            let linkTitle = link.getElementsByTagName('h3')[0];

            function changeElement() {
                if(changeIt && newsInGoogle && newsInGoogle.length > 0) {
                    linkLabel.innerHTML = newsInGoogle[0].urlText;
                    link.href = newsInGoogle[0].url;
                    linkTitle.innerHTML = newsInGoogle[0].title;
                } else {
                }
            }

            if(link && link.href) {
                // Check whether this is a link to a legacy news site
                filters.forEach(medium => {
                    isNews = link.href.includes(medium.url);

                    // If it's news, color the thing red
                    if(isNews) {
                        idWrapper.style.background = "#EEEEEE";
                    } else {
                        changeElement();
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
let filters;
let newsInGoogle;

if(window && window.location && window.location.href) {
    isGoogle = window.location.href.includes('google') && window.location.href.includes('search');
}

if(isGoogle) {
    let mangle = async () => {
        console.log('User navigating Google search page');
        // Set filters to a variable
        // Same for results
        filters = await fetchFilters();
        newsInGoogle = await fetchResults();

        mangleResults();
    };

    mangle();

} else {
    console.log('User not on a Google search page');
}