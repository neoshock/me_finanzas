import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import { User } from '../models/user';
import { AngularFireAuth } from '@angular/fire/auth';
import {AngularFireStorage} from '@angular/fire/storage';
import {first} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: User;

  constructor(private fire_bdd: AngularFireDatabase, private fire_auth: AngularFireAuth, private storage: AngularFireStorage) { }

  async updateNewUserAndVerify(fileImg, userData){
    var user_data = null;
    var displayName = userData.user_firtsName + " " + userData.user_lastName;
    var photo_url;
    const user = await this.fire_auth.currentUser;
    var storageRef = await this.storage.storage.ref().child(`files/${user.uid}/${fileImg.name}`).put(fileImg).then(()=>{
      console.log("archivo creado");
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

    user.sendEmailVerification().then(()=>{
      console.log('enviado a direccion de correo');
    }).catch((error)=>{
      console.log(error);
    });
    return userData;
  }

  getCurrentUser(){
    return this.fire_auth.authState.pipe(first()).toPromise()
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
      localStorage.clear();
      indexedDB.deleteDatabase("firebaseLocalStorageDb");
    }).catch((error)=>{
      console.log(error);
    });
  }

  async login_user(user: any) {
    let email = user.email;
    let password = user.password;
    var on_state = null;
    const result = await this.fire_auth.signInWithEmailAndPassword(email,password).then((userCredential)=>{
      on_state = userCredential;
      this.enablePersistance(email, password)
    }).catch((error)=>{
      on_state = error.code;
    });
    return on_state;
  }
}
