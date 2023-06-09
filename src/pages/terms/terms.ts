import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';


@IonicPage()
@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html',
})
export class TermsPage {
  offer_id:any='';
  terms_detail:any={};
  loading:Loading;
  term:any='';
  url:string='';
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbService:DbserviceProvider,
              public loadingCtrl:LoadingController) {
                this.url = dbService.upload_url3

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsPage');
    this.offer_id=this.navParams.get('id');
    this.term=this.navParams.get('term');
    this.getTermsDetail(this.offer_id);
    this.presentLoading()
  }
  getTermsDetail(offer_id)
  {
    console.log(offer_id);
   this.dbService.onPostRequestDataFromApi({'offer_id':offer_id,'karigar_id':22},'app_karigar/offerTermCondition', this.dbService.rootUrl).subscribe(r=>
    {
          console.log(r);
          this.loading.dismiss();
          this.terms_detail=r['offer'];
    });
  }
  presentLoading()
  {
    this.loading = this.loadingCtrl.create({
    content: "Please wait...",
    dismissOnPageChange: true
  });
  this.loading.present();
  }
  }

