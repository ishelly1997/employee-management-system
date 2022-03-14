//packages
const mysql = require('mysql2');
const inquirer = require("inquirer");
const util = require('util');
const consoleTable = require("console.table");

// Connection to database
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
  console.log(`Connected to the Employee Database.`)
);
connection.query = util.promisify(connection.query);
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    console.log(`Employee Management System`)
    firstPrompt();
});
//main menu nav
const firstPrompt = async () => {

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

        case "View All Employees":
            viewEmployees();
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
  //print all employees
const viewEmployees = async () => {
    console.log('Employees');
    try {
        let query = 'SELECT * FROM employee';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let employeeChoices = [];
            res.forEach(employee => employeeChoices.push(employee));
            console.table(employeeChoices);
            firstPrompt();
        });
    } catch (err) {
        console.log(err);
        firstPrompt();
    };
}

// print all departments
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

// print all roles
const viewAllRoles = async () => {
    console.log('Roles');
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

// add a new employee to db
const addEmployee = async () => {
    try {
        console.log('Add Employee');

        let roles = await connection.query("SELECT * FROM role");

        let managers = await connection.query("SELECT * FROM employee");

        let answer = await inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'First Name?'
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'Last Name?'
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
                message: "Employee Role?"
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
                message: "Employee Manager Id?"
            }
        ])

        let result = await connection.query("INSERT INTO employee SET ?", {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: (answer.employeeRoleId),
            manager_id: (answer.employeeManagerId)
        });

        console.log(`${answer.firstName} ${answer.lastName} added to Employees.\n`);
        firstPrompt();

    } catch (err) {
        console.log(err);
        firstPrompt();
    };
}

// add a new department to db
const addDepartment = async () => {
    try {
        console.log('Add Department');

        let answer = await inquirer.prompt([
            {
                name: 'deptName',
                type: 'input',
                message: 'New Department Name?'
            }
        ]);

        let result = await connection.query("INSERT INTO department SET ?", {
            department_name: answer.deptName
        });

        console.log(`${answer.deptName} added to Departments.\n`)
        firstPrompt();

    } catch (err) {
        console.log(err);
        firstPrompt();
    };
}

// add a new role to db
const addRole = async () => {
    try {
        console.log('Add Role');

        let departments = await connection.query("SELECT * FROM department")

        let answer = await inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'New Role Title?'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Salary?'
            },
            {
                name: 'departmentId',
                type: 'list',
                choices: departments.map((departmentId) => {
                    return {
                        name: departmentId.department_name,
                        value: departmentId.id
                    }
                }),
                message: 'Department ID associated with Role?',
            }
        ]);
        
        let chosenDept;
        for (i = 0; i < departments.length; i++) {
            if(departments[i].department_id === answer.choice) {
                chosenDept = departments[i];
            };
        }
        let result = await connection.query("INSERT INTO role SET ?", {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.departmentId
        })

        console.log(`${answer.title} role added.\n`)
        firstPrompt();

    } catch (err) {
        console.log(err);
        firstPrompt();
    };
}

// update/change role of an employee within db
const updateEmployeeRole = async () => {
    try {
        console.log('Update Employee Role');
        
        let employees = await connection.query("SELECT * FROM employee");

        let employeeSelection = await inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                choices: employees.map((employeeName) => {
                    return {
                        name: employeeName.first_name + " " + employeeName.last_name,
                        value: employeeName.id
                    }
                }),
                message: 'Select Employee:'
            }
        ]);

        let roles = await connection.query("SELECT * FROM role");

        let roleSelection = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: roles.map((roleName) => {
                    return {
                        name: roleName.title,
                        value: roleName.id
                    }
                }),
                message: 'Select new role.'
            }
        ]);

        let result = await connection.query("UPDATE employee SET ? WHERE ?", [{ role_id: roleSelection.role }, { id: employeeSelection.employee }]);

        console.log(`Employee Role Updated.\n`);
        firstPrompt();

    } catch (err) {
        console.log(err);
        firstPrompt();
    };
}