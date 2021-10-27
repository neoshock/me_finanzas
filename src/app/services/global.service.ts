import { Injectable } from '@angular/core';
import {AccountsService} from './accounts.service';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(private account_service: AccountsService,private user_service: UserService) {

  }

  public async getName(){
    return (await this.user_service.getCurrentUser()).displayName;
  }

  public async getTotalAmount() {
    return await this.account_service.getTotalBalance();
  }

  public async getPhotoUrl() {
    return (await this.user_service.getCurrentUser()).photoURL;
  }

  public getLastedMovemnts():any {
    
  }
}
