import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {FormControl, FormGroup} from '@angular/forms';
import {AccountsService} from '../../../services/accounts.service';
import {IncomesService} from '../../../services/incomes.service';
import {AlertController} from '@ionic/angular';
import {Router} from '@angular/router';
import {PhotoService} from '../../../services/photo.service';

@Component({
  selector: 'app-add-income',
  templateUrl: './add-income.page.html',
  styleUrls: ['./add-income.page.scss'],
  providers: [PhotoService, IncomesService,AccountsService]
})
export class AddIncomePage implements OnInit {

  constructor(private modalCtrl: ModalController, private account_service: AccountsService, private income_services: IncomesService, private alert: AlertController, private router: Router, public photo_service: PhotoService) { }

  public accountItems;

  public dateNow = new Date();
  private file_evidence: File[] = null;

  new_income = new FormGroup({
    income_name: new FormControl(''),
    income_description: new FormControl(''),
    income_ammount: new FormControl(),
    income_dateReceive: new FormControl('04-11-2021'),
    income_accountDestine: new FormControl('default'),
    income_status: new FormControl(false),
    income_file: new FormControl(null)
  })

  ngOnInit() {
    this.fillAnyInputs();
  }

  async fillAnyInputs(){
    this.accountItems = await this.account_service.getAccountsActives();
  }

  addNewIncome(){
    if(this.new_income.value.income_name != "" && this.new_income.value.income_description != "" && this.new_income.value.income_ammount != null && this.new_income.value.income_accountDestine != 'default'){
      this.new_income.value.income_dateReceive = this.formatoFecha(new Date(this.new_income.value.income_dateReceive), 'dd/mm/20yy');
      if(this.file_evidence != null){
        this.income_services.addNewIncomeToDataBase(this.new_income.value,this.file_evidence[0]);
        this.presentAlertSuccess();
      }else{
        if (this.photo_service.file_blop != null){
          this.income_services.uploadPhotoToService(this.photo_service.file_blop,this.new_income.value);
        }else{
          this.income_services.addNewIncomeToDataBase(this.new_income.value,this.file_evidence);
        }
        this.presentAlertSuccess();
      }
    }else{
      this.presentAlert("Uno o mas campos son requeridos");
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

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
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

}
