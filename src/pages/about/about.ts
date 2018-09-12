import { Component } from '@angular/core';
import { NavController, App, NavParams } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthProvider } from '../../providers/auth/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { LoginPage } from '../login/login';

export interface List{
  _ref: string,
  task: string,
  status: string,
  priority: string,
  date: string
};

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  list_collection: AngularFirestoreCollection;
  list: List[] = [];
  user;
  username;
  email;
  photourl;
  total;
  pending = 0;

  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth, private app: App, private auth: AuthProvider, public navCtrl: NavController, public navParams: NavParams,private fireAuth: AngularFireAuth) {
    this.list_collection = afs.collection<any>(auth.user.email);
    this.list_collection.valueChanges().subscribe(data => {
      this.list = data.map(res => res as List);
      this.total=this.list.length;
      for(let i=0;i<this.list.length;i++)
      {
        if(this.list[i].status=="pending"){
          this.pending++;
        }
      }
    });
    this.user = auth.user;
    this.username = auth.user.displayName.toUpperCase();
    this.email = auth.user.email;
    this.photourl = auth.user.photoURL;
  }

}
