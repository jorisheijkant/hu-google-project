// This is the main script that changes the search results
// See comments for more info on how it works

// this function fetches the filters from the VPS
let fetchFilters = async function() {
    let response = await fetch('https://api.jorisheijkant.nl/data/hu/legacy-filters.json');

    if (response.ok) {
        let json = await response.json();
        console.log(`fetched ${json.length} filters`);
        return json;
    } else {
        console.log("HTTP-Error: " + response.status);
    }
}

// this function fetches the results from the VPS
let fetchNewsResults = async function() {
    let response = await fetch('https://api.jorisheijkant.nl/data/hu/news-results/sylvester-eijffinger/news-results.json');

    if (response.ok) {
        let json = await response.json();
        console.log(`fetched ${json.length} news results`);
        return json;
    } else {
        console.log("HTTP-Error: " + response.status);
    }
}

// this function fetches the results from the VPS
let fetchRegularResults = async function() {
    let response = await fetch('https://api.jorisheijkant.nl/data/hu/news-results/sylvester-eijffinger/regular-results.json');

    if (response.ok) {
        let json = await response.json();
        console.log(`fetched ${json.length} regular results`);
        return json;
    } else {
        console.log("HTTP-Error: " + response.status);
    }
}

// Declare the user group profiles here
let userGroups = [
    [], // GROUP 0 is empty
    [9,8,7,6,5,4,3,2,1,0], // GROUP 1 More news results
    [0,1,2,3,4,5,6,7,8,9], // GROUP 2 Less news results
    [4,4,5,5,4,4,5,5,4,4] // GROUP 3 Evenly spread news results
];

