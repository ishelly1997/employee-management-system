/*sample data to add*/
USE employee_DB

INSERT INTO department (department_name)
VALUES ("accounting"),
       ("human resources"),
       ("engineering"),
       ("product development"),
       ("marketing");

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 60000, 1),
       ("Engineer", 95000, 3) ,
       ("Data Analyst", 120000, 4),
       ("Human Resources Director", 100000, 2),
       ("Marketing Specialist", 85000, 5),
       ("Product Manager",  200000, 4),
       ("Intern", NULL, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Christinith", "Johnson", 1, 1),
       ("Harry", "Debby", 2, NULL),
       ("Carolina", "Stuart", 3, NULL),
       ("Blerta", "Marku", 3, 3),
       ("Ivan", "Milkes", 4, NULL),
       ("Pepe", "Frenchman", 4, 5),
       ("Aiello", "DeCameron", 5, 2);
