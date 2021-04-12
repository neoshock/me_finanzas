import { Component, OnInit } from '@angular/core';
import {LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-started',
  templateUrl: './started.page.html',
  styleUrls: ['./started.page.scss'],
  providers: [UserService]
})
export class StartedPage implements OnInit {

  constructor(private loading: LoadingController, private user_service: UserService, private router: Router) { }

  ngOnInit() {
    //this.user_service.logOut_user();
  }

  async presentLoading() {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Espere un momento....',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
  }

}
