# Weather Wachine
## A Project for MTSU CSCI-4560 (Database Management)

Weather Machine is an open-source library management software that allows for three different user types (Admin, Librarian, Visitor) as well as a request/checkout system for the books available. In addition to the software, it includes a schema that can be used for the database and it currently compatible with the given code. 

## User Types
1. Admin
    - Has full control over adding, deleted, and updating books & accounts in the database. 
    - Includes the same abilities as Librarian and Visitor.
2. Librarian
    - Has ability to fulfil checkout requests and returns, as well as issuing accounts to Visitors. 
    - Includes the same abilities as Visitor.  
3. Visitor
    - Has ability to view books available in the systems as well as requesting a checkout for a book. 

## To Get Started...
1. Install node and npm to your system. Instructions vary depending on your Operating System
    - https://nodejs.org/en/download
2. Clone the repo using

```
git clone https://github.com/jgc4c/library_machine.git
```

3. Open your terminal/command prompt in the library_machine directory and type in the command below to install dependencies

```
npm install
```

4. To run the server, type the line below in your terminal/command prompt and navigate to the url it spits out.

```
node server.js
```

For instance, the output may look like

```
Server running on port 3000
Access site at [ localhost:3000 ]
```

So you would type in **localhost:3000** in your web browser to access the site.



