let jsondata = [];
let recentDebits = [];

// TODO: add node file check, if doesn't exist, point to default statements folder
let statementsPath = './statements/costs.json';

let checkingDiv = document.getElementById("checking-items");
let chaseDiv = document.getElementById("chase-auto-items");
let totalCheckingDiv = document.getElementById("total-checking-items");
let totalChaseDiv = document.getElementById("total-chase-items");
let remainingDiv = document.getElementById("remaining");
let month = document.getElementById("validdate");
let comments = document.getElementById("goals");

function createItemsFromJSON(appendingDiv, regularExpenses, totalDiv, cashRemainingDiv, income, savings, currentChecking) {

    let totalExpenses = 0;
    let remaining = 0;

    // using object entries to generate arrays for each key value pair
    // which allows me to set the id to the key and run totals with the value
    Object.entries(regularExpenses).forEach(expense => {
        
        // console.log(item);
        let newExpenseDiv = document.createElement("p");
        newExpenseDiv.setAttribute("id", expense[0])
        newExpenseDiv.textContent = `${expense[0]}: \$${expense[1]}`;

        // use parseFloat to change string to number value to be used in calculations
        totalExpenses += parseFloat(expense[1]);
        appendingDiv.appendChild(newExpenseDiv);
    })

    // create div with total sum of all expenses
    let newTotalDiv = document.createElement("p");
    newTotalDiv.textContent = totalExpenses.toFixed(2);
    totalDiv.appendChild(newTotalDiv);

    // create div with total remaining funds
    if(cashRemainingDiv && income) {
        // console.log(income)
        remaining = parseFloat((income + savings + currentChecking) - totalExpenses).toFixed(2);
        cashRemainingDiv.textContent = `$${remaining}`;
    } 

    // recentDebits.newValue = "thing";

}

fetch(statementsPath)
    .then(response => response.json()) // take JSON as input and parse
    .then(data => {     // then you can see the data and do things with it
            // console.log(data[0]);

            let recentDebits = data[0];
            // let month = recentCosts.date;
            // console.log("Valid month: " + month);

            // let text = recentCosts.checking.chase_default;
            comments.textContent = recentDebits.comment;
            month.textContent = recentDebits.date
            
            createItemsFromJSON(checkingDiv, recentDebits.checking, totalCheckingDiv, remainingDiv, recentDebits.income, recentDebits.from_savings, recentDebits.existing_checking);
            // update this to dynamic deal with multiple cards
            createItemsFromJSON(chaseDiv, recentDebits.chase_auto, totalChaseDiv);

            //https://dmitripavlutin.com/access-object-properties-javascript/
            // console.log(recentCosts.checking.chase_default);


    }) 
    .catch(error => console.log(error));