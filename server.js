const mysql = require('mysql2');
const inquirer = require("inquirer");
const util = require('util');
const consoleTable = require("console.table");

// Connect to database
const connection = mysql.createConnection(
  {
    host: 'localhost',
    //MYSQL PORT
    port: 3306,
    user: 'root',
    // MySQL 
    password: '',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);
connection.query = util.promisify(connection.query);
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    console.log(`Employee Management System`)
    firstPrompt();
});

const firstPrompt = async () =>{

    inquirer
      .prompt({
        type: "list",
        name: "task",
        message: "Would you like to do?",
        choices: [
        "View All Departments",
        "Add Department",
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "End"]
      })
      .then(function ({ task }) {
        switch (task) {
        case "View All Departments":
            viewDepartments();
            break;  

        case "Add Department":
            addDepartment();
            break;  

        case "View Employees":
            viewEmployee();
            break;
        
        case "Add Employee":
            addEmployee();
            break;
  
        case "Update Employee Role":
            updateEmployeeRole();
            break;

        case "View All Roles":
            viewAllRoles();
            break;  

        case "Add Role":
            addRole();
            break;
  
        case "End":
            connection.end();
            break;
        }
      });
  }
  // Selection to view all of the employees.
const viewEmployee = async () => {
    console.log('Employee View');
    try {
        let query = 'SELECT * FROM employee';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let employeeArray = [];
            res.forEach(employee => employeeArray.push(employee));
            console.table(employeeArray);
            firstPrompt();
        });
    } catch (err) {
        console.log(err);
        firstPrompt();
    };
}

// Selection to view all of the departments.
const viewDepartments = async () => {
    console.log('Departments');
    try {
        let query = 'SELECT * FROM department';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let deptChoices = [];
            res.forEach(department => deptChoices.push(department));
            console.table(deptChoices);
            firstPrompt();
        });
    } catch (err) {
        console.log(err);
        firstPrompt();
    };
}

// Selection to view all of the roles.
const viewAllRoles = async () => {
    console.log('Role View');
    try {
        let query = 'SELECT * FROM role';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let roleChoices = [];
            res.forEach(role => roleChoices.push(role));
            console.table(roleChoices);
            firstPrompt();
        });
    } catch (err) {
        console.log(err);
        firstPrompt();
    };
}

// Selection to add a new employee.
const addEmployee = async () => {
    try {
        console.log('Add Employee');

        let roles = await connection.query("SELECT * FROM role");

        let managers = await connection.query("SELECT * FROM employee");

        let answer = await inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'What is the first name of this Employee?'
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'What is the last name of this Employee?'
            },
            {
                name: 'employeeRoleId',
                type: 'list',
                choices: roles.map((role) => {
                    return {
                        name: role.title,
                        value: role.id
                    }
                }),
                message: "What is this Employee's role?"
            },
            {
                name: 'employeeManagerId',
                type: 'list',
                choices: managers.map((manager) => {
                    return {
                        name: manager.first_name + " " + manager.last_name,
                        value: manager.id
                    }
                }),
                message: "What is this Employee's Manager's Id?"
            }
        ])

        let result = await connection.query("INSERT INTO employee SET ?", {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: (answer.employeeRoleId),
            manager_id: (answer.employeeManagerId)
        });

        console.log(`${answer.firstName} ${answer.lastName} added successfully.\n`);
        firstPrompt();

    } catch (err) {
        console.log(err);
        firstPrompt();
    };
}

