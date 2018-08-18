import { Injectable } from '@angular/core';

import { FileUtilsProvider } from '../file-utils/file-utils';

let _StorageKey = "ct_up";
let _StorageKeyApps = "ct_uapps";
let _StorageKeyOrders = "ct_uorders";

@Injectable()
export class UserDataProvider {

  private _loggedIn:boolean;
  private _userProfile:any;
  private _userApps:any;

  private _appsAll: object[] = [];

  constructor(
    private fileUtils:FileUtilsProvider) {
    this._loggedIn = false;
  }

  ionViewWillEnter(){
    
  }

  IsLoggedIn(){
    return this._loggedIn;
  }

  HasActivated(){
    return (this._userProfile.status == 2);
  }

  GetUserProfile(){
    return this._userProfile;
  }

  GetUserApps(){
    return this._appsAll;
  }

  GetUserAppsRaw(){
    return this._userApps;
  }

  GetUserApp(appId){
    let match = null;
    
    if(this._userApps){
      this._userApps.forEach(element => {
        if(element.app_id == appId){
          match = element;
        }
      });
    }

    return match;
  }

  SetUserProfile(userProfile)
  {
    this.UpdateProfile(userProfile);
    this.fileUtils.SaveDataToLocalStorage(_StorageKey, this._userProfile);
  }

  private UpdateProfile(userProfile)
  {
    if(userProfile != null){
      this._userProfile = userProfile;
      this._loggedIn = true;
    } else {
      this._userProfile = null;
      this._loggedIn = false;
    }
  }

  private UpdateUserApps(userApps)
  {
    if(userApps != null){
      this._userApps = userApps;
    } else {
      this._userApps = null;
    }
  }

  LoadProfile()
  {
    return new Promise((resolve, reject) => {
      this._userProfile = null;

      this.fileUtils.LoadDataFromLocalStorage(_StorageKey).then((val) => {
        if(val != null){
          this.UpdateProfile(val);
        }
        resolve(this._userProfile);
      }, (reason) => {
        reject(this._userProfile);
      });
    });
  }

  ClearProfile()
  {
    this.UpdateProfile(null);
    this.UpdateUserApps(null);

    return new Promise((resolve, reject) => {
      this.fileUtils.ClearDataFromLocalStorage(_StorageKey).then((value) => {

        this.fileUtils.ClearDataFromLocalStorage(_StorageKeyApps);
        this.fileUtils.ClearDataFromLocalStorage(_StorageKeyOrders);

        resolve();
      }, (reason) => {
        reject();
      });
    });
  }
}
