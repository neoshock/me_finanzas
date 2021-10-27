import { Component } from '@angular/core';
import {UserService} from './services/user.service';
import {AccountsService} from './services/accounts.service';
import {NavigationEnd, Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {FingerPrintPage} from './finger-print/finger-print.page';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [UserService,AccountsService]
})
export class AppComponent {

  public appPages = [
    { title: 'Inicio', url: '/home', icon: 'home-outline' },
    { title: 'Mis cuentas', url: '/my-money', icon: 'wallet-outline' },
    { title: 'Ingresos', url: '/income', icon: 'arrow-up-outline' },
    { title: 'Egresos', url: '/expense', icon: 'arrow-down-outline' },
    { title: 'Configuracion', url: '/config', icon: 'settings-outline' }
  ];

  private fingerPrint: boolean = false;

  the_user: any = {
    user_name: "No existe usuario",
    user_picture: "assets/default-img/user.png",
    user_balance: 0
  }

  constructor(private user_service: UserService, private router: Router, private accounts: AccountsService, private modal: ModalController) {
    this.router.events.subscribe((ev)=>{
      if (ev instanceof NavigationEnd){
        this.updateUserDates();
      }
    });
    this.loadUserDates();
    this.enableFingerPrint();
    this.enableDarkTheme();
  }

  ngOnInit(){

  }

  enableDarkTheme(){
    var toggle = (localStorage.getItem('dark-mode') === 'true');
    toggleDarkTheme(toggle);
    function toggleDarkTheme(shouldAdd) {
      document.body.classList.toggle('dark', shouldAdd);
    }
  }

  enableFingerPrint(){
    this.fingerPrint = (localStorage.getItem('finger-mode') === 'true');
    if(this.fingerPrint){
      this.presentModal();
    }
  }

  public onUseVerify: boolean = false;

  private async updateUserDates(){
      const user = await this.user_service.getCurrentUser();
      if(user != null){
        this.the_user.user_name = user.displayName;
        this.the_user.user_picture = user.photoURL;
        this.the_user.user_balance = await this.accounts.getTotalBalance();
        this.the_user.user_balance = parseFloat(this.the_user.user_balance).toFixed(2);
      }
  }

  private async loadUserDates(){
    const user = await this.user_service.getCurrentUser();
    if(user != null){
      this.router.navigate(['/tabnav']);
      this.onUseVerify = user.emailVerified;
      this.the_user.user_name = user.displayName;
      this.the_user.user_picture = user.photoURL;
      this.the_user.user_balance = await this.accounts.getTotalBalance();
      this.the_user.user_balance = parseFloat(this.the_user.user_balance).toFixed(2);
    }else{
      this.router.navigate(['/started']);
    }
  }

  async loadNavBar(){
    var menu_items = document.getElementById("menu_items");
    if (menu_items != null){
      var items = menu_items.children;
      items[0].classList.add("active");
    }
  }

  async presentModal() {
      const modal = await this.modal.create({
        component: FingerPrintPage,
        backdropDismiss: false,
        componentProps: {'modal_status':true}
      });
      return await modal.present();
  }

  public logOut(){
    this.user_service.logOut_user();
  }

}
