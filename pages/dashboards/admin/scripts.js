let page_min = 0;
let page_max = 19;
let table_id = 0;
let account_read_id = 0;
let fullData = "";
let searchData = "";
let accountData = "";
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

function getAllBooks() {
    fetch('/getAllBooks')
    .then(response => response.json())
    .then(results => {
        fullData = results;
        currData = fullData;
        displayData(fullData, table_id);
    });
}

function getVisitors(){
    fetch('/getVisitorInfo')
    .then(response => response.json())
    .then(results => {
        account_read_id = 2;
        table_id = account_read_id;
        accountData = results;
        currData = accountData;
        displayData(accountData, table_id);
    });
}

function getLibrarians(){
    fetch('/getLibrarianInfo')
    .then(response => response.json())
    .then(results => {
        account_read_id = 3;
        table_id = account_read_id;
        accountData = results;
        currData = accountData;
        displayData(accountData, table_id);
    });

}

function displayData(data, id) {
    let output =  "";
    let tableSize = 0;

    if (id == 0){ //id = 0, display all
        output = document.getElementById("output-all-table");
    }
    else if (id == 1) { //id = 1, display search
        output = document.getElementById("search-table");
    }
    else if ((id == 2) || (id == 3)){ //id = 2 or 3, account table
        output = document.getElementById("account-table");
    }


    if (data.length < page_max){
        tableSize = data.length;
    }
    else{
        tableSize = page_max
    }
    //reset innerHTML on each button press,
    //could display table as this format, there might be a better alternative way to display the book content
    if ((id == 0) || (id == 1)){
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
    else if (id == 2){ //id of 2: visitor
        output.innerHTML = "";
        output.innerHTML += 
        "<tr>" + 
            " <th>Visitor ID</th>" +
            " <th>Visitor Username</th>" +
            " <th>Visitor Password</th>" +
            " <th>First Name</th>" +
            " <th>Last Name</th>" +
            " <th>Email</th>" +
            " <th>Phone Number</th>" +
        "</tr>";

        for (var i = page_min; i < tableSize; i++) {
            output.innerHTML += "<tr>";
            output.innerHTML += 
            "<td>" + data[i].Visitor_id + "</td>"
            + "<td>" + data[i].Visitor_user + "</td>"
            + "<td>" + data[i].Visitor_pass + "</td>"
            + "<td>" + data[i].First_name + "</td>"
            + "<td>" + data[i].Last_name + "</td>"
            + "<td>" + data[i].Email + "</td>"
            + "<td>" + data[i].Phone_num + "</td>";
            output.innerHTML += "</tr>";
        }
        output.classList.add("w3-table-all");
        output.classList.add("w3-hoverable");

    }
    else if (id == 3){ // id of 3: librarian
        output.innerHTML = "";
        output.innerHTML += 
        "<tr>" + 
            " <th>Librarian ID</th>" +
            " <th>Librarian Username</th>" +
            " <th>Librarian Password</th>" +
            " <th>First Name</th>" +
            " <th>Last Name</th>" +
        "</tr>";

        for (var i = page_min; i < tableSize; i++) {
            output.innerHTML += "<tr>";
            output.innerHTML += 
            "<td>" + data[i].Librarian_id + "</td>"
            + "<td>" + data[i].Librarian_user + "</td>"
            + "<td>" + data[i].Librarian_pass + "</td>"
            + "<td>" + data[i].First_name + "</td>"
            + "<td>" + data[i].Last_name + "</td>";
            output.innerHTML += "</tr>";
        }
        output.classList.add("w3-table-all");
        output.classList.add("w3-hoverable");
    }
}

$(document).ready( () => {
    getAllBooks();
    $("#search").hide();
    $("#show-accounts").hide();
    $("#account-operation").hide();
    $("#book-operation").hide();

    $("#toggle-show-all").click( () => {
        $("#show-all").show();
        $("#search").hide();
        $("#show-accounts").hide();
        $("#account-operation").hide();
        $("#book-operation").hide();
        page_min = 0;
        page_max = 19;
        table_id = 0;
        currData = fullData;
        displayData(currData, table_id);
    });

    $("#toggle-search").click( () => {
        $("#show-all").hide();
        $("#search").show();
        $("#show-accounts").hide();
        $("#account-operation").hide();
        $("#book-operation").hide();
        page_min = 0;
        page_max = 19;
        table_id = 1;
        currData = searchData;
        displayData(currData, table_id);
    });


    $("#toggle-show-accounts").click( () => {
        $("#show-all").hide();
        $("#search").hide();
        $("#show-accounts").show();
        $("#account-operation").hide();
        $("#book-operation").hide();
        page_min = 0;
        page_max = 19;
        table_id = account_read_id;
        currData = accountData;
        displayData(currData, table_id);
        
    });

    $("#toggle-account-operation").click( () => {
        $("#show-all").hide();
        $("#search").hide();
        $("#show-accounts").hide();
        $("#account-operation").show();
        $("#book-operation").hide();
        
    });

    $("#toggle-book-operation").click( () => {
        $("#show-all").hide();
        $("#search").hide();
        $("#show-accounts").hide();
        $("#account-operation").hide();
        $("#book-operation").show();
        
    });

    $("#submit_retrieve").click ( () => { 
        let user_type = $("#retrieve_type").val();

        if (user_type == "Visitor"){
            getVisitors();
        }
        else if (user_type == "Librarian") {
            getLibrarians();
        }
    });


    $("#submit_search").click ( () => {
        let field = $("#search_type").val();
        let value = $("#search_value").val();

        $.ajax({
            url: '/searchSpecific',
            type: 'POST',
            cache: false, 
            data: { book_search : field, value : value },
            success: function(response){ searchData = response; displayBookData(response, table_id); }
        });
    })

    $("#account-add-form").submit ( (e) => {

        //e: event, set this so the dashboard page doesn't reset every time on submit.
        e.preventDefault();

        let output = document.getElementById('output-message-acc-add');
        let userType = $('input[name="user_type"]:checked').val();

        let username = $('#username').val();
        let password = $('#password').val();
        let fname = $('#fname').val();
        let lname = $('#lname').val();
        let email = $('#email').val();
        let phone = $('#phone').val();

        if((username.length < 1) || (password.length < 1) || (fname.length < 1) || (lname.length < 1)) {
            output.innerHTML = "<b>" + "ERROR: Necessary fields cannot be empty!" + "</b>";
        }
        else{
            //default assumption, if the email and phone fields are left unused.
            if (email.length < 1){
                email = 'None';
            }

            if (phone.length < 1) {
                phone = 'None';
            }

            $.ajax({
                url: '/accountCreation',
                type: 'POST',
                cache: false, 
                data: { user_type : userType, 
                        username : username,
                        password : password,
                        firstname : fname,
                        lastname : lname,
                        emailAddr: email,
                        phoneNum : phone },
                success: function(response){ output.innerHTML = response;}
            });
        }

    });

    $("#acc_submit_delete").click( () =>{
        let output = document.getElementById('output-message-acc-del');
        let user_type = $("#user-del-type").val();
        let id_value = $("#ID_delete_val").val();

        $.ajax({
            url: '/accountDeletion',
            type: 'POST',
            cache: false, 
            data: { user_type : user_type, value : id_value },
            success: function(response){ output.innerHTML = response; }
        });

    });

    $("#book-add-form").submit ( (e) => {
        e.preventDefault();

        let output = document.getElementById('output-message-book-add');

        let ISBN = $('#ISBN_new').val();
        let book_name = $('#book_name_new').val();
        let author = $('#author').val();
        let genre = $('#genre').val();
        let num_pages = $('#num_pages').val();

        if ((ISBN.length < 1) || (book_name.length < 1)){
            output.innerHTML =  "<b>" + "ERROR: Necessary fields cannot be empty!" + "</b>" ;
        }
        else if (ISBN.length != 13){
            output.innerHTML =  "<b>" + "ERROR: ISBN digit not sufficient/exceeding in length! Please set the ISBN number to precisely 13 in length." + "</b>";
        }
        else{
            //default assumption, ditto procedure.
            if (author.length < 1){
                author = 'None';
            }

            if (genre.length < 1) {
                genre = 'None';
            }

            if (num_pages.length < 1) {
                num_pages = 1;
            }

            $.ajax({
                url: '/bookAddition',
                type: 'POST',
                cache: false, 
                data: { ISBN : ISBN, 
                        book_name : book_name,
                        author : author,
                        genre : genre,
                        num_pages : num_pages },
                success: function(response){ output.innerHTML = response;}
            });
        }

    });

    $("#book_submit_delete").click( () =>{
        let output = document.getElementById('output-message-book-del');
        let ISBN_value = $("#ISBN_delete_val").val();

        $.ajax({
            url: '/bookDeletion',
            type: 'POST',
            cache: false, 
            data: { value : ISBN_value },
            success: function(response){ output.innerHTML = response; }
        });
    });

});