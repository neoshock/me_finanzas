import { Component, OnInit } from '@angular/core';
import {IncomesService} from '../../../services/incomes.service';
import {AccountsService} from '../../../services/accounts.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {LoadingController} from '@ionic/angular';

interface IncomeData {
  income_name?: string;
  income_description?: string;
  income_ammount?: number;
  income_dateReceive?: string;
  income_accountDestine?: number;
  income_status?:boolean;
  income_file?: string;
}


@Component({
  selector: 'app-income-detail',
  templateUrl: './income-detail.page.html',
  styleUrls: ['./income-detail.page.scss'],
  providers: [IncomesService,AccountsService]
})
export class IncomeDetailPage implements OnInit {

  constructor(private income_service: IncomesService,private activate: ActivatedRoute, 
    private account_service: AccountsService,private alert_ctrl: AlertController,private loading: LoadingController) { }
  private income_id: any = null;
  private account_id: any = null;
  public income_objet: IncomeData = {
    income_name: "string",
    income_description: "string",
    income_ammount: 0,
    income_dateReceive: "string",
    income_accountDestine: 0,
    income_status:false,
    income_file: null
  };

  ngOnInit() {
    this.activate.paramMap.subscribe(paramMap => {
      this.income_id = paramMap.get('id-income');
    });
  }

  ngAfterViewInit(){
    this.getActualIncomeDetail();
  }

  public async getActualIncomeDetail(){
    var result = await this.income_service.getIncome(this.income_id);
    this.income_objet = result;
    this.account_id = this.income_objet.income_accountDestine;
    this.income_objet.income_accountDestine = await this.account_service.getAccountNumber(this.income_objet.income_accountDestine);
  }

  incomeSuccess(){
    if(this.income_id != null){
      this.income_service.updateState(this.income_id,this.account_id,this.income_objet.income_ammount);
      this.presentLoading();
    }
  }

  async presentLoading() {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Espere un momento....',
    });
    await loading.present();
    setTimeout(()=>{
      this.presentAlertSuccess();
      loading.dismiss();
    }, 1000);
  }

  async presentAlertSuccess() {
    const alert = await this.alert_ctrl.create({
      cssClass: 'my-custom-class',
      header: 'Atencion',
      subHeader: 'Cambios realizados exitosamente',
      buttons: [{
        text:"Continuar",
        handler: ()=>{
          this.getActualIncomeDetail();
        }
      }]
    });
    alert.present();
  }

}
