import { Component } from '@angular/core';
import { IonicPage, NavController,Loading, NavParams,LoadingController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import {ProductDetailPage} from '../product-detail/product-detail';

/**
 * Generated class for the SubCategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sub-category',
  templateUrl: 'sub-category.html',
})
export class SubCategoryPage {
  cat_id:any='';
  category_id:any;
  filter :any = {};
  prod_cat_list:any=[];
  prod_cat_list_id:any;
  state:any;
  loading:Loading;
  url:any;
  no_data:Boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public loadingCtrl:LoadingController) {
    this.url=this.service.category_url;
    console.log(this.url);
  }
//  url:any='https://apps.abacusdesk.com/grafdoer/dd_api/app/Http/Controllers/Admin/Master/appOfflineUploads/imageCatalogue/'
  ionViewDidLoad() {
    this.cat_id = this.navParams.get('id');
   
    console.log("id call========>",this.cat_id);
    console.log(this.category_id);
     this.get_subcategory('');

    console.log("sub cat call ==================================>");
    
    console.log(this.service);
    this.state= this.service.userStorageData.state;
    console.log(this.state);
    
    
  }
 
  doRefresh(refresher) 
  {
    console.log('Begin async operation', refresher);
  
    this.get_subcategory('')
    refresher.complete();
  }
  
    get_subcategory(name)
    {
     
      this.presentLoading2();
      this.category_id=this.cat_id;
      console.log(this.category_id);
      console.log("id call 2========>",this.cat_id);
      this.filter.limit=0;
      this.filter.search=name;
      this.service.post_rqst({'filter':this.filter,'category_id':this.category_id},'app_master/childCategoryList')
    .subscribe((r)=>
    {
      console.log(r);
     console.log("value of ==>",r['category'].length )
      
      if(r['category'].length){
        this.prod_cat_list=r['category'];
      }else if(r['category'].length == 0){
        this.no_data = true;
      }
      this.prod_cat_list_id=r['category']['id']
      console.log("this.prod_cat_list_id",this.prod_cat_list_id);
      console.log(this.prod_cat_list);
      this.loading.dismiss();


    })
    }
    flag:any;
    loadData(InfiniteScroll) {
    
      this.category_id=this.cat_id;
      console.log('catagorylist');
      this.filter.limit =this.prod_cat_list.length;
      this.service.post_rqst({'filter' : this.filter,'category_id':this.category_id},'app_master/childCategoryList')
      .subscribe((r) =>
      {
       
        if(r['category']=='')
        {
          this.flag=1;
        }
        else{
          setTimeout(() => {
            this.prod_cat_list = r['category'];
            this.prod_cat_list=this.prod_cat_list.concat(r['category'])
            InfiniteScroll.complete();
          
          for (let index = this.prod_cat_list.length; index < 7; index++) {
                      this.prod_cat_list.push(this.prod_cat_list.length)
              
            }
      
          }, 500);
        }
       
    
      },(error: any) => {
        this.loading.dismiss();
      }
      );

      
    }
    get_subcategory1(id)
    {
             console.log(id);
              this.navCtrl.push(ProductDetailPage,{'id':id})

    }
    presentLoading2() 
    {
      this.loading = this.loadingCtrl.create({
        content: "",
        dismissOnPageChange: false
      });
      this.loading.present();
    }
}
