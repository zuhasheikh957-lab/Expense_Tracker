// --- Initialize expenses from localStorage ---
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// --- DOM Elements ---
const expenseForm = document.getElementById("expenseForm");
const expenseTableBody = document.querySelector("#expenseTable tbody");
const summaryChartCtx = document.getElementById("summaryChart").getContext("2d");
let summaryChart;

// --- Add Expense ---
expenseForm.addEventListener("submit", function(e){
    e.preventDefault();
    let expense = {
        date: document.getElementById("date").value,
        category: document.getElementById("category").value,
        amount: parseFloat(document.getElementById("amount").value),
        description: document.getElementById("description").value
    };

    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    expenseForm.reset();
    displayExpenses();
});

// --- Display Expenses in Table & Update Cards ---
function displayExpenses(filterCategory="", searchText="") {
    expenseTableBody.innerHTML = "";

    let total = 0, food=0, transport=0, entertainment=0, utilities=0, other=0;

    expenses.forEach((exp, index) => {
        // Filter by category
        if(filterCategory && exp.category !== filterCategory) return;

        // Filter by search
        if(searchText && !exp.description.toLowerCase().includes(searchText.toLowerCase())) return;

        total += exp.amount;
        switch(exp.category){
            case "Food": food+=exp.amount; break;
            case "Transport": transport+=exp.amount; break;
            case "Entertainment": entertainment+=exp.amount; break;
            case "Utilities": utilities+=exp.amount; break;
            case "Other": other+=exp.amount; break;
        }

        // Table row
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${exp.date}</td>
            <td>${exp.category}</td>
            <td>$${exp.amount.toFixed(2)}</td>
            <td>${exp.description}</td>
            <td><button onclick="deleteExpense(${index})">Delete</button></td>
        `;
        expenseTableBody.appendChild(row);
    });

    // Update cards
   document.getElementById("totalDisplay").innerText = total.toFixed(2);
document.getElementById("totalAmount").innerText = total.toFixed(2);
    document.getElementById("foodAmount").innerText = food.toFixed(2);
    document.getElementById("transportAmount").innerText = transport.toFixed(2);
    document.getElementById("entertainmentAmount").innerText = entertainment.toFixed(2);
    document.getElementById("OtherAmount").innerText = other.toFixed(2);

    updateChart();
}

// --- Delete Expense ---
function deleteExpense(index){
    if(confirm("Are you sure you want to delete this expense?")){
        expenses.splice(index,1);
        localStorage.setItem("expenses", JSON.stringify(expenses));
        displayExpenses(
            document.getElementById("filterCategory").value,
            document.getElementById("searchDesc").value
        );
    }
}

// --- Filter by Category ---
document.getElementById("filterCategory").addEventListener("change", function(){
    displayExpenses(this.value, document.getElementById("searchDesc").value);
});

// --- Search by Description ---
document.getElementById("searchDesc").addEventListener("input", function(){
    displayExpenses(document.getElementById("filterCategory").value, this.value);
});

// --- Monthly Summary Chart ---
let chart;
function updateChart() {
    let ctx = document.getElementById("summaryChart").getContext("2d");

    // Calculate totals per category
    let totals = {Food:0, Transport:0, Entertainment:0, Utilities:0, Other:0};
    expenses.forEach(exp => {
        if(totals[exp.category] !== undefined){
            totals[exp.category] += exp.amount;
        }
    });

    let labels = Object.keys(totals);
    let data = Object.values(totals);

    if(summaryChart) summaryChart.destroy();

    summaryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Expenses ($)',
                data: data,
                backgroundColor: ['#38bdf8','#34d399','#f87171','#facc15','#a78bfa']
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } }
        }
    });
}


// --- Dark Mode Toggle ---
document.getElementById("darkModeToggle").addEventListener("click", function(){
    document.body.classList.toggle("dark-mode");
});

// --- Initial Display ---
displayExpenses();
