import { Injectable } from '@angular/core';

import { FileUtilsProvider } from '../file-utils/file-utils';

let _StorageKeyApps = "ct_apps";
let _StorageKeyProducts = "ct_prods";
let _StorageKeyPublishers = "ct_pubs";

@Injectable()
export class AppDataProvider {

  private _appsData:any;

  private _appsAll: object[] = [];
  private _appsPopular: object[] = [];
  private _appsNew: object[] = [];

  constructor(
    private fileUtils:FileUtilsProvider) {
    
  }

  ionViewWillEnter(){
    
  }

  GetAppListing(listingKey){
    switch(listingKey){
      case "POPULAR": return this._appsPopular;
      case "NEW": return this._appsNew;
      default: return this._appsAll;
    }
  }

  GetAppsRaw() {
    return this._appsData;
  }

  GetApp(appId)
  {
    let match = null;
    
    if(this._appsData) {
      this._appsData.forEach(element => {
        if(element.id == appId){
          match = element;
        }
      });
    }

    return match;
  }

  GetAppByName(appName)
  {
    let match = null;
    
    if(this._appsData) {
      this._appsData.forEach(element => {
        if(element.appName == appName){
          match = element;
        }
      });
    }

    return match;
  }

  SetAppsData(appsData)
  {
    this.UpdateAppsData(appsData);
    this.fileUtils.SaveDataToLocalStorage(_StorageKeyApps, this._appsData);

    this._appsAll = [];
    this._appsPopular = [];
    this._appsNew = [];

    appsData.forEach(element => {

      this._appsAll.push(element); // Push all the apps on this listing

      let listingKeys = element.listingKeys;

      // Filter the apps tagged as Popular
      if(listingKeys.indexOf("POPULAR") >= 0) {
        this._appsPopular.push(element);
      }

      // Filter the apps tagged as New
      if(listingKeys.indexOf("NEW") >= 0) {
        this._appsNew.push(element);
      }

    });
  }

  private UpdateAppsData(appsData)
  {
    if(appsData != null){
      this._appsData = appsData;
    } else {
      this._appsData = null;
    }
  }

  LoadAppsData()
  {
    return new Promise((resolve, reject) => {
      this._appsData = null;

      this.fileUtils.LoadDataFromLocalStorage(_StorageKeyApps).then((val) => {
        if(val != null){
          this.UpdateAppsData(val);
        }
        resolve(this._appsData);
      }, (reason) => {
        reject(this._appsData);
      });
    });
  }

  ClearData()
  {
    this.UpdateAppsData(null);

    return new Promise((resolve, reject) => {
      this.fileUtils.ClearDataFromLocalStorage(_StorageKeyApps).then((value) => {

        this.fileUtils.ClearDataFromLocalStorage(_StorageKeyProducts);
        this.fileUtils.ClearDataFromLocalStorage(_StorageKeyPublishers);

        resolve();
      }, (reason) => {
        reject();
      });
    });
  }
}
