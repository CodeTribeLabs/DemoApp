import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AppInfoPage } from '../app-info/app-info';

import { AppDataProvider } from '../../providers/app-data/app-data';

@IonicPage()
@Component({
  selector: 'page-search-apps',
  templateUrl: 'search-apps.html',
})
export class SearchAppsPage {

  _searchQuery: string = '';
  _searchItems: string[];

  _appListingAll: any;
  _appListingFiltered: object[] = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private appData: AppDataProvider) {

  }

  ionViewDidLoad() {
    
  }

  ionViewWillEnter() {
    this._appListingAll = this.appData.GetAppsRaw();
    this.RefreshItems();
    this.RefreshFilteredApps();
  }

  private RefreshItems() {

    this._searchItems = [];
    
    this._appListingAll.forEach(element => {
      this._searchItems.push(element.appName); // Push all the app names  
    });

  }

  private RefreshFilteredApps() {

    this._appListingFiltered = [];

    for (var appName of this._searchItems) {
        let appInfo = this.appData.GetAppByName(appName);
        if(appInfo){
          this._appListingFiltered.push(appInfo);
        }
    }
  }

  SearchItems(ev: any) {
    // Reset items back to all of the items
    this.RefreshItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this._searchItems = this._searchItems.filter(
        (item) => {
          return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
        }
      );
    }

    // Refresh the filtered apps based on the App Names inside the _searchItems
    this.RefreshFilteredApps();
  }

  OnAppClick(appId) {
    //console.log("Clicked AppId=" + appId);
    this.navCtrl.push(AppInfoPage, {'app-id': appId});
  }
}
