function getData() {
    fetch('/book-display-all')
    .then(response => response.json())
    .then(data => {
        displayData(data);
    });
}

function displayData(data) {
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

    for (var i = 0; i < data.length; i++) {
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
}

//Also imported from w3
function optionTab(evt, optionName) {
// Declare variables
var i, tabcontent, tablinks;

// Get all elements with class="tabcontent" and hide them
tabcontent = document.getElementsByClassName("tabcontent");
for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
}

// Get all elements with class="tablinks" and remove the class "active"
tablinks = document.getElementsByClassName("tablinks");
for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
}

// Show the current tab, and add an "active" class to the button that opened the tab
document.getElementById(optionName).style.display = "block";
evt.currentTarget.className += " active";
}