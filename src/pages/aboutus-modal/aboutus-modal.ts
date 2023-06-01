import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform,Nav } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-aboutus-modal',
  templateUrl: 'aboutus-modal.html',
})
export class AboutusModalPage {
  country:any;
  userCountry:any;
  @ViewChild(Nav) nav: Nav;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public dbService:DbserviceProvider,
              public platform: Platform) {
                console.log(navParams);
                this.country= this.navParams.data.country;
                console.log(this.country);
                this.userCountry = this.dbService.userStorageData.country;
                
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutusModalPage');
  }

  dismiss() {
   let data = { 'foo': 'bar' };
   this.viewCtrl.dismiss(data);
 }
 exitapp()
 {
   console.log('exit');
  this.platform.exitApp();
 }
 gotoHomePage()
 {
     console.log('gotohome');
     this.navCtrl.setRoot(TabsPage,{index:'0'});
 }
}
