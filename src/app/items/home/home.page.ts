import { Router } from '@angular/router';
import { IncomesService } from './../../services/incomes.service';
import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {AccountsService} from '../../services/accounts.service';
import { ExpenseService } from 'src/app/services/expense.service';
import {PopoverController} from '@ionic/angular';
import { HomePopoverComponent } from './home-popover/home-popover.component';
import {HomeNotificationsPage} from './home-notifications/home-notifications.page';

interface Income {
  income_id?: string;
  income_data: {
    income_name?: string;
    income_description?: string;
    income_ammount?: any;
    income_dateReceive?: string;
    income_accountDestine?: string;
    income_status?:boolean;
    income_file?: string;
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {

  public user: any = {
    user_name: "Usuario",
    user_photo: "assets/default-img/user.png",
    user_amount: 0,
    user_expenses: 0,
    user_incomes: 0
  }

  public movements: Array<Income> = [];

  public pendings: Array<any> = [];

  constructor(private user_service: UserService, private account_service: AccountsService, public expense_service: ExpenseService, public income_service: IncomesService, private router: Router, private popoverController: PopoverController) {

  }

  ngOnInit() {
    this.loadData(); 
  }

  ionViewDidEnter() {
    this.pendings = [];
    this.loadPenddingMovement();
  }

  private async loadData(){
    const result = await this.user_service.getCurrentUser();
    if(result != null){
      this.user.user_name = result.displayName;
      this.user.user_photo = result.photoURL;
      this.loadTotal();
      this.loadLastedMovement();
    }
  }

  private async loadTotal(){
    this.user.user_amount = await this.account_service.getTotalBalance();
    this.user.user_expenses = await this.expense_service.getTotalExpense();
    this.user.user_expenses = parseFloat(this.user.user_expenses).toFixed(2);
    this.user.user_incomes = await this.income_service.getTotalIncomes();
    this.user.user_incomes = parseFloat(this.user.user_incomes).toFixed(2);
  }

  private async loadLastedMovement(){
    const resultIncomes = await this.income_service.getIncomes();
    if(resultIncomes.length > 0){
      resultIncomes.forEach(r =>{
        this.movements.push(r);
      });
      this.movements = this.sortIncomes(this.movements);
    }
  }

  private async loadPenddingMovement(){
    const incomes = await this.income_service.getIncomesPendding();
    const expenses = await this.expense_service.getExpensesPending();
    incomes.forEach(i => this.pendings.push(i));
    expenses.forEach(e => this.pendings.push(e));
  }

  private sortIncomes(incomes: Array<Income>){
    var element = [];
    var items = [];
    for(let i = 0; i< incomes.length; i++){
      if(incomes[i].income_data.income_status == true){
        element.push(incomes[i]);
      }
    }

    for(let i = 0; i< 4; i++){
      items.push(element[i]);
    }
    return items;
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: HomeNotificationsPage,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });
    await popover.present();
    const { role } = await popover.onDidDismiss();
  }

  showDeatail(id) {
    this.router.navigate(['income/detail/'+id]);
  }
}
