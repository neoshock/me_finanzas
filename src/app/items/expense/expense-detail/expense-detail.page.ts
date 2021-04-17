import { Component, OnInit } from '@angular/core';
import {ExpenseService} from '../../../services/expense.service';
import {AccountsService} from '../../../services/accounts.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController,LoadingController, ModalController} from '@ionic/angular';
import {AddExpensePage} from '../add-expense/add-expense.page';

interface ExpenseData {
  expense_name?: string;
  expense_description?: string;
  expense_ammount?: number;
  expense_dateReceive?: string;
  expense_accountDestine?: number;
  expense_status?:boolean;
  expense_file?: string;
}

@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.page.html',
  styleUrls: ['./expense-detail.page.scss'],
  providers: [ExpenseService,AccountsService]
})
export class ExpenseDetailPage implements OnInit {

  constructor(private expense_service: ExpenseService,private activate: ActivatedRoute, 
    private account_service: AccountsService,private alert_ctrl: AlertController,private loading: LoadingController,private modalController: ModalController, private router: Router) { }

  private expense_id: any = null;
  private account_id: any = null;
  public expense_object: ExpenseData = {
    expense_name: "Cargando...",
    expense_description: "Cargando...",
    expense_ammount: 0,
    expense_dateReceive: "Cargando...",
    expense_accountDestine: 0,
    expense_status:false,
    expense_file: null
  };

  ngOnInit() {
    this.activate.paramMap.subscribe(paramMap => {
      this.expense_id = paramMap.get('id-expense');
    });
  }

  ngAfterViewInit(){
    this.getActualExpenseDetail();
  }

  public async getActualExpenseDetail(){
    var result = await this.expense_service.getExpense(this.expense_id);
    this.expense_object = result;
    this.account_id = this.expense_object.expense_accountDestine;
    this.expense_object.expense_accountDestine = await this.account_service.getAccountNumber(this.expense_object.expense_accountDestine);
  }

  expenseSuccess(){
    if(this.expense_id != null){
      this.expense_service.updateState(this.expense_id,this.account_id,this.expense_object.expense_ammount);
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
          this.getActualExpenseDetail();
        }
      }]
    });
    alert.present();
  }

  deleteExpense(){
    this.presentAlert();
  }

  async presentAlert() {
    const alert = await this.alert_ctrl.create({
      cssClass: 'my-custom-class',
      header: 'Atencion',
      subHeader: 'Una vez eliminado el egreso, no se podra recuperar, los cambios realizados no afectaran directamente a las cuentas',
      buttons: [
      {
        text: "Cancelar"
      },
      {
        text:"Continuar",
        handler: ()=>{
          this.expense_service.deleteExpense(this.expense_id);
          this.router.navigate(['/expense']);
        }
      }
      ]
    });
    alert.present();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddExpensePage,
      componentProps: { 'data_expense': this.expense_object, 'expense_id': this.expense_id,'account_id':this.account_id }
    });
    await modal.present();
    const data = await modal.onDidDismiss();
    if (data.data.status == 'success'){
      this.presentLoading();
    }
  }

}
