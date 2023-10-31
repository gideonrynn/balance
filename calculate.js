let statementsPath = './statements-actual/costs.json';

// overall divs
let month = document.getElementById("validdate");
let comments = document.getElementById("goals");
let error = document.getElementById("error");
let remainingDiv = document.getElementById("remaining");
let detailsDiv = document.getElementById("details");

let sections = {
    'checking': {},
    'savings': {},
    'credit_cards': {}
};

// fetch the data kept in the costs.json
// create a section for each item in the sectionData
// render details in those sections based on certain rules

// TODO: render regular versus ad hoc expenses
// TODO: pass in what section to append things to
function createSectionFromJSON(sectionTitle, sectionData, subsection = false) {

    // validate that sectionTitle is a string and sectionData is an object

    // passed in expenses must be set as they are adjusted for a given month
    let expenses = sectionData.debits;
    let credits = sectionData.credits ?? 0;
    let currentChecking = sectionData.current;
    let notes = sectionData.notes;

    // totals and balances have to be calculated
    let totalExpenses = 0;
    let totalCredits = 0;
    let totalRemaining = 0;

    
    // create the section
    let sectionDiv = document.createElement("section");
    sectionDiv.id = sectionTitle;
    detailsDiv.appendChild(sectionDiv);
    
    // create the section title
    let titleDiv = document.createElement("h2");
    titleDiv.textContent = sectionTitle.replace(/_/g, ' ');
    sectionDiv.appendChild(titleDiv);

    // object entries will be created for regular expenses and adhoc expenses, so pass both in
    // this will let us iterate over the keys in an object
    for (let type in expenses) {
        // console.log(`${type}: ${expenses[type]}`);
        // console.log(type);

        // using object entries to generate arrays for each key value pair
        // which allows me to set the id to the key [0] and run totals with the value [1]
        // and use template literals to build the text content representing each expense
        Object.entries(expenses[type]).forEach(expense => {
            // console.log(expense);
            let expenseDiv = document.createElement("p");
            expenseDiv.setAttribute("id", expense[0]);
            expenseDiv.textContent = `${expense[0].replace(/_/g, ' ')}: $${expense[1]}`;

            // use parseFloat to change string to number value to be used in calculations
            // it will also help ensure calculations don't get tripped up by trying to combine strings
            totalExpenses += parseFloat(expense[1]);
            sectionDiv.appendChild(expenseDiv);
        })
    }

    // create div with total sum of all expenses
    let newTotalDiv = document.createElement("p");
    newTotalDiv.textContent = `Total expenses: $${totalExpenses.toFixed(2)}`;
    sectionDiv.appendChild(newTotalDiv);

    totalRemaining = parseFloat((( credits.income ?? 0) + (credits.fromSavings ?? 0) + currentChecking) - totalExpenses).toFixed(2);

    // create div with total remaining funds
    if(credits && sectionTitle === 'checking') {
        remainingDiv.textContent = `Remaining Balance: $${totalRemaining}`;
    }

    let totalBalanceDiv = document.createElement("p");
    totalBalanceDiv.textContent = `Remaining Balance: $${totalRemaining}`;
    sectionDiv.appendChild(totalBalanceDiv);

    let notesDiv = document.createElement("p");
    notesDiv.textContent = notes;
    sectionDiv.appendChild(notesDiv);

    let separatorDiv = document.createElement("hr");
    sectionDiv.appendChild(separatorDiv);

}

// note that in a Fetch API request, the Promise only rejects when a network error is encountered (usually when there's a permissions issue or similar).
fetch(statementsPath)
    .then(response => response.json()) // take JSON as input and parse
    .then(data => {     // take the result of the previous call and do things with it
        console.log(data[0]);

        // data[0] because I only want the most relevant (ie recent) month to work on out of all the many months of expenses in that file
        let currentMonthFinances = data[0];
        console.log(currentMonthFinances.checking);

        comments.textContent = currentMonthFinances.comment;
        month.textContent = currentMonthFinances.date;
        
        // evaluate each item and see if it's an object
        // TODO: alternatively may want to specify the properties for checking, savings and cc
        // TODO: pass in true falses for creating sections - rules need to be set on an object somewhere
        // for example, for checking, remaining balance is true, but for cc remaining balance is false
        for(item in currentMonthFinances) {

            let sectionTitle = item;
            
            if (typeof currentMonthFinances[item] == 'object' && sectionTitle === 'checking' || sectionTitle === 'savings' ) {
                console.log("----- Here's the data being set in fetch -----");
                console.log(sectionTitle + " section of will be created in the html");
                console.log(currentMonthFinances[item]);

                createSectionFromJSON(sectionTitle, currentMonthFinances[item]);
            };

            if (typeof currentMonthFinances[item] == 'object' && sectionTitle === 'credit_cards') {
                console.log("----- Here's the data being set in fetch -----");
                console.log(sectionTitle + " section of will be created in the html");
                console.log(currentMonthFinances[item]);

                let subSectionData = currentMonthFinances[item];

                for (item in subSectionData){
                    // console.log(item);
                    createSectionFromJSON(item, subSectionData[item], true);
                }
                
            };

        };

    })
    .catch((error) => {
        console.log(error)
        errorDiv.innerHTML = `<p>Something went wrong when fetching data. Error message: ${error.message}</p>`;
    });