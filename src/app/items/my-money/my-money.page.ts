import { Component, OnInit } from '@angular/core';
import { PopoverController, ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import {PopoverComponent} from '../popover/popover.component';
import {Account} from '../../models/acount.models';
import {AccountsService} from '../../services/accounts.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-my-money',
  templateUrl: './my-money.page.html',
  styleUrls: ['./my-money.page.scss'],
  providers: [AccountsService]
})

export class MyMoneyPage implements OnInit {

  constructor(private popoverController: PopoverController, private account_service: AccountsService, public actionSheet: ActionSheetController, private router: Router, private alertController: AlertController, private loading: LoadingController) { }

  public accounts: Account[];
  public accountsAux: Account[];

  ngOnInit() {

  }

  ngAfterViewInit() {

  }

  ionViewDidEnter(){
    this.loadAccounts();
  }

  async loadAccounts(){
    //var result = await this.account_service.getAccounts();
    var result = await this.account_service.getAccountsDisconect();
    if(result.length > 0){
      this.accounts = result;
      this.accounts.map(value => value.account_data.account_balance = parseFloat(value.account_data.account_balance).toFixed(2));
    }else{
      this.accounts = null;
    }
  }

  async presentActionSheet(content) {

    const actionSheet = await this.actionSheet.create({
      header:  content.account_data.name_account,
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Editar',
        icon: 'pencil',
        handler: () => {
          this.router.navigate([`my-money/edit-account/${content.account_id}`]);
        }
      }, {
        text: 'Eliminar cuenta',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.deleteAccount(content.account_id);
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {

        }
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  private deleteAccount(id){
    this.presentAlertConfirm(id);
  }

  async presentAlertConfirm(id) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Comfirmar',
      message: 'Una vez realizado los cambios no se podrá recuperar la cuenta',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        }, {
          text: 'Eliminar',
          handler: () => {
            this.account_service.deleteAccount(id);
            this.presentLoading();
            this.loadAccounts();
          }
        }
      ]
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
    }, 1000);
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });
    await popover.present();
    const { role } = await popover.onDidDismiss();
  }

}

