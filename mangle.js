// This is the main script that changes the search results
// See comments for more info on how it works
// The actual code being ran is at the bottom, first I declare the functions

// This is the first part of the script, that checks the variables set in the plugin window
// It also picks the right page number
let getVariables = () => {
    let pageNumber;
    let casus;
    let group;

    return new Promise(resolve => {
        // First fetch page number
        let statsWrapper = document.querySelector('#result-stats');
        if(statsWrapper) {
            let statsText = statsWrapper.innerText;
            if(statsText && statsText.includes('Pagina')) {
                let page = statsText.replace('Pagina ', '').split('van');
                pageNumber = Number(page[0]);
            } else {
                pageNumber = 1;
            }
            debugIt('Were at page', pageNumber);
        } else {
            pageNumber = null;
        }

        // Check if the user's group is there and assign a profile
        if (chrome && chrome.storage) {
            chrome.storage.local.get(['group', 'debug', 'casus'], function (result) {
                debugIt(`Group currently is ${result.group}, case currently is ${result.casus}`);

                if (result.group) {
                    casus = result.casus;
                    group = result.group;
                }

                if (Number(result.debug)) {
                    debug = true;
                }

                resolve({
                    casus: casus,
                    group: group,
                    pageNumber: pageNumber
                });
            });
        } else {
            debugIt('No chrome.storage object');
            resolve();
        }
    });
}

// This is the grand function that fetches all the data with the results that should be shoved in
let fetchData = async (variables) => {
    // Set VPS check variable
    let vpsAvailable;

    // Then set variables and final variable to be returned
    const {group, casus} = variables;
    let groupObject;
    let results;

    // Check what item we need to fetch
    // Remember, groups are predefined in the groups.js file
    if(group && casus) {
        debugIt(`Getting group object for casus ${casus}, group ${group}`);
        if(groups && groups[casus] && groups[casus][group]) {
            groupObject = groups[casus][group];
        }

        // Check whether the VPS is up. If not, we can fall back to calling the Airtable API directly
        // Calling the Airtable API directly all the time might cause us to hit some data limits, that's why
        // Also you need to expose your key then, which is not what you want
        if(groupObject) {
            let vpsResults = await fetch(groupObject.url);
            vpsAvailable = vpsResults.ok;
        }
    }

    // Get the VPS url and parse the results
    async function getUrl(url) {
        let json;
        let response = await fetch(url);
        if (response && response.ok) json = await response.json();
        if (json) {
            if (json.records) {
                return json.records;
            } else {
                return 'no records in table';
            }
        } else {
            return null;
        }
    }

    // If the VPS is up, get stuff from there
    if (vpsAvailable && groupObject) {
        results = await getUrl(groupObject.url);
    } else {
        debugIt('No group object found or VPS not available');
    }

    return results;
}

// The main function that's mangling the results
// Conditionally fired at the bottom of this script
let mangleResults = (variables, newResults) => {
    debugIt('Now mangling the results');
    debugIt(newResults);
    const {pageNumber} = variables;

    // Get the containers we need
    let resultsWrapper;
    let resultsContainer;

    resultsWrapper = document.querySelector('#search');
    if (resultsWrapper) {
        resultsContainer = resultsWrapper.querySelector('#rso')
    }

    // If there's a results container, and we're in the first 4 pages, fetch these results and list them
    if (resultsContainer && pageNumber < 5) {
        // Set results element and remove all normal results
        let resultsOnPage = resultsContainer.querySelectorAll('div');
        for (const result of resultsOnPage) {
            result.remove();
        }

        if (newResults && newResults.length > 0) {
            let resultsOnPage = newResults.filter(result => {
                if (result && result.fields) {
                    return result.fields.page === pageNumber;
                }
            });

            let resultElements = resultsOnPage.map(result => {
                let fields = result.fields;

                if (fields && fields.title) {
                    return `<div class="hu-result">
                                    <div class="hu-result-wrapper">
                                        <div class="hu-result-top" >
                                            <div class="hu-result-breadcrumbs">
                                                <p class="hu-result-breadcrumbs-text">${fields.urlText}</p>
                                                <span class="hu-result-breadcrumbs-icon"></span>
                                            </div>
                                            <a class="hu-result-title" href="${fields.url}">${fields.title}</a>
                                        </div>
                                        <p class="hu-result-bottom">${fields.text}</p>
                                    </div>  
                                </div>`
                }
            });

            resultElements.forEach(element => {
                resultsContainer.innerHTML += element;
            })
        }

        // After all is done show them results
        if (resultsWrapper) {
            resultsWrapper.style.opacity = 1;
        }
    } else {
        debugIt('No results container or out of range, page is ', pageNumber);
        resultsWrapper.style.opacity = 1;
    }
}

// ACTUAL SCRIPT STARTS HERE

// First check if we're on a Google page and set a debug variable
let isGoogle;
let debug = false;

if (window && window.location && window.location.href) {
    isGoogle = window.location.href.includes('google') && window.location.href.includes('search');
}

// Declare debug function
// Use literals if you want to log sth, since this function only accepts one argument
let debugIt = (item) => {
    if(debug) {
        console.log(item);
    }
}

// If we're on a google page, fire up
if (isGoogle) {
    let mangle = async () => {
        debugIt('User navigating Google search page');

        let variables = await getVariables();
        debugIt(`variables set, ${variables}`);

        if (variables) {
            // First get the data we need
            let neededResults = await fetchData(variables);

            // And then start filling the page
            mangleResults(variables, neededResults);
        }
    };

    mangle();
} else {
    console.log('User not on a Google search page, HU extension not running');
}