let page_min = 0;
let page_max = 19;
let data = "";

function nextPage() {
    page_max += 20;
    page_min += 20;
    if (page_max > data.length) {
        prevPage();
    }
    displayData();
}

function prevPage() {
    page_max -= 20;
    page_min -= 20;
    if (page_min < 0) {
        nextPage();
    }
    displayData();
}

function getAllBooks() {
    fetch('/getAllBooks')
    .then(response => response.json())
    .then(results => {
        data = results;
        displayData();
    });
}

function displayData() {
    let output =  document.getElementById("output-table");
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

    for (var i = page_min; i < page_max; i++) {
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
        displayData();
    });

    $("#toggle-search").click( () => {
        $("#show-all").hide();
        $("#search").show();
        $("#request").hide();
        page_min = 0;
        page_max = 19;
        displayData();
    });

    $("#toggle-request").click( () => {
        $("#show-all").hide();
        $("#search").hide();
        $("#request").show();
    });

    $("#submit_search").click ( () => {
        let field = $("#search_type").val();
        let value = $("#search_value").val();

        
    })
});
