import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, Loading, LoadingController, ToastController } from 'ionic-angular';
import { OtpPage } from '../otp/otp';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { SelectRegistrationTypePage } from '../../select-registration-type/select-registration-type';
import { TranslateService } from '@ngx-translate/core';
import { LanguagePage } from '../../language/language';


@IonicPage()
@Component({
    selector: 'page-mobile-login',
    templateUrl: 'mobile-login.html',
})
export class MobileLoginPage {
    
    data:any = {};
    otp:any = '';
    loading:Loading;
    loginType:any = '';
    lang:any='en';
    country:any;
    
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public dbService: DbserviceProvider,
        public alertCtrl:AlertController,
        public translate:TranslateService,
        public toastCtrl :ToastController,
        public loadingCtrl:LoadingController) {
            
            this.loginType = this.navParams.get('registerType');
            console.log(this.loginType);
            this.lang = this.navParams.get("lang");
            console.log('====================================');
            console.log(this.lang);
            console.log('====================================');
        }
        
        ionViewDidLoad() {
            console.log('ionViewDidLoad MobileLoginPage');
            this.translate.setDefaultLang(this.lang);
            this.translate.use(this.lang);
           
        }
        
        
        
       
        
        
        chs_lng:any=""
        no:any=""
        Ok:any=""
        sure:any=""
        showAlert()
        {
            this.translate.get("Change Language")
            .subscribe(resp=>{
                this.chs_lng = resp;
            })
            
            
            this.translate.get("Ok")
            .subscribe(resp=>{
                this.Ok = resp;
            })
            this.translate.get("This mobile  number is not vaild in " + this.country)
            .subscribe(resp=>{
                this.chs_lng = resp;
            })
            let updateAlert = this.alertCtrl.create({
                title: this.chs_lng,
                message: this.sure,
                buttons: [
                    {
                        text: this.Ok,
                        handler: () => {
                            this.navCtrl.push(LanguagePage)
                        } 
                    }
                ]
            });
            updateAlert.present();
        }
        
        presentToast() {
            const toast = this.toastCtrl.create({
                message: `${this.data.mobile_no} This mobile number has already been registered please use another number.`,
                duration: 3000,
            });
            toast.present();
        }
        
        onLoginSubmitHandler() {
            this.dbService.onPostRequestDataFromApi({'mobile_no': this.data.mobile_no, 'type':this.loginType},'app_karigar/checkType', this.dbService.rootUrl).subscribe((r) => {
                console.log(r);
                if(r.status == 'TYPE_NOT_FOUND'){
                    this.presentToast();
                    return;
                }
                
                this.dbService.onShowLoadingHandler();
                this.data.otp = '123456';
                // if(this.data.mobile_no == '9896356568' || this.data.mobile_no == '7840871141' ||  this.data.mobile_no == '9560533107' || this.data.mobile_no == '9958680038') {
                
                //     this.data.otp = '123456';
                
                // } else {
                
                //     this.data.otp = Math.floor(100000 + Math.random() * 900000);
                
                // }
                this.data.country = this.country;
                this.dbService.onPostRequestDataFromApi({'login_data': this.data},'app_karigar/karigarLoginOtp', this.dbService.rootUrl).subscribe((r) => {
                    
                    console.log(r);
                    this.dbService.onDismissLoadingHandler();
                    
                    if (r['status'] == 'REQUIRED MOBILE NO') {
                        
                        this.dbService.onShowMessageAlertHandler("Please enter Mobile No to continue.");
                        return false;
                        
                    } 
                    else if (r['status'] == "WRONG COUNTRY"){
                        this.showAlert();
                        return;
                    }
                    
                    else if (r['status'] == "SUCCESS") {
                        
                        this.otp = r['otp'];
                        
                        this.navCtrl.push(OtpPage, {
                            lang:this.lang,
                            otp: this.data.otp,
                            mobile_no: this.data.mobile_no,
                            loginType: this.loginType
                        });
                    }
                });
                
            });
            
            
        }
        
        onBackButtonClickHanlder() {
            
            this.navCtrl.push(SelectRegistrationTypePage);
        }
    }
    