let page_min = 0;
let page_max = 19;
let table_id = 0;
let fullData = "";
let searchData = "";
let requestData = "";
let loanerData = "";
let currData = "";


function nextPage() {
    page_max += 20;
    page_min += 20;
    if (page_max > currData.length) {
        prevPage();
    }

    if ((table_id == 0) || (table_id == 1)){
        displayBookData(currData, table_id);
    }
    else if (table_id == 2){
        displayRequesterData(currData);
    }
    else{
        displayLoanerData(currData);
    }
}

function prevPage() {
    page_max -= 20;
    page_min -= 20;
    if (page_min < 0) {
        nextPage();
    }

    if ((table_id == 0) || (table_id == 1)){
        displayBookData(currData, table_id);
    }
    else if (table_id == 2){
        displayRequesterData(currData);
    }
    else{
        displayLoanerData(currData);
    }
}

function getAllBooks() {
    fetch('/getAllBooks')
    .then(response => response.json())
    .then(results => {
        fullData = results;
        currData = fullData;
        displayBookData(fullData, table_id);
    });
}

function getAllRequests() {
    fetch('/getAllRequests')
    .then(response => response.json())
    .then(results => {
        requestData = results;
        currData = requestData;
        displayRequesterData(requestData);
    });
}


function getAllLoaner() {
    fetch('/getAllLoaners')
    .then(response => response.json())
    .then(results => {
        loanerData = results;
        currData = loanerData;
        displayLoanerData(loanerData);
    });
}

function displayBookData(data, id) {
    let output =  "";
    let tableSize = 0;

    if (id == 0){ //id = 0, display all
        output =  document.getElementById("output-all-table");
    }
    else if (id == 1) { //id = 1, display search
        output =  document.getElementById("search-table");
    }


    if (data.length < page_max){
        tableSize = data.length;
    }
    else{
        tableSize = page_max
    }
    //reset innerHTML on each button press,
    //could display table as this format, there might be a better alternative way to display the book content
    output.innerHTML = "";
    output.innerHTML += 
    "<tr>" + 
        " <th>ISBN</th>" +
        " <th>Book Name</th>" +
        " <th>Author</th>" +
        " <th>Genre</th>" +
        " <th>Num_pages</th>" +
        " <th>Count</th>" +
    "</tr>";

    for (var i = page_min; i < tableSize; i++) {
        output.innerHTML += "<tr>";
        output.innerHTML += 
          "<td>" + data[i].ISBN + "</td>"
        + "<td>" + data[i].Book_name + "</td>"
        + "<td>" + data[i].Author + "</td>"
        + "<td>" + data[i].Genre + "</td>"
        + "<td>" + data[i].Num_pages + "</td>"
        + "<td>" + data[i].Count + "</td>";
        output.innerHTML += "</tr>";
    }
    output.classList.add("w3-table-all");
    output.classList.add("w3-hoverable");
}

function displayRequesterData(data){
    let output =  "";
    let tableSize = 0;
    output =  document.getElementById("output-request-table");

    if (data.length < page_max){
        tableSize = data.length;
    }
    else{
        tableSize = page_max;
    }

    output.innerHTML = "";
    output.innerHTML += 
    "<tr>" + 
        " <th>Request ID</th>" +
        " <th>ISBN</th>" +
        " <th>Book Name</th>" +
        " <th>Requester ID</th>" +
        " <th>Requester Username</th>" +
        " <th>Request Date</th>" +
    "</tr>";

    for (var i = page_min; i < tableSize; i++) {
        output.innerHTML += "<tr>";
        output.innerHTML += 
          "<td>" + data[i].Request_id + "</td>"
        + "<td>" + data[i].ISBN + "</td>"
        + "<td>" + data[i].Book_name + "</td>"
        + "<td>" + data[i].Requester_id + "</td>"
        + "<td>" + data[i].Requester_user + "</td>"
        + "<td>" + data[i].Request_Date + "</td>";
        output.innerHTML += "</tr>";
    }
    output.classList.add("w3-table-all");
    output.classList.add("w3-hoverable");


}

