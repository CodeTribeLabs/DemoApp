import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { AppPlayPage } from '../app-play/app-play';

//import { WebServiceProvider } from '../../providers/web-service/web-service';
//import { UserDataProvider } from '../../providers/user-data/user-data';
import { AppDataProvider } from '../../providers/app-data/app-data';
//import { TransitionProvider } from '../../providers/transition/transition';
//import { BrowserUtilsProvider } from '../../providers/browser-utils/browser-utils';

@IonicPage()
@Component({
  selector: 'page-app-info',
  templateUrl: 'app-info.html',
})
export class AppInfoPage {

  //private _responseData:any;
  private _appInfo: any;

  private _isAvailable:boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    //private webService: WebServiceProvider,
    //private userData: UserDataProvider,
    private appData: AppDataProvider,
    //private transition:TransitionProvider,
    //private browserUtils: BrowserUtilsProvider
  ) {

      // Fetch the app info here at the constructor so that the data will be available for data binding with the template
      this.RefreshFields();
  }

  RefreshFields() {
    this.GetAppInfo();
  }

  ionViewDidLoad() {
    //this.FetchUserApps();
  }

  GetAppInfo() {
    this._appInfo = this.appData.GetApp(this.navParams.get('appId'));

    this._isAvailable = (this._appInfo.status == 1);
  }

  OnPlayGame() {
    //console.log("LINK APP");
    let data = {
      "appId": this._appInfo.id, 
      "appName": this._appInfo.appName, 
      "isAvailable": this._isAvailable
    };

    let customModal = this.modalCtrl.create(AppPlayPage, data);

    customModal.onDidDismiss(data => {
      console.log("Game Dismissed, AppId=" + data.appId);
      if(data.appId) {
        // Do something with appId
      } else {
        //this.transition.ShowToast("Oops! You forgot to enter your App ID.");
      }
    });

    customModal.present();
  }
}
