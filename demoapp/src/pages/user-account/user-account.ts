import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { WebServiceProvider } from '../../providers/web-service/web-service';
import { UserDataProvider } from '../../providers/user-data/user-data';
import { TransitionProvider } from '../../providers/transition/transition';

@IonicPage()
@Component({
  selector: 'page-user-account',
  templateUrl: 'user-account.html',
})
export class UserAccountPage {

  _responseData:any;
  _userProfile:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private webService: WebServiceProvider,
    public userData: UserDataProvider,
    private transition: TransitionProvider
  ) {
      this._userProfile = this.userData.GetUserProfile();
  }

  ionViewDidLoad() {

  }

  ionViewWillEnter() {
    this.SilentLogin();
  }

  SilentLogin(){
    this.transition.ShowLoader("");
    this.webService.SilentLogin(this._userProfile.userName)
      .then((result) => {
        this._responseData = result;
        console.log(this._responseData);

        this.transition.HideLoader();

        if(this._responseData.acctId)
        { // If Login was successful
          this.userData.SetUserProfile(this._responseData);
          this._userProfile = this.userData.GetUserProfile();
        }
      }, (err) => {
        console.log("Connection Failed");
        this.transition.HideLoader();
        this.transition.ShowToast("Unable to reach the server. Please check your internet connection.");
      });
  }

  OnAction(action) {
    switch(action) {
      case "CREDITS": break;
      case "GAMES": this.transition.NavToTabIndex(0); break;
      case "BOARD": this.transition.NavToTabIndex(2); break;
      default: console.log("Unhandled action: " + action); break;
    }
  }

}
