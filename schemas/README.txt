Basic version of what our schema should look like, modify if needed

2/11/25 update:
# Condensed drop table commands into drop database, create database, and use database statements
# Any primary key id for relation/tables are set to unique tag, update other attributes/columns with same tag if needed
# Added Loan_Date and Due_Date for Loaner_List table: Loan_Date should call for current time stamp, Due_Date default could be 7 days ahead of current time stamp (no implementation yet)