// Define various tables to be fetched here, with both VPS and direct Airtable urls
const groups = {
    group1: {
        lessNews: {
            url: 'https://api.jorisheijkant.nl/data/hu/airtable/data/group1/less-news.json',
            airtableUrl: 'https://api.airtable.com/v0/appn3lK0fVb5jbKpu/Weinig%20nieuwsresultaten?view=Grid%20view',
            results: []
        },
        balanced: {
            url: 'https://api.jorisheijkant.nl/data/hu/airtable/data/group1/balanced.json',
            airtableUrl: 'https://api.airtable.com/v0/appn3lK0fVb5jbKpu/Gebalanceerd?view=Grid%20view',
            results: []
        },
        moreNews: {
            url: 'https://api.jorisheijkant.nl/data/hu/airtable/data/group1/more-news.json',
            airtableUrl: 'https://api.airtable.com/v0/appn3lK0fVb5jbKpu/Veel%20nieuwsresultaten?view=Grid%20view',
            results: []
        }
    },
    group2 : {
        lessNews: {
            url: 'https://api.jorisheijkant.nl/data/hu/airtable/data/group2/less-news.json',
            airtableUrl: 'https://api.airtable.com/v0/appQqjgba22SsUiRL/Weinig%20nieuwsresultaten?view=Grid%20view',
            results: []
        },
        balanced: {
            url: 'https://api.jorisheijkant.nl/data/hu/airtable/data/group2/balanced.json',
            airtableUrl: 'https://api.airtable.com/v0/appQqjgba22SsUiRL/Gebalanceerd?view=Grid%20view',
            results: []
        },
        moreNews: {
            url: 'https://api.jorisheijkant.nl/data/hu/airtable/data/group2/more-news.json',
            airtableUrl: 'https://api.airtable.com/v0/appQqjgba22SsUiRL/Veel%20nieuwsresultaten?view=Grid%20view',
            results: []
        }
    },
    group3: {
        lessNews: {
            url: 'https://api.jorisheijkant.nl/data/hu/airtable/data/group3/less-news.json',
            airtableUrl: 'https://api.airtable.com/v0/appdzDBx2HqfwAWof/Weinig%20nieuwsresultaten?view=Grid%20view',
            results: []
        },
        balanced: {
            url: 'https://api.jorisheijkant.nl/data/hu/airtable/data/group3/balanced.json',
            airtableUrl: 'https://api.airtable.com/v0/appdzDBx2HqfwAWof/Gebalanceerd?view=Grid%20view',
            results: []
        },
        moreNews: {
            url: 'https://api.jorisheijkant.nl/data/hu/airtable/data/group3/more-news.json',
            airtableUrl: 'https://api.airtable.com/v0/appdzDBx2HqfwAWof/Veel%20nieuwsresultaten&view=Grid%20view',
            results: []
        }
    }
}