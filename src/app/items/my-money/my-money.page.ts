import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import {PopoverComponent} from '../popover/popover.component';
import {Acount} from '../../models/acount.models';
import {AccountsService} from '../../services/accounts.service';

@Component({
  selector: 'app-my-money',
  templateUrl: './my-money.page.html',
  styleUrls: ['./my-money.page.scss'],
  providers: [AccountsService]
})
export class MyMoneyPage implements OnInit {

  constructor(private popoverController: PopoverController, private account_service: AccountsService) { }

  public accounts: Acount[];
  public accountsAux: Acount[];

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
    if(result != null){
      this.accounts = result;
    }else{
      this.accounts = null;
    }
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
