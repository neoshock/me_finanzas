import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {FormControl, FormGroup} from '@angular/forms';
import {AlertController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.page.html',
  styleUrls: ['./user-update.page.scss'],
  providers: [UserService]
})
export class UserUpdatePage implements OnInit {

  update_currentUser = new FormGroup({
    user_firtsName: new FormControl(''),
    user_lastName: new FormControl('')
  });

  public userEmail: string;
  private avatar_img: Array<File>;  
  public image_avatar: any = "assets/default-img/user.png";

  constructor(private user_services: UserService, private alert_ctrl: AlertController, private router: Router) { }

  ngOnInit() {
    this.getUser();
  }

  async getUser(){
    const user = await this.user_services.getCurrentUser();
    this.userEmail = user.email;
  }

  async verifyUser(){
    if (this.update_currentUser.value.user_firstName != "" && this.update_currentUser.value.user_lastName != ""){
      if(this.avatar_img != null){
        const result = await this.user_services.updateNewUserAndVerify(this.avatar_img[0],this.update_currentUser.value);
        if(result != null){
          this.user_services.logOut_user();
          this.router.navigate(['/started']);
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

  addImgUser(event){
    const reader = new FileReader();
    this.avatar_img = event.target.files;
    reader.readAsDataURL(this.avatar_img[0]);
    reader.onload = () =>{
      this.image_avatar = reader.result;
    }
  }

}
