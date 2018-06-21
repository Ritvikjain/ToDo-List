import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  newTask
  status;
  priority;
  pending = 0;
  item;
  listItem=[];
  total;

  constructor(public navCtrl: NavController,public alertCtrl: AlertController) {
    this.total=this.listItem.length;
        for(let i=0;i<this.listItem.length;i++)
        {
          if(this.listItem[i].status=="pending"){
            this.pending++;
          }
        }
  }
  add()
  {
    if(this.newTask!=null&&this.priority!=null){
      this.listItem.push({task:this.newTask ,status:"pending",priority:this.priority,date:new Date().toLocaleDateString()});
      this.newTask=null;
      this.priority=null;
      this.total++;
      this.pending++;
    }
  }
  remove(i)
  {
    if(this.listItem[i].status=="pending")
    this.pending--;
    this.total--;
    this.listItem.splice(i,1);
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
          handler: data => {
            console.log('Saved clicked');
            item.task=data.title;
          }
        }
      ]
    });
    prompt.present();
    
    if(item.status=="pending")
    {
      item.status="done";
      this.pending--;
    }
    else
    {
      item.status="pending";
      this.pending++;
    }
  }

  updateStatus(item)
  {
    
    if(item.status=="pending")
    {
      item.status="done";
      this.pending--;
    }
    else
    {
      item.status="pending";
      this.pending++;
    }
  }


}
