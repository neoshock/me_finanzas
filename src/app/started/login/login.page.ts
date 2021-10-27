import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {FormControl, FormGroup} from '@angular/forms';
import {AlertController,LoadingController} from '@ionic/angular';
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

  constructor(private user_services: UserService, private alert_ctrl: AlertController, private router: Router, private loading_controller: LoadingController) { }

  ngOnInit() {
    
  }

  async loginWithEmail(){
    const loading = await this.loading_controller.create({message: 'Espere un momento...'});
    if(this.user_login.value.email != "" && this.user_login.value.password != ""){
      loading.present();
      var user = await this.user_services.login_user(this.user_login.value);
      if(user == "auth/network-request-failed"){
        loading.dismiss();
        this.presentAlert("Error de conexión inténtelo más tarde")
      }else if (user == "auth/wrong-password"){
        loading.dismiss();
        this.presentAlert("Correo o contraseña incorrecto");
      }else{
        loading.dismiss();
        if(user.user.uid != null){
          window.location.reload();
        }
      }
    }else{
      this.presentAlert("Por favor llene los campos requeridos");
    }
  }

  private async sendEmailToResetPassword(data){
    var result = await this.user_services.sendResetPassword(data.correo);
    if(result != 'success'){
      this.presentAlert('Hubo un error inténtelo mas tarde');
    }else{
      this.presentLoading();
    }
  }

  async loginFacebook(){
    const loading = await this.loading_controller.create({message: 'Espere un momento...'});
    loading.present();
    this.user_services.singInWithFacebook().then((result)=>{
      if(result){
        loading.dismiss();
        window.location.reload();
      }else{
        loading.dismiss();
      }
    }).catch((error)=>{
      loading.dismiss();
      this.presentAlert("Error de conexión inténtelo más tarde");
    });
  }

  async loginGoogle(){
    const loading = await this.loading_controller.create({message: 'Espere un momento...'});
    loading.present();
    this.user_services.singInWithGoogle().then(result=>{
      if(result){
        loading.dismiss();
        window.location.reload();
      }else{
        loading.dismiss();
      }
    }).catch(error=>{
      loading.dismiss();
      this.presentAlert(error.code);
    })
  }

  
  async presentAlertTemp(message){
    const alert = await this.alert_ctrl.create({
      cssClass: 'my-custom-class',
      header: 'Atencion',
      message: message,
    });
    await alert.present();
  }

  async presentAlertToReset(){
    const alert = await this.alert_ctrl.create({
      cssClass: 'my-custom-class',
      header: 'Restablecer contraseña',
      message: 'A continuación, se le enviara un correo para restablecer su contraseña',
      inputs: [
        {
          name: 'correo',
          type: 'email',
          placeholder: 'Ingrese su dirección de correo'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },{
          text: 'Enviar',
          handler: (data)=>{
            this.sendEmailToResetPassword(data);
          }
        }
      ]
    });
    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loading_controller.create({
      cssClass: 'my-custom-class',
      message: 'Espere un momento....',
    });
    await loading.present();
    setTimeout(()=>{
      loading.dismiss();
      this.presentAlertSuccess();
    }, 1000);
  }

  async presentAlertSuccess() {
    const alert = await this.alert_ctrl.create({
      cssClass: 'my-custom-class',
      header: 'Atencion',
      subHeader: 'Correo enviado exitosamente',
      buttons: [{
        text:"Continuar",
        role: 'cancel'
      }]
    });

    await alert.present();
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
