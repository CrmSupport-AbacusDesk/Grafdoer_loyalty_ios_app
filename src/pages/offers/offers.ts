import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App } from 'ionic-angular';
import { TermsPage } from '../terms/terms';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { GiftDetailPage } from '../gift-gallery/gift-detail/gift-detail';

@IonicPage()
@Component({
  selector: 'page-offers',
  templateUrl: 'offers.html',
})
export class OffersPage {
  offer_id:any='';
  offer_detail:any={};
  gift_list:any='';
  balance_point:any='';
  loading:Loading;
  offer_balance:any='';
  total_balance:number=0;
  url:string='';
  notdata:boolean=false

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbService:DbserviceProvider,
              public loadingCtrl:LoadingController,
              private app : App) {
              this.url = dbService.upload_url3
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OffersPage');
    
   
  }
  ionViewDidEnter(){
    this.offer_id=this.navParams.get('id')
    this.getofferDetail(this.offer_id);
    this.presentLoading();
}

  doRefresh(refresher)
  {
    console.log('Begin async operation', refresher);
    this.getofferDetail(this.offer_id);
    refresher.complete();
  }

  goOntermsPage(id,term){
    this.navCtrl.push(TermsPage, {'id':id,'term':term});
  }
  godiscriptionsPage(id,discriptions){
    this.navCtrl.push(TermsPage, {'id':id,'term':discriptions});
  }
  goOnGiftDetail(id){
    console.log(id);
  	this.navCtrl.push(GiftDetailPage,{'id':id})
  }

  goOnGiftDetail1(){
    // console.log(id);
  	this.navCtrl.push(GiftDetailPage)
  }

  toInt(i){
    console.log(i);

    return parseInt(i);
  }

  getofferDetail(offer_id)
  {
   console.log(offer_id);
   this.dbService.onPostRequestDataFromApi({'offer_id':offer_id,'karigar_id':this.dbService.userStorageData.id},'app_karigar/offerDetail', this.dbService.rootUrl).subscribe(r=>
    {
      console.log(r['offer'].length);
      
      

        this.offer_detail=r['offer'];

      this.offer_balance=parseInt(r['gift'][0].offer_balance);
      this.total_balance = r.karigar.total_balance
     
      if( r['gift'].length ){
        this.gift_list=r['gift'];
      }else if( r['gift'].length ==0){
        this.notdata = true
      } 
      this.balance_point=parseInt(r['karigar'].balance_point + parseInt(r['karigar'].reg_points));
      // for gift active class

 
      this.loading.dismiss();

      for (let i = 0; i < this.gift_list.length; i++)
      {
        this.gift_list[i].coupon_points = parseInt( this.gift_list[i].coupon_points);
      }
      // end
    });
  }
  presentLoading()
  {
    this.loading = this.loadingCtrl.create({
    content: "Please wait...",
    dismissOnPageChange: false
  });
  this.loading.present();
  }
  ionViewDidLeave()
  {
   let nav = this.app.getActiveNav();
   if(nav && nav.getActive())
   {
       let activeView = nav.getActive().name;
       let previuosView = '';
       if(nav.getPrevious() && nav.getPrevious().name)
       {
          previuosView = nav.getPrevious().name;
       }
       console.log(previuosView);
       console.log(activeView);
       console.log('its leaving');
       if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage'))
       {

           console.log(previuosView);
           this.navCtrl.popToRoot();
       }
   }
   }
}
