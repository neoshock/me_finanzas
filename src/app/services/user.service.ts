import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import { User } from '../models/user';
import { AngularFireAuth } from '@angular/fire/auth';
import {AngularFireStorage} from '@angular/fire/storage';
import {first, retry} from 'rxjs/operators';
import * as CryptoJS  from 'crypto-js';
import firebase from 'firebase/app';
import {AlertController} from '@ionic/angular';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook/ngx';
import {GooglePlus} from '@ionic-native/google-plus/ngx';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: User;
  private secureKey: string;
  private secureIv: string;

  constructor(private fire_bdd: AngularFireDatabase, private fire_auth: AngularFireAuth, private storage: AngularFireStorage, private alert: AlertController, private facebook: Facebook, private google: GooglePlus) {
    this.generatekeys();
  }

  private async generatekeys(){
    const key = await this.getCurrentUser();
    if (key != null){
      this.secureKey = CryptoJS.enc.Utf8.parse(key.uid);
      this.secureIv = CryptoJS.enc.Utf8.parse(key.uid);
    }else{

    }
  }

  public encrypt(data): any{
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data.toString()), this.secureKey,
    {
        keySize: 128 / 8,
        iv: this.secureIv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  public decrypt(data){
    var decrypted = CryptoJS.AES.decrypt(data, this.secureKey, {
        keySize: 128 / 8,
        iv: this.secureIv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  async updateNewUserAndVerify(fileImg, userData){
    var user_data = null;
    var displayName = userData.user_firtsName + " " + userData.user_lastName;
    var photo_url;
    const user = await this.fire_auth.currentUser;

    var storageRef = await this.storage.storage.ref().child(`files/${user.uid}/${fileImg.name}`).put(fileImg).then(()=>{
    });

    var avatarRef = await this.storage.storage.ref().child(`files/${user.uid}/${fileImg.name}`).getDownloadURL().then((url)=>{
      return url;
    }).catch((error)=>{
      console.log(error);
    });

    user.updateProfile({
      displayName: displayName,
      photoURL: avatarRef
    }).then((data)=>{
      user_data = data;
    }).catch((error)=>{
      console.log(error);
    });
    this.sendEnamilForverification();
    return userData;
  }

  public async sendEnamilForverification(){
    return (await this.fire_auth.currentUser).sendEmailVerification().then(()=>{

    }).catch((error)=>{console.log(error)});
  }

  async updateUser(user,imgDefault, imgProfile){
    var displayName = user.user_firtsName + " " + user.user_lastName;
    var photo_url;
    const result = await this.fire_auth.currentUser;
    var data_result = null;

    if (imgProfile != null){
      var storageRef = await this.storage.storage.ref().child(`files/${result.uid}/${imgProfile.name}`).put(imgProfile).then(()=>{
        console.log("archivo creado");
      });

      var avatarRef = await this.storage.storage.ref().child(`files/${result.uid}/${imgProfile.name}`).getDownloadURL().then((url)=>{
        return url;
      }).catch((error)=>{
        console.log(error);
      });
      photo_url = avatarRef;
    }else{
      photo_url = imgDefault;
    }

    return result.updateProfile({
      displayName: displayName,
      photoURL: photo_url
    }).then((data)=>{
      return data;
    }).catch((error)=>{
      return error;
    });
  }

  getCurrentUser(){
    return  this.fire_auth.setPersistence('local').then(()=>{
      return this.fire_auth.authState.pipe(first()).toPromise();
    })
  }

  async register_User(user: any){
    let email = user.email;
    let password = user.password;
    const result = await this.fire_auth.createUserWithEmailAndPassword(email,password).then((userCredential)=>{
      return userCredential.user.uid;
    }).catch((error)=>{
      console.log(error.code);
    });
    return result;
  }

  async sendResetPassword(email){
    var _email = email;
    var result = null;
    result = await this.fire_auth.sendPasswordResetEmail(_email).then(()=>{
      return 'success';
    }).catch((error)=>{
      return error.code;
    });
    return result;
  }

  async enablePersistance(email, password){
    this.fire_auth.setPersistence('local').then(()=>{
      return this.fire_auth.signInWithEmailAndPassword(email,password);
    }).catch((error)=>{
      console.log(error);
    })
  }

  async logOut_user(){
    this.fire_auth.setPersistence('local').then(()=>{
      this.fire_auth.signOut;
      indexedDB.deleteDatabase("firebaseLocalStorageDb");
      localStorage.clear();
      window.location.reload();
    }).catch((error)=>{
      console.log(error);
    });
  }

  updatePassword(password){
    const user = this.fire_auth.currentUser;
    user.then((data)=>{
      data.updatePassword(password);
    }).catch((error)=>{
      console.log(error);
    })
  }

  singInWithFacebook(){
    return this.facebook.login(['email','public_profile']).then((result:FacebookLoginResponse)=>{
      const credential_facebook = firebase.auth.FacebookAuthProvider.credential(result.authResponse.accessToken);
      return this.fire_auth.signInWithCredential(credential_facebook).then((result)=>{
        return result;
      }).catch((error)=>{
        if(error.code === 'auth/account-exists-with-different-credential'){
          var email = error.email;
          this.showAlertMessage(email);
        }
      });
    }).catch((error)=>{

    });
  }

  singInWithGoogle(){
    return this.google.login({}).then((result)=>{
      const user_data = result;
      const credential_google = firebase.auth.GoogleAuthProvider.credential(null,user_data.accessToken);
      return this.fire_auth.signInWithCredential(credential_google).then(result =>{
        return result;
      }).catch(error =>{
        if(error.code === 'auth/account-exists-with-different-credential'){
          var email = error.email;
          this.showAlertMessage(email); 
        }
      });
    });
  }

  private async showAlertMessage(email){
    const alert = await this.alert.create({
      header: 'Atencion!',
      message: `Hemos detectado que ${email} ya existe con una cuenta diferente`,
      buttons: [
        {text: 'Aceptar', role: 'cancel'}
      ]
    });
    alert.present();
  }

  async login_user(user: any) {
    let email = user.email;
    let password = user.password;
    var on_state = null;
    const result = await this.fire_auth.signInWithEmailAndPassword(email,password).then((userCredential)=>{
      on_state = userCredential;
    }).catch((error)=>{
      on_state = error.code;
    });
    return on_state;
  }
}
