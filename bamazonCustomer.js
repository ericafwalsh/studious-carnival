var inquirer = require('inquirer');

inquirer.prompt([
    {
        type: "input",
        message: "What is id of the item you would like to buy?",
        name: "id"
    },
    {
        type: "input",
        message: "How many units of that product would you like to buy?",
        name: "units"
    }
])
.then(function(inquirerResponse) {
    console.log("You chose product ID: " + inquirerResponse.id);
    console.log("You want to buy " + inquirerResponse.units + " units");
});