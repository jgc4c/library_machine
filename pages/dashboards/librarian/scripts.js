let page_min = 0;
let page_max = 19;
let table_id = 0;
let requestData = "";
let loanerData = "";
let currData = "";


function nextPage() {
    page_max += 20;
    page_min += 20;
    if (page_max > currData.length) {
        prevPage();
    }
    displayData(currData, table_id);
}

function prevPage() {
    page_max -= 20;
    page_min -= 20;
    if (page_min < 0) {
        nextPage();
    }
    displayData(currData, table_id);
}

function getAllRequests() {
    fetch('/getAllRequests')
    .then(response => response.json())
    .then(results => {
        requestData = results;
        currData = requestData;
        displayData(requestData, table_id);
    });
}


function getAllLoaner() {
    fetch('/getAllLoaner')
    .then(response => response.json())
    .then(results => {
        loanerData = results;
        currData = loanerData;
        //displayData(loanerData, table_id);
    });
}


$(document).ready( () => {
    getAllRequests();
    getAllLoaner();
    $("#loaner-list").hide();
    $("#check-out").hide();
    $("#returns").hide();

    $("#toggle-request-list").click( () => {
        $("#request-list").show();
        $("#loaner-list").hide();
        $("#check-out").hide();
        $("#returns").hide();
        page_min = 0;
        page_max = 19;
        table_id = 0;
    });

    $("#toggle-loaner-list").click( () => {
        $("#request-list").hide();
        $("#loaner-list").show();
        $("#check-out").hide();
        $("#returns").hide();
        page_min = 0;
        page_max = 19;
        table_id = 1;
    });

    $("#toggle-check-out").click( () => {
        $("#request-list").hide();
        $("#loaner-list").hide();
        $("#check-out").show();
        $("#returns").hide();
    });

    $("#toggle-returns").click( () => {
        $("#request-list").hide();
        $("#loaner-list").hide();
        $("#check-out").hide();
        $("#returns").show();
    });

});