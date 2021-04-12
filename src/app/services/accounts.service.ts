import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {AngularFirestore} from '@angular/fire/firestore';
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

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(private user_service: UserService,private fire_database: AngularFireDatabase, private firestore: AngularFirestore) { }

  public async uploadNewAccount(account, type){
    var add_acount = null;
    const userUID = (await this.user_service.getCurrentUser()).uid;
    if (userUID != null){
      const accountResult = this.accountFormater(account,type);
      add_acount = await this.fire_database.database.ref(`users/${userUID}/accounts/`).push(accountResult);
      console.log('account added');
    }
    return add_acount;
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

  public async getAccounts() {
    var dataAccounts = null;
    const userUID = (await this.user_service.getCurrentUser()).uid;
    if (userUID != null){
      const getAccountsFromDatabase = await this.fire_database.database.ref(`users/${userUID}/accounts`).get().then((data)=>{
        if(data.exists()){
          return data.val();
        }
      }).catch((error)=>{
        console.log(error);
      });
      dataAccounts = getAccountsFromDatabase;
      if (dataAccounts != null){
        dataAccounts = Object.entries(dataAccounts).map(e => Object.assign(e[1], { key: e[0] }));
      }
      return dataAccounts;
    }else{
      return dataAccounts;
    }
  }

  //Firestore para persistencia de datos

  public async addNewAccountDisconect(account,type){
    const userUID = (await this.user_service.getCurrentUser()).uid;
    const accountResult = this.accountFormater(account,type);
    if(userUID != null){
       await this.firestore.collection(`users/${userUID}/accounts`).add(accountResult).then((docRef) =>{
      }).catch((error)=>{
        console.log(error);
      });
    }
  }

  public async getAccountsActives(){
    const userUID = (await this.user_service.getCurrentUser()).uid;
    var items = null;
    var result = [];
    if (userUID != null){
      items = (await this.firestore.collection(`users/${userUID}/accounts`, ref => ref.where("type_account","!=","credit_card")).get().toPromise()).docs;
      if (items != null){
        items.forEach(element => {
          result.push({id: element.id,data:element.data()});
        });
      }
    }
    return result;
  }

  public async getAllAccountsActives(){
    const userUID = (await this.user_service.getCurrentUser()).uid;
    var items = null;
    var result = [];
    if (userUID != null){
      items = (await this.firestore.collection(`users/${userUID}/accounts`).get().toPromise()).docs;
      if (items != null){
        items.forEach(element => {
          result.push({id: element.id,data:element.data()});
        });
      }
    }
    return result;
  }

  public async getTotalBalance(){
    var totalBalance = 0;
    var result = await this.getAccountsDisconect();
    result.forEach((element)=>{
      totalBalance += element.account_balance;
    });
    return totalBalance;
  }

  public async updateAccountAmount(amount,accountId,userUid){
    const account = await this.firestore.collection(`users/${userUid}/accounts/`).doc(accountId);
    account.get().subscribe((doc)=>{
      if(doc.exists){
        var myElement: Account = doc.data();
        account.update({account_balance:amount + myElement.account_balance});
      }
    });
  }

  async getAccountNumber(account_id) {
    const userUID = (await this.user_service.getCurrentUser()).uid;
    if(userUID != null){
      const account_number = this.firestore.collection(`users/${userUID}/accounts/`).doc(account_id);
      var result = account_number.get().toPromise();
      var number: Account = (await result).data();
      return number.account_number;
    }else{
      return 0;
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
          elements.push(element.data());
        });
      }
    }
    return elements;
  }
}