// The main function that's mangling the results
// Conditionally fired at the bottom of this script
let mangleResults = () => {
    console.log('Now mangling the results');

    // Set some variables
    let resultsWrapper;
    let resultsContainer;
    let results = [];
    let userGroup;
    let pageNumber;

    // Fill them in a promise, so we're sure we're set when we start changing
    let setVariables = new Promise(resolve => {
        // Check if we can access the DOM and from there pull the results Google gives us
        if (document) {
            resultsWrapper = document.querySelector('#search');
            if (resultsWrapper) {
                resultsContainer = resultsWrapper.querySelector('#rso')
            }

            // Also fetch page number here
            let statsWrapper = document.querySelector('#result-stats');
            if(statsWrapper) {
                let statsText = statsWrapper.innerText;
                if(statsText && statsText.includes('Pagina')) {
                    let page = statsText.replace('Pagina ', '').split('van');
                    pageNumber = Number(page[0]);
                } else {
                    pageNumber = 1;
                }
                console.log('Were at page', pageNumber);
            }
        }

        // Check if the user's group is there and assign a profile
        if(chrome && chrome.storage) {
            chrome.storage.local.get(['group'], function(result) {
                console.log('Group currently is ' + result.group);
                if(result.group) {
                    userGroup = userGroups[result.group];
                    console.log('profile array', userGroup);
                    resolve();
                }
            });
        } else {
            console.log('No chrome.storage object');
            resolve();
        }
    });

    setVariables.then(res => {
        // If there's a results container, and we're in the first 10 pages, fetch these results and list them
        if(resultsContainer && pageNumber < 11) {
            // Set results element
            results = resultsContainer.querySelectorAll('.g');

            // Set news results Needed based on usergroup and page index
            let newsResultsNeeded = userGroup[pageNumber - 1];

            let newsRange = helpers.getResultsRange(userGroup, pageNumber - 1);
            let regularRange = helpers.getRegularResultsRange(userGroup, pageNumber - 1);

            console.log('ranges', newsRange, regularRange);

            let newsRangeStart = helpers.getIndex(newsInGoogle, newsRange.start, newsRange.length);
            let regularRangeStart = helpers.getIndex(regularInGoogle, regularRange.start, newsRange.length);

            console.log('starts', newsRangeStart, regularRangeStart);

            let news = newsInGoogle.slice(newsRangeStart, newsRange.end);
            let regular = regularInGoogle.slice(regularRangeStart, regularRange.end);
            let newsResultsOnPage = 0;

            console.log('news items for this page', news);
            console.log('regular items for this page', regular);

            let checkNews = (result) => {
                // Set link sub-elements
                let link = result.getElementsByTagName('a')[0];
                let isNews;

                if(link && link.href) {
                    // Check whether this is a link to a legacy news site
                    for (let index = 0; index < filters.length; index++) {
                        isNews = link.href.includes(filters[index].url_pattern);
                        if(isNews) {
                            console.log(link.href, 'is a news result!');
                            return true;
                        }
                    }

                    return isNews;
                }
            }

            let resultsArray = Array.from(results).map(result => {
                return {
                    element: result,
                    isNews: checkNews(result),
                }
            });

            let newsResults = resultsArray.reduce((accumulator, currentValue) => {
                if(currentValue.isNews) {
                    return accumulator + 1;
                } else {
                    return accumulator;
                }
            }, 0);

            console.log(`We need ${newsResultsNeeded} news results, we have ${newsResults} news results, the total amount of hits for this page equals ${results.length}.`);

            // Change element function
            // TO DO: make dynamic with item that is to be inserted
            let changeElement = (element, isNews, index) => {
                let link = element.getElementsByTagName('a')[0];
                let linkLabel = link.getElementsByTagName('div')[0];
                let linkTitle = link.getElementsByTagName('h3')[0];
                let innerText = element.querySelector(':scope > div > div > div:nth-of-type(2)');

                if(isNews) {
                    // Add a news element
                    let newElement = news[index];
                    console.log('swapping element', element, 'for', newElement);
                    if(news && news.length > 0) {
                        linkLabel.innerHTML = news[index].urlText;
                        link.href = news[index].url;
                        linkTitle.innerHTML = news[index].title;
                        innerText.innerHTML = news[index].text;
                    }
                } else {
                    if(regular && regular.length > 0) {
                        linkLabel.innerHTML = regular[index].urlText;
                        link.href = regular[index].url;
                        linkTitle.innerHTML = regular[index].title;
                        innerText.innerHTML = regular[index].text;
                    }
                }
            }

            // Shuffle the array to not replace items top to bottom, but randomly
            let shuffledResults = helpers.shuffle(resultsArray);

            let difference = newsResultsNeeded - newsResults;
            if(difference > 0) {
                // Less news results than needed, inserting some
                let insertNews = difference;
                let inserted = 0;
                console.log(`Inserting ${insertNews} news results`);

                shuffledResults.forEach((result, index) => {
                    if(!result.isNews && inserted < insertNews) {
                        changeElement(result.element, true, index);
                        inserted++;
                    }
                })

            } else if(difference < 0) {
                // More news results than needed, deleting some
                let insertNormal = Math.abs(difference);
                let inserted = 0;
                console.log(`Inserting ${insertNormal} normal results`);

                shuffledResults.forEach((result, index) => {
                    if(result.isNews && inserted < insertNormal) {
                        changeElement(result.element, false, index);
                        inserted++;
                    }
                })
            } else {
                console.log('Exactly the right amount of news results on this page already.')
            }

            // After all is done show them results
            if(resultsWrapper) {
                resultsWrapper.style.opacity = 1;
            }
        } else {
            console.log('No results container or out of range, page is ', pageNumber);
        }
    }).catch(e => console.log('error setting base variables, ', e));

}

// First check if we're on a Google page
let isGoogle;
let filters;
let newsInGoogle;
let regularInGoogle;

if(window && window.location && window.location.href) {
    isGoogle = window.location.href.includes('google') && window.location.href.includes('search');
}

if(isGoogle) {
    let mangle = async () => {
        console.log('User navigating Google search page');
        // Set filters to a variable
        // Same for results
        filters = await fetchFilters();
        newsInGoogle = await fetchNewsResults();
        regularInGoogle = await fetchRegularResults()

        mangleResults();
    };

    mangle();

} else {
    console.log('User not on a Google search page');
}