import { Component, OnInit, Input } from '@angular/core';
import {FingerprintAIO} from '@ionic-native/fingerprint-aio/ngx';
import {AlertController, ModalController} from '@ionic/angular';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-finger-print',
  templateUrl: './finger-print.page.html',
  styleUrls: ['./finger-print.page.scss'],
})
export class FingerPrintPage implements OnInit {

  @Input() modal_status: boolean;

  constructor(private finger: FingerprintAIO, private modal: ModalController, private alert: AlertController, private user_serivce: UserService) { }


  ngOnInit() {
    
  }

  showDataBiometrics(){
    this.finger.show({
      title: 'Autenticacion biometrica',
      description: 'Por favor use su huella dactilar',
      disableBackup: true
    }).then((result: any) =>{
      this.modal.dismiss();
    }).catch((error: any) => {
      console.log(error);
    });
  }

  resetPassword(){
    this.user_serivce.logOut_user();
    this.modal.dismiss();
  }

  async insertPassword(){
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Ingreso por contraseña',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Ingrese su contraseña'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },{
          text: 'Aceptar',
          handler: (data)=>{
            this.authenticateUser(data);
          }
        }
      ]
    });
    await alert.present();
  }

  async authenticateUser(data){
    const user = await this.user_serivce.getCurrentUser();
    var email = user.email;
    var password = data.password;
    var theUser = {email: email, password: password};
    const login = await this.user_serivce.login_user(theUser);
    if(login == 'auth/wrong-password'){
      this.presentAlert('Contraseña incorrecta')
    }else{
      if (login == 'auth/network-request-failed'){
        this.presentAlert('Hubo un error inténtelo más tarde');
      }else{
        if (login.user.uid != null){
          this.modal.dismiss();
        }
      }
    }
  }

  async presentAlert(message) {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Atención!',
      subHeader: 'Error de ingreso',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

}
