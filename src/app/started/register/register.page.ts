import { Component, OnInit } from '@angular/core';
import {FormControl,FormGroup} from '@angular/forms';
import {AlertController} from '@ionic/angular';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private alert_ctrl: AlertController, private user_service: UserService, private router: Router) { }

  user_register = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    password_repeat: new FormControl(''),
    accept_terms: new FormControl(false)
  });

  ngOnInit() {

  }

  ionViewDidEnter(){
    this.user_register = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
      password_repeat: new FormControl(''),
      accept_terms: new FormControl(false)
    });
  }

  async registerNewUser(){
    if (this.user_register.value.email != "" && this.user_register.value.password != "" && this.user_register.value.password_repeat != ""){
      if(this.user_register.value.password == this.user_register.value.password_repeat){
        if(this.user_register.value.accept_terms){
          var register = await this.user_service.register_User(this.user_register.value);
          if (register != null){
            this.router.navigate(['/started/user-update']);
          }else{
            this.presentAlert("Hubo un error al crear el usuario, intentelo mas tarde");
          }
        }else{
          this.presentAlert("Acepte los terminos y condiciones");
        }
      }else{
        this.presentAlert("Las contrasenas no coinciden");
      }
    }else{
      this.presentAlert("Por favor llene los campos requeridos");
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
