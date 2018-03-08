import {Component} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public alertctrl: AlertController) {

  }

  hi() {
    let alert = this.alertctrl.create({
      title: "Hello",
      subTitle: "I love this",
      buttons: [{
        title: "OK",
        handler: function () {
          console.log("OK Pressed")
        }
      }]
    })
    alert.present();
  }
}
