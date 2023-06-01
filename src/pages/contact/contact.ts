import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {
  usertype:any
  userCountry:any;

  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private app:App,
    public dbService:DbserviceProvider) {
      this.usertype = this.dbService.userStorageData.type;
      this.userCountry = this.dbService.userStorageData.country;
     
      
      
      if(this.dbService.connection=='offline')
      {
        this.dbService.onShowMessageAlertHandler('Offline ! Please Connect To An Active Internet Connection');
        this.navCtrl.setRoot(HomePage)
      }
    }
    
    ionViewDidLoad() {
      console.log('ionViewDidLoad ContactPage');
    }
    go_to_map()
    {
      console.log('map');
      let destination = 28.6223767 + ',' + 77.1205522;
      
      
      let label = encodeURI('C-50, Phase-II, Mayapuri Industrial Area, New Delhi- 110064');
      
      window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
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
  