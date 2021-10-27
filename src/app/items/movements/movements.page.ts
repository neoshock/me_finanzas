import { Component, OnInit } from '@angular/core';
import { IncomesService } from 'src/app/services/incomes.service';
import { ExpenseService } from 'src/app/services/expense.service';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.page.html',
  styleUrls: ['./movements.page.scss'],
})
export class MovementsPage implements OnInit {

  public totalIncomes: number = 0;
  public totalExpenses: number = 0;

  constructor(private income: IncomesService, private expense: ExpenseService) { }

  ngOnInit() {
    this.getTotalCountMovements();
  }

  private async getTotalCountMovements(){
    const resultIncome = await this.income.getIncomes();
    this.totalIncomes = resultIncome.length;

    const resultExpense = await this.expense.getExpenses();
    this.totalExpenses = resultExpense.length;
    
  }
}
