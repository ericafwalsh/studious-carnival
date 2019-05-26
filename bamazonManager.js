var inquirer = require('inquirer');
var mysql = require("mysql");

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

    // Using an inquirer list, ask the manager which action they would like to perform
    inquirer.prompt([
        {
            type: "list",
            message: "Which option would you like?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            name: "managerList"
        }
    ])
        .then(function (inquirerResponse) {

            if (inquirerResponse.managerList === "View Products for Sale") {

                // Show all data except department when the manager selects "View Products for Sale"
                connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (err, res) {
                    if (err) throw err;
                    console.log(res);
                    connection.end();
                })
            }

            else if (inquirerResponse.managerList === "View Low Inventory") {

                // Show all procuts where inventory is less than 5
                connection.query("SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 5", function (err, res) {
                    if (err) throw err;
                    console.log(res);
                    connection.end();
                })

            }

            else if (inquirerResponse.managerList === "Add to Inventory") {

                // Ask which product and how much to add
                inquirer.prompt([
                    {
                        type: "input",
                        message: "Which item id would you like to add inventory to?",
                        name: "id"
                    },
                    {
                        type: "input",
                        message: "How many units would you like to add?",
                        name: "units"
                    }
                ])
                    .then(function (inquirerResponse) {

                        selectedUnits = parseInt(inquirerResponse.units);
                        selectedItem = inquirerResponse.id;

                        // grab the current stock quantity from the selected item
                        connection.query("SELECT stock_quantity FROM products WHERE ?", { item_id: selectedItem }, function (err, result) {

                            if (err) throw err;

                            // Update the database with the updated inventory
                            connection.query("UPDATE products SET ? WHERE ?",
                                [
                                    {
                                        stock_quantity: result[0].stock_quantity + selectedUnits

                                    },
                                    {
                                        item_id: selectedItem
                                    }
                                ],

                                function (err, res) {
                                    if (err) throw err;
                                    connection.end();
                                });

                        })

                    });
            }

            else if (inquirerResponse.managerList === "Add New Product") {

                inquirer.prompt([
                    {
                        type: "input",
                        message: "What is the name of the product?",
                        name: "productName"
                    },
                    {
                        type: "input",
                        message: "What is the product's department?",
                        name: "dept"
                    },
                    {
                        type: "input",
                        message: "What is the price of the product?",
                        name: "productPrice"
                    },
                    {
                        type: "input",
                        message: "How many units do you have on hand?",
                        name: "productUnits"
                    }

                ])
                    .then(function (inquirerResponse) {

                        connection.query("INSERT INTO products SET ?",
                            {
                                product_name: inquirerResponse.productName,
                                department_name: inquirerResponse.dept,
                                price: parseInt(inquirerResponse.productPrice),
                                stock_quantity: parseInt(inquirerResponse.productUnits)
                            },
                            function (err, res) {
                                if (err) throw err;
                                connection.end();
                            }
                        );

                    });

            }

        });

};
