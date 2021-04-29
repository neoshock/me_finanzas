import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormControl,FormGroup} from '@angular/forms';
import {AccountsService} from '../../../services/accounts.service';
import {AlertController} from '@ionic/angular';
import {LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.page.html',
  styleUrls: ['./add-account.page.scss'],
  providers: [AccountsService]
})
export class AddAccountPage implements OnInit {

  public bank: boolean = false;
  public efective: boolean = false;
  public creditCard: boolean = false;

  bank_account = new FormGroup({
    bank_name: new FormControl(''),
    propietary_name: new FormControl(''),
    account_number: new FormControl(),
    started_balance: new FormControl()
  });

  card_account = new FormGroup({
    card_name: new FormControl(''),
    propietary_name: new FormControl(''),
    card_number: new FormControl(),
    started_balance: new FormControl()
  });

  efective_account = new FormGroup({
    account_name: new FormControl(''),
    propietary_name: new FormControl(''),
    started_balance: new FormControl()
  });

  constructor(private activate: ActivatedRoute, private account_service: AccountsService, private alert_ctrl: AlertController, private loading: LoadingController, private router: Router) { }

  ngOnInit() {
    this.activate.paramMap.subscribe(paramMap => {
      const description = paramMap.get('desc');
      if (description == 'bank_account'){
        this.bank = true;
      }else if (description == 'cash_efective'){
        this.efective = true;
      }else {
        this.creditCard = true;
      }
    });
  }

  registerBankAccount(){
    if (this.bank_account.value.card_name != "" && this.bank_account.value.propietary_name != "" && this.bank_account.value.account_number != null && this.bank_account.value.started_balance != null){
      //const result = await this.account_service.uploadNewAccount(this.bank_account.value,'bank_account');
      var result = this.account_service.addNewAccountDisconect(this.bank_account.value,'bank_account');
      if (result != null){
        this.presentLoading();
      }else{
        this.presentAlert("Hubo un error al ingresar los datos Inténtelo más tarde");
      }
    }else{
      this.presentAlert("Uno o mas campos son requeridos");
    }
  }

  async registerCardAccount(){
    if (this.card_account.value.account_name != "" && this.card_account.value.propietary_name != "" && this.card_account.value.card_number != null && this.card_account.value.started_balance != null){
      //const result = await this.account_service.uploadNewAccount(this.card_account.value,'credit_card');
      var result = this.account_service.addNewAccountDisconect(this.card_account.value,'credit_card');
      if (result != null){
        this.presentLoading();
      }else{
        this.presentAlert("Hubo un error al ingresar los datos Inténtelo más tarde");
      }
    }else{
      this.presentAlert("Uno o mas campos son requeridos");
    }
  }

  async registerEfectiveAccount(){
    if (this.efective_account.value.bank_name != "" && this.efective_account.value.propietary_name != "" && this.efective_account.value.started_balance != null){
      //const result = await this.account_service.uploadNewAccount(this.efective_account.value,'cash_efective');
      var result = this.account_service.addNewAccountDisconect(this.efective_account.value,'cash_efective');
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
      subHeader: 'Registro exitoso',
      buttons: [{
        text:"Continuar",
        handler: ()=>{
          this.router.navigate(['/my-money']);
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
