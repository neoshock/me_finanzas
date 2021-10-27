import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {AddIncomePage} from './add-income/add-income.page';
import {IncomesService} from '../../services/incomes.service';
import {Router} from '@angular/router';

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
  selector: 'app-income',
  templateUrl: './income.page.html',
  styleUrls: ['./income.page.scss'],
  providers: [IncomesService]
})
export class IncomePage implements OnInit {

  public incomes: Income[];

  constructor(private modalController: ModalController, private income_service: IncomesService, private router: Router) { }

  ngOnInit() {

  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.loadIncomes();
      event.target.complete();
    }, 500);
  }

  ionViewDidEnter(){
    this.loadIncomes();
  }


  async loadIncomes(){
    var result = await this.income_service.getIncomes();
    if(result.length > 0){
      this.incomes = result;
      this.incomes.map(value => value.income_data.income_ammount = parseFloat(value.income_data.income_ammount).toFixed(2));
    }else{
      this.incomes = null;
    }
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddIncomePage,
      componentProps: {'data_income':'empty'}
    });
    await modal.present();
    const data = await modal.onDidDismiss();
    if (data.data.status == 'success'){
      this.loadIncomes();
    }
  }

  showDeatail(id) {
    this.router.navigate(['income/detail/'+id]);
  }

}
