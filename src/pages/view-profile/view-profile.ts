import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

@IonicPage()
@Component({
  selector: 'page-view-profile',
  templateUrl: 'view-profile.html',
})
export class ViewProfilePage {
  profile_pic:any='';
  url:string='';
  mode:string='';
  product_image_url:string='';
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db:DbserviceProvider,
    public viewCtrl:ViewController) {
      this.url = db.upload_url3;
      this.product_image_url = this.db.product_image_url       
      
    }
    
    ionViewDidLoad() {
      console.log('ionViewDidLoad ViewProfilePage');
      
      this.profile_pic=this.navParams.get("Image");
      this.mode=this.navParams.get("mode");
      console.log(this.profile_pic);
      
    }
    closeModal(){
      this.viewCtrl.dismiss();
    }
    
    
  }
  