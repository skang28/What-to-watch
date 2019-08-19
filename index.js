function getAmazonResults() {

}

function getEbayResults() {
    const apiID = 'StevenKa-ProductS-PRD-c447dc556-7d1b6d38';
    fetch('https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=StevenKa-ProductS-PRD-c447dc556-7d1b6d38&RESPONSE-DATA-FORMAT=json&REST-PAYLOAD&keywords=harry%20potter%20phoenix&paginationInput.entriesPerPage=2')
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error(response.statusText); 
    })
    .then(responseJson => displayEbayResults(responseJson))
    .catch(err => {
        $('.errorMessage').text(`Uh oh. Something went wrong: ${err.message}`)
    });
}

function getWalmartResults() {

}

function displayAmazonResults() {

}

function displayEbayResults(responseJson) {
    console.log(responseJson);
    $('.ebay').empty();

    $('.ebay').append(`
    <p>${responseJson.findItemsByKeywordsReponse.searchResult.item.title}</p>`);

}

function displayWalmartResults() {

}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        getEbayResults();
    });
}

$(watchForm);