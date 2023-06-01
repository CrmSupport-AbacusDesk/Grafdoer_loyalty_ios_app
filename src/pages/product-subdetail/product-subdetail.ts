import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App, ModalController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { EnquiryPage } from '../enquiry/enquiry';
import { SocialSharing } from '@ionic-native/social-sharing';
// import { OfflineDbProvider } from '../../providers/offline-db/offline-db';
// import { SQLite } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';
import { ViewProfilePage } from '../view-profile/view-profile';


@IonicPage()
@Component({
    selector: 'page-product-subdetail',
    templateUrl: 'product-subdetail.html',
})
export class ProductSubdetailPage {
    prod_id:any='';
    api:any;
    prod_detail:any={};
    loading:Loading;
    prod_image:any=[];
    active_image:any=''
    user_data:any={};
    userType:any
    company_name:any='Grafdoer VMS Bathware Pvt. Ltd'
    url:any=''
    share_image:any;

    constructor(public socialSharing:SocialSharing,
                public storage: Storage,
                public modalCtrl:ModalController,
                public navCtrl: NavController,
                public navParams: NavParams,
                public dbService:DbserviceProvider,
                public loadingCtrl:LoadingController,
                private app:App,
                // public offlineService: OfflineDbProvider,
                // private sqlite: SQLite
                ) {
            this.url = this.dbService.product_image_url
            const loginType = this.dbService.userStorageData.loginType;

            console.log(loginType);
            if(loginType=='CMS')
            {
                this.userType='notDrLogin'
            }
            else
            {
                this.userType='drLogin'
            }

            console.log(this.userType);

            if(this.userType=='CMS')
            {
                this.user_data = this.dbService.userStorageData;
            }
            else
            {
                this.user_data = this.dbService.userStorageData.all_data;
                // this.checkForExistInFavourite()
            }
            console.log(this.user_data);
            this.presentLoading();
            // this.checkForExistInFavourite()
            
        }

        ionViewDidLoad() {
            console.log('ionViewDidLoad ProductSubdetailPage');
            this.prod_id = this.navParams.get('id');
            this.getProductDetail(this.prod_id);

        }
        openLink(Link)
        {
            window.open(Link,'_system','location=yes');

        }

  

        getProductDetail(id)
        {
            this.dbService.onPostRequestDataFromApi({'product_id' :id},'app_master/productDetail', this.dbService.rootUrl).subscribe( r =>
                {
                    console.log(r);
                  
                    this.prod_detail=r['product'];
                    this.prod_image=r['product']['image'];
                    console.log(this.prod_image);
                    for (let i = 0; i < this.prod_image.length; i++) {
                        this.element = this.prod_image[i].actual_image_name;
                        console.log("image name ===>", this.element )

                        this.imgData   =  this.url+ this.element
                        
                    }
                    // if(this.prod_image && this.prod_image.length > 1) {

                    //     this.prod_image=r['product']['image']=this.prod_image=r['product']['image'];
    
                    // } else {
    
                    //     this.prod_image=r['product']['image']=this.prod_image=r['product']['image'][0];
                    // }
                    for (let i = 0; i < this.prod_image.length; i++) {
                        this.share_image = this.prod_image[i].actual_image_name;
                        console.log("image name ===>", this.share_image )

                        this.imgData   =  this.url+ this.share_image
                        
                    }
                    console.log(this.prod_image);

                    this.changeImage();
                    this.api=this.dbService.upload_url+"app/uploads/";
                    console.log(this.prod_detail.image_profile);
                    console.log( this.api);
                    this.loading.dismiss();
                },(error: any) => {
                   
                });
            }

            imgData:any;
            element:any;
            shareproduct()   {


            

                console.log(this.imgData);
                console.log("Company Name:"+this.company_name+"\n"+"Category:"+this.prod_detail.main_category+"\n"+"Category:"+this.prod_detail.category_name+"\n"+"Product Name:  "+this.prod_detail.product_name+"\n"+"Product Code:  "+this.prod_detail.material_code+"\n"+"Price:"+this.prod_detail.price+ "\n"+"Description:"+this.prod_detail.desc+ "\n"+"Product PCS:"+this.prod_detail.pcs,null,this.imgData);
                var shareData
                if(this.prod_detail.desc)
                {

                    shareData ="Company Name:"+this.company_name+"\n"+"Category : "+this.prod_detail.main_category+ "\n"+"Product Name :  "+this.prod_detail.product_name+"\n"+"Product Name:  "+this.prod_detail.product_name+"\n"+"Product Code:  "+this.prod_detail.material_code+"\n"+"Price : "+this.prod_detail.price+ "\n"+"Description : "+this.prod_detail.desc
                }
                else
                {
                    shareData = "Company Name:"+this.company_name+"\n"+"Category : "+this.prod_detail.main_category+"\n"+"Product Name :  "+this.prod_detail.product_name+ "\n"+"Product Name:  "+this.prod_detail.product_name+"\n"+"Product Code:  "+this.prod_detail.material_code+"\n"+"Price : "+this.prod_detail.price

                }

                this.socialSharing.share(shareData,null,this.imgData,null).then(() => {

                    console.log("success",this.imgData);

                }).catch((e) => {
                    console.log(e);
                });
            }

            goToEnquiryPage()
            {
                this.navCtrl.push(EnquiryPage,{'id':this.prod_detail.id})
            }

            presentLoading()
            {
                this.loading = this.loadingCtrl.create({
                    // content: "Please wait...",
                    dismissOnPageChange: true
                });
                this.loading.present();
            }
            


