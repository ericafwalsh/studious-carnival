var inquirer = require('inquirer');
var mysql = require("mysql");
var Table = require("easy-table");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    afterConnection();
});


function afterConnection() {

    // Using an inquirer list, ask the supervisor which action they would like to perform
    inquirer.prompt([
        {
            type: "list",
            message: "Hi Supervisor. Which option would you like?",
            choices: ["View Product Sales by Department", "Create New Department"],
            name: "supervisorList"
        }
    ])
        .then(function (inquirerResponse) {

            if (inquirerResponse.supervisorList === "View Product Sales by Department") {

                connection.query(
                    "select department_id, d.department_name, over_head_costs, " +
                    "sum(product_sales) as Ttl_Product_Sales, " +
                    "(sum(product_sales) - over_head_costs) as total_profit " +
                    "from departments as d " +
                    "join products as p " +
                    "on d.department_name = p.department_name " +
                    "group by d.department_name",
                    function (err, res) {
                        if (err) throw err;

                        // Printing the results in a table using the npm package easy-table
                        var data = res;
                          var t = new Table
                          data.forEach(function(product) {
                            t.cell('Department ID', product.department_id)
                            t.cell('Department Name', product.department_name)
                            t.cell('Over Head Costs', product.over_head_costs)
                            t.cell('Product Sales', product.Ttl_Product_Sales)
                            t.cell('Total Profit', product.total_profit)
                            t.newRow()
                          })
                          console.log(t.toString())

                        connection.end();
                    })
            }

            else if (inquirerResponse.supervisorList === "Create New Department") {

                inquirer.prompt([
                    {
                        type: "input",
                        message: "What is the name of the new department?",
                        name: "newDeptName"
                    },
                    {
                        type: "input",
                        message: "What are the over head costs of the new department?",
                        name: "newDeptCosts"
                    }

                ])
                    .then(function (inquirerResponse) {

                        connection.query("INSERT INTO departments SET ?",
                            {
                                department_name: inquirerResponse.newDeptName,
                                over_head_costs: parseInt(inquirerResponse.newDeptCosts),

                            },
                            function (err, res) {
                                if (err) throw err;
                                connection.end();
                            }
                        );

                    });
            }
        })
};




 

