import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';

export interface List{
  _ref: string,
  task: string,
  status: string,
  priority: string,
  date: string
};

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  list_collection: AngularFirestoreCollection;
  list: List[] = [];
  newTask
  status;
  priority;
  pending = 0;
  item;
  listItem=[];
  total;

  constructor( private afs: AngularFirestore,public navCtrl: NavController,public alertCtrl: AlertController) {
    this.list_collection = afs.collection<any>('todo_list');
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
  }
  add()
  {
    if(this.newTask!=null&&this.priority!=null){
      let new_obj = {_ref: '',task: this.newTask, status: "pending",priority: this.priority,date: new Date().toLocaleDateString()};
      this.list_collection.add(new_obj).then(res => {
        this.list_collection.doc(res.id).update({_ref: res.id});
        this.list.push(new_obj);
        this.total=this.list.length;
        for(let i=0;i<this.list.length;i++)
        {
          if(this.list[i].status=="pending"){
            this.pending++;
          }
        }
      });
      //this.listItem.push({task:this.newTask ,status:"pending",priority:this.priority,date:new Date().toLocaleDateString()});
      this.newTask=null;
      this.priority=null;
      //this.total++;
      //this.pending++;
    }
  }
  remove(item, i)
  {
    this.list_collection.doc(item._ref).delete().then(()=>{
      this.list.splice(i, 1);
    });
    //if(this.listItem[i].status=="pending")
    //this.pending--;
    //this.total--;
    //this.listItem.splice(i,1);
  }

  edit(item){
    
    const prompt = this.alertCtrl.create({
      title: 'Edit',
      message: "Enter new Task:",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: new_data => {
            this.list_collection.doc(item._ref).update({task: new_data.title}).then(()=>{
              item.data = new_data.data;
              if(item.status=="pending")
              {
                this.list_collection.doc(item._ref).update({status: "done"});
                this.pending--;
              }
              else
              {
                this.list_collection.doc(item._ref).update({status: "pending"});
                this.pending++;
              }
            });
          }
        }
      ]
    });
    prompt.present();
    
    
  }

  updateStatus(item)
  {
    
    if(item.status=="pending")
    {
      this.list_collection.doc(item._ref).update({status: "done"});
      this.pending--;
    }
    else
    {
      this.list_collection.doc(item._ref).update({status: "pending"});
      this.pending++;
    }
  }


}
