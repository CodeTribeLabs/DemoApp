import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

import { SearchAppsPage } from '../search-apps/search-apps';
import { AppInfoPage } from '../app-info/app-info';

import { WebServiceProvider } from '../../providers/web-service/web-service';
import { UserDataProvider } from '../../providers/user-data/user-data';
import { AppDataProvider } from '../../providers/app-data/app-data';
import { TransitionProvider } from '../../providers/transition/transition';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  _appListing: any;
  _responseData:any;

  _appListingAll: any;
  _appListingPopular: any;
  _appListingNew: any;

  constructor(
    public navCtrl: NavController,
    private menuCtrl: MenuController,
    private webService: WebServiceProvider,
    private userData: UserDataProvider,
    private appData: AppDataProvider,
    private transition:TransitionProvider) {

      this._appListing = "segment1";
  }

  ionViewDidLoad() {
    this.menuCtrl.enable(true);

    this.FetchAppData();
  }

  FetchAppData() {
    this.transition.ShowLoader("");

    let userProfile = this.userData.GetUserProfile();
    this.webService.GetApps(userProfile.authToken, userProfile.acctId)
      .then((result) => {
        this._responseData = result;
        console.log(this._responseData);

        this.transition.HideLoader();
        this.PopulateAppData();
      }, (err) => {
        console.log("Connection Failed");
        this.transition.HideLoader();
        this.transition.ShowToast("Unable to reach the server. Please check your internet connection.");
      });
  }

  PopulateAppData() {
    if(this._responseData)
    { // If request was successful
      
      this.appData.SetAppsData(this._responseData);

      this._appListingAll = this.appData.GetAppListing("ALL");
      this._appListingPopular = this.appData.GetAppListing("POPULAR");
      this._appListingNew = this.appData.GetAppListing("NEW");

    } else {
      this.transition.ShowToast("Sorry, we are unable to fetch the Games Listing");
    }
  }

  OnSearchClick() {
    this.navCtrl.push(SearchAppsPage);
  }

  OnAppClick(appId) {
    //console.log("Clicked AppId=" + appId);
    this.navCtrl.push(AppInfoPage, {'appId': appId});
  }
}
