import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ProductSubdetailPage } from '../product-subdetail/product-subdetail';

/**
 * Generated class for the NewarrivalsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-newarrivals',
  templateUrl: 'newarrivals.html',
})
export class NewarrivalsPage {
  cat_id:any='';
  filter :any = {};
  prod_list:any=[];
  prod_cat:any={};
  prod_count:any='';
  loading:Loading;
  total_count:any='';
  flag:any='';
  no_rec:any=false;
  skelton:any={};
  imageUrl:any;
  usertype:any;


  constructor(public navCtrl: NavController, public navParams: NavParams ,public service:DbserviceProvider,public loadingCtrl:LoadingController) {
    this.usertype = this.service.userStorageData.type;
    this.skelton = new Array(10);
    console.log(navParams);
    console.log(navCtrl);
    
    
    this.getProductList(this.cat_id,'');
    console.log("services",service);
    console.log("enter a==>",this.usertype)

    this.imageUrl = this.service.product_image_url;
    console.log("image ===========>",this.imageUrl)
    // this.imageUrl = service['constant'].image_url+'product/';
  }
  ionViewDidLoad() {
    this.getProductList(this.cat_id,'');
  }
  presentLoading() 
  {
    this.loading = this.loadingCtrl.create({
      // content: "Please wait...",
      dismissOnPageChange: true
    });
    this.loading.present();
  }
  goOnProductSubDetailPage(id){
    this.navCtrl.push(ProductSubdetailPage,{'id':id})
  }
  
  doRefresh(refresher) 
  {
    console.log('Begin async operation', refresher);
    this.flag = '';
    this.getProductList(this.cat_id,''); 
    refresher.complete();
  }
  loadData(infiniteScroll)
  {
    console.log('loading');
    
    this.filter.karigar_id = this.service.userStorageData.id 
    this.filter.limit=this.prod_list.length;
    this.service.post_rqst({'filter' : this.filter,'type':'New Arivals'},'app_master/newArrivals').subscribe( r =>
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
    console.log(search);
    this.filter.search=search;
    this.filter.limit = 0;
    this.filter.id=id;
    this.filter.karigar_id = this.service.userStorageData.id 
    // this.presentLoading();
    this.service.post_rqst({'filter':this.filter},'app_master/newArrivals')
    .subscribe( (r) =>
    {
      console.log("new arrvial ===>",r);
     
      this.prod_list=r['products'];
      // this.loading.dismiss();
      

      for (let i = 0; i < this.prod_list.length; i++) {
        const element = this.prod_list[i];
        
      }

    // for (let index = 0; index < this.prod_list.length; index++) {
    //   if(this.prod_list[index].image.search("base64")=='-1'){
    //     this.prod_list[index].image = this.prod_list[index].image;
    // }else{
    //   this.prod_list[index].image1 = this.prod_list[index].image;
    // }
    // }
 
      if(this.prod_list.length == 0)
      {
        this.no_rec = true;
      }
      else
      {
        this.no_rec = false;
      }
      // this.prod_cat=r['category_name'][0];
      this.prod_count=r['product_count']
      this.total_count=r['product_count_all']
      console.log(this.prod_cat);
      console.log(this.prod_list);
    },(error: any) => {
      // this.loading.dismiss();
    })
  }

}
