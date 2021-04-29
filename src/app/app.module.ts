import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFirestoreModule} from '@angular/fire/firestore';

import { ReactiveFormsModule} from '@angular/forms';

import {FingerprintAIO} from '@ionic-native/fingerprint-aio/ngx';

const firebaseConfig = {
  apiKey: "AIzaSyCPwxWLADJf205RWAD4D32G5MgVJM2QEyM",
  authDomain: "inlaid-lane-281023.firebaseapp.com",
  databaseURL: "https://inlaid-lane-281023-default-rtdb.firebaseio.com",
  projectId: "inlaid-lane-281023",
  storageBucket: "inlaid-lane-281023.appspot.com",
  messagingSenderId: "946953840256",
  appId: "1:946953840256:web:1d3fdd907b15191f612865"
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, AngularFireModule.initializeApp(firebaseConfig), AngularFireDatabaseModule, AngularFireAuthModule, ReactiveFormsModule,AngularFireStorageModule, AngularFirestoreModule.enablePersistence()],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, FingerprintAIO],
  bootstrap: [AppComponent],
})
export class AppModule {}
