let mangleResults = () => {
    console.log('Now mangling the results');

    // Set some variables
    let resultsWrapper;
    let resultsContainer;

    // Check if we can access the DOM and from there pull the results Google gives us
    if(document) {
        resultsWrapper = document.querySelector('#search');
        resultsContainer = resultsWrapper.querySelector('#rso')
    }

    console.log(resultsWrapper, resultsContainer);
}

chrome.webNavigation.onCompleted.addListener(function() {
    console.log("Using Google");
    mangleResults();
}, {url: [{urlMatches : 'https://www.google.com/*'}]});