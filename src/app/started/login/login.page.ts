import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {FormControl, FormGroup} from '@angular/forms';
import {AlertController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: [UserService]
})
export class LoginPage implements OnInit {

  user_login = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private user_services: UserService, private alert_ctrl: AlertController, private router: Router) { }

  ngOnInit() {
    
  }

  async loginWithEmail(){
    console.log(this.user_login.value);
    if(this.user_login.value.email != "" && this.user_login.value.password != ""){
      var user = await this.user_services.login_user(this.user_login.value);
      if(user == "auth/network-request-failed"){
        this.presentAlert("Error de conexion intentelo mas tarde")
      }else if (user == "auth/wrong-password"){
        this.presentAlert("correo o contrasena incorrectos");
      }else{
        if(user.user.uid != null){
          window.location.reload();
          console.log('aqui');
        }
      }
    }else{
      this.presentAlert("por favor llene los campos requeridos");
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

}
