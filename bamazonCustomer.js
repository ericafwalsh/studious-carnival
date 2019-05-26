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

    // Show the customer all available products and their information
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(res);

        //   Ask the customer which product and how much, using the inquirer package
        inquirer.prompt([
            {
                type: "input",
                message: "What is the ID of the item you would like to buy?",
                name: "id"
            },
            {
                type: "input",
                message: "How many units of that product would you like to buy?",
                name: "units"
            }
        ])
            .then(function (inquirerResponse) {

                requestedQuantity = parseInt(inquirerResponse.units);
                requestedItem = inquirerResponse.id;

                // Looks up the on hand inventory
                connection.query("SELECT stock_quantity FROM products WHERE ?", { item_id: requestedItem }, function (err, quantityResult) {

                    if (err) throw err;

                    // If there is not enough inventory, stop and show "Insufficient quantity!"
                    if (requestedQuantity > quantityResult[0].stock_quantity) {
                        console.log("Insufficient quantity!");
                        connection.end();
                    }

                    // If there is enough inventory, update the products table to take out inventory and show price
                    else {
                        // Update the database
                        connection.query("UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: quantityResult[0].stock_quantity - requestedQuantity

                                },
                                {
                                    item_id: requestedItem
                                }
                            ],
                            function (err, res) {
                                if (err) throw err;
                            });

                        // Show the total price of the customer's purchase
                        connection.query("SELECT price FROM products WHERE ?", { item_id: requestedItem }, function (err, priceResult) {
                            if (err) throw err;
                            totalCustomerPrice = parseFloat(priceResult[0].price * requestedQuantity).toFixed(2);
                            console.log("Your total is $" + totalCustomerPrice);
                            connection.end();
                        });
                    }

                });

            });
    })
};