//WARNING: Haven't tested the display for this
function displayLoanerData(data){
    let output =  "";
    let tableSize = 0;
    output =  document.getElementById("output-loaner-table");

    if (data.length < page_max){
        tableSize = data.length;
    }
    else{
        tableSize = page_max;
    }

    output.innerHTML = "";
    output.innerHTML += 
    "<tr>" + 
        " <th>Loan ID</th>" +
        " <th>ISBN</th>" +
        " <th>Book Name</th>" +
        " <th>Borrower ID</th>" +
        " <th>Borrower Fname</th>" +
        " <th>Approved By</th>" +
        " <th>Loan Start Date</th>" +
        " <th>Due By</th>" +
    "</tr>";

    for (var i = page_min; i < tableSize; i++) {
        output.innerHTML += "<tr>";
        output.innerHTML += 
          "<td>" + data[i].Loan_id + "</td>"
        + "<td>" + data[i].ISBN + "</td>"
        + "<td>" + data[i].Book_name + "</td>"
        + "<td>" + data[i].Borrower_id + "</td>"
        + "<td>" + data[i].Borrow_user + "</td>"
        + "<td>" + data[i].Approved_by + "</td>"
        + "<td>" + data[i].Loan_Date + "</td>"
        + "<td>" + data[i].Due_Date + "</td>";
        output.innerHTML += "</tr>";
    }
    output.classList.add("w3-table-all");
    output.classList.add("w3-hoverable");

}


$(document).ready( () => {
    getAllBooks();
    $("#search").hide();
    $("#request-list").hide();
    $("#loaner-list").hide();
    $("#check-out").hide();
    $("#returns").hide();

    $("#toggle-show-all").click( () => {
        $("#show-all").show();
        $("#search").hide();
        $("#request-list").hide();
        $("#loaner-list").hide();
        $("#check-out").hide();
        $("#returns").hide();
        page_min = 0;
        page_max = 19;
        table_id = 0;
        currData = fullData;
        displayBookData(currData, table_id);
    });

    $("#toggle-search").click( () => {
        $("#show-all").hide();
        $("#search").show();
        $("#request-list").hide();
        $("#loaner-list").hide();
        $("#check-out").hide();
        $("#returns").hide();
        page_min = 0;
        page_max = 19;
        table_id = 1;
        currData = searchData;
        displayBookData(currData, table_id);
    });


    $("#toggle-request-list").click( () => {
        getAllRequests();
        $("#show-all").hide();
        $("#search").hide();
        $("#request-list").show();
        $("#loaner-list").hide();
        $("#check-out").hide();
        $("#returns").hide();
        page_min = 0;
        page_max = 19;
        table_id = 2;
        currData = requestData;
        displayRequesterData(currData);
    });

    $("#toggle-loaner-list").click( () => {
        getAllLoaner();
        $("#show-all").hide();
        $("#search").hide();
        $("#request-list").hide();
        $("#loaner-list").show();
        $("#check-out").hide();
        $("#returns").hide();
        page_min = 0;
        page_max = 19;
        table_id = 3;
        currData = loanerData;
        displayLoanerData(currData);
    });

    $("#toggle-check-out").click( () => {
        $("#show-all").hide();
        $("#search").hide();
        $("#request-list").hide();
        $("#loaner-list").hide();
        $("#check-out").show();
        $("#returns").hide();
    });

    $("#toggle-returns").click( () => {
        $("#show-all").hide();
        $("#search").hide();
        $("#request-list").hide();
        $("#loaner-list").hide();
        $("#check-out").hide();
        $("#returns").show();
    });

    $("#submit_search").click ( () => {
        let field = $("#search_type").val();
        let value = $("#search_value").val();

        var query = { 'book_search' : field, 'value' : value };
        console.log(query);

        $.ajax({
            url: '/searchSpecific',
            type: 'POST',
            cache: false, 
            data: { book_search : field, value : value },
            success: function(response){ searchData = response; displayBookData(response, table_id); }
        });
    })

    $("#process_loan").click ( () => {
        let duration = $("#loan-duration").val();
        let request_ID = $("#requesting_ID").val();

        console.log(duration, request_ID);

    });

    $("#return_book").click ( () => {
        let loan_ID = $("#loaner_ID").val();

        console.log(loan_ID);

    });

});