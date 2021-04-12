import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {UserService} from './user.service';
import {AngularFireStorage} from '@angular/fire/storage';
import {AccountsService} from '../services/accounts.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private user_service: UserService,private firestore: AngularFirestore,private storage: AngularFireStorage, private account_service: AccountsService) { }

  public async addNewExpenseToDataBase(expense,file){
    const userUID = (await this.user_service.getCurrentUser()).uid;
    if(userUID != null){
      if (file == null){
        await this.firestore.collection(`users/${userUID}/expenses`).add(expense).then((docRef) =>{
        }).catch((error)=>{
          
        });
      }else{
        await this.storage.storage.ref().child(`files/${userUID}/expenses/${file.name}`).put(file);
        var fileLink = await this.storage.storage.ref().child(`files/${userUID}/expenses/${file.name}`).getDownloadURL().then((url)=>{
          return url;
        }).catch((error)=>{
          console.log(error);
        });
        expense.expense_file = fileLink;
        await this.firestore.collection(`users/${userUID}/expenses`).add(expense).then((docRef) =>{
        }).catch((error)=>{
          
        });
      }
      if(expense.expense_status){
        this.account_service.updateAccountAmount(-expense.expense_ammount,expense.expense_accountDestine,userUID);
      }
    }
  }

  async getExpense(expense_id){
    const userUID = (await this.user_service.getCurrentUser()).uid;
    if(userUID != null){
      var item = this.firestore.collection(`users/${userUID}/expenses`).doc(expense_id);
      var result = item.get().toPromise();
      return (await result).data();
    }else{
      return null;
    }
  }

  async updateState(expense_id,account_id, amount){
    const userUID = (await this.user_service.getCurrentUser()).uid;
    if(userUID != null){
      var document = this.firestore.collection(`users/${userUID}/expenses`).doc(expense_id);
      var date = this.formatoFecha(new Date,`dd/mm/20yy`);
      document.update({expense_status: true,expense_dateReceive: date});
      this.account_service.updateAccountAmount(-amount,account_id,userUID);
      return true;
    }else{
      return false;
    }
  }

  public async getExpenses(){
    var expenses: any = [];
    const userUID = (await this.user_service.getCurrentUser()).uid;
    if(userUID != null){
      const result = await this.firestore.collection(`users/${userUID}/expenses`,ref => ref.orderBy('expense_dateReceive','desc')).get().subscribe((data)=>{
        data.forEach((element)=>{
          expenses.push({expense_id: element.id, expense_data: element.data()});
        });
      });
    }
    return expenses;
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
