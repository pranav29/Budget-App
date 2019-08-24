class UI {
    constructor(){
        this.budgetFeedback = document.getElementById("budget-feedback");
        this.budgetForm = document.getElementById("budget-form");
        this.budgetInput = document.getElementById("budget-input");
        this.expenseFeedback = document.getElementById("expense-feedback");
        this.expenseForm = document.getElementById("expense-form");
        this.expenseTitle = document.getElementById("expense-title");
        this.expenseValue = document.getElementById("expense-value");
        this.budgetAmount = document.getElementById("budget-amount");
        this.expenseAmount = document.getElementById("expense-amount");
        this.balanceAmount = document.getElementById("balance-amount");
        this.budgetSubmit = document.getElementById("budget-submit");
        this.expenseSubmit = document.getElementById("expense-submit");
        this.expenseList = document.getElementById("expense-list");
        this.id = 0;
        this.itemList = [];
        this.elementToEdit = "";
    }

    showBudgetAmount(){
        const budget = this.budgetInput.value;

        if(budget === ''){
            this.budgetFeedback.classList.add("display-feedback");
            this.budgetFeedback.textContent = "Cannot input empty budget.";
        }
        else {
            this.budgetAmount.textContent = budget;
            this.budgetInput.value = '';
            this.budgetFeedback.classList.remove("display-feedback");
            this.calculateBalance();
        }
    }

    calculateBalance(){
        const balance = this.budgetAmount.textContent - this.expenseAmount.textContent;

        this.balanceAmount.textContent = balance;
        if(balance < 0){
            this.balanceAmount.classList.remove("showGreen");
            this.balanceAmount.classList.add("showRed");
        } else {
            this.balanceAmount.classList.remove("showRed");
            this.balanceAmount.classList.add("showGreen");
        }
    }

    showExpenseAmount(){
        const expenseTitle = this.expenseTitle.value;
        const expenseValue = this.expenseValue.value;

        if(expenseTitle === '' || expenseValue === '') {
            this.expenseFeedback.classList.add("display-feedback");
            this.expenseFeedback.textContent = "Expense title or expense value are empty."
        } else if(this.expenseSubmit.getAttribute("data-id")){
            const itemId = this.expenseSubmit.getAttribute("data-id");
            this.updateExpenseInList(itemId, expenseTitle, expenseValue);
            this.expenseSubmit.removeAttribute("data-id");
        } else {
            const expense = {
                expenseTitle,
                expenseValue,
                id: this.id
            };
            this.id++;
            this.itemList.push(expense);
            this.addExpenseToList(expense);
        }
            this.expenseTitle.value = "";
            this.expenseValue.value = "";
            this.expenseAmount.textContent = this.calculateTotalExpense();
            this.calculateBalance();
    }

    addExpenseToList(expense){
        const div = document.createElement('div');
        div.setAttribute("class", "expense-item d-flex");
        div.innerHTML = `<h5 class="list-item">${expense.expenseTitle}</h5>
                         <h5 class="list-item">${expense.expenseValue}</h5>
                          <h5 class="list-item"><a href="#" data-id = ${expense.id}>Edit</a>
                          <a href="#" data-id = ${expense.id}>Delete</a></h5>`;
        this.expenseList.appendChild(div);
    }

    editExpense(element, id){
        const item = this.getItemFromList(id);
        this.expenseTitle.value = item.expenseTitle;
        this.expenseValue.value = item.expenseValue;
        this.expenseSubmit.setAttribute("data-id", id);
        this.elementToEdit = element.parentElement.parentElement;
    }


    deleteExpense(element, id){
        const parent = element.parentElement;
        parent.removeChild(element);
        this.expenseAmount.textContent = this.calculateTotalExpense();
        this.calculateBalance();
        this.itemList = this.itemList.filter((item)=>{
            return item.id !== id;
        });
    }

    getItemFromList(id){
        const filteredList = this.itemList.filter((item)=>{
            return item.id === id;
        });
        const item = filteredList[0];
        return item;
    }

    updateExpenseInList(itemId, expenseTitle, expenseValue){
        this.itemList.forEach((item)=>{
            if(item.id === parseInt(itemId)){
                item.expenseTitle= expenseTitle;
                item.expenseValue = expenseValue;
            }
        });
        this.elementToEdit.children[0].textContent = expenseTitle;
        this.elementToEdit.children[1].textContent = expenseValue;
    }

    calculateTotalExpense(){
        const totalExpense = this.itemList.reduce((acc, current)=>{
            debugger;
            acc += parseInt(current.expenseValue);
            return acc;
        }, 0);
        return totalExpense;
    }
}

function eventListeners(){
    const ui = new UI();

    ui.budgetSubmit.addEventListener('click', (event)=>{
       event.preventDefault();
       ui.showBudgetAmount();
    });
    ui.expenseSubmit.addEventListener('click', (event)=>{
       event.preventDefault();
       ui.showExpenseAmount();
    });
    ui.expenseList.addEventListener('click', (event)=>{
       const element = event.target;

       if(element.textContent === "Edit"){
           const id = parseInt(element.getAttribute('data-id'));
           ui.editExpense(element, id);
       } else if(element.textContent === "Delete"){
           const id = parseInt(element.getAttribute('data-id'));
           const elementToDelete = element.parentElement.parentElement;
           ui.deleteExpense(elementToDelete, id);
       }
    });
}

document.addEventListener('DOMContentLoaded', ()=>{
    eventListeners();
});
