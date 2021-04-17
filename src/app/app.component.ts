import { Component } from '@angular/core';
import {UserService} from './services/user.service';
import {AccountsService} from './services/accounts.service';
import {NavigationEnd, Router} from '@angular/router';
import { User } from './models/user';



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
    { title: 'Egresos', url: '/expense', icon: 'arrow-down-outline' }
  ];

  the_user: any = {
    user_name: "No existe usuario",
    user_picture: "assets/default-img/user.png",
    user_balance: 0
  }

  constructor(private user_service: UserService, private router: Router, private accounts: AccountsService) {
    this.router.events.subscribe((ev)=>{
      if (ev instanceof NavigationEnd){
        this.updateUserDates();
      }
    });
  }

  ngOnInit(){
    this.loadUserDates();
  }

  public onUseVerify: boolean = false;

  private async updateUserDates(){
    if(this.onUseVerify){
      const user = await this.user_service.getCurrentUser();
      if(user != null){
        this.the_user.user_name = user.displayName;
        this.the_user.user_picture = user.photoURL;
        this.the_user.user_balance = await this.accounts.getTotalBalance();
        this.the_user.user_balance = parseFloat(this.the_user.user_balance).toFixed(2);
      }
    }
  }

  private async loadUserDates(){
    const user = await this.user_service.getCurrentUser();
    if(user != null){
      this.router.navigate(['/home']);
      if(user.emailVerified){
        this.onUseVerify = true;
        this.the_user.user_name = user.displayName;
        this.the_user.user_picture = user.photoURL;
        this.the_user.user_balance = await this.accounts.getTotalBalance();
        this.the_user.user_balance = parseFloat(this.the_user.user_balance).toFixed(2);
        await this.loadNavBar();
      }else{
        this.the_user.user_name = "Nescesitamos que verifique su correo";
      }
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

  public logOut(){
    this.user_service.logOut_user();
  }

  public onToggleItem(event){
    let indice = 0;
    var menu_items = document.getElementById("menu_items");
    var items = menu_items.children;

    for (let i =0; i< this.appPages.length; i++){
      if(this.appPages[i].title == event.title){
        indice = i;
        break;
      }else{
        indice = 0;
      }
    }
    for (let i = 0; i< this.appPages.length; i++){
      items[i].classList.remove("active");
    }
    items[indice].classList.toggle("active");
  }
}
