
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App } from 'ionic-angular';
import { ProductSubdetailPage } from '../product-subdetail/product-subdetail';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';



@IonicPage()
@Component({
  selector: 'page-product-detail',
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage {
  cat_id:any='';
  filter :any = {};
  prod_list:any=[];
  prod_cat:any={};
  prod_count:any='';
  loading:Loading;
  total_count:any='';
  flag:any='';
  no_rec:any=false;
  skelton:any={}
  url:any;
  state:any;
  


  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public loadingCtrl:LoadingController, private app:App) {
    // this.presentLoading();
    this.skelton = new Array(10);

    this.url = this.service.product_image_url;
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailPage');
    this.cat_id = this.navParams.get('id');
    this.getProductList(this.cat_id,'');
    console.log(this.service);
    this.state= this.service.userStorageData.state;
    console.log(this.state)
    
  }
  
  goOnProductSubDetailPage(id){
    this.navCtrl.push(ProductSubdetailPage,{'id':id})
  }
  
  doRefresh(refresher) 
  {
    console.log('Begin async operation', refresher);
    // this.flag = '';
    this.getProductList(this.cat_id,''); 
    refresher.complete();
  }
  loadData(infiniteScroll)
  {
    console.log('loading');
    this.filter.karigar_id = this.service.userStorageData.id 
    this.filter.limit=this.prod_list.length;
    this.service.post_rqst({'filter':this.filter},'app_master/productList').subscribe( r =>
      {
        console.log(r);
        if(r['products']=='')
        {
          this.flag=1;
        }
        else
        {
          setTimeout(()=>{
            this.prod_list=this.prod_list.concat(r['products']);
            console.log('Asyn operation has stop')
            infiniteScroll.complete();
          },1000);
        }
      });
    }
  getProductList(id,search)
  {
    this.presentLoading();
    console.log(search);
    this.filter.search=search;
    this.filter.limit = 0;
    this.filter.id=id;
    this.filter.karigar_id = this.service.userStorageData.id 
    // this.presentLoading();
    this.service.post_rqst({'filter':this.filter},'app_master/productList')
    .subscribe( (r) =>
    {
      console.log(r);
      this.loading.dismiss();
      this.prod_list=r['products'];
      console.log(this.prod_list);
      console.log(this.prod_list.length);
      
      

// if(this.prod_list.length==r.product_count_all){
//   this.flag=1;
// }
      if(this.prod_list.length == 0)
      {
        this.no_rec = true;
      }
      else
      {
        this.no_rec = false;
      }
      for (let index = 0; index < this.prod_list.length; index++) {

          if(this.prod_list[index]['image'] && this.prod_list[index]['image'].search("base64") == -1){
            // this.imge = this.prod_list[index].image.replace(" ", "%20");
            // console.log(this.imge);
                // this.prod_list[index].image = this.url + this.prod_list[index].image;
          }  else {

              // this.getImages(this.prod_list[index]['id'],index)
             
          }
      }
      this.prod_cat=r['category_name'][0];
      this.prod_count=r['product_count']
      this.total_count=r['product_count_all']
      console.log(this.prod_cat);
    },(error: any) => {
      // this.loading.dismiss();
    })
  }


  imge:any;

 
 
    presentLoading() 
    {
      this.loading = this.loadingCtrl.create({
        // content: "Please wait...",
        dismissOnPageChange: true
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
  