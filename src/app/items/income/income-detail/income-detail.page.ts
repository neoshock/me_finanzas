import { Component, OnInit } from '@angular/core';
import {IncomesService} from '../../../services/incomes.service';
import {AccountsService} from '../../../services/accounts.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, LoadingController, ModalController} from '@ionic/angular';
import {AddIncomePage} from '../add-income/add-income.page';

interface IncomeData {
  income_name?: string;
  income_description?: string;
  income_ammount?: number;
  income_dateReceive?: string;
  income_accountDestine?: any;
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
    private account_service: AccountsService,private alert_ctrl: AlertController,private loading: LoadingController, private modalController: ModalController, private router: Router) { }
  private income_id: any = null;
  private account_id: any = null;

  public income_objet: IncomeData = {
    income_name: "Cargando...",
    income_description: "Cargando...",
    income_ammount: 0,
    income_dateReceive: "Cargando...",
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
    var result: IncomeData = await this.income_service.getIncome(this.income_id);
    this.account_id = result.income_accountDestine;
    result.income_accountDestine = "Cargando...";
    this.income_objet = result;
    this.income_objet.income_accountDestine = await this.account_service.getAccountNumber(this.account_id);
  }

  deleteIncome(){
    this.presentAlert();
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
      this.getActualIncomeDetail();
      this.presentAlertSuccess();
      loading.dismiss();
    }, 1000);
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddIncomePage,
      componentProps: { 'data_income': this.income_objet, 'income_id': this.income_id,'account_id':this.account_id }
    });
    await modal.present();
    const data = await modal.onDidDismiss();
    if (data.data.status == 'success'){
      this.presentLoading();
    }
  }

  async presentAlert() {
    const alert = await this.alert_ctrl.create({
      cssClass: 'my-custom-class',
      header: 'Atención!',
      subHeader: 'Una vez eliminado el egreso no se podrá recuperar, los cambios realizados no afectaran directamente a las cuentas',
      buttons: [
      {
        text: "Cancelar"
      },
      {
        text:"Continuar",
        handler: ()=>{
          this.income_service.deleteIncome(this.income_id);
          this.router.navigate(['/income']);
        }
      }
      ]
    });
    alert.present();
  }

  async presentAlertSuccess() {
    const alert = await this.alert_ctrl.create({
      cssClass: 'my-custom-class',
      header: 'Atención!',
      subHeader: 'Cambios realizados exitosamente',
      buttons: [{
        text:"Continuar"
      }]
    });
    alert.present();
  }

}
