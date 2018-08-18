import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SearchAppsPage } from '../search-apps/search-apps';
import { AppInfoPage } from '../app-info/app-info';

import { UserDataProvider } from '../../providers/user-data/user-data';
import { AppDataProvider } from '../../providers/app-data/app-data';

@IonicPage()
@Component({
  selector: 'page-user-apps',
  templateUrl: 'user-apps.html',
})
export class UserAppsPage {

  private _appListingAll: object[] = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private userData: UserDataProvider,
    private appData: AppDataProvider) {

  }

  ionViewDidLoad() {

  }

  ionViewWillEnter() {
    this.GetUserApps();
  }

  GetUserApps() {

    let userApps = this.userData.GetUserAppsRaw();

    if(userApps){
      
      this._appListingAll = [];

      userApps.forEach(element => {

        let appInfo = this.appData.GetApp(element.app_id);

        let data = {
          "id": appInfo.id,
          "iconUrl": appInfo.icon_url,
          "appName": appInfo.app_name,
          "genre": appInfo.genre,
          "userRating": appInfo.user_rating
        }

        this._appListingAll.push(data);
      });
    }
  }

  OnSearchClick(){
    this.navCtrl.push(SearchAppsPage);
  }

  OnAppClick(appId) {
    //console.log("Clicked AppId=" + appId);
    this.navCtrl.push(AppInfoPage, {'app-id': appId});
  }
}
