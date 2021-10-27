import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { UserUpdatePage } from '../../started/user-update/user-update.page';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {

  constructor(private user_service: UserService, private modal: ModalController, private alert: AlertController, private loading: LoadingController) { }

  public user: User = {
    displayName: "Cargando...",
    email: "Cargando...",
    photoURL: "assets/default-img/user.png",
    verify: false
  };

  toggleCheck = (localStorage.getItem('dark-mode') === 'true');
  fingerCheck = (localStorage.getItem('finger-mode') === 'true');

  ngOnInit() {

  }

  ionViewDidEnter(){
    this.loadUser();
  }

  async loadUser(){
    var result = await this.user_service.getCurrentUser();
    this.user.displayName =  result.displayName;
    this.user.email =  result.email;
    this.user.photoURL = result.photoURL;
    this.user.verify = result.emailVerified;
  }

  async presentModal() {
    const modal = await this.modal.create({
      component: UserUpdatePage,
      componentProps: {'status_user':'update', 'user_data': this.user}
    });
    return await modal.present();
  }

  enabledDarkMode(event){
    document.body.classList.toggle('dark', event.detail.checked);  
    localStorage.setItem('dark-mode',event.detail.checked);
  }

  enabledFingerPrint(event){
    localStorage.setItem('finger-mode',event.detail.checked);
  }

  async verifyPassword(data){
    var user = {email: this.user.email, password: data.password}
    const result = await this.user_service.login_user(user);
    if(result == 'auth/wrong-password'){
      this.presentAlert('Contraseña incorrecta vuelva a intentarlo');
    }else{
      if (result == 'auth/network-request-failed'){
        this.presentAlert('Hubo un error al ingresar los datos Inténtelo más tarde');
      }else{
        this.updatePassword();
      }
    }
  }

  async updateNewPassword(data){
    if (data.password == data.comfirm){
      this.user_service.updatePassword(data.password);
      this.presentLoading();
    }else{
      this.presentAlert('Las contraseñas no coinciden');
    }
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

  async presentAlertSuccess() {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Atencion',
      subHeader: 'Cambios realizados correctamente, a continuacion se cerrará sesión',
      buttons: [{
        text:"Continuar",
        handler: ()=>{
          this.user_service.logOut_user();
        }
      }]
    });

    await alert.present();
  }

  async presentAlertForEmail(email) {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Atencion',
      subHeader: `Le hemos enviado un correo de verificación: ${email}, una vez verificada su cuenta cierre y vuelva a iniciar sesión`,
      buttons: [{
        text:"Continuar",
        role: 'cancel'
      }]
    });

    await alert.present();
  }

  sendEmail(){
    this.user_service.sendEnamilForverification().then((result)=>{this.presentAlertForEmail(this.user.email)}).catch((error)=>{this.presentAlert('Ha ocurrido un error inténtelo más tarde')});
  }

  async updatePassword(){
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Nueva contraseña',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Ingrese la nueva contraseña'
        },
        {
          name: 'comfirm',
          type: 'password',
          placeholder: 'Comfirmar la nueva contraseña'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },{
          text: 'Cambiar contraseña',
          handler: (data)=>{
            this.updateNewPassword(data);
          }
        }
      ]
    });
    await alert.present();
  }

  async changePassword(){
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Cambiar contraseña',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Ingrese su contraseña actual'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },{
          text: 'Aceptar',
          handler: (data)=>{
            this.verifyPassword(data);
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlert(message) {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Atencion',
      subHeader: 'Error de ingreso',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  public logOut(){
    this.user_service.logOut_user();
  }

}

interface User {
  displayName: string;
  email: string;
  photoURL: string;
  verify: boolean;
}
