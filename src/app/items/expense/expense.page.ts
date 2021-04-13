import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {AddExpensePage} from './add-expense/add-expense.page';
import {ExpenseService} from '../../services/expense.service';
import {Router} from '@angular/router';

interface Expense {
  expense_id?: string;
  expense_data: {
    expense_name?: string;
    expense_description?: string;
    expense_ammount?: number;
    expense_dateReceive?: string;
    expense_accountDestine?: string;
    expense_status?:boolean;
    expense_file?: string;
  }
}

@Component({
  selector: 'app-expense',
  templateUrl: './expense.page.html',
  styleUrls: ['./expense.page.scss'],
  providers: [ExpenseService]
})
export class ExpensePage implements OnInit {

  public expenses: Array<Expense> = [];

  constructor(private modalController: ModalController, private expense_services: ExpenseService, private router: Router) { }

  ngOnInit() {
    this.loadExpenses();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddExpensePage
    });
    return await modal.present();
  }

  async loadExpenses(){
    this.expenses = await this.expense_services.getExpenses();
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.loadExpenses();
      event.target.complete();
    }, 500);
  }

  showDeatail(id) {
    this.router.navigate(['expense/detail/'+id]);
  }

}