import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

/**
 * Generated class for the DigitalcatalogPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-digitalcatalog',
  templateUrl: 'digitalcatalog.html',
})
export class DigitalcatalogPage {
  pdf:any=[];
  uploadUrl:string='';
  loading:Loading;
  constructor(public navCtrl: NavController, public loadingCtrl:LoadingController, public navParams: NavParams,public dbService:DbserviceProvider) {
    this.uploadUrl = dbService.upload_url3;
    // this.presentLoading();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DigitalcatalogPage');
    this.getpdflist();
   

  }

  presentLoading()
  {
      this.loading = this.loadingCtrl.create({
          content: "Please wait...",
          dismissOnPageChange: false
      });
      this.loading.present();
  }

  getpdflist()
 {
  this.presentLoading();

   this.dbService.onPostRequestDataFromApi( {},'app_karigar/product_catalogue_list', this.dbService.rootUrl).subscribe( r =>
    {
      console.log(r);
      this.pdf = r['pdf']
      this.loading.dismiss();
      }); 
    }

}
