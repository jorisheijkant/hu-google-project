// This is the main script that changes the search results
// See comments for more info on how it works

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
                legacyMedia.forEach(medium => {
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


// Set up the legavy media news sites array
// TO DO: import this somehow instead of hardcoding in the main script
const legacyMedia = [
    {
        "name": "NOS",
        "url": "nos.nl"
    },
    {
        "name": "Brabants Dagblad",
        "url": "bd.nl"
    },
    {
        "name": "Volkskrant",
        "url": "volkskrant.nl"
    },
    {
        "name": "BNR Nieuwsradio",
        "url": "bnr.nl"
    },
    {
        "name": "RTL",
        "url": "rtlnieuws.nl"
    },
    {
        "name": "Omroep Brabant",
        "url": "omroepbrabant.nl"
    },
    {
        "name": "Het Parool",
        "url": "parool"
    },
    {
        "name": "Financieel Dagblad",
        "url": "fd.nl"
    },
    {
        "name": "Eindhovens Dagblad",
        "url": "ed.nl"
    },
    {
        "name": "RTL Boulevard",
        "url": "rtlboulevard.nl"
    },
    {
        "name": "Algemeen Dagblad",
        "url": "ad.nl"
    },
    {
        "name": "De Gelderlander",
        "url": "gelderlander.nl"
    },
    {
        "name": "De Stentor",
        "url": "destentor.nl"
    },
    {
        "name": "VPRO",
        "url": "vpro.nl"
    },
    {
        "name": "Vrij Nederland",
        "url": "vn.nl"
    },
    {
        "name": "Omroep Tilburg",
        "url": "omroeptilburg.nl"
    },
    {
        "name": "HP/De Tijd",
        "url": "hpdetijd.nl"
    },
    {
        "name": "NRC Handelsblad",
        "url": "nrc.nl"
    }
]

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