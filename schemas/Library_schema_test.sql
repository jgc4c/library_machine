/* This SQL/Schema file is only meant for testing/designing the library machine 
project schema currently. No SQL commands here would be final */

/* Any username and password related fields will have type of VARCHAR(30) */
DROP DATABASE IF EXISTS library_machine;
CREATE DATABASE library_machine;
USE library_machine;

/* 
ISBN numbers have a fixed length of 13 digits including dashes (for books issued after 1970s?)
Book_name must not be null
Author name and Genre might possibly be anonymous/unknown, adjust length of Author VARCHAR length if needed
Num_pages might be unknown (aka null) but count associates to total number of that book's copy in the library
Currently refraining with adding Cover column */
CREATE TABLE Book(
	ISBN	  CHAR(20)		NOT NULL AUTO_INCREMENT,
    Book_name VARCHAR(255)   NOT NULL,
    Author	  VARCHAR(40),
    Genre	  VARCHAR(40),
    Num_pages INT,
    Count	  INT 			NOT NULL,
    PRIMARY KEY(ISBN)
);

CREATE TABLE Admin(
	Admin_id	INT				NOT NULL AUTO_INCREMENT,
    Admin_user	VARCHAR(30)		NOT NULL,
    Admin_pass	VARCHAR(30)		NOT NULL,
    First_name	VARCHAR(15)		NOT NULL,
    Last_name	VARCHAR(15)		NOT NULL,
    PRIMARY KEY(Admin_id)
);

CREATE TABLE Librarian(
	Librarian_id	INT				NOT NULL AUTO_INCREMENT,
    Librarian_user	VARCHAR(30)		NOT NULL,
    Librarian_pass	VARCHAR(30)		NOT NULL,
    First_name		VARCHAR(15)		NOT NULL,
    Last_name		VARCHAR(15)		NOT NULL,
    PRIMARY KEY(Librarian_id)
);

CREATE TABLE Visitor(
	Visitor_id		INT				NOT NULL AUTO_INCREMENT,
    Visitor_user	VARCHAR(30)		NOT NULL,
    Visitor_pass	VARCHAR(30)		NOT NULL,
    First_name		VARCHAR(15)		NOT NULL,
    Last_name		VARCHAR(15)		NOT NULL,
    Email			VARCHAR(320),
    Phone_num		VARCHAR(20),
    PRIMARY KEY(Visitor_id)
);

/* Assumed Approved_by == Librarian_id, not username */
CREATE TABLE Loaner_list(
	Loan_id 	INT 		  NOT NULL AUTO_INCREMENT,
    ISBN 		CHAR(20)	  NOT NULL,
    Book_name 	VARCHAR(45)   NOT NULL,
    Borrower_id INT			  NOT NULL,
    Borrow_name	VARCHAR(30)	  NOT NULL,
    Approved_by INT			  NOT NULL,
    Loan_Date 	DATETIME	  DEFAULT current_timestamp,
    Due_Date 	DATETIME	  NOT NULL,
    PRIMARY KEY(Loan_id),
    FOREIGN KEY(ISBN) REFERENCES Book(ISBN)
   # FOREIGN KEY(Borrower_id) REFERENCES Visitor(Visitor_id),
    #FOREIGN KEY(Approved_by) REFERENCES Librarian(Librarian_id)
);

CREATE TABLE Request_list(
	Request_id		INT 		  NOT NULL AUTO_INCREMENT,
    ISBN 			CHAR(20)	  NOT NULL,
	Book_name 		VARCHAR(45)   NOT NULL,
    Requester_id 	INT		  	  NOT NULL,
    Requester_name	VARCHAR(30)	  NOT NULL,
    Request_Date 	DATETIME	  DEFAULT current_timestamp,
    PRIMARY KEY(Request_id),
    FOREIGN KEY(ISBN) REFERENCES Book(ISBN),
    FOREIGN KEY(Requester_id) REFERENCES Visitor(Visitor_id)
);
-- Insertion test
INSERT INTO Book (ISBN, Book_name, Author, Genre, Num_pages, Count) VALUES 
("978-0345391803", "The Hitchhiker's Guide to the Galaxy", "Douglas Adams", "Science Fiction", 224, 1);

INSERT INTO Book VALUES ("123-4567890123", "Test test", null, null, 255, 1000);

INSERT INTO Loaner_List VALUES (123, "123-4567890123", "Test", 456, "test", 789, DEFAULT,"2008-11-11");
