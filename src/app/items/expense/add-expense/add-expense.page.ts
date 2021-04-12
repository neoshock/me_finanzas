import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {FormControl, FormGroup} from '@angular/forms';
import {AccountsService} from '../../../services/accounts.service';
import {ExpenseService} from '../../../services/expense.service';
import {AlertController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.page.html',
  styleUrls: ['./add-expense.page.scss'],
  providers: [ExpenseService,AccountsService]
})
export class AddExpensePage implements OnInit {

  constructor(private modalCtrl: ModalController,private account_service: AccountsService, private expense_service: ExpenseService, private alert: AlertController, private router: Router) { }

  public accountItems;

  public dateNow = new Date();
  private file_evidence: File[] = null;

  new_expense = new FormGroup({
    expense_name: new FormControl(''),
    expense_description: new FormControl(''),
    expense_ammount: new FormControl(),
    expense_dateReceive: new FormControl('04-11-2021'),
    expense_accountDestine: new FormControl('default'),
    expense_status: new FormControl(false),
    expense_file: new FormControl(null)
  })

  ngOnInit() {
    this.fillAnyInputs();
  }

  async fillAnyInputs(){
    this.accountItems = await this.account_service.getAllAccountsActives();
  }

  addNewExpense(){
    if(this.new_expense.value.expense_name != "" && this.new_expense.value.expense_description != "" && this.new_expense.value.expense_ammount != null && this.new_expense.value.expense_accountDestine != 'default'){
      this.new_expense.value.expense_dateReceive = this.formatoFecha(new Date(this.new_expense.value.expense_dateReceive), 'dd/mm/20yy');
      if(this.file_evidence != null){
        this.expense_service.addNewExpenseToDataBase(this.new_expense.value,this.file_evidence[0]);
        this.presentAlertSuccess();
      }else{
        this.expense_service.addNewExpenseToDataBase(this.new_expense.value,this.file_evidence);
        this.presentAlertSuccess();
      }
    }else{
      this.presentAlert("Uno o mas campos son requeridos");
    }
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

  async presentAlertSuccess() {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Atencion',
      subHeader: 'Registro exitoso',
      buttons: [{
        text:"Continuar",
        handler: ()=>{
          this.dismiss();
        }
      }]
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

  fileChange(event){
    var fileExtension = event.target.files[0].name.split('.');
    var index = fileExtension.length - 1;
    if(fileExtension[index] == "jpg" || fileExtension[index] == "png" || fileExtension[index] == "jpeg" || fileExtension[index] == "pdf" || fileExtension[index] == "PDF"){
      this.file_evidence = event.target.files;
      console.log(this.file_evidence);
    }else{

    }
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}
