import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import {FormControl,FormGroup} from '@angular/forms';
import {AccountsService} from '../../../services/accounts.service';
import {AlertController} from '@ionic/angular';
import {LoadingController} from '@ionic/angular';
import {Account} from '../../../models/acount.models';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.page.html',
  styleUrls: ['./edit-account.page.scss'],
  providers: [AccountsService]
})
export class EditAccountPage implements OnInit {

  constructor(private account_service: AccountsService, private activate: ActivatedRoute, private alert_ctrl: AlertController, private router: Router, private loading: LoadingController) { 
    this.activate.paramMap.subscribe(paramMap => {
      this.account_id = paramMap.get('id-account');
      this.loadData();
    });
  }

  private account_id;
  public account: Account = {
    account_id: "",
    account_data: {

    }
  };

  bank_account;
  card_account;
  efective_account;

  ngOnInit() {

  }

  async loadData(){
    this.account = await this.account_service.getAccount(this.account_id);
    if(this.account != null){
      if(this.account.account_data.type_account == 'bank_account'){
        this.bank_account = new FormGroup({
          bank_name: new FormControl(this.account.account_data.name_account),
          propietary_name: new FormControl(this.account.account_data.propietary_name),
          account_number: new FormControl(this.account.account_data.account_number),
          started_balance: new FormControl(this.account.account_data.account_balance)
        });
      }else if(this.account.account_data.type_account == 'cash_efective'){
        this.efective_account = new FormGroup({
          account_name: new FormControl(this.account.account_data.name_account),
          propietary_name: new FormControl(this.account.account_data.propietary_name),
          started_balance: new FormControl(this.account.account_data.account_balance)
        });
      }else {
        this.card_account = new FormGroup({
          card_name: new FormControl(this.account.account_data.name_account),
          propietary_name: new FormControl(this.account.account_data.propietary_name),
          card_number: new FormControl(this.account.account_data.account_number),
          started_balance: new FormControl(this.account.account_data.account_balance)
        });
      }
    }
  }

  editCashAccount() {
    if (this.efective_account.value.account_name != "" && this.efective_account.value.propietary_name != "" && this.efective_account.value.started_balance != null){
      //const result = await this.account_service.uploadNewAccount(this.efective_account.value,'cash_efective');
      this.account.account_data.name_account = this.efective_account.value.account_name;
      this.account.account_data.propietary_name = this.efective_account.value.propietary_name;
      this.account.account_data.account_balance = this.efective_account.value.started_balance;
      var result = this.account_service.updateAccount(this.account);
      if (result != null){
        this.presentLoading();
      }else{
        this.presentAlert("Hubo un error al ingresar los datos Inténtelo más tarde");
      }
    }else{
      this.presentAlert("Uno o más campos son requeridos");
    }
  }

  editBankAccount() {
    if (this.bank_account.value.bank_name != "" && this.bank_account.value.propietary_name != "" && this.bank_account.value.started_balance != null && this.bank_account.value.account_number != null){
      //const result = await this.account_service.uploadNewAccount(this.efective_account.value,'cash_efective');
      this.account.account_data.name_account = this.bank_account.value.bank_name;
      this.account.account_data.propietary_name = this.bank_account.value.propietary_name;
      this.account.account_data.account_balance = this.bank_account.value.started_balance;
      this.account.account_data.account_number = this.bank_account.value.account_number;
      var result = this.account_service.updateAccount(this.account);
      if (result != null){
        this.presentLoading();
      }else{
        this.presentAlert("Hubo un error al ingresar los datos Inténtelo más tarde");
      }
    }else{
      this.presentAlert("Uno o mas campos son requeridos");
    }
  }

  editCardAccount() {
    if (this.card_account.value.card_name != "" && this.card_account.value.propietary_name != "" && this.card_account.value.started_balance != null && this.card_account.value.card_number != null){
      //const result = await this.account_service.uploadNewAccount(this.efective_account.value,'cash_efective');
      this.account.account_data.name_account = this.card_account.value.card_name;
      this.account.account_data.propietary_name = this.card_account.value.propietary_name;
      this.account.account_data.account_balance = this.card_account.value.started_balance;
      this.account.account_data.account_number = this.card_account.value.card_number;
      var result = this.account_service.updateAccount(this.account);
      if (result != null){
        this.presentLoading();
      }else{
        this.presentAlert("Hubo un error al ingresar los datos Inténtelo más tarde");
      }
    }else{
      this.presentAlert("Uno o mas campos son requeridos");
    }
  }

  async presentAlert(message) {
    const alert = await this.alert_ctrl.create({
      cssClass: 'my-custom-class',
      header: 'Atencion',
      subHeader: 'Error de ingreso',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentAlertSuccess() {
    const alert = await this.alert_ctrl.create({
      cssClass: 'my-custom-class',
      header: 'Atencion',
      backdropDismiss: false,
      subHeader: 'Registro exitoso',
      buttons: [{
        text:"Continuar",
        handler: ()=>{
          this.router.navigate(['/tabnav/my-money']);
        }
      }]
    });

    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Espere un momento....',
    });
    await loading.present();
    setTimeout(()=>{
      loading.dismiss();
      this.presentAlertSuccess();
    }, 1000);
  }

}
