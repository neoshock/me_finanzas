import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {IncomesService} from '../../../services/incomes.service';
import {ExpenseService} from '../../../services/expense.service';
import { PopoverController } from '@ionic/angular';

interface Movement {
  movement_id?: string;
  movement_name?: string;
  movement_type?: string;
  movement_ammount?: any;
  movement_date?: string;
  movement_status?: boolean;
}

@Component({
  selector: 'app-home-notifications',
  templateUrl: './home-notifications.page.html',
  styleUrls: ['./home-notifications.page.scss'],
})
export class HomeNotificationsPage implements OnInit {

  constructor(private popover_controller: PopoverController, private incomesService: IncomesService, private expenseService: ExpenseService, private router: Router) {
    this.getPendingMovements();
  }

  public pendingMovements: Array<Movement> = [];

  ngOnInit() {

  }

  public async getPendingMovements(){
    let incomes = await this.incomesService.getIncomesPendding();
    let expenses = await this.expenseService.getExpensesPending();
    this.mixIncomesAndExpenses(incomes, expenses);
  }

  public mixIncomesAndExpenses(incomes, expenses){

    incomes.forEach(income => {
      let movement: Movement = {
        movement_id: income.income_id,
        movement_name: income.income_data.income_name,
        movement_type: "Ingreso",
        movement_ammount: income.income_data.income_ammount,
        movement_date: income.income_data.income_dateReceive,
        movement_status: income.income_data.income_status
      };
      this.pendingMovements.push(movement);
    });
    expenses.forEach(expense => {
      let movement: Movement = {
        movement_id: expense.expense_id,
        movement_name: expense.expense_data.expense_name,
        movement_type: "Gasto",
        movement_ammount: expense.expense_data.expense_ammount,
        movement_date: expense.expense_data.expense_dateReceive,
        movement_status: expense.expense_data.expense_status
      };
      this.pendingMovements.push(movement);
    });
  }

  showDetailIncome(id){
    this.router.navigate(['income/detail/'+id]);
    this.onDimiss();
  }

  showDetailExpense(id){
    this.router.navigate(['expense/detail/'+id]);
    this.onDimiss();
  }

  onDimiss() {
    this.popover_controller.dismiss({
      fromPopover: "anything"
    });
  }

}
