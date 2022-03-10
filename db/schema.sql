DROP DATABASE IF EXISTS inventory_db;
CREATE DATABASE inventory_db;

USE inventory_db;

CREATE TABLE department(
  id INTEGER NOT NULL,
  department_name VARCHAR(30) NOT NULL
);

CREATE TABLE roles(
  id INTEGER NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department_id INTEGER
);

CREATE TABLE employee(
  id INTEGER NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER,
  manager_id INTEGER
);