import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  public typesAccount: any = [
    {name: 'Cuenta bancaria', link: 'null'},
    {name: 'Dinero en efectivo', link: 'null'},
    {name: 'Tarjeta de credito', link: 'null'}
  ];

  constructor(private router: Router,private popoverController: PopoverController) { }

  ngOnInit() {}

  addNewAccount(typeAccount){
    this.onDimiss();
    this.router.navigate(['/my-money/add-account', `${typeAccount}`]);
  }

  onDimiss(){
    this.popoverController.dismiss({
      fromPopover: "anyyhing"
    })
  }
}
