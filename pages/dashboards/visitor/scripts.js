let page_min = 0;
let page_max = 19;
let table_id = 0;
let fullData = "";
let searchData = "";
let currData = "";

function nextPage() {
    page_max += 20;
    page_min += 20;
    if (page_max > currData.length) {
        prevPage();
    }
    displayBookData(currData, table_id);
}

function prevPage() {
    page_max -= 20;
    page_min -= 20;
    if (page_min < 0) {
        nextPage();
    }
    displayBookData(currData, table_id);
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

$(document).ready( () => {
    getAllBooks();
    $("#search").hide();
    $("#request").hide();

    $("#toggle-show-all").click( () => {
        $("#show-all").show();
        $("#search").hide();
        $("#request").hide();
        page_min = 0;
        page_max = 19;
        table_id = 0;
        currData = fullData;
        displayBookData(currData, table_id);
    });

    $("#toggle-search").click( () => {
        $("#show-all").hide();
        $("#search").show();
        $("#request").hide();
        page_min = 0;
        page_max = 19;
        table_id = 1;
        currData = searchData;
        displayBookData(currData, table_id);
    });

    $("#toggle-request").click( () => {
        $("#show-all").hide();
        $("#search").hide();
        $("#request").show();
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

    $("#request_input").click ( () => {
        let ISBN_req = $("#request_book_ISBN").val();
        console.log("Hello: " + ISBN_req);
    });
});
