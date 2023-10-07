let jsondata = [];
let recentDebits = [];

// TODO: add node file check, if doesn't exist, point to default statements folder
// Note that when using liveserver, you will encounter "Not allowed to load local resource" error in the console with current config
//let statementsPath = 'C:\\Users\\dilki\\OneDrive\\Documents\\Bills\\statements\\costs.json';
// there are some workarounds I don't care for with this, so for now just make sure the file is accessible within the project
let statementsPath = './statements-actual/costs.json';

// overall divs
let month = document.getElementById("validdate");
let comments = document.getElementById("goals");
let error = document.getElementById("error");
let remainingDiv = document.getElementById("remaining");

// checking divs
let checkingDiv = document.getElementById("checking-items");
let totalCheckingDiv = document.getElementById("total-checking-items");

// savings divs
let savingsDiv = document.getElementById("savings-items");
let totalSavingsDiv = document.getElementById("total-savings-items");

// credit card divs
let totalChaseDiv = document.getElementById("total-chase-items");
let chaseDiv = document.getElementById("chase-auto-items");
let cardsDiv = document.getElementById("cards");

// fetch the data kept in the costs.json
// create a section for each item in the monthOfFinances
// render details in those sections based on certain rules

// function createItemsFromJSON(appendingExpenseDiv, regularExpenses, totalDiv, cashRemainingDiv, income, savings, currentChecking) {

function createSectionFromJSON(sectionDiv, monthOfFinances) {

    // passed in expenses must be set
    let expenses = monthOfFinances.debits;
    let income = monthOfFinances.credits.income;
    let fromSavings = monthOfFinances.credits.from_savings;
    let currentChecking = monthOfFinances.current;

    // totals and balances have to be calculated
    let totalExpenses = 0;
    let totalCredits = 0;
    let totalRemaining = 0;

    // creating the section title
    let titleDiv = document.createElement("h2");

    sectionDiv.appendChild(titleDiv);

    // just do map here if you can

    // object entries will be created for regular expenses and adhoc expenses, so pass both in
    for (let type in expenses) {
        // console.log(`${type}: ${expenses[type]}`);
        console.log(type);

        // using object entries to generate arrays for each key value pair
        // which allows me to set the id to the key [0] and run totals with the value [1]
        // and use template literals to build the text content representing each expense
        Object.entries(expenses[type]).forEach(expense => {
            // console.log(expense);
            let expenseDiv = document.createElement("p");
            expenseDiv.setAttribute("id", expense[0])
            expenseDiv.textContent = `${expense[0]}: $${expense[1]}`;

            // use parseFloat to change string to number value to be used in calculations
            totalExpenses += parseFloat(expense[1]);
            sectionDiv.appendChild(expenseDiv);
        })
    }

    // create div with total sum of all expenses
    let newTotalDiv = document.createElement("p");
    newTotalDiv.textContent = `Total expenses: $${totalExpenses.toFixed(2)}`;
    sectionDiv.appendChild(newTotalDiv);


    // create div with total remaining funds
    // if(cashRemainingDiv && income) {
        // console.log(income)
        totalRemaining = parseFloat((income + fromSavings + currentChecking) - totalExpenses).toFixed(2);
        remainingDiv.textContent = `Remaining Balance: $${totalRemaining}`;
    // } 

    let separatorDiv = document.createElement("hr");
    sectionDiv.appendChild(separatorDiv);

}

// note that in a Fetch API request, the Promise only rejects when a network error is encountered (usually when there's a permissions issue or similar).
fetch(statementsPath)
    .then(response => response.json()) // take JSON as input and parse
    .then(data => {     // take the result of the previous call and do things with it
            console.log(data[0]);

            // data[0] because I only want the most relevant (ie recent) month to work on
            let currentMonthFinances = data[0];
            console.log(currentMonthFinances);

            comments.textContent = currentMonthFinances.comment;
            month.textContent = currentMonthFinances.date

            // need to create sections in the html for checking (checkingDiv), savings (savingsDiv), credit cards div
            
            // this function should know to create a checking, savings, and cc div no matter what
            // TODO: think about if I want this to boil this down into creating each section
            // createItemsFromJSON(checkingDiv, currentMonthFinances.checking, totalCheckingDiv, remainingDiv, currentMonthFinances.income, currentMonthFinances.from_savings, currentMonthFinances.existing_checking);


            // evaluate each item and see if it's an object - may want to specify the properties for checking, savings and cc
            // if it is, pass it in

            createSectionFromJSON(checkingDiv, currentMonthFinances.checking);
            // update this to dynamically deal with multiple cards
            // createItemsFromJSON(cardsDiv, currentMonthFinances.chase_auto);
            // createItemsFromJSON(cardsDiv, currentMonthFinances.boa_auto);
            // createItemsFromJSON(cardsDiv, currentMonthFinances.discover_auto);

            //https://dmitripavlutin.com/access-object-properties-javascript/
            // console.log(recentCosts.checking.chase_default);

    }) 
    .catch((error) => {
        console.log(error)
        errorDiv.innerHTML = `<p>Something went wrong when fetching data. Error message: ${error.message}</p>`;
    });