            changeImage()
            {
                if(this.prod_image.length){
                    this.active_image=  this.prod_image.filter( x=> x.profile == 1)[0].image;
                }
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

            prod_data:any={};
            add_to_fav()
            {
                    var userId = ''
                    const loginType = this.dbService.userStorageData.loginType;

                    console.log(loginType);
                    console.log(this.dbService.userStorageData.loggedInUserType);

                    if(loginType=='CMS')
                    {
                        this.userType='CMS'
                    }
                    else
                    {
                        if(this.dbService.userStorageData.loggedInUserType == 'Employee')
                        {
                            this.userType='Employee';
                            userId =  this.dbService.userStorageData.id;
                        }
                        else
                        {
                            this.userType='drLogin'
                        }
                    }
                    console.log(this.userType);

                setTimeout(() => {
                    if(this.userType=='CMS')
                    {
                        this.user_data = this.dbService.userStorageData.tokenInfo;
                        userId = this.dbService.userStorageData.id;
                    }
                    else
                    {
                        if(this.userType!='Employee')
                        {
                            this.user_data = this.dbService.userStorageData.all_data;
                            userId = this.user_data.id
                        }
                    }
                    var prod = {id:this.navParams.get('id')}
                    var data = {"id":userId,userType:this.userType}
                    this.dbService.onShowLoadingHandler();
                    this.dbService.onPostRequestDataFromApi({"user_data":data,"product":prod},"dealerData/add_favorite", this.dbService.rootUrlSfa)
                    .subscribe(resp=>{
                        console.log(resp);
                        this.dbService.onDismissLoadingHandler();
                        this.dbService.presentToast('Product Added to Favourites')
                    },err=>
                    {
                        this.dbService.errToasr()
                        this.dbService.onDismissLoadingHandler()
                    })
                }, 1000);
                ///////

            }
            remove_from_fav()
            {
                var userId = ''
                const loginType = this.dbService.userStorageData.loginType;

                console.log(loginType);
                console.log(this.dbService.userStorageData.loggedInUserType);

                if(loginType=='CMS')
                {
                    this.userType='CMS'
                }
                else
                {
                    if(this.dbService.userStorageData.loggedInUserType == 'Employee')
                    {
                        this.userType='Employee'
                        userId = this.dbService.userStorageData.id;
                    }
                    else
                    {
                        this.userType='drLogin'
                    }
                }

                console.log(this.userType);

                setTimeout(() => {
                    if(this.userType=='CMS')
                    {
                        this.user_data = this.dbService.userStorageData.tokenInfo;
                        userId = this.dbService.userStorageData.id;
                    }
                    else
                    {
                        if(this.userType!='Employee')
                        {
                            this.user_data = this.dbService.userStorageData.all_data;
                            userId = this.user_data.id;

                        }else
                        {
                            userId = this.dbService.userStorageData.id;
                        }
                    }
                    var prod = {id:this.navParams.get('id')}
                    var data = {"id":userId,userType:this.userType}
                    this.dbService.onShowLoadingHandler();
                    this.dbService.onPostRequestDataFromApi({"user_data":data,"product":prod},"dealerData/remove_from_fav", this.dbService.rootUrlSfa)
                    .subscribe(resp=>{
                        console.log(resp);
                        this.dbService.onDismissLoadingHandler();
                        this.dbService.presentToast('Product Removed From Favourites')
                    },err=>
                    {
                        this.dbService.errToasr()
                        this.dbService.onDismissLoadingHandler()
                    })
                }, 1000);
                ///////

            }
            existInFavourite:any='';
            checkForExistInFavourite()
            {

                const loginType = this.dbService.userStorageData.loginType;

                console.log(loginType);
                console.log(this.dbService.userStorageData.loggedInUserType);

                if(loginType=='CMS')
                {
                    this.userType='CMS'
                }
                else
                {
                    if(this.dbService.userStorageData.loggedInUserType == 'Employee')
                    {
                        this.userType='Employee'
                    }
                    else
                    {
                        this.userType='drLogin'
                    }
                }
                console.log(this.userType);


                setTimeout(() => {
                    var userId = ''
                    if(this.userType=='CMS')
                    {
                        this.user_data = this.dbService.userStorageData.tokenInfo;
                        userId = this.dbService.userStorageData.id;
                    }
                    else
                    {
                        if(this.userType!='Employee')
                        {
                            this.user_data = this.dbService.userStorageData.all_data;
                            userId = this.user_data.id
                        }
                        else
                        {
                            userId = this.dbService.userStorageData.id;
                        }
                    }
                    console.log(this.navParams.get('id') )
                    console.log(this.userType);
                    console.log(this.user_data);
                    // this.dbService.userStorageData.id
                    setTimeout(() => {
                        this.dbService.onPostRequestDataFromApi({"product_id":this.navParams.get('id'),"userId":userId,userType:this.userType},"dealerData/checkForExistInFavourite", this.dbService.rootUrlSfa)
                        .subscribe(resp=>{
                            console.log(resp);
                            if(resp!=0)
                            {
                                this.existInFavourite=true;
                            }
                            else
                            {
                                this.existInFavourite=false
                            }
                        },err=>
                        {
                        })

                    }, 500);
                }, 500);
            }

            viewDetail(image)
            {
              this.modalCtrl.create(ViewProfilePage, {"Image": image, 'mode':"product_img"}).present();
            }
        }
