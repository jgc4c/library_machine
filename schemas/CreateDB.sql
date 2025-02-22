CREATE DATABASE Suppliers_Database;
USE Suppliers_Database;

CREATE TABLE Supplier(
	Sno   CHAR(4),
    Sname VARCHAR(15) NOT NULL,
    Status INT,
    City VARCHAR(20),
    CHECK (Status >= 0),
    PRIMARY KEY(Sno)
);

CREATE TABLE Part (
	Pno CHAR(4),
    Pname VARCHAR(20) NOT NULL,
    Color VARCHAR(10),
    Weight INT NOT NULL,
    City VARCHAR(20),
    CHECK ((Weight >= 1) AND (Weight <= 100)),
    UNIQUE(Pno, Color),
    PRIMARY KEY(Pno)
);

CREATE TABLE Shipment (
	Sno CHAR(4),
    Pno CHAR(4),
    Qty INT DEFAULT (100),
    Price FLOAT,
    CHECK (Price >= 0),
    PRIMARY KEY(Sno, Pno),
    FOREIGN KEY(Sno) REFERENCES Supplier(Sno),
    FOREIGN KEY(Pno) REFERENCES Part(Pno)
);