import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {FormControl, FormGroup} from '@angular/forms';
import {AccountsService} from '../../../services/accounts.service';
import {ExpenseService} from '../../../services/expense.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {PhotoService} from '../../../services/photo.service';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.page.html',
  styleUrls: ['./add-expense.page.scss'],
  providers: [ExpenseService,AccountsService, PhotoService]
})
export class AddExpensePage implements OnInit {

  @Input() data_expense: any;
  @Input() expense_id: any;
  @Input() account_id: any;

  constructor(private modalCtrl: ModalController,private account_service: AccountsService, private expense_service: ExpenseService, private alert: AlertController, private router: Router, public photo_service: PhotoService, private loading: LoadingController) { }

  public accountItems;

  public dateNow = new Date();
  private file_evidence: File[] = null;
  private status_expense: string = 'empty';

  new_expense = new FormGroup({
    expense_name: new FormControl(''),
    expense_description: new FormControl(''),
    expense_ammount: new FormControl(),
    expense_dateReceive: new FormControl(this.formatoFecha(this.dateNow, "mm-dd-yy")),
    expense_accountDestine: new FormControl('default'),
    expense_status: new FormControl(false),
    expense_file: new FormControl(null)
  });

  ngOnInit() {
    if (this.data_expense != 'empty'){
      this.loadDatesOfExpense(this.data_expense);
      console.log('pasa esto');
    }else{
      this.fillAnyInputs();
    }
  }

  async fillAnyInputs(){
    this.accountItems = await this.account_service.getAllAccountsActives();
  }

  async loadDatesOfExpense(data){
    var date = data.expense_dateReceive.split('/');
    if(data.expense_file != null){
      this.photo_service.photos = [{filepath:'empty', webviewPath:data.expense_file}];
    }
    var account = await this.account_service.getAccountNumber(this.account_id);
    if (account == 0){
      this.account_id = 'default';
    }
    await this.fillAnyInputs();
    this.new_expense = new FormGroup({
      expense_name: new FormControl(data.expense_name),
      expense_description: new FormControl(data.expense_description),
      expense_ammount: new FormControl(data.expense_ammount),
      expense_dateReceive: new FormControl(`${date[1]}-${date[0]}-${date[2]}`),
      expense_accountDestine: new FormControl(this.account_id),
      expense_status: new FormControl(data.expense_status),
      expense_file: new FormControl(data.expense_file)});
  }

  addNewExpense(){
    if(this.new_expense.value.expense_name != "" && this.new_expense.value.expense_ammount != null && this.new_expense.value.expense_accountDestine != 'default'){
      this.new_expense.value.expense_dateReceive = this.formatoFecha(new Date(this.new_expense.value.expense_dateReceive), 'dd/mm/20yy');
      this.saveChangesForExpense(this.new_expense.value);
      if (this.data_expense == 'empty'){
        if(this.file_evidence != null){
          this.expense_service.addNewExpenseToDataBase(this.new_expense.value,this.file_evidence[0]);
          this.presentLoading();
        }else{
          if (this.photo_service.file_blop != null){
            this.expense_service.uploadPhotoToService(this.photo_service.file_blop,this.new_expense.value);
          }else{
            this.expense_service.addNewExpenseToDataBase(this.new_expense.value,this.file_evidence);
          }
          this.presentLoading();
        }
      }
    }else{
      this.presentAlert("Uno o más campos son requeridos");
    }
  }

  async presentLoading() {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Espere un momento....',
    });
    await loading.present();
    setTimeout(()=>{
      this.presentAlertSuccess();
      loading.dismiss();
    }, 1000);
  }

  saveChangesForExpense(data){
    if (this.data_expense != 'empty'){
      this.expense_service.editDataExpense(data,this.expense_id,this.photo_service.file_blop);
      this.presentLoading();
    }
  }

  public cancelPhoto(){
    this.photo_service.photos = null;
    this.photo_service.file_blop = null;
  }

  addPhotoToGallery() {
    try{
      this.photo_service.addNewToGallery();
    }catch {
      console.log("hubo un error");
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
      header: '¡Atención!',
      subHeader: 'Registro exitoso',
      buttons: [{
        text:"Continuar",
        handler: ()=>{
          this.status_expense = 'success';
          this.dismiss();
        }
      }]
    });

    await alert.present();
  }

  async presentAlert(message) {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: '¡Atención!',
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
    }else{

    }
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true,
      'status': this.status_expense
    });
  }

}
