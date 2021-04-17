import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {UserService} from './user.service';
import {AngularFireStorage} from '@angular/fire/storage';
import {AccountsService} from '../services/accounts.service';

@Injectable({
  providedIn: 'root'
})

export class IncomesService {

  constructor(private user_service: UserService,private firestore: AngularFirestore,private storage: AngularFireStorage, private account_service: AccountsService) { }

  public async addNewIncomeToDataBase(income,file){
    const userUID = (await this.user_service.getCurrentUser()).uid;
    if(userUID != null){
      if (file == null){
        await this.firestore.collection(`users/${userUID}/incomes`).add(income).then((docRef) =>{
        }).catch((error)=>{
          
        });
      }else{
        await this.storage.storage.ref().child(`files/${userUID}/incomes/${file.name}`).put(file);
        var fileLink = await this.storage.storage.ref().child(`files/${userUID}/incomes/${file.name}`).getDownloadURL().then((url)=>{
          return url;
        }).catch((error)=>{
          console.log(error);
        });
        income.income_file = fileLink;
        await this.firestore.collection(`users/${userUID}/incomes`).add(income).then((docRef) =>{
        }).catch((error)=>{
          
        });
      }
      if(income.income_status){
        this.account_service.updateAccountAmount(income.income_ammount,income.income_accountDestine,userUID);
      }
    }
  }

  public async editDataIncome(data, income_id, photo){
    const userUID = (await this.user_service.getCurrentUser()).uid;
    if (userUID != null){
      if(photo != null){
        var file_name = new Date().getTime() + '.jpeg';
        await this.storage.storage.ref().child(`files/${userUID}/incomes/${file_name}`).put(photo);
        var fileLink = await this.storage.storage.ref().child(`files/${userUID}/incomes/${file_name}`).getDownloadURL().then((url)=>{
          return url;
        }).catch((error)=>{
          console.log(error);
        });
        data.income_file = fileLink;
      }else{
        const result = await this.firestore.collection(`users/${userUID}/incomes`).doc(income_id);
        result.update(data);
      }

      if (data.income_status){
        this.account_service.updateAccountAmount(data.income_ammount,data.income_accountDestine,userUID);
      }
    } 
  }

  public async uploadPhotoToService(photo: any, income){
    const userUID = (await this.user_service.getCurrentUser()).uid;
    if(userUID) {
      if (photo != null){
        var file_name = new Date().getTime() + '.jpeg';
        await this.storage.storage.ref().child(`files/${userUID}/incomes/${file_name}`).put(photo);
        var fileLink = await this.storage.storage.ref().child(`files/${userUID}/incomes/${file_name}`).getDownloadURL().then((url)=>{
          return url;
        }).catch((error)=>{
          console.log(error);
        });
        income.income_file = fileLink;
        await this.firestore.collection(`users/${userUID}/incomes`).add(income).then((docRef) =>{
        }).catch((error)=>{
          
        });
        if(income.income_status){
          this.account_service.updateAccountAmount(income.income_ammount,income.income_accountDestine,userUID);
        }
      }
    } 
  }

  public async deleteIncome(income_id){
    const userUID = (await this.user_service.getCurrentUser()).uid;
    if(userUID != null){
      var item = this.firestore.collection(`users/${userUID}/incomes`).doc(income_id);
      item.delete();
    }
  }

  async getIncome(income_id){
    const userUID = (await this.user_service.getCurrentUser()).uid;
    if(userUID != null){
      var item = this.firestore.collection(`users/${userUID}/incomes`).doc(income_id);
      var result = item.get().toPromise();
      return (await result).data();
    }else{
      return null;
    }
  }

  async updateState(income_id,account_id, amount){
    const userUID = (await this.user_service.getCurrentUser()).uid;
    if(userUID != null){
      var document = this.firestore.collection(`users/${userUID}/incomes`).doc(income_id);
      var date = this.formatoFecha(new Date,`dd/mm/20yy`);
      document.update({income_status: true,income_dateReceive: date});
      this.account_service.updateAccountAmount(amount,account_id,userUID);
      return true;
    }else{
      return false;
    }
  }

  public async getIncomes(){
    var incomes: any = [];
    const userUID = (await this.user_service.getCurrentUser()).uid;
    if(userUID != null){
      const result = await this.firestore.collection(`users/${userUID}/incomes`,ref => ref.orderBy('income_dateReceive','desc')).get().subscribe((data)=>{
        data.forEach((element)=>{
          incomes.push({income_id: element.id, income_data: element.data()});
        });
      });
    }
    return incomes;
  }

  formatoFecha(fecha, formato) {
    const map = {
        dd: fecha.getDate(),
        mm: fecha.getMonth() + 1,
        yy: fecha.getFullYear().toString().slice(-2),
        yyyy: fecha.getFullYear()
    }

    return formato.replace(/dd|mm|yy|yyy/gi, matched => map[matched])
  }
}

