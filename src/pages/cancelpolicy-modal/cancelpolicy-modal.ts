import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController, Loading,Nav } from 'ionic-angular';
import { CancelationPolicyPage } from '../cancelation-policy/cancelation-policy';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TabsPage } from '../tabs/tabs';
import { RegistrationPage } from '../login-section/registration/registration';


@IonicPage()
@Component({
    selector: 'page-cancelpolicy-modal',
    templateUrl: 'cancelpolicy-modal.html', 
})
export class CancelpolicyModalPage {
    @ViewChild(Nav) nav: Nav;
    data:any={};
    otp_value:any='';
    karigar_id:any=''
    otp:any='';
    karigar_detail:any={};
    gift_id:any='';
    gift_detail:any='';
    loading:Loading;
    mode:any = true;
    


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public viewCtrl: ViewController,
                public dbService:DbserviceProvider,
                public alertCtrl:AlertController,
                public loadingCtrl:LoadingController) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CancelpolicyModalPage');
        this.karigar_id = this.navParams.get('karigar_id');
        console.log(this.karigar_id);
        this.gift_id = this.navParams.get('gift_id');
        console.log(this.gift_id);
        this.getOtpDetail();
        this.presentLoading();
        this.data.paytm_mobile = "";
        this.data.bank_account_number = "";
        this.data.bank_ifsc_code = "";
        this.data.bank_detail_type = "";
        this.data.bank_name = "";
    }


    dismiss() {
        let data = { 'foo': 'bar' };
        this.viewCtrl.dismiss(data);
    }

    goOnCancelationPolicy(){
        this.navCtrl.push(CancelationPolicyPage)
    }

    getOtpDetail()
    {
        console.log('otp');
        this.dbService.onPostRequestDataFromApi({'karigar_id':this.dbService.userStorageData.id, 'mobile_no':this.dbService.userStorageData.mobile_no, 'gift_id':this.gift_id},'app_karigar/sendOtp', this.dbService.rootUrl)
        .subscribe((r)=>
        {
            console.log(r);
            this.loading.dismiss();
            this.otp=r['otp'];
            console.log(this.otp);
            this.karigar_detail=r['karigar'];
            this.data.account_holder_name= this.karigar_detail.account_holder_name;
            this.data.bank_name= this.karigar_detail.bank_name;
            this.data.bank_account_number= this.karigar_detail.account_number;
            this.data.bank_ifsc_code= this.karigar_detail.ifsc_code;
            this.gift_detail=r['gift'];
        });
    }
    resendOtp()
    {
        this.dbService.onPostRequestDataFromApi({'karigar_id':this.dbService.userStorageData.id,'gift_id':this.gift_id},'app_karigar/sendOtp', this.dbService.rootUrl)
        .subscribe((r)=>
        {

            console.log(r);
            this.otp=r['otp'];
            console.log(this.otp);
        });
    }

    otpvalidation()
    {
        this.otp_value=false;
        if(this.data.otp==this.otp)
        {
            this.otp_value=true
        }
    }

    submit()
    {

        if(this.gift_detail.type === 'Cash'){
            if(this.karigar_detail.account_holder_name =='' || this.karigar_detail.bank_name=='' || this.karigar_detail.account_number=='' || this.karigar_detail.ifsc_code==''){
                this.showAlert("Bank details are missing");
                return;
            }  
        }
        if(this.gift_detail.type === 'Gift'){
            if(!this.data.shipping_address){
                this.showAlert("Please fill Address");
                return;
            }  
        }

        

          this.presentLoading();
          console.log('data');
          console.log(this.data);
          this.dbService.onPostRequestDataFromApi( {'karigar_id': this.dbService.userStorageData.id,mobile:this.karigar_detail.mobile_no,'bank_detail_type':this.data.bank_detail_type,'bank_account_number':this.data.bank_account_number,'bank_ifsc_code':this.data.bank_ifsc_code,'account_holder_name':this.data.account_holder_name,'paytm_mobile':this.data.paytm_mobile.toString(),"gift_id": this.gift_id,'offer_id':this.gift_detail.offer_id,'bankDetails':'','bank_name':this.data.bank_name,'shipping_address' :this.data.shipping_address },'app_karigar/redeemRequest', this.dbService.rootUrl)
          .subscribe( (r) =>
          {
                this.loading.dismiss();
                console.log(r);
                if(r['status']=="SUCCESS")
                {
                    this.navCtrl.setRoot(TabsPage,{index:'3'});
                    this.showSuccess("Redeemed Request Sent Successfully");
                }
                else if(r['status']=="EXIST")
                {
                    this.showAlert(" Already Redeemed!");
                }
          });
    }


    showAlert(text) {
        let alert = this.alertCtrl.create({
            title:'Alert!',
            cssClass:'action-close',
            subTitle: text,
            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            },
            {
                text:'OK',
                cssClass: 'close-action-sheet',
                handler:()=>{
                    // this.navCtrl.push(TransactionPage);
                }
            }]
        });
        alert.present();
    }
    showSuccess(text)
    {
        let alert = this.alertCtrl.create({
            title:'Success!',
            cssClass:'action-close',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
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
        console.log('leave');
        this.dismiss()
    }


    updateProfile()
    {
        this.karigar_detail.edit_profile= 'edit_profile';
        console.log(this.karigar_detail);
        this.navCtrl.push(RegistrationPage,{'data':this.karigar_detail})
    }
    myNumber()
    {
        console.log(this.data);
        if(this.data.check1==true)
        {
            this.data.shipping_address=this.karigar_detail.address + ' ,'+this.karigar_detail.city + ' ,'+this.karigar_detail.district +' ,'+ this.karigar_detail.state +' ,'+ this.karigar_detail.pincode;
        }
        else{
            this.data.shipping_address='';
        }
        
        
    }
    

}
