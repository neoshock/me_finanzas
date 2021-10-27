import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {AngularFirestore} from '@angular/fire/firestore';
import { first } from 'rxjs/operators';
import {UserService} from './user.service';

interface Account {
  account_balance?: number;
  account_number?: number;
  class_name?: string;
  icon_image?: string
  name_account?: string;
  propietary_name?: string;
  type_account?: string;
}

interface Data {
  data?: any; 
}

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(private user_service: UserService,private fire_database: AngularFireDatabase, private firestore: AngularFirestore) {

  }


  private accountFormater(account, type):any{
    var account;
    if(type == "bank_account"){
      account = {
        name_account: account.bank_name,
        type_account: 'bank_account',
        propietary_name: account.propietary_name,
        account_number: account.account_number,
        account_balance: account.started_balance,
        icon_image: 'home-outline',
        class_name: 'bank-acount'
      }
    }else if (type == "credit_card"){
      account = {
        name_account: account.card_name,
        type_account: 'credit_card',
        propietary_name: account.propietary_name,
        account_number: account.card_number,
        account_balance: account.started_balance,
        icon_image: 'card-outline',
        class_name: 'card-acount'
      }
    }else{
      account = {
        name_account: account.account_name,
        type_account: 'cash_efective',
        propietary_name: account.propietary_name,
        account_number: null,
        account_balance: account.started_balance,
        icon_image: 'cash-outline',
        class_name: 'efective-account'
      }
    }
    return account;
  }

  //Firestore para persistencia de datos

  public async addNewAccountDisconect(account,type){
    const userUID = (await this.user_service.getCurrentUser()).uid;
    const accountResult = this.user_service.encrypt(JSON.stringify(this.accountFormater(account,type)).toString());
    if(userUID != null){
       await this.firestore.collection(`users/${userUID}/accounts`).add({data:accountResult}).then((docRef) =>{
      }).catch((error)=>{
        console.log(error);
      });
    }
  }

  public async updateAccount(account){
    const userUID = (await this.user_service.getCurrentUser()).uid;
    if (userUID != null){
      const result = await this.firestore.collection(`users/${userUID}/accounts`).doc(account.account_id);
      var data = {data: this.user_service.encrypt(JSON.stringify(account.account_data).toString())} 
      result.update(data);
    }
  }

  async getAccountNumbers(){
    var accountItems = [];
    var result = await this.getAllAccountsActives();
    for(let item of result){
      if(item.data.type_account != 'credit_card'){
        accountItems.push(item);
      }
    }
    return accountItems;
  }

  public async getAllAccountsActives(){
    const userUID = (await this.user_service.getCurrentUser()).uid;
    var items = null;
    var result = [];
    if (userUID != null){
      items = (await this.firestore.collection(`users/${userUID}/accounts`).get().toPromise()).docs;
      if (items != null){
        items.forEach(element => {
          if(element.data().data){
            result.push({id: element.id,data:JSON.parse(this.user_service.decrypt(element.data().data))});
          }else{
            result.push({id: element.id, data: element.data()});
          }
        });
      }
    }
    return result;
  }

  public async deleteAccount(account_id){
    const userUID = (await this.user_service.getCurrentUser()).uid;
    if (userUID != null){
      const result = await this.firestore.collection(`users/${userUID}/accounts`).doc(account_id);
      result.delete();
    }
  }

  public async getTotalBalance(){
    var totalBalance = 0;
    var result = await this.getAccountsDisconect();
    result.forEach((element)=>{
      totalBalance += element.account_data.account_balance;
    });
    return totalBalance;
  }

  public async updateAccountAmount(amount,accountId,userUid){
    const account = await this.firestore.collection(`users/${userUid}/accounts/`).doc(accountId);
    account.get().subscribe((doc)=>{
      if(doc.exists){
        var myElement: Data = doc.data();
        if(myElement.data){
          var accountDecrypt: Account = JSON.parse(this.user_service.decrypt(myElement.data));
          accountDecrypt.account_balance += amount;
          var accountEncrypt = this.user_service.encrypt(JSON.stringify(accountDecrypt).toString());
          account.update({data:accountEncrypt});
        }else{
          var accountNormal: Account = doc.data();
          var totalBalance = accountNormal.account_balance + amount;
          account.update({account_balance: totalBalance});
        }
      }
    });
  }

  async getAccountNumber(account_id) {
    const userUID = (await this.user_service.getCurrentUser()).uid;
    if(userUID != null){
      const account_number = this.firestore.collection(`users/${userUID}/accounts/`).doc(account_id);
      var result: Data = (await account_number.get().toPromise()).data();
      if (result == null){
        return 0;
      }else{
        var account: Account = null;
        if(result.data){
          account = JSON.parse(this.user_service.decrypt(result.data));
        }else{
          account = (await account_number.get().toPromise()).data();
        }
        return account.account_number;
      }
    }else{
      return null;
    }
  }

  public async getAccount(account_id){
    const userUID = (await this.user_service.getCurrentUser()).uid;
    if(userUID != null){
      const accountResult = await this.firestore.collection(`users/${userUID}/accounts/`).doc(account_id);
      var result = await accountResult.get().pipe(first()).toPromise();
      var dataEncrypt: Data = result.data();
      if(dataEncrypt.data){
        return {account_id: result.id, account_data: JSON.parse(this.user_service.decrypt(dataEncrypt.data))};
      }else{
        return {account_id: result.id, account_data: result.data()};
      }
    }else{
      return null;
    }
  }

  public async getAccountsDisconect(){
    const userUID = (await this.user_service.getCurrentUser()).uid;
    var items = null;
    var elements = [];
    if (userUID != null){
      items = (await this.firestore.collection(`users/${userUID}/accounts`).get().toPromise()).docs;
      if (items != null){
        items.forEach(element => {
          if(element.data().data){
            elements.push({account_id: element.id, account_data: JSON.parse(this.user_service.decrypt(element.data().data))});
          }else{
            elements.push({account_id:element.id,account_data: element.data()});
          }
        });
      }else{
        elements = null;
      }
    }
    return elements;
  }
}
