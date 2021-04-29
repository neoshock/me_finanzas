import { Component, OnInit, Input } from '@angular/core';
import {UserService} from '../../services/user.service';
import {FormControl, FormGroup} from '@angular/forms';
import {AlertController, ModalController,LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.page.html',
  styleUrls: ['./user-update.page.scss'],
  providers: [UserService]
})

export class UserUpdatePage implements OnInit {

  @Input() status_user: any = 'empty';
  @Input() user_data: any;

  update_currentUser = new FormGroup({
    user_firtsName: new FormControl(''),
    user_lastName: new FormControl('')
  });

  public userEmail: string;
  private avatar_img: Array<File>;  
  public image_avatar: any = "assets/default-img/user.png";

  constructor(private user_services: UserService, private alert_ctrl: AlertController, private router: Router, private modal: ModalController, private loading: LoadingController) { }

  ngOnInit() {
    this.loadCurrentStates();
  }

  loadCurrentStates(){
    if(this.status_user == 'update'){
      var userName = this.user_data.displayName.split(' ');
      this.image_avatar = this.user_data.photoURL;
      this.update_currentUser = new FormGroup({
        user_firtsName: new FormControl(userName[0]),
        user_lastName: new FormControl(userName[userName.length -1])
      });
    }else{
      this.getUser();
    }
  }

  async getUser(){
    const user = await this.user_services.getCurrentUser();
    this.userEmail = user.email;
  }

  updateUser(){
    if (this.update_currentUser.value.user_firstName != "" && this.update_currentUser.value.user_lastName != ""){
      var status;
      var userName = this.user_data.displayName.split(' ');
      if (this.avatar_img != null){
        status = this.user_services.updateUser(this.update_currentUser.value,null,this.avatar_img[0]);
        if (status != null){
          this.presentAlertSuccess();
        }
      }else{
        if (this.update_currentUser.value.user_firtsName !== userName[0] || this.update_currentUser.value.user_lastName !== userName[1]){
          if (this.avatar_img != null){
            status = this.user_services.updateUser(this.update_currentUser.value,null,this.avatar_img[0]);
            if (status != null){
              this.presentAlertSuccess();
            }
          }else{
            status = this.user_services.updateUser(this.update_currentUser.value,this.image_avatar,null);
            if (status != null){
              this.presentAlertSuccess();
            }
          }
        }else{
          this.presentAlert("Es nescesario cambiar los valores");
        }
      }
    }else{
      this.presentAlert("Por favor llene los campos requeridos");
    }
  }

  async verifyUser(){
    if (this.update_currentUser.value.user_firstName != "" && this.update_currentUser.value.user_lastName != ""){
      if(this.avatar_img != null){
        const result = await this.user_services.updateNewUserAndVerify(this.avatar_img[0],this.update_currentUser.value);
        if(result != null){
          this.presentLoading();
        }else {
          this.presentAlert("Hubo un error intentelo mas tarde");
        }
      }else{
        this.presentAlert("es nescesario una foto de perfil");
      }
    }else{
      this.presentAlert("Por favor llene los campos requeridos")
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

  async presentLoading() {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Espere un momento....',
    });
    await loading.present();
    setTimeout(()=>{
      loading.dismiss();
      this.presentAlertCongrats();
    }, 1000);
  }

  async presentAlertCongrats() {
    const alert = await this.alert_ctrl.create({
      cssClass: 'my-custom-class',
      header: 'Atencion',
      subHeader: 'Le hemos enviado un email de verificacion, revise su correo',
      buttons: [{
        text:"Continuar",
        handler: ()=>{
          this.user_services.logOut_user();
          this.router.navigate(['/started']);
        }
      }]
    });

    await alert.present();
  }

  async presentAlertSuccess() {
    const alert = await this.alert_ctrl.create({
      cssClass: 'my-custom-class',
      header: 'Atencion',
      subHeader: 'Cambios realizado exitosamente',
      buttons: [{
        text:"Continuar",
        handler: ()=>{
          this.dismiss();
        }
      }]
    });

    await alert.present();
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modal.dismiss({
      'dismissed': true,
    });
  }

  addImgUser(event){
    const reader = new FileReader();
    this.avatar_img = event.target.files;
    reader.readAsDataURL(this.avatar_img[0]);
    reader.onload = () =>{
      this.image_avatar = reader.result;
    }
  }

}
