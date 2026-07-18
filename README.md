mysql -u root -p connect database



Here’s a list of common MySQL commands used for managing databases, tables, users, and other administrative tasks. You can use these commands after logging into MySQL using the mysql -u root -p command.

Basic MySQL Commands
Log in to MySQL:

bash

mysql -u root -p
This will prompt you for the MySQL root user password.

Exit MySQL:

sql



EXIT;

Database Management
Show all databases:

sql

SHOW DATABASES;
Create a new database:

sql

CREATE DATABASE database_name;
Delete a database:

sql

DROP DATABASE database_name;
DROP DATABASE technoboat;
Select a database to use:

sql

USE database_name;
Table Management
Show all tables in the selected database:

sql

SHOW TABLES;
Create a new table:

sql

CREATE TABLE table_name (
    column1 datatype,
    column2 datatype,
    column3 datatype
);
Show the structure of a table:

sql

DESCRIBE table_name;
Delete a table:

sql

DROP TABLE table_name;
Rename a table:

sql

RENAME TABLE old_table_name TO new_table_name;
Data Management
Insert data into a table:

sql

INSERT INTO table_name (column1, column2, column3) VALUES (value1, value2, value3);
Select data from a table:

sql

SELECT * FROM table_name;
To select specific columns:
sql

SELECT column1, column2 FROM table_name;
Update data in a table:

sql

UPDATE table_name SET column1 = value1, column2 = value2 WHERE condition;
Delete data from a table:

sql

DELETE FROM table_name WHERE condition;
Limit number of rows in a SELECT statement:

sql

SELECT * FROM table_name LIMIT 10;